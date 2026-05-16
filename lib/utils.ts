export function knotsToKmh(knots: number): number {
  return Math.round(knots * 1.852);
}

export function knotsToMph(knots: number): number {
  return Math.round(knots * 1.15078);
}

export function getSaffirSimpsonCategory(windKnots: number): number | "TS" | "TD" {
  if (windKnots < 34) return "TD";
  if (windKnots < 64) return "TS";
  if (windKnots < 83) return 1;
  if (windKnots < 96) return 2;
  if (windKnots < 113) return 3;
  if (windKnots < 137) return 4;
  return 5;
}

export function getCategoryColor(category: number | "TS" | "TD"): string {
  const map: Record<string, string> = {
    TD: "var(--cat-td)",
    TS: "var(--cat-ts)",
    "1": "var(--cat-1)",
    "2": "var(--cat-2)",
    "3": "var(--cat-3)",
    "4": "var(--cat-4)",
    "5": "var(--cat-5)",
  };
  return map[String(category)] ?? "var(--cat-td)";
}
