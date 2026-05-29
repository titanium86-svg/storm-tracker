import { NextResponse } from "next/server";
import type { NHCActiveStormsResponse } from "@/lib/nhc";
import { fetchJTWCStorms } from "@/lib/jtwc";

const NHC_URL = "https://www.nhc.noaa.gov/CurrentStorms.json";

export const revalidate = 1800; // 30 min

export async function GET() {
  const [nhcResult, jtwcResult] = await Promise.allSettled([
    fetch(NHC_URL, {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "StormTracker/1.0" },
    }).then((r): Promise<NHCActiveStormsResponse> => (r.ok ? r.json() : Promise.resolve({ activeStorms: [] }))),
    fetchJTWCStorms(),
  ]);

  const nhcStorms = nhcResult.status === "fulfilled" ? (nhcResult.value.activeStorms ?? []) : [];
  const jtwcStorms = jtwcResult.status === "fulfilled" ? jtwcResult.value : [];

  return NextResponse.json({ activeStorms: [...nhcStorms, ...jtwcStorms] });
}
