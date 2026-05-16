import type { MetadataRoute } from "next";
import { STORMS } from "@/scripts/storms-list";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://storm-tracker-one.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/live`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/library`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const stormRoutes: MetadataRoute.Sitemap = STORMS.map((storm) => ({
    url: `${BASE}/library/${storm.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...stormRoutes];
}
