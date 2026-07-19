import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { BilingualText, SiteShell } from "@/components/site-shell";
import { getShopProduct, listShopProducts } from "@/lib/products.functions";
import { useBag } from "@/lib/bag-context";
import { useT, useField } from "@/lib/language-context";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["shop-product", slug],
    queryFn: () => getShopProduct({ data: { slug } }),
  });

const allProductsQuery = queryOptions({
  queryKey: ["shop-products"],
  queryFn: () => listShopProducts(),
});

export const Route = createFileRoute("/shop/$slug")({
  head: ({ params }) => {
    const pretty = params.slug.replace(/-/g, " ");
    const title = `${pretty} — pinlove.studio`;
    const description = "Handcrafted piece from pinlove.studio.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    context.queryClient.prefetchQuery(allProductsQuery);
    return { product };
  },
  notFoundComponent: () => {
    const t = useT();
    return (
      <SiteShell>
        <section className="section-space">
          <div className="container-shell space-y-4">
            <p className="label-caps text-muted-foreground">{t("Not found", "Не е намерено")}</p>
            <h1 className="display-section">
              {t("This piece is no longer available.", "Това изделие вече не е налично.")}
            </h1>
            <Button asChild variant="outline">
              <Link to="/shop">{t("Back to Best Sellers", "Обратно към най-продавани")}</Link>
            </Button>
          </div>
        </section>
      </SiteShell>
    );
  },
  errorComponent: ({ error }) => {
    const t = useT();
    return (
      <SiteShell>
        <section className="section-space">
          <div className="container-shell space-y-4">
            <h1 className="display-section">{t("Something went wrong.", "Нещо се обърка.")}</h1>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </section>
      </SiteShell>
    );
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { data: all } = useSuspenseQuery(allProductsQuery);
  const { add } = useBag();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const t = useT();
  const f = useField();

  const isBracelet = product?.category === "bracelet" && product?.foot_price_eur != null;
  const [variant, setVariant] = useState<"hand" | "foot">("hand");

  if (!product) return null;

  const related = all.filter((p) => p.slug !== product.slug).slice(0, 4);
  const unitPrice = isBracelet && variant === "foot" ? product.foot_price_eur! : product.price_eur;

  async function handleAdd(thenGoToBag = false) {
    if (!product) return;
    setAdding(true);
    try {
      await add(product.slug, qty, isBracelet ? variant : undefined);
      const localizedName = f(product.name, product.name_bg);
      toast.success(t(`${localizedName} added to bag`, `${localizedName} добавен в чантата`));
      if (thenGoToBag) navigate({ to: "/bag" });
    } catch {
      toast.error(t("Could not add to bag", "Неуспешно добавяне в чантата"));
    } finally {
      setAdding(false);
    }
  }

  return (
    <SiteShell>
      <section className="section-space">
        <div className="container-shell space-y-8">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              {t("Home", "Начало")}
            </Link>
            <span className="px-2">/</span>
            <Link to="/shop" className="hover:text-foreground">
              {t("Best Sellers", "Най-продавани")}
            </Link>
            <span className="px-2">/</span>
            <span className="text-foreground">{f(product.name, product.name_bg)}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-sm bg-secondary/35 shadow-soft"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.alt ?? f(product.name, product.name_bg)}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="aspect-[4/5] w-full bg-secondary/50" />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-7 lg:pt-6"
            >
              <div className="space-y-3">
                {product.eyebrow ? (
                  <p className="label-caps text-muted-foreground">{f(product.eyebrow, product.eyebrow_bg)}</p>
                ) : null}
                <h1 className="display-section text-balance">{f(product.name, product.name_bg)}</h1>
              </div>

              <p className="text-2xl font-medium text-foreground">{unitPrice.toFixed(0)} €</p>

              {isBracelet ? (
                <div className="space-y-2">
                  <span className="label-caps text-muted-foreground">{t("Wear as", "Носи като")}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVariant("hand")}
                      className={`rounded-sm border px-4 py-2 text-sm transition-colors ${
                        variant === "hand"
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {t("Hand / Wrist", "Ръка / Китка")} — {product.price_eur.toFixed(0)} €
                    </button>
                    <button
                      type="button"
                      onClick={() => setVariant("foot")}
                      className={`rounded-sm border px-4 py-2 text-sm transition-colors ${
                        variant === "foot"
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {t("Foot / Ankle", "Крак / Глезен")} — {product.foot_price_eur!.toFixed(0)} €
                    </button>
                  </div>
                </div>
              ) : null}

              {product.dimensions ? (
                <p className="max-w-lg text-sm leading-6 text-foreground">
                  {t("Dimensions:", "Размери:")} {f(product.dimensions, product.dimensions_bg)}
                </p>
              ) : null}

              {product.artisan_note ? (
                <div className="max-w-lg space-y-3 whitespace-pre-line rounded-sm bg-secondary/25 p-5 text-sm leading-6 text-foreground">
                  {f(product.artisan_note, product.artisan_note_bg)}
                </div>
              ) : null}

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <span className="label-caps text-muted-foreground">{t("Quantity", "Количество")}</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="h-9 w-9 rounded-sm border border-border text-foreground hover:bg-accent"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label={t("Decrease", "Намали")}
                    >
                      −
                    </button>
                    <span className="w-8 text-center tabular-nums">{qty}</span>
                    <button
                      className="h-9 w-9 rounded-sm border border-border text-foreground hover:bg-accent"
                      onClick={() => setQty((q) => q + 1)}
                      aria-label={t("Increase", "Увеличи")}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button size="lg" onClick={() => handleAdd(false)} disabled={adding}>
                    {adding ? t("Adding…", "Добавяне…") : t("Add to bag", "Добави в чантата")}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => handleAdd(true)}
                    disabled={adding}
                  >
                    {t("Buy now", "Купи сега")}
                  </Button>
                </div>
              </div>

              <div className="space-y-3 border-t border-border/70 pt-6 text-sm text-muted-foreground">
                <BilingualText
                  en="Orders are confirmed personally by email with payment and delivery details. Handcrafted in small batches; delivery within Bulgaria 2–4 business days."
                  bg="Поръчките се потвърждават лично по имейл, с детайли за плащане при получаване на доставката."
                  className="text-sm leading-6"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-space border-t border-border/80 bg-secondary/25">
          <div className="container-shell space-y-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="display-section">{t("You may also like", "Може да харесате и")}</h2>
              <Link to="/shop" className="label-caps text-muted-foreground hover:text-foreground">
                {t("All best sellers →", "Всички най-продавани →")}
              </Link>
            </div>
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <article key={p.slug} className="group flex flex-col">
                  <Link
                    to="/shop/$slug"
                    params={{ slug: p.slug }}
                    className="block overflow-hidden rounded-sm bg-background"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.alt ?? f(p.name, p.name_bg)}
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="aspect-[4/5] w-full bg-secondary/50" />
                    )}
                  </Link>
                  <div className="flex items-baseline justify-between gap-2 pt-3">
                    <Link
                      to="/shop/$slug"
                      params={{ slug: p.slug }}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {f(p.name, p.name_bg)}
                    </Link>
                    <span className="text-xs font-medium text-foreground">
                      {p.price_eur.toFixed(0)} €
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
