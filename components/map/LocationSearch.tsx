"use client";

import { useRef, useState } from "react";
import type maplibregl from "maplibre-gl";

type Props = { map: maplibregl.Map };

export default function LocationSearch({ map }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function search() {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (!data.length) { setError("Not found"); return; }
      const { lon, lat } = data[0];
      map.flyTo({ center: [parseFloat(lon), parseFloat(lat)], zoom: 5, duration: 1200 });
      setQuery("");
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="absolute z-10"
      style={{ top: 12, right: 52, display: "flex", gap: 0 }}
    >
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setError(""); }}
        onKeyDown={(e) => e.key === "Enter" && search()}
        placeholder="Search location…"
        aria-label="Search location"
        style={{
          width: 200,
          height: 32,
          padding: "0 10px",
          borderRadius: "6px 0 0 6px",
          border: "1px solid var(--ink-600)",
          borderRight: "none",
          backgroundColor: "rgba(13,15,20,0.92)",
          color: "var(--cream)",
          fontSize: 13,
          fontFamily: "var(--font-body)",
          outline: "none",
        }}
      />
      <button
        onClick={search}
        disabled={loading}
        aria-label="Search"
        style={{
          height: 32,
          padding: "0 10px",
          borderRadius: "0 6px 6px 0",
          border: "1px solid var(--ink-600)",
          backgroundColor: loading ? "rgba(8,145,178,0.3)" : "rgba(8,145,178,0.2)",
          color: "var(--ocean)",
          fontSize: 13,
          cursor: loading ? "default" : "pointer",
        }}
      >
        {loading ? "…" : "→"}
      </button>
      {error && (
        <span
          style={{
            position: "absolute",
            top: 36,
            right: 0,
            fontSize: 11,
            color: "#f87171",
            fontFamily: "var(--font-mono)",
            backgroundColor: "rgba(13,15,20,0.92)",
            padding: "2px 6px",
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
