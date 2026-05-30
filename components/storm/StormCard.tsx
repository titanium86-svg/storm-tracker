import Link from "next/link";
import Image from "next/image";
import type { StormCard } from "@/lib/library";
import { getCategoryColor } from "@/lib/utils";

const BASIN_LABEL: Record<string, string> = {
  NA: "Atlantic", EP: "E. Pacific", WP: "W. Pacific",
  NI: "N. Indian",  SI: "S. Indian",  SP: "S. Pacific",
};

type Props = { storm: StormCard; priority?: boolean };

export default function StormCardComponent({ storm, priority = false }: Props) {
  const color = storm.category_saffir
    ? getCategoryColor(storm.category_saffir)
    : "var(--cat-ts)";

  return (
    <Link
      href={`/library/${storm.slug}`}
      className="group block rounded-xl overflow-hidden transition-transform hover:-translate-y-0.5"
      style={{ backgroundColor: "var(--ink-800)", border: "1px solid var(--ink-600)" }}
      aria-label={`${storm.full_name} — ${storm.year} research article`}
    >
      {/* Image */}
      <div className="relative h-44" style={{ backgroundColor: "var(--ink-700)" }}>
        {storm.og_image_url ? (
          <>
            <Image
              src={storm.og_image_url}
              alt={`Satellite image of ${storm.full_name}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
              priority={priority}
              unoptimized={storm.og_image_url.includes("wikimedia")}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(8,9,12,0.85) 100%)" }}
              aria-hidden="true"
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, var(--ink-700), var(--ink-900))" }}
            aria-hidden="true"
          />
        )}

        {/* Basin badge */}
        <span
          className="absolute top-3 right-3 text-xs px-2 py-1 rounded z-10"
          style={{
            backgroundColor: "rgba(8,9,12,0.65)", color: "#6b9ec0",
            fontFamily: "var(--font-mono)",
            backdropFilter: "blur(4px)",
          }}
        >
          {BASIN_LABEL[storm.basin] ?? storm.basin}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-xs mb-1 uppercase tracking-widest" style={{ color: "var(--ash)", fontFamily: "var(--font-body)" }}>
          {storm.year}
        </div>
        <h2 className="text-lg mb-2 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}>
          {storm.full_name}
        </h2>
        <p className="text-xs line-clamp-2" style={{ color: "var(--smoke)", fontFamily: "var(--font-body)" }}>
          {storm.summary}
        </p>
        <div className="mt-3 flex gap-4 flex-wrap">
          {storm.peak_wind_kmh && <StatMini label="Wind" value={`${storm.peak_wind_kmh} km/h`} />}
          {storm.peak_pressure && <StatMini label="Pressure" value={`${storm.peak_pressure} mb`} />}
          {storm.fatalities && <StatMini label="Deaths" value={storm.fatalities.toLocaleString()} />}
          {storm.category_saffir ? (
            <div>
              <div className="text-xs" style={{ color: "var(--ash)", fontFamily: "var(--font-body)" }}>Level</div>
              <div className="text-xs font-bold tabular-nums" style={{ color, fontFamily: "var(--font-mono)" }}>
                Cat {storm.category_saffir}
              </div>
            </div>
          ) : (
            <StatMini label="Level" value={storm.classification} />
          )}
        </div>
      </div>
    </Link>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs" style={{ color: "var(--ash)", fontFamily: "var(--font-body)" }}>{label}</div>
      <div className="text-xs font-medium tabular-nums" style={{ color: "var(--bone)", fontFamily: "var(--font-mono)" }}>{value}</div>
    </div>
  );
}
