import { createClient } from "@/lib/supabase/server";

export type StormCard = {
  slug: string;
  name: string;
  full_name: string;
  year: number;
  basin: string;
  category_saffir: number | null;
  classification: string;
  peak_wind_kmh: number | null;
  peak_pressure: number | null;
  fatalities: number | null;
  summary: string;
  og_image_url: string | null;
  affected_areas: string[] | null;
};

export type StormDetail = StormCard & {
  season: string;
  formed_at: string;
  dissipated_at: string | null;
  damage_usd: number | null;
  research_md: string;
  fun_facts: string[] | null;
  sources: { title: string; url: string; type: string }[];
  images: { id: string; url: string; caption: string; credit: string; type: string }[];
  is_featured: boolean;
};

export async function getStorms(basin?: string): Promise<StormCard[]> {
  const supabase = await createClient();
  let q = supabase
    .from("storms")
    .select(
      "slug, name, full_name, year, basin, category_saffir, classification, peak_wind_kmh, peak_pressure, fatalities, summary, og_image_url, affected_areas"
    )
    .order("year", { ascending: false });

  if (basin) q = q.eq("basin", basin);

  const { data, error } = await q;
  if (error) return [];
  return (data as StormCard[]) ?? [];
}

export async function getStormBySlug(slug: string): Promise<StormDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("storm_with_images")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as StormDetail;
}
