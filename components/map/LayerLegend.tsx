"use client";

import type { LegendConfig } from "@/lib/weather-layers";

type Props = { config: LegendConfig };

export default function LayerLegend({ config }: Props) {
  const gradient = config.stops.map((s) => s.color).join(", ");

  return (
    <div
      className="absolute z-10"
      style={{ bottom: 56, left: 16, width: 220 }}
    >
      <div
        style={{
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          color: "var(--ash)",
          marginBottom: 4,
          letterSpacing: "0.08em",
        }}
      >
        {config.label.toUpperCase()}
      </div>

      {/* Gradient bar */}
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background: `linear-gradient(to right, ${gradient})`,
          marginBottom: 4,
        }}
      />

      {/* Tick labels */}
      <div style={{ position: "relative", height: 14 }}>
        {config.stops.map((stop, i) => {
          const pct = (i / (config.stops.length - 1)) * 100;
          return (
            <span
              key={stop.value}
              style={{
                position: "absolute",
                left: `${pct}%`,
                transform: i === 0 ? "none" : i === config.stops.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                color: "var(--smoke)",
                whiteSpace: "nowrap",
              }}
            >
              {stop.value}{i === config.stops.length - 1 ? `+ ${config.unit}` : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}
