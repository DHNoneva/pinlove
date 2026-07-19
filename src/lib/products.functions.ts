import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  name_bg: string | null;
  eyebrow: string | null;
  eyebrow_bg: string | null;
  price_eur: number;
  category: string | null;
  foot_price_eur: number | null;
  image: string | null;
  alt: string | null;
};

export type ShopProductDetail = ShopProduct & {
  dimensions: string | null;
  dimensions_bg: string | null;
  artisan_note: string | null;
  artisan_note_bg: string | null;
  images: { url: string; alt: string | null }[];
};

function serverSupabase() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const listShopProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<ShopProduct[]> => {
    const supabase = serverSupabase();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, slug, name, name_bg, eyebrow, eyebrow_bg, price_eur, category, foot_price_eur, is_available, sort_order, product_images(url, alt, sort_order)",
      )
      .eq("is_available", true)
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[products] list failed", error);
      throw new Error("Unable to load products right now.");
    }
    return (data ?? []).map((p) => {
      const imgs = (p.product_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        name_bg: p.name_bg,
        eyebrow: p.eyebrow,
        eyebrow_bg: p.eyebrow_bg,
        price_eur: Number(p.price_eur),
        category: p.category,
        foot_price_eur: p.foot_price_eur == null ? null : Number(p.foot_price_eur),
        image: imgs[0]?.url ?? null,
        alt: imgs[0]?.alt ?? p.name,
      };
    });
  },
);

export const getShopProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<ShopProductDetail | null> => {
    const supabase = serverSupabase();
    const { data: p, error } = await supabase
      .from("products")
      .select(
        "id, slug, name, name_bg, eyebrow, eyebrow_bg, price_eur, dimensions, dimensions_bg, category, foot_price_eur, artisan_note, artisan_note_bg, product_images(url, alt, sort_order)",
      )
      .eq("slug", data.slug)
      .eq("is_available", true)
      .maybeSingle();
    if (error) {
      console.error("[products] detail failed", error);
      throw new Error("Unable to load this product right now.");
    }
    if (!p) return null;
    const imgs = (p.product_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      name_bg: p.name_bg,
      eyebrow: p.eyebrow,
      eyebrow_bg: p.eyebrow_bg,
      price_eur: Number(p.price_eur),
      dimensions: p.dimensions,
      dimensions_bg: p.dimensions_bg,
      category: p.category,
      foot_price_eur: p.foot_price_eur == null ? null : Number(p.foot_price_eur),
      artisan_note: p.artisan_note,
      artisan_note_bg: p.artisan_note_bg,
      image: imgs[0]?.url ?? null,
      alt: imgs[0]?.alt ?? p.name,
      images: imgs.map((i) => ({ url: i.url, alt: i.alt })),
    };
  });
