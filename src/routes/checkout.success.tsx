import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/language-context";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (search) =>
    z.object({ order: z.string().optional() }).parse(search),
  head: () => ({ meta: [{ title: "Order received — pinlove.studio" }] }),
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const { order } = Route.useSearch();
  const t = useT();
  return (
    <SiteShell>
      <section className="section-space">
        <div className="container-shell max-w-2xl space-y-6 text-center">
          <p className="label-caps text-muted-foreground">{t("Thank you", "Благодарим ти")}</p>
          <h1 className="display-section">{t("Your order has been received.", "Поръчката ти беше получена.")}</h1>
          {order ? (
            <p className="text-sm text-muted-foreground">
              {t("Order reference:", "Референтен номер:")} <span className="font-medium text-foreground">{order}</span>
            </p>
          ) : null}
          <p className="mx-auto max-w-lg text-sm text-muted-foreground">
            {t(
              "We'll email you within 24 hours to confirm payment and delivery details. Please check your inbox (and spam folder) for a message from pinlove.studio.",
              "Ще ти пишем в рамките на 24 часа, за да потвърдим плащане и детайли за доставка. Моля, провери входящата поща (и спам папката) за съобщение от pinlove.studio.",
            )}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button asChild>
              <Link to="/shop">{t("Continue shopping", "Продължи пазаруването")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/home">{t("Back to home", "Обратно към начало")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
