import { notFound } from "next/navigation";
import type { NHCActiveStormsResponse } from "@/lib/nhc";
import { fetchJTWCStorms } from "@/lib/jtwc";
import StormDetailClient from "./StormDetailClient";

type Props = { params: Promise<{ stormId: string }> };

async function fetchStorm(stormId: string) {
  try {
    // JTWC storm IDs start with "jtwc-"
    if (stormId.startsWith("jtwc-")) {
      const storms = await fetchJTWCStorms();
      return storms.find((s) => s.id === stormId) ?? null;
    }

    const res = await fetch("https://www.nhc.noaa.gov/CurrentStorms.json", {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "StormTracker/1.0" },
    });
    if (!res.ok) return null;
    const data: NHCActiveStormsResponse = await res.json();
    return data.activeStorms.find((s) => s.id === stormId) ?? null;
  } catch {
    return null;
  }
}

export default async function StormDetailPage({ params }: Props) {
  const { stormId } = await params;
  const storm = await fetchStorm(stormId);
  if (!storm) notFound();
  return <StormDetailClient storm={storm} />;
}
