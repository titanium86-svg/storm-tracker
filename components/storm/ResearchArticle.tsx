import type { StormDetail } from "@/lib/library";
import { getCategoryColor } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

const BASIN_LABEL: Record<string, string> = {
  NA: "North Atlantic", EP: "Eastern Pacific", WP: "Western Pacific",
  NI: "North Indian",  SI: "South Indian",    SP: "South Pacific",
};

type Props = { storm: StormDetail };

export default function ResearchArticle({ storm }: Props) {
  const color = storm.category_saffir
    ? getCategoryColor(storm.category_saffir)
    : "var(--cat-ts)";

  const formattedDamage = storm.damage_usd
    ? storm.damage_usd >= 1e9
      ? `$${(storm.damage_usd / 1e9).toFixed(1)}B`
      : `$${(storm.damage_usd / 1e6).toFixed(0)}M`
    : null;

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Back nav */}
      <Link
        href="/library"
        className="inline-flex items-center gap-1 text-xs mb-8 transition-colors"
        style={{ color: "var(--smoke)", fontFamily: "var(--font-body)" }}
      >
        <ArrowLeft size={12} />
        Storm Library
      </Link>

      {/* Hero image */}
      {storm.og_image_url && (
        <div
          className="rounded-xl overflow-hidden mb-8 h-72 bg-cover bg-center"
          style={{ backgroundImage: `url(${storm.og_image_url})` }}
        />
      )}

      {/* Title block */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--ash)", fontFamily: "var(--font-body)" }}
          >
            {storm.year} · {BASIN_LABEL[storm.basin] ?? storm.basin}
          </span>
          {storm.category_saffir && (
            <span
              className="text-xs px-2 py-0.5 rounded font-bold"
              style={{
                backgroundColor: color + "22",
                color,
                border: `1px solid ${color}44`,
                fontFamily: "var(--font-mono)",
              }}
            >
              Cat {storm.category_saffir}
            </span>
          )}
        </div>
        <h1
          className="text-5xl leading-tight mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
        >
          {storm.full_name}
        </h1>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--bone)", fontFamily: "var(--font-body)" }}
        >
          {storm.summary}
        </p>
      </div>

      {/* Stats grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 p-5 rounded-xl"
        style={{ backgroundColor: "var(--ink-800)", border: "1px solid var(--ink-600)" }}
      >
        {storm.peak_wind_kmh && (
          <StatCell label="Peak Wind" value={`${storm.peak_wind_kmh} km/h`} />
        )}
        {storm.peak_pressure && (
          <StatCell label="Min Pressure" value={`${storm.peak_pressure} mb`} />
        )}
        {storm.fatalities != null && (
          <StatCell label="Fatalities" value={storm.fatalities.toLocaleString()} />
        )}
        {formattedDamage && (
          <StatCell label="Damage" value={formattedDamage} />
        )}
      </div>

      {/* Affected areas */}
      {storm.affected_areas && storm.affected_areas.length > 0 && (
        <div className="mb-8">
          <SectionLabel>Affected Areas</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {storm.affected_areas.map((area) => (
              <span
                key={area}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "var(--ink-700)",
                  color: "var(--smoke)",
                  border: "1px solid var(--ink-600)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Research content */}
      <div
        className="prose prose-invert max-w-none mb-10"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--bone)",
          lineHeight: "1.75",
        }}
      >
        {storm.research_md.split("\n").map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <div key={i}>
                <SectionLabel>{line.slice(3)}</SectionLabel>
              </div>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <p key={i} style={{ color: "var(--bone)", marginBottom: "0.5rem" }}>
                · {line.slice(2)}
              </p>
            );
          }
          if (line.trim()) {
            return (
              <p key={i} style={{ color: "var(--bone)", marginBottom: "1rem" }}>
                {line}
              </p>
            );
          }
          return null;
        })}
      </div>

      {/* Fun facts */}
      {storm.fun_facts && storm.fun_facts.length > 0 && (
        <div
          className="mb-10 p-5 rounded-xl"
          style={{ backgroundColor: "var(--ink-700)", border: "1px solid var(--ink-600)" }}
        >
          <SectionLabel>Notable Facts</SectionLabel>
          <ul className="space-y-2">
            {storm.fun_facts.map((fact, i) => (
              <li
                key={i}
                className="text-sm flex gap-2"
                style={{ color: "var(--bone)", fontFamily: "var(--font-body)" }}
              >
                <span style={{ color: "var(--amber-glow)" }}>→</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources */}
      {storm.sources && storm.sources.length > 0 && (
        <div>
          <SectionLabel>Sources</SectionLabel>
          <ul className="space-y-2">
            {storm.sources.map((src, i) => (
              <li key={i}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm inline-flex items-center gap-1 hover:underline"
                  style={{ color: "var(--ocean)", fontFamily: "var(--font-body)" }}
                >
                  {src.title}
                  <ExternalLink size={11} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs uppercase tracking-widest mb-3 mt-8"
      style={{ color: "var(--smoke)", fontFamily: "var(--font-body)" }}
    >
      {children}
    </p>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="text-xs uppercase tracking-wider mb-1"
        style={{ color: "var(--ash)", fontFamily: "var(--font-body)" }}
      >
        {label}
      </div>
      <div
        className="text-xl font-medium tabular-nums"
        style={{ color: "var(--cream)", fontFamily: "var(--font-mono)" }}
      >
        {value}
      </div>
    </div>
  );
}
