"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import maplibregl from "maplibre-gl";
import {
  buildGIBSSource,
  defaultSatelliteDate,
  formatSliderDate,
  type GIBSLayer,
} from "@/lib/gibs";
import type { NHCStorm } from "@/lib/nhc";
import { classificationLabel } from "@/lib/nhc";
import { getCategoryColor, getSaffirSimpsonCategory, knotsToKmh } from "@/lib/utils";
import {
  type WeatherLayer,
  owmTileUrl,
  getRadarTileUrl,
  LAYER_LEGENDS,
  fetchWeatherPoint,
  type OWMPoint,
} from "@/lib/weather-layers";
import LayerPanel from "./LayerPanel";
import WindParticles from "./WindParticles";
import LocationSearch from "./LocationSearch";

const SATELLITE_LAYER: GIBSLayer = "VIIRS_SNPP_CorrectedReflectance_TrueColor";
const SOURCE_ID = "satellite";
const LAYER_ID = "satellite-layer";
const WX_SRC = "weather-source";
const WX_LAYER = "weather-overlay";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildDateRange(): string[] {
  const dates: string[] = [];
  for (let i = 16; i >= 2; i--) {
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

type WindPoint = { lat: number; lng: number; u: number; v: number };

function degToCompass(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export default function StormMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const coneIdsRef = useRef<string[]>([]);
  const coneAbortRef = useRef<AbortController | null>(null);
  const dateInitRef = useRef(false);

  const dates = useMemo(() => buildDateRange(), []);
  const [selectedDate, setSelectedDate] = useState(() => defaultSatelliteDate());
  const [mapReady, setMapReady] = useState(false);
  const [storms, setStorms] = useState<NHCStorm[]>([]);
  const [activeLayer, setActiveLayer] = useState<WeatherLayer | null>(null);
  const [windPoints, setWindPoints] = useState<WindPoint[]>([]);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverWeather, setHoverWeather] = useState<OWMPoint | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function selectLayer(layer: WeatherLayer) {
    setActiveLayer((prev) => (prev === layer ? null : layer));
  }
  const OWM_KEY = process.env.NEXT_PUBLIC_OWM_KEY ?? "";

  const hasTileLayer = activeLayer !== null && activeLayer !== "radar";

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!mapReady || !mapRef.current || !hasTileLayer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverPos({ x, y });

    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(async () => {
      const map = mapRef.current;
      if (!map) return;
      const lngLat = map.unproject([x, y]);
      const data = await fetchWeatherPoint(lngLat.lat, lngLat.lng, OWM_KEY);
      setHoverWeather(data);
    }, 400);
  }

  function handleMouseLeave() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoverPos(null);
    setHoverWeather(null);
  }

  const router = useRouter();

  const dateIndex = dates.indexOf(selectedDate);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: { [SOURCE_ID]: buildGIBSSource(SATELLITE_LAYER, selectedDate) },
        layers: [
            { id: "background", type: "background", paint: { "background-color": "#0d1520" } },
            { id: LAYER_ID, type: "raster", source: SOURCE_ID },
          ],
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
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch active storms
  useEffect(() => {
    fetch("/api/storms/active")
      .then((r) => (r.ok ? r.json() : { activeStorms: [] }))
      .then((data) => setStorms(data.activeStorms ?? []))
      .catch(() => setStorms([]));
  }, []);

  // Storm markers + cones
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    coneAbortRef.current?.abort();
    const ac = new AbortController();
    coneAbortRef.current = ac;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    coneIdsRef.current.forEach((id) => {
      if (map.getLayer(`cone-fill-${id}`)) map.removeLayer(`cone-fill-${id}`);
      if (map.getLayer(`cone-outline-${id}`)) map.removeLayer(`cone-outline-${id}`);
      if (map.getSource(`cone-${id}`)) map.removeSource(`cone-${id}`);
    });
    coneIdsRef.current = [];

    if (storms.length === 0) return;

    const navigate = (id: string) => router.push(`/live/${id}`);
    storms.forEach((storm) => { markersRef.current.push(addStormMarker(map, storm, navigate)); });

    storms.forEach((storm) => {
      if (!storm.trackCone?.geoJSON) return;
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
        .catch(() => {});
    });

    return () => { ac.abort(); };
  }, [storms, mapReady, router]);

  // Satellite date slider — only update tiles when date actually changes, not on initial load
  useEffect(() => {
    if (!dateInitRef.current) { dateInitRef.current = true; return; }
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource(SOURCE_ID) as maplibregl.RasterTileSource | undefined;
    if (!source) return;
    source.setTiles(buildGIBSSource(SATELLITE_LAYER, selectedDate).tiles);
  }, [selectedDate]);

  // Sync weather tile overlays with activeLayer (single-select)
  const TILE_LAYERS = ["radar", "precipitation", "temp", "pressure"] as const;
  const OWM_MAP: Record<string, string> = {
    precipitation: "precipitation_new",
    temp: "temp_new",
    pressure: "pressure_new",
  };

  useEffect(() => {
    let alive = true;
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // Remove all tile layers that aren't the active one
    for (const id of TILE_LAYERS) {
      if (id !== activeLayer) {
        if (map.getLayer(`${WX_LAYER}-${id}`)) map.removeLayer(`${WX_LAYER}-${id}`);
        if (map.getSource(`${WX_SRC}-${id}`)) map.removeSource(`${WX_SRC}-${id}`);
      }
    }

    const id = activeLayer as typeof TILE_LAYERS[number] | null;
    if (!id || !TILE_LAYERS.includes(id)) return () => { alive = false; };
    if (map.getLayer(`${WX_LAYER}-${id}`)) return () => { alive = false; };

    const opacity = id === "radar" ? 0.8 : 0.65;
    if (id === "radar") {
      getRadarTileUrl().then((url) => {
        if (!alive || !url || !mapRef.current) return;
        const m = mapRef.current;
        if (m.getLayer(`${WX_LAYER}-radar`)) return;
        m.addSource(`${WX_SRC}-radar`, { type: "raster", tiles: [url], tileSize: 256 });
        m.addLayer({ id: `${WX_LAYER}-radar`, type: "raster", source: `${WX_SRC}-radar`, paint: { "raster-opacity": opacity } });
      });
    } else {
      map.addSource(`${WX_SRC}-${id}`, { type: "raster", tiles: [owmTileUrl(OWM_MAP[id])], tileSize: 256 });
      map.addLayer({ id: `${WX_LAYER}-${id}`, type: "raster", source: `${WX_SRC}-${id}`, paint: { "raster-opacity": opacity } });
    }

    return () => { alive = false; };
  }, [activeLayer, mapReady]);

  // Fetch wind data once when wind layer is first activated
  useEffect(() => {
    if (activeLayer !== "wind" || windPoints.length > 0) return;
    fetch("/api/wind")
      .then((r) => (r.ok ? r.json() : { points: [] }))
      .then((data) => setWindPoints(data.points ?? []))
      .catch(() => setWindPoints([]));
  }, [activeLayer, windPoints.length]);

  const activeLegendConfig = activeLayer ? (LAYER_LEGENDS[activeLayer] ?? null) : null;

  return (
    <div className="relative w-full h-full" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div
        ref={containerRef}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        aria-label="Interactive storm map"
        role="application"
      />

      {mapReady && mapRef.current && activeLayer === "wind" && windPoints.length > 0 && (
        <WindParticles map={mapRef.current} points={windPoints} />
      )}

      {mapReady && mapRef.current && (
        <LocationSearch map={mapRef.current} />
      )}


      {/* Hover tooltip */}
      {hoverPos && hoverWeather && hasTileLayer && (
        <div
          style={{
            position: "absolute",
            left: hoverPos.x + 14,
            top: Math.max(hoverPos.y - 80, 8),
            pointerEvents: "none",
            backgroundColor: "rgba(13,15,20,0.92)",
            border: "1px solid var(--ink-600)",
            borderRadius: 6,
            padding: "8px 12px",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--cream)",
            zIndex: 20,
            minWidth: 130,
            backdropFilter: "blur(4px)",
          }}
        >
          {activeLayer === "temp" && (
            <div>
              <span style={{ color: "var(--ash)", fontSize: 10 }}>TEMP </span>
              <span style={{ color: "#f97316" }}>{hoverWeather.temp.toFixed(1)}°C</span>
            </div>
          )}
          {activeLayer === "wind" && (
            <div>
              <span style={{ color: "var(--ash)", fontSize: 10 }}>WIND </span>
              <span style={{ color: "#0ea5e9" }}>{hoverWeather.windSpeed.toFixed(0)} km/h</span>
              <span style={{ color: "var(--ash)", fontSize: 10 }}> {degToCompass(hoverWeather.windDeg)}</span>
            </div>
          )}
          {activeLayer === "pressure" && (
            <div>
              <span style={{ color: "var(--ash)", fontSize: 10 }}>PRES </span>
              <span style={{ color: "#a78bfa" }}>{hoverWeather.pressure} hPa</span>
            </div>
          )}
          {activeLayer === "precipitation" && (
            <div>
              <span style={{ color: "var(--ash)", fontSize: 10 }}>RAIN </span>
              <span style={{ color: "#22c55e" }}>{hoverWeather.rain.toFixed(1)} mm/h</span>
            </div>
          )}
        </div>
      )}

      <LayerPanel activeLayer={activeLayer} onSelect={selectLayer} />

      {mapReady && storms.length === 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2" role="status">
          <div
            className="px-4 py-2 rounded-lg text-sm flex items-center gap-3"
            style={{ backgroundColor: "rgba(13,15,20,0.9)", border: "1px solid var(--ink-600)", color: "var(--smoke)", fontFamily: "var(--font-body)" }}
          >
            No active storms ·
            <a href="/library" style={{ color: "var(--ocean)" }} className="underline">Browse Storm Library</a>
          </div>
        </div>
      )}

      {mapReady && storms.length > 0 && (
        <div
          className="absolute top-4 px-3 py-1 rounded text-xs"
          style={{
            left: 192,
            backgroundColor: "rgba(13,15,20,0.85)",
            border: "1px solid var(--ink-600)",
            color: "var(--smoke)",
            fontFamily: "var(--font-mono)",
          }}
          aria-live="polite"
        >
          {storms.length} active storm{storms.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Floating legend — bottom-left, above attribution */}
      {activeLegendConfig && (
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 16,
            width: 180,
            zIndex: 10,
            pointerEvents: "none",
            backgroundColor: "rgba(13,15,20,0.82)",
            borderRadius: 6,
            padding: "6px 10px",
            border: "1px solid var(--ink-600)",
          }}
        >
          <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--ash)", letterSpacing: "0.1em", marginBottom: 4 }}>
            {activeLegendConfig.label.toUpperCase()}
          </div>
          <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(to right, ${activeLegendConfig.stops.map((s) => s.color).join(", ")})`, marginBottom: 3 }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 8, fontFamily: "var(--font-mono)", color: "var(--smoke)" }}>
              {activeLegendConfig.stops[0].value}
            </span>
            <span style={{ fontSize: 8, fontFamily: "var(--font-mono)", color: "var(--smoke)" }}>
              {activeLegendConfig.stops[activeLegendConfig.stops.length - 1].value}+ {activeLegendConfig.unit}
            </span>
          </div>
        </div>
      )}

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ backgroundColor: "rgba(13,15,20,0.90)" }}
      >
        {/* Date slider */}
        <div className="px-6 py-2 flex items-center gap-4">
          <span
            className="text-xs shrink-0 tabular-nums"
            style={{ fontFamily: "var(--font-mono)", color: "var(--smoke)" }}
          >
            {formatSliderDate(selectedDate)}
          </span>
          <input
            type="range"
            min={0}
            max={dates.length - 1}
            value={dateIndex === -1 ? dates.length - 3 : dateIndex}
            onChange={(e) => setSelectedDate(dates[parseInt(e.target.value)])}
            className="flex-1 h-1 appearance-none rounded cursor-pointer"
            style={{ accentColor: "var(--amber-glow)" }}
            aria-label="Select satellite imagery date"
          />
          <span className="text-xs shrink-0" style={{ fontFamily: "var(--font-mono)", color: "var(--ash)" }}>
            {formatSliderDate(dates[dates.length - 1])}
          </span>
        </div>
      </div>
    </div>
  );
}
