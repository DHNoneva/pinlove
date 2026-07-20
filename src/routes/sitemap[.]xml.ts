import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://pinlove.org";

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface SitemapEntry {
  path: string;
  changefreq: ChangeFrequency;
  priority: string;
  lastmod?: string;
}

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

async function getProductEntries(): Promise<SitemapEntry[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  // The static pages remain discoverable if Supabase is temporarily unavailable.
  if (!url || !key) return [];

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_available", true)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("[sitemap] Could not load products", error);
      return [];
    }

    return (data ?? []).map((product) => ({
      path: `/shop/${encodeURIComponent(product.slug)}`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: product.updated_at ? new Date(product.updated_at).toISOString().slice(0, 10) : undefined,
    }));
  } catch (error) {
    console.error("[sitemap] Could not create the Supabase client", error);
    return [];
  }
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/home", changefreq: "weekly", priority: "0.9" },
          { path: "/shop", changefreq: "daily", priority: "0.9" },
          { path: "/fashion-pins", changefreq: "monthly", priority: "0.8" },
          { path: "/craft-your-own", changefreq: "monthly", priority: "0.8" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          ...(await getProductEntries()),
        ];

        const urls = entries.map((entry) =>
          [
            "  <url>",
            `    <loc>${escapeXml(`${BASE_URL}${entry.path}`)}</loc>`,
            entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
            `    <changefreq>${entry.changefreq}</changefreq>`,
            `    <priority>${entry.priority}</priority>`,
            "  </url>",
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600",
          },
        });
      },
    },
  },
});

 