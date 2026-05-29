import type { NHCStorm, StormClassification } from "./nhc";

const JTWC_RSS_URL = "https://www.metoc.navy.mil/jtwc/rss/jtwc.rss";

function parseClassification(text: string): StormClassification {
  const t = text.toUpperCase();
  if (t.includes("SUPER TYPHOON")) return "STY";
  if (t.includes("TYPHOON")) return "TY";
  if (t.includes("SEVERE TROPICAL STORM")) return "STS";
  if (t.includes("TROPICAL STORM")) return "TS";
  return "TD";
}

// T000 159N 1328E 040 ...  →  { lat: 15.9, lon: 132.8, wind: 40 }
function parseTCWPosition(line: string): { lat: number; lon: number; wind: number } | null {
  const m = line.match(/^T000\s+(\d+)([NS])\s+(\d+)([EW])\s+(\d+)/);
  if (!m) return null;
  return {
    lat: (parseInt(m[1]) / 10) * (m[2] === "S" ? -1 : 1),
    lon: (parseInt(m[3]) / 10) * (m[4] === "W" ? -1 : 1),
    wind: parseInt(m[5]),
  };
}

// "2026052906 06W JANGMI  009  01 300 10 SATL 060"
//                                    dir spd
function parseTCWMovement(line: string): { dir: number; speed: number } | null {
  const parts = line.trim().split(/\s+/);
  if (parts.length < 7) return null;
  const dir = parseInt(parts[5]);
  const speed = parseInt(parts[6]);
  if (isNaN(dir) || isNaN(speed)) return null;
  return { dir, speed };
}

type JTWCStormInfo = {
  id: string;
  name: string;
  classText: string;
  tcwUrl: string;
};

function parseRSSStorms(xml: string): JTWCStormInfo[] {
  const storms: JTWCStormInfo[] = [];
  const cdataRe = /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/g;

  let item: RegExpExecArray | null;
  while ((item = cdataRe.exec(xml)) !== null) {
    const content = item[1];

    // Match storm header: "Tropical Storm  06W (Jangmi) Warning #09"
    const stormRe =
      /<b>\s*((?:Super Typhoon|Typhoon|Severe Tropical Storm|Tropical Storm|Tropical Depression)\s+(\w+)\s+\((\w+)\)[^<]*)<\/b>/gi;
    const tcwRe = /href='([^']+\.tcw)'/i;

    let stormMatch: RegExpExecArray | null;
    while ((stormMatch = stormRe.exec(content)) !== null) {
      const tcwMatch = tcwRe.exec(content);
      if (!tcwMatch) continue;
      storms.push({
        id: `jtwc-${stormMatch[2].toLowerCase()}`,
        name: stormMatch[3].charAt(0).toUpperCase() + stormMatch[3].slice(1).toLowerCase(),
        classText: stormMatch[1],
        tcwUrl: tcwMatch[1],
      });
    }
  }

  return storms;
}

async function fetchOneStorm(info: JTWCStormInfo, signal: AbortSignal): Promise<NHCStorm | null> {
  try {
    const res = await fetch(info.tcwUrl, { signal, headers: { "User-Agent": "StormTracker/1.0" } });
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.split("\n");

    const posLine = lines.find((l) => l.trim().startsWith("T000"));
    if (!posLine) return null;
    const pos = parseTCWPosition(posLine.trim());
    if (!pos) return null;

    const headerLine = lines.find((l) =>
      /^\d{10}\s+\w+\s+\w+\s+\d+\s+\d+\s+\d+\s+\d+/.test(l.trim())
    );
    const movement = headerLine ? parseTCWMovement(headerLine) : null;

    // Parse timestamp from header line like "2026052906"
    const tsMatch = text.match(/^(\d{4})(\d{2})(\d{2})(\d{2})/m);
    const lastUpdate = tsMatch
      ? `${tsMatch[1]}-${tsMatch[2]}-${tsMatch[3]}T${tsMatch[4]}:00:00Z`
      : new Date().toISOString();

    return {
      id: info.id,
      binNumber: info.id,
      name: info.name,
      classification: parseClassification(info.classText),
      intensity: String(pos.wind),
      pressure: "N/A",
      latitudeNumeric: pos.lat,
      longitudeNumeric: pos.lon,
      movementDir: movement?.dir ?? 0,
      movementSpeed: movement?.speed ?? 0,
      lastUpdate,
      forecastAdvisory: { url: info.tcwUrl },
      forecastGraphics: { url: "" },
    };
  } catch {
    return null;
  }
}

export async function fetchJTWCStorms(): Promise<NHCStorm[]> {
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 8000);
  try {
    const res = await fetch(JTWC_RSS_URL, {
      signal: ac.signal,
      headers: { "User-Agent": "StormTracker/1.0" },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const infos = parseRSSStorms(xml);
    const results = await Promise.all(infos.map((s) => fetchOneStorm(s, ac.signal)));
    return results.filter((s): s is NHCStorm => s !== null);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
