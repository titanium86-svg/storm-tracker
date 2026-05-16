import { notFound } from "next/navigation";
import { getStormBySlug } from "@/lib/library";
import ResearchArticle from "@/components/storm/ResearchArticle";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const storm = await getStormBySlug(slug);
  if (!storm) return { title: "Storm not found" };

  return {
    title: `${storm.full_name} (${storm.year}) — Storm Tracker`,
    description: storm.summary,
    openGraph: {
      images: storm.og_image_url ? [storm.og_image_url] : [],
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
