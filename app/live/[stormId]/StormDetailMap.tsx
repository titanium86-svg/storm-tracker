"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildGIBSSource, defaultSatelliteDate } from "@/lib/gibs";
import { getCategoryColor, getSaffirSimpsonCategory } from "@/lib/utils";
import type { NHCStorm } from "@/lib/nhc";

type Props = { storm: NHCStorm };

export default function StormDetailMap({ storm }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const windKnots = parseInt(storm.intensity);
    const color = getCategoryColor(getSaffirSimpsonCategory(windKnots));

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          "carto-dark": {
            type: "raster",
            tiles: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
          },
          satellite: buildGIBSSource(
            "MODIS_Terra_CorrectedReflectance_TrueColor",
            defaultSatelliteDate()
          ),
        },
        layers: [
          { id: "background", type: "background", paint: { "background-color": "#0d1520" } },
          { id: "carto-layer", type: "raster", source: "carto-dark" },
          { id: "satellite-layer", type: "raster", source: "satellite" },
        ],
      },
      center: [Number(storm.longitudeNumeric), Number(storm.latitudeNumeric)],
      zoom: 5,
      maxZoom: 14,
      renderWorldCopies: false,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");

    map.on("load", () => {
      // Storm position marker
      const el = document.createElement("div");
      el.style.cssText = `
        width: 16px; height: 16px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid white;
        box-shadow: 0 0 20px ${color};
      `;
      new maplibregl.Marker({ element: el })
        .setLngLat([Number(storm.longitudeNumeric), Number(storm.latitudeNumeric)])
        .addTo(map);

      // Forecast cone if available
      if (storm.trackCone?.geoJSON) {
        fetch(storm.trackCone.geoJSON)
          .then((r) => r.json())
          .then((geojson) => {
            map.addSource("cone", { type: "geojson", data: geojson });
            map.addLayer({
              id: "cone-fill",
              type: "fill",
              source: "cone",
              paint: { "fill-color": "#fbbf24", "fill-opacity": 0.15 },
            });
            map.addLayer({
              id: "cone-outline",
              type: "line",
              source: "cone",
              paint: {
                "line-color": "#f59e0b",
                "line-width": 1.5,
                "line-dasharray": [4, 2],
              },
            });
          })
          .catch(() => {});
      }
    });

    return () => map.remove();
  }, [storm]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
