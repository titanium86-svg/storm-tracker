"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  buildGIBSSource,
  defaultSatelliteDate,
  formatSliderDate,
  type GIBSLayer,
} from "@/lib/gibs";
import type { NHCStorm } from "@/lib/nhc";
import { classificationLabel } from "@/lib/nhc";
import { getCategoryColor, getSaffirSimpsonCategory, knotsToKmh } from "@/lib/utils";

const SATELLITE_LAYER: GIBSLayer = "MODIS_Terra_CorrectedReflectance_TrueColor";
const SOURCE_ID = "satellite";
const LAYER_ID = "satellite-layer";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildDateRange(): string[] {
  const dates: string[] = [];
  for (let i = 14; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function addStormMarker(
  map: maplibregl.Map,
  storm: NHCStorm,
  onNavigate: (id: string) => void
): maplibregl.Marker {
  const windKnots = Number(storm.intensity) || 0;
  const category = getSaffirSimpsonCategory(windKnots);
  const color = getCategoryColor(category);
  const catLabel = typeof category === "number" ? String(category) : category;

  const el = document.createElement("div");
  el.style.cssText = `
    width:40px;height:40px;border-radius:50%;
    background:${color};border:2px solid rgba(255,255,255,0.4);
    display:flex;align-items:center;justify-content:center;
    color:white;font-size:12px;font-weight:700;
    cursor:pointer;box-shadow:0 0 14px ${color}90;
    font-family:var(--font-mono);transition:transform 0.15s;
  `;
  el.textContent = catLabel;
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", `${storm.name} — click for details`);
  el.onmouseenter = () => (el.style.transform = "scale(1.15)");
  el.onmouseleave = () => (el.style.transform = "scale(1)");
  el.onclick = () => onNavigate(storm.id);

  // XSS-safe: escape all user-supplied strings before injecting into HTML
  const popup = new maplibregl.Popup({ offset: 22, closeButton: false, closeOnClick: false })
    .setHTML(`
      <div style="background:#0d0f14;border:1px solid #1b1f2a;border-radius:6px;padding:10px 14px;min-width:160px;font-family:'Inter Tight',system-ui,sans-serif;">
        <div style="color:#f5efe1;font-weight:600;font-size:14px;margin-bottom:3px">${esc(storm.name)}</div>
        <div style="color:${color};font-size:12px;margin-bottom:6px">${esc(classificationLabel(storm.classification))}</div>
        <div style="color:#9ca3af;font-size:12px;font-family:'JetBrains Mono',monospace">
          ${knotsToKmh(windKnots)} km/h · ${esc(storm.pressure)} mb
        </div>
        <div style="color:#0891b2;font-size:11px;margin-top:6px">Click to view details →</div>
      </div>
    `);

  return new maplibregl.Marker({ element: el })
    .setLngLat([Number(storm.longitudeNumeric), Number(storm.latitudeNumeric)])
    .setPopup(popup)
    .addTo(map);
}

export default function StormMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const coneIdsRef = useRef<string[]>([]);
  const coneAbortRef = useRef<AbortController | null>(null);

  // Fix #8: initialize to actual last date in range, not offset-computed
  const dates = useMemo(() => buildDateRange(), []);
  const [selectedDate, setSelectedDate] = useState(() => defaultSatelliteDate());
  const [mapReady, setMapReady] = useState(false);
  const [storms, setStorms] = useState<NHCStorm[]>([]);
  const router = useRouter();

  const dateIndex = dates.indexOf(selectedDate);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: { [SOURCE_ID]: buildGIBSSource(SATELLITE_LAYER, selectedDate) },
        layers: [{ id: LAYER_ID, type: "raster", source: SOURCE_ID, maxzoom: 9 }],
      },
      center: [-60, 15],
      zoom: 3,
      maxZoom: 9,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.on("load", () => setMapReady(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch("/api/storms/active")
      .then((r) => (r.ok ? r.json() : { activeStorms: [] }))
      .then((data) => setStorms(data.activeStorms ?? []))
      .catch(() => setStorms([]));
  }, []);

  // Fix #2 + #3: abort in-flight cone fetches on cleanup, remove old cone layers before re-adding
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // Abort previous cone fetches
    coneAbortRef.current?.abort();
    const ac = new AbortController();
    coneAbortRef.current = ac;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Remove old cone layers+sources
    coneIdsRef.current.forEach((id) => {
      if (map.getLayer(`cone-fill-${id}`)) map.removeLayer(`cone-fill-${id}`);
      if (map.getLayer(`cone-outline-${id}`)) map.removeLayer(`cone-outline-${id}`);
      if (map.getSource(`cone-${id}`)) map.removeSource(`cone-${id}`);
    });
    coneIdsRef.current = [];

    if (storms.length === 0) return;

    const navigate = (id: string) => router.push(`/live/${id}`);
    storms.forEach((storm) => {
      markersRef.current.push(addStormMarker(map, storm, navigate));
    });

    // Add cones with abort support
    storms.forEach((storm) => {
      if (!storm.trackCone?.geoJSON) return;
      // Validate host before fetching (fix #15)
      try {
        const url = new URL(storm.trackCone.geoJSON);
        if (!url.hostname.endsWith("nhc.noaa.gov")) return;
      } catch { return; }

      fetch(storm.trackCone.geoJSON, { signal: ac.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((geojson) => {
          if (!geojson || ac.signal.aborted || !mapRef.current) return;
          const m = mapRef.current;
          const src = `cone-${storm.id}`;
          if (m.getSource(src)) return;
          m.addSource(src, { type: "geojson", data: geojson });
          m.addLayer({ id: `cone-fill-${storm.id}`, type: "fill", source: src, paint: { "fill-color": "#fbbf24", "fill-opacity": 0.15 } });
          m.addLayer({ id: `cone-outline-${storm.id}`, type: "line", source: src, paint: { "line-color": "#f59e0b", "line-width": 1.5, "line-dasharray": [4, 2] } });
          coneIdsRef.current.push(storm.id);
        })
        .catch(() => {}); // AbortError silently ignored
    });

    return () => {
      ac.abort();
    };
  }, [storms, mapReady, router]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const source = map.getSource(SOURCE_ID) as maplibregl.RasterTileSource | undefined;
    if (!source) return;
    source.setTiles(buildGIBSSource(SATELLITE_LAYER, selectedDate).tiles);
  }, [selectedDate, mapReady]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0" aria-label="Interactive storm map" role="application" />

      {mapReady && storms.length === 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2" role="status">
          <div className="px-4 py-2 rounded-lg text-sm flex items-center gap-3"
            style={{ backgroundColor: "rgba(13,15,20,0.9)", border: "1px solid var(--ink-600)", color: "var(--smoke)", fontFamily: "var(--font-body)" }}>
            No active storms ·
            <a href="/library" style={{ color: "var(--ocean)" }} className="underline">Browse Storm Library</a>
          </div>
        </div>
      )}

      {mapReady && storms.length > 0 && (
        <div className="absolute top-4 left-4 px-3 py-1 rounded text-xs"
          style={{ backgroundColor: "rgba(13,15,20,0.85)", border: "1px solid var(--ink-600)", color: "var(--smoke)", fontFamily: "var(--font-mono)" }}
          aria-live="polite">
          {storms.length} active storm{storms.length !== 1 ? "s" : ""}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 px-6 py-3 flex items-center gap-4"
        style={{ backgroundColor: "rgba(13,15,20,0.85)" }}>
        <span className="text-xs shrink-0 tabular-nums" style={{ fontFamily: "var(--font-mono)", color: "var(--smoke)" }}>
          {formatSliderDate(selectedDate)}
        </span>
        <input
          type="range" min={0} max={dates.length - 1}
          value={dateIndex === -1 ? dates.length - 3 : dateIndex}
          onChange={(e) => setSelectedDate(dates[parseInt(e.target.value)])}
          className="flex-1 h-1 appearance-none rounded cursor-pointer"
          style={{ accentColor: "var(--amber-glow)" }}
          aria-label="Select satellite imagery date"
        />
        <span className="text-xs shrink-0" style={{ fontFamily: "var(--font-mono)", color: "var(--ash)" }}>today</span>
      </div>
    </div>
  );
}
