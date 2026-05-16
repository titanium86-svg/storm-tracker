import { notFound } from "next/navigation";
import type { NHCActiveStormsResponse } from "@/lib/nhc";
import StormDetailClient from "./StormDetailClient";

type Props = { params: Promise<{ stormId: string }> };

async function fetchStorm(stormId: string) {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${base}/api/storms/active`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) return null;

  const data: NHCActiveStormsResponse = await res.json();
  return data.activeStorms.find((s) => s.id === stormId) ?? null;
}

export default async function StormDetailPage({ params }: Props) {
  const { stormId } = await params;
  const storm = await fetchStorm(stormId);

  if (!storm) notFound();

  return <StormDetailClient storm={storm} />;
}
