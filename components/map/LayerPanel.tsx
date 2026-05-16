"use client";

import { LAYERS, type WeatherLayer } from "@/lib/weather-layers";

type Props = {
  activeLayers: Set<WeatherLayer>;
  onToggle: (layer: WeatherLayer) => void;
};

export default function LayerPanel({ activeLayers, onToggle }: Props) {
  return (
    <div
      className="absolute top-4 left-4 z-10 rounded-lg overflow-hidden"
      style={{
        backgroundColor: "rgba(13,15,20,0.92)",
        border: "1px solid var(--ink-600)",
        width: 176,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="px-4 py-2 border-b"
        style={{
          borderColor: "var(--ink-600)",
          color: "var(--ash)",
          fontSize: 10,
          letterSpacing: "0.1em",
          fontFamily: "var(--font-mono)",
        }}
      >
        WEATHER MAPS
      </div>

      {LAYERS.map((layer) => {
        const isActive = activeLayers.has(layer.id);
        return (
          <button
            key={layer.id}
            onClick={() => onToggle(layer.id)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
            style={{
              backgroundColor: isActive ? "rgba(8,145,178,0.12)" : "transparent",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
              style={{ backgroundColor: isActive ? "var(--ocean)" : "var(--ink-500)" }}
            />
            <div>
              <div
                style={{
                  color: isActive ? "var(--cream)" : "var(--smoke)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  lineHeight: 1.2,
                }}
              >
                {layer.label}
              </div>
              <div
                style={{
                  color: "var(--ash)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  marginTop: 1,
                }}
              >
                {layer.sub}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
