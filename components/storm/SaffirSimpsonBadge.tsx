import { getSaffirSimpsonCategory, getCategoryColor } from "@/lib/utils";
import type { StormClassification } from "@/lib/nhc";
import { classificationLabel } from "@/lib/nhc";

type Props = {
  classification: StormClassification;
  windKnots: number;
};

const SCALE_DESCRIPTIONS: Record<string, string> = {
  TD: "< 34 kt · Minimal",
  TS: "34–63 kt · Moderate",
  "1": "64–82 kt · Minimal",
  "2": "83–95 kt · Moderate",
  "3": "96–112 kt · Extensive",
  "4": "113–136 kt · Extreme",
  "5": "≥ 137 kt · Catastrophic",
};

export default function SaffirSimpsonBadge({ classification, windKnots }: Props) {
  const category = getSaffirSimpsonCategory(windKnots);
  const color = getCategoryColor(category);
  const catKey = typeof category === "number" ? String(category) : category;
  const label = typeof category === "number" ? `Category ${category}` : classificationLabel(classification);
  const desc = SCALE_DESCRIPTIONS[catKey] ?? "";

  return (
    <div className="flex items-center gap-3">
      <div
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ backgroundColor: color, color: "#fff", fontFamily: "var(--font-mono)" }}
        title={desc}
      >
        {typeof category === "number" ? category : catKey}
      </div>
      <div>
        <div
          className="text-sm font-semibold"
          style={{ color: color, fontFamily: "var(--font-body)" }}
        >
          {label}
        </div>
        <div
          className="text-xs"
          style={{ color: "var(--ash)", fontFamily: "var(--font-mono)" }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
}
