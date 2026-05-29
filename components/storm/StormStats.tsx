"use client";

import { useState } from "react";
import type { NHCStorm } from "@/lib/nhc";
import { knotsToKmh, knotsToMph } from "@/lib/utils";
import SaffirSimpsonBadge from "./SaffirSimpsonBadge";

type Unit = "kmh" | "knots" | "mph";

const DIRECTION_LABELS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

function directionLabel(deg: number): string {
  return DIRECTION_LABELS[Math.round(deg / 22.5) % 16];
}

type Props = { storm: NHCStorm };

export default function StormStats({ storm }: Props) {
  const [unit, setUnit] = useState<Unit>("kmh");
  const windKnots = parseInt(storm.intensity);
  const speedKnots = storm.movementSpeed;

  function displayWind(knots: number): string {
    if (unit === "knots") return `${knots} kt`;
    if (unit === "mph") return `${knotsToMph(knots)} mph`;
    return `${knotsToKmh(knots)} km/h`;
  }

  const lastUpdated = new Date(storm.lastUpdate).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "UTC",
  }) + " UTC";

  return (
    <div className="space-y-6">
      {/* Name + classification */}
      <div>
        <h1
          className="text-3xl mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
        >
          {storm.name}
        </h1>
        <SaffirSimpsonBadge classification={storm.classification} windKnots={windKnots} />
      </div>

      {/* Unit toggle */}
      <div className="flex gap-1">
        {(["kmh", "knots", "mph"] as Unit[]).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className="px-3 py-1 rounded text-xs font-medium transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              backgroundColor: unit === u ? "var(--ink-500)" : "transparent",
              color: unit === u ? "var(--cream)" : "var(--ash)",
              border: "1px solid var(--ink-600)",
            }}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatBlock label="Max Wind" value={displayWind(windKnots)} />
        <StatBlock label="Pressure" value={`${storm.pressure} mb`} />
        <StatBlock
          label="Movement"
          value={`${directionLabel(storm.movementDir)} ${displayWind(speedKnots)}`}
        />
        <StatBlock
          label="Position"
          value={`${Math.abs(storm.latitudeNumeric).toFixed(1)}°${storm.latitudeNumeric >= 0 ? "N" : "S"} ${Math.abs(storm.longitudeNumeric).toFixed(1)}°${storm.longitudeNumeric >= 0 ? "E" : "W"}`}
        />
      </div>

      <div
        className="text-xs"
        style={{ color: "var(--ash)", fontFamily: "var(--font-mono)" }}
      >
        Last advisory: {lastUpdated}
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--ink-700)", border: "1px solid var(--ink-600)" }}
    >
      <div
        className="text-xs mb-1 uppercase tracking-widest"
        style={{ color: "var(--ash)", fontFamily: "var(--font-body)" }}
      >
        {label}
      </div>
      <div
        className="text-lg font-medium tabular-nums"
        style={{ color: "var(--cream)", fontFamily: "var(--font-mono)" }}
      >
        {value}
      </div>
    </div>
  );
}
