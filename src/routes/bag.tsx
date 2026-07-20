import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useBag } from "@/lib/bag-context";
import { listShopProducts } from "@/lib/products.functions";
import { useT, useField } from "@/lib/language-context";

const shopProductsQuery = queryOptions({
  queryKey: ["shop-products"],
  queryFn: () => listShopProducts(),
});

export const Route = createFileRoute("/bag")({
  head: () => ({ meta: [{ title: "Your bag — pinlove.studio" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(shopProductsQuery),
  component: BagPage,
  errorComponent: ({ error }) => (
    <SiteShell>
      <section className="section-space">
        <div className="container-shell">
          <p role="alert" className="text-sm text-muted-foreground">
            {error.message}
          </p>
        </div>
      </section>
    </SiteShell>
  ),
});

function BagPage() {
  const { items, count, setQuantity, remove, clear } = useBag();
  const { data: products } = useSuspenseQuery(shopProductsQuery);
  const t = useT();
  const f = useField();

  const detailed = items
    .map((i) => ({ ...i, product: products.find((p) => p.slug === i.slug) }))
    .filter((i) => i.product)
    .map((i) => ({
      ...i,
      unitPrice:
        i.variant === "foot" && i.product!.foot_price_eur != null
          ? i.product!.foot_price_eur
          : i.product!.price_eur,
    }));

  const subtotal = detailed.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <SiteShell>
      <section className="section-space">
        <div className="container-shell space-y-8">
          <div className="space-y-3 border-b border-border/80 pb-6">
            <p className="label-caps text-muted-foreground">{t("Your bag", "Твоята чанта")}</p>
            <h1 className="display-section">
              {count === 0
                ? t("Your bag is empty.", "Твоята чанта е празна.")
                : t(
                    `${count} ${count === 1 ? "piece" : "pieces"} in your bag.`,
                    `${count} ${count === 1 ? "артикул" : "артикула"} в чантата ти.`,
                  )}
                  </h1><br></br>
                  <h2>{t("Delivery is free on orders over €50.", "Доставката е безплатна на поръчка над 50 евро")}</h2> <br />
            
          </div>

          {count === 0 ? (
            <Button asChild variant="outline">
              <Link to="/shop">{t("Browse best sellers", "Разгледай най-продаваните")}</Link>
            </Button>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
              <ul className="divide-y divide-border/70">
                {detailed.map(({ slug, quantity, variant, product, unitPrice }) => (
                  <li key={`${slug}:${variant ?? "default"}`} className="flex gap-5 py-6">
                    <Link
                      to="/shop/$slug"
                      params={{ slug }}
                      className="block h-32 w-24 shrink-0 overflow-hidden rounded-sm bg-secondary/35"
                    >
                      {product!.image ? (
                        <img
                          src={product!.image}
                          alt={product!.alt ?? f(product!.name, product!.name_bg)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-secondary/50" />
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            to="/shop/$slug"
                            params={{ slug }}
                            className="text-base font-medium text-foreground hover:underline"
                          >
                            {f(product!.name, product!.name_bg)}
                          </Link>
                          {variant ? (
                            <p className="text-sm text-muted-foreground">
                              {variant === "foot" ? t("Foot / Ankle", "Крак / Глезен") : t("Hand / Wrist", "Ръка / Китка")}
                            </p>
                          ) : product!.eyebrow ? (
                            <p className="text-sm text-muted-foreground">{f(product!.eyebrow, product!.eyebrow_bg)}</p>
                          ) : null}
                        </div>
                        <p className="text-sm font-medium">{unitPrice.toFixed(0)} €</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <button
                          className="h-8 w-8 rounded-sm border border-border text-foreground hover:bg-accent"
                          onClick={() => setQuantity(slug, quantity - 1, variant)}
                          aria-label={t("Decrease quantity", "Намали количеството")}
                        >
                          −
                        </button>
                        <span className="w-6 text-center tabular-nums">{quantity}</span>
                        <button
                          className="h-8 w-8 rounded-sm border border-border text-foreground hover:bg-accent"
                          onClick={() => setQuantity(slug, quantity + 1, variant)}
                          aria-label={t("Increase quantity", "Увеличи количеството")}
                        >
                          +
                        </button>
                        <button
                          className="ml-4 text-xs tracking-[0.12em] text-muted-foreground uppercase hover:text-foreground"
                          onClick={() => remove(slug, variant)}
                        >
                          {t("Remove", "Премахни")}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="h-fit space-y-6 rounded-sm border border-border/80 bg-surface p-6 shadow-soft">
                <div>
                  <p className="label-caps text-muted-foreground">{t("Summary", "Обобщение")}</p>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">{t("Subtotal", "Междинна сума")}</span>
                    <span className="text-2xl font-medium">{subtotal.toFixed(2)} €</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t(
                      "No online payment. We confirm your order by email with payment and delivery details.",
                      "Без онлайн плащане. Потвърждаваме поръчката ти по имейл с детайли за плащане и доставка.",
                    )}
                  </p>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link to="/checkout">{t("Proceed to checkout", "Продължи към плащане")}</Link>
                </Button>
                <button
                  className="w-full text-xs tracking-[0.12em] text-muted-foreground uppercase hover:text-foreground"
                  onClick={() => clear()}
                >
                  {t("Clear bag", "Изчисти чантата")}
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
