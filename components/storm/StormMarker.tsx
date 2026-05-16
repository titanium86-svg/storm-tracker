"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { NHCStorm } from "@/lib/nhc";
import { classificationLabel } from "@/lib/nhc";
import { getCategoryColor, getSaffirSimpsonCategory, knotsToKmh } from "@/lib/utils";

type Props = {
  storm: NHCStorm;
  map: maplibregl.Map;
};

export default function StormMarker({ storm, map }: Props) {
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    const windKnots = parseInt(storm.intensity);
    const category = getSaffirSimpsonCategory(windKnots);
    const color = getCategoryColor(category);
    const catLabel =
      typeof category === "number" ? `Cat ${category}` : category;

    const el = document.createElement("div");
    el.style.cssText = `
      width: 36px; height: 36px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid rgba(255,255,255,0.3);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 11px; font-weight: 700;
      cursor: pointer; box-shadow: 0 0 12px ${color}80;
      font-family: var(--font-mono);
    `;
    el.textContent = catLabel === "TD" ? "TD" : catLabel === "TS" ? "TS" : String(category);

    const popup = new maplibregl.Popup({
      offset: 20,
      closeButton: false,
      className: "storm-popup",
    }).setHTML(`
      <div style="
        background: #0d0f14;
        border: 1px solid #1b1f2a;
        border-radius: 6px;
        padding: 10px 14px;
        min-width: 160px;
        font-family: 'Inter Tight', system-ui, sans-serif;
      ">
        <div style="color: #f5efe1; font-weight: 600; font-size: 14px; margin-bottom: 4px;">
          ${storm.name}
        </div>
        <div style="color: ${color}; font-size: 12px; margin-bottom: 8px;">
          ${classificationLabel(storm.classification)}
        </div>
        <div style="color: #9ca3af; font-size: 12px; font-family: 'JetBrains Mono', monospace;">
          ${knotsToKmh(windKnots)} km/h · ${storm.pressure} mb
        </div>
      </div>
    `);

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([Number(storm.longitudeNumeric), Number(storm.latitudeNumeric)])
      .setPopup(popup)
      .addTo(map);

    markerRef.current = marker;
    popupRef.current = popup;

    return () => {
      marker.remove();
    };
  }, [storm, map]);

  return null;
}
