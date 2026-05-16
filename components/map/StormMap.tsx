"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  buildGIBSSource,
  defaultSatelliteDate,
  formatSliderDate,
  type GIBSLayer,
} from "@/lib/gibs";

const SATELLITE_LAYER: GIBSLayer = "MODIS_Terra_CorrectedReflectance_TrueColor";
const SOURCE_ID = "satellite";
const LAYER_ID = "satellite-layer";

// Date range: last 14 days (MODIS archives)
function buildDateRange(): string[] {
  const dates: string[] = [];
  for (let i = 14; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export default function StormMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedDate, setSelectedDate] = useState(defaultSatelliteDate);
  const [mapReady, setMapReady] = useState(false);

  const dates = buildDateRange();
  const dateIndex = dates.indexOf(selectedDate);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          [SOURCE_ID]: buildGIBSSource(SATELLITE_LAYER, selectedDate),
        },
        layers: [
          {
            id: LAYER_ID,
            type: "raster",
            source: SOURCE_ID,
            minzoom: 0,
            maxzoom: 9,
          },
        ],
      },
      center: [-60, 15],
      zoom: 3,
      maxZoom: 9,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-left"
    );

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    map.on("load", () => setMapReady(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update satellite tiles when date changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const source = map.getSource(SOURCE_ID) as maplibregl.RasterTileSource | undefined;
    if (!source) return;

    source.setTiles(
      buildGIBSSource(SATELLITE_LAYER, selectedDate).tiles
    );
  }, [selectedDate, mapReady]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Timeline slider */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 py-3 flex items-center gap-4"
        style={{ backgroundColor: "rgba(13,15,20,0.85)" }}
      >
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
        />
        <span
          className="text-xs shrink-0"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ash)" }}
        >
          today
        </span>
      </div>
    </div>
  );
}
