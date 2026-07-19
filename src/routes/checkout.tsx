import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBag } from "@/lib/bag-context";
import { listShopProducts } from "@/lib/products.functions";
import { placeOrder } from "@/lib/orders.functions";
import { useT, useField } from "@/lib/language-context";

const shopProductsQuery = queryOptions({
  queryKey: ["shop-products"],
  queryFn: () => listShopProducts(),
});

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — pinlove.studio" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(shopProductsQuery),
  component: CheckoutPage,
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

const ERROR_MESSAGES: Record<string, { en: string; bg: string }> = {
  invalid_name: { en: "Please enter your full name.", bg: "Моля, въведете пълното си име." },
  invalid_email: { en: "Please enter a valid email address.", bg: "Моля, въведете валиден имейл адрес." },
  invalid_address: { en: "Please enter a valid shipping address.", bg: "Моля, въведете валиден адрес за доставка." },
  empty_cart: { en: "Your bag is empty.", bg: "Твоята чанта е празна." },
  too_many_items: { en: "Too many items in your bag.", bg: "Твърде много артикули в чантата." },
  invalid_quantity: { en: "Invalid quantity for one of your items.", bg: "Невалидно количество за един от артикулите." },
  product_unavailable: {
    en: "One of the products is no longer available.",
    bg: "Един от продуктите вече не е наличен.",
  },
};

function CheckoutPage() {
  const { items, clear } = useBag();
  const { data: products } = useSuspenseQuery(shopProductsQuery);
  const navigate = useNavigate();
  const placeOrderFn = useServerFn(placeOrder);
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

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_country: "Bulgaria",
    notes: "",
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof placeOrderFn>[0]["data"]) => placeOrderFn({ data }),
    onSuccess: async ({ order_number }) => {
      await clear();
      toast.success(t(`Order ${order_number} received`, `Поръчка ${order_number} получена`));
      navigate({ to: "/checkout/success", search: { order: order_number } });
    },
    onError: (err: Error) => {
      const key = err.message.trim();
      const mapped = ERROR_MESSAGES[key];
      toast.error(mapped ? t(mapped.en, mapped.bg) : err.message || t("Could not place order.", "Поръчката не можа да бъде направена."));
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (detailed.length === 0) {
      toast.error(t("Your bag is empty.", "Твоята чанта е празна."));
      return;
    }
    mutation.mutate({
      ...form,
      items: detailed.map((i) => ({
        product_id: i.product!.id,
        quantity: i.quantity,
        variant: i.variant,
      })),
    });
  }

  if (items.length === 0) {
    return (
      <SiteShell>
        <section className="section-space">
          <div className="container-shell space-y-6">
            <h1 className="display-section">{t("Your bag is empty.", "Твоята чанта е празна.")}</h1>
            <Button asChild variant="outline">
              <Link to="/shop">{t("Browse best sellers", "Разгледай най-продаваните")}</Link>
            </Button>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="section-space">
        <div className="container-shell space-y-8">
          <div className="space-y-3 border-b border-border/80 pb-6">
            <p className="label-caps text-muted-foreground">{t("Checkout", "Плащане")}</p>
            <h1 className="display-section">{t("Your details", "Твоите данни")}</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {t(
                "No online payment. Fill in your contact and delivery details and we'll email you within 24 hours to confirm payment and shipping.",
                "Без онлайн плащане. Попълни контактните си данни и данните за доставка и ще ти пишем в рамките на 24 часа, за да потвърдим плащане и доставка.",
              )}
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">{t("Full name *", "Пълно име *")}</Label>
                  <Input
                    id="customer_name"
                    required
                    value={form.customer_name}
                    onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
                    maxLength={120}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_email">{t("Email *", "Имейл *")}</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    required
                    value={form.customer_email}
                    onChange={(e) => setForm((f) => ({ ...f, customer_email: e.target.value }))}
                    maxLength={255}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">{t("Phone", "Телефон")}</Label>
                  <Input
                    id="customer_phone"
                    value={form.customer_phone}
                    onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value }))}
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_city">{t("City", "Град")}</Label>
                  <Input
                    id="shipping_city"
                    value={form.shipping_city}
                    onChange={(e) => setForm((f) => ({ ...f, shipping_city: e.target.value }))}
                    maxLength={120}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping_address">{t("Shipping address *", "Адрес за доставка *")}</Label>
                <Input
                  id="shipping_address"
                  required
                  value={form.shipping_address}
                  onChange={(e) => setForm((f) => ({ ...f, shipping_address: e.target.value }))}
                  maxLength={500}
                  placeholder={t("Street, number, apartment", "Улица, номер, апартамент")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping_country">{t("Country", "Държава")}</Label>
                <Input
                  id="shipping_country"
                  value={form.shipping_country}
                  onChange={(e) => setForm((f) => ({ ...f, shipping_country: e.target.value }))}
                  maxLength={120}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{t("Order notes", "Забележки към поръчката")}</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  maxLength={1000}
                  placeholder={t("Anything we should know?", "Нещо, което трябва да знаем?")}
                />
              </div>
            </div>

            <aside className="h-fit space-y-6 rounded-sm border border-border/80 bg-surface p-6 shadow-soft">
              <div>
                <p className="label-caps text-muted-foreground">{t("Order summary", "Обобщение на поръчката")}</p>
                <ul className="mt-4 space-y-3 border-b border-border/70 pb-4 text-sm">
                  {detailed.map(({ slug, quantity, variant, product, unitPrice }) => (
                    <li
                      key={`${slug}:${variant ?? "default"}`}
                      className="flex justify-between gap-3"
                    >
                      <span className="text-foreground">
                        {f(product!.name, product!.name_bg)}
                        {variant
                          ? ` (${variant === "foot" ? t("Foot / Ankle", "Крак / Глезен") : t("Hand / Wrist", "Ръка / Китка")})`
                          : ""}{" "}
                        <span className="text-muted-foreground">× {quantity}</span>
                      </span>
                      <span className="tabular-nums">{(unitPrice * quantity).toFixed(0)} €</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">{t("Subtotal", "Междинна сума")}</span>
                  <span className="text-2xl font-medium">{subtotal.toFixed(2)} €</span>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? t("Placing order…", "Изпращане на поръчката…") : t("Place order", "Направи поръчка")}
              </Button>
              <p className="text-xs text-muted-foreground">
                {t(
                  "By placing this order you agree to be contacted by email to arrange payment and delivery.",
                  "С направата на тази поръчка се съгласяваш да бъдеш потърсен по имейл за уточняване на плащане и доставка.",
                )}
              </p>
            </aside>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
