import { getStorms } from "@/lib/library";
import StormCardComponent from "@/components/storm/StormCard";
import EmptyState from "@/components/ui/EmptyState";

const BASINS = [
  { code: "", label: "All" },
  { code: "NA", label: "Atlantic" },
  { code: "WP", label: "W. Pacific" },
  { code: "EP", label: "E. Pacific" },
  { code: "NI", label: "N. Indian" },
  { code: "SI", label: "S. Indian" },
  { code: "SP", label: "S. Pacific" },
];

type Props = { searchParams: Promise<{ basin?: string }> };

export default async function LibraryPage({ searchParams }: Props) {
  const { basin } = await searchParams;
  const storms = await getStorms(basin);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ color: "var(--smoke)", fontFamily: "var(--font-body)" }}
        >
          Research archive
        </p>
        <h1
          className="text-4xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
        >
          Storm Library
        </h1>
      </div>

      {/* Basin filter tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {BASINS.map(({ code, label }) => {
          const active = (basin ?? "") === code;
          return (
            <a
              key={code}
              href={code ? `/library?basin=${code}` : "/library"}
              className="px-4 py-1.5 rounded text-sm transition-colors"
              style={{
                backgroundColor: active ? "var(--ink-500)" : "var(--ink-800)",
                color: active ? "var(--cream)" : "var(--smoke)",
                border: `1px solid ${active ? "var(--ink-600)" : "var(--ink-600)"}`,
                fontFamily: "var(--font-body)",
              }}
            >
              {label}
            </a>
          );
        })}
      </div>

      {/* Grid */}
      {storms.length === 0 ? (
        <EmptyState
          title="No storms yet"
          description="Run the seed script to populate the library."
        />
      ) : (
        <>
          <p
            className="text-xs mb-6"
            style={{ color: "var(--ash)", fontFamily: "var(--font-mono)" }}
          >
            {storms.length} storms
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {storms.map((storm) => (
              <StormCardComponent key={storm.slug} storm={storm} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
