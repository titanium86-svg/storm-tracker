"use client";

import { useState } from "react";
import type { StormCard } from "@/lib/library";
import StormCardComponent from "@/components/storm/StormCard";
import EmptyState from "@/components/ui/EmptyState";

type Props = { storms: StormCard[] };

export default function LibrarySearch({ storms }: Props) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? storms.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.full_name.toLowerCase().includes(q) ||
          String(s.year).includes(q) ||
          s.affected_areas?.some((a) => a.toLowerCase().includes(q))
      )
    : storms;

  return (
    <>
      {/* Search input */}
      <div className="flex justify-center mb-8">
      <div className="relative w-full max-w-2xl">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--smoke)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search storms, years, regions…"
          className="w-full pl-9 pr-4 py-2 rounded text-sm outline-none focus-visible:ring-2"
          style={{
            backgroundColor: "var(--ink-800)",
            border: "1px solid var(--ink-600)",
            color: "var(--cream)",
            fontFamily: "var(--font-body)",
            caretColor: "var(--cream)",
          }}
          aria-label="Search storms"
        />
      </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No storms found"
          description={`No results for "${query}". Try a different name or year.`}
        />
      ) : (
        <>
          <p
            className="text-xs mb-6"
            style={{ color: "var(--ash)", fontFamily: "var(--font-mono)" }}
          >
            {filtered.length} storm{filtered.length !== 1 ? "s" : ""}
            {q ? ` matching "${query}"` : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((storm, i) => (
              <StormCardComponent key={storm.slug} storm={storm} priority={i < 4} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
