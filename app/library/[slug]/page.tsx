import { notFound } from "next/navigation";
import { getStormBySlug } from "@/lib/library";
import ResearchArticle from "@/components/storm/ResearchArticle";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://storm-tracker-one.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const storm = await getStormBySlug(slug);
  if (!storm) return { title: "Storm not found" };

  const cat = storm.category_saffir ? String(storm.category_saffir) : "";
  const ogUrl = `${BASE}/og?title=${encodeURIComponent(storm.full_name)}&sub=${encodeURIComponent(storm.year + " · " + storm.classification)}&cat=${cat}`;

  return {
    title: `${storm.full_name} (${storm.year})`,
    description: storm.summary,
    openGraph: {
      title: `${storm.full_name} (${storm.year})`,
      description: storm.summary,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogUrl],
    },
  };
}

export default async function StormLibraryPage({ params }: Props) {
  const { slug } = await params;
  const storm = await getStormBySlug(slug);

  if (!storm) notFound();

  return (
    <main className="flex-1">
      <ResearchArticle storm={storm} />
    </main>
  );
}
