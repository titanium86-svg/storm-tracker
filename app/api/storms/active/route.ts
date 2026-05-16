import { NextResponse } from "next/server";
import type { NHCActiveStormsResponse } from "@/lib/nhc";

const NHC_URL = "https://www.nhc.noaa.gov/CurrentStorms.json";

export const revalidate = 1800; // 30 min

export async function GET() {
  try {
    const res = await fetch(NHC_URL, {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "StormTracker/1.0" },
    });

    if (!res.ok) throw new Error(`NHC fetch failed: ${res.status}`);

    const data: NHCActiveStormsResponse = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { activeStorms: [], error: "Failed to fetch NHC data" },
      { status: 503 }
    );
  }
}
