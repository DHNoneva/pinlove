import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { BilingualText, SiteShell } from "@/components/site-shell";
import { listShopProducts } from "@/lib/products.functions";
import { useT, useField } from "@/lib/language-context";

const shopProductsQuery = queryOptions({
  queryKey: ["shop-products"],
  queryFn: () => listShopProducts(),
});

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Best Sellers — pinlove.studio" },
      {
        name: "description",
        content:
          "Best-selling handcrafted necklaces and pieces from pinlove.studio — pearl-led designs and softly sculpted bracelets.",
      },
      { property: "og:title", content: "Best Sellers — pinlove.studio" },
      {
        property: "og:description",
        content:
          "Best-selling handcrafted necklaces and pieces from pinlove.studio — pearl-led designs and softly sculpted bracelets.",
      },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(shopProductsQuery),
  component: ShopPage,
  errorComponent: ({ error }) => {
    const t = useT();
    return (
      <SiteShell>
        <section className="section-space">
          <div className="container-shell">
            <p role="alert" className="text-sm text-muted-foreground">
              {t("Couldn't load products:", "Продуктите не можаха да се заредят:")} {error.message}
            </p>
          </div>
        </section>
      </SiteShell>
    );
  },
  notFoundComponent: () => {
    const t = useT();
    return (
      <SiteShell>
        <section className="section-space">
          <div className="container-shell">
            <p className="text-sm text-muted-foreground">{t("No products yet.", "Все още няма продукти.")}</p>
          </div>
        </section>
      </SiteShell>
    );
  },
});

function ShopPage() {
  const { data: products } = useSuspenseQuery(shopProductsQuery);
  const t = useT();
  const f = useField();
  return (
    <SiteShell>
      <section className="section-space">
        <div className="container-shell space-y-10">
          <div className="space-y-4 border-b border-border/80 pb-8">
            <p className="label-caps text-muted-foreground">{t("Best Sellers", "Най-продавани")}</p>
            <h1 className="display-section max-w-3xl text-balance">
              {t("The most-loved handcrafted pieces.", "Най-обичаните ръчно изработени бижута.")}
            </h1>
            <p>
              {t(
                "Select your preferred piece, add it to your cart, and complete your order.",
                "Изберете предпочитаното от вас бижу, добавете го в количката и завършете своята поръчка.",
              )}
            </p>
          </div>

          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <article key={product.slug} className="group flex flex-col">
                <Link
                  to="/shop/$slug"
                  params={{ slug: product.slug }}
                  className="block overflow-hidden rounded-sm bg-secondary/35"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.alt ?? f(product.name, product.name_bg)}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="aspect-[4/5] w-full bg-secondary/50" />
                  )}
                </Link>
                <div className="space-y-1 pt-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <Link
                      to="/shop/$slug"
                      params={{ slug: product.slug }}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {f(product.name, product.name_bg)}
                    </Link>
                    <span className="text-xs font-medium text-foreground">
                      {product.price_eur.toFixed(0)} €
                    </span>
                  </div>
                  {product.eyebrow ? (
                    <p className="text-xs text-muted-foreground">{f(product.eyebrow, product.eyebrow_bg)}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
