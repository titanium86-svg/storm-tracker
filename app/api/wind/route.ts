import { NextResponse } from "next/server";

export const revalidate = 1800;

type WindPoint = { lat: number; lng: number; u: number; v: number };

// 4×7 = 28 grid points covering hurricane-active regions
const LATS = [-10, 10, 30, 50];
const LNGS = [-160, -110, -60, -10, 40, 90, 140];

export async function GET() {
  const fetches = LATS.flatMap((lat) =>
    LNGS.map(async (lng): Promise<WindPoint | null> => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms`;
        const res = await fetch(url, { next: { revalidate: 1800 } });
        if (!res.ok) return null;
        const data = await res.json();
        const speed: number = data.current?.wind_speed_10m ?? 0;
        const dir: number = data.current?.wind_direction_10m ?? 0;
        const rad = (dir * Math.PI) / 180;
        // meteorological convention: dir = where wind comes FROM
        // u = eastward component, v = northward component
        return { lat, lng, u: -speed * Math.sin(rad), v: -speed * Math.cos(rad) };
      } catch {
        return null;
      }
    })
  );

  const results = await Promise.all(fetches);
  const points = results.filter((p): p is WindPoint => p !== null);
  return NextResponse.json({ points });
}
