import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";
import { listShopProducts } from "@/lib/products.functions";
import { useT, useField } from "@/lib/language-context";

const bestSellersQuery = queryOptions({
  queryKey: ["shop-products"],
  queryFn: () => listShopProducts(),
});

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — pinlove.studio" },
      {
        name: "description",
        content:
          "A quiet atelier in Bulgaria. Custom commissions, a signature collection, and a slowly-made archive of pieces.",
      },
      { property: "og:title", content: "Home — pinlove.studio" },
      {
        property: "og:description",
        content:
          "A quiet atelier in Bulgaria. Custom commissions and a signature collection of handmade jewelry.",
      },
      { property: "og:url", content: "/home" },
    ],
    links: [{ rel: "canonical", href: "/home" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(bestSellersQuery),
  component: HomePage,
});

function HomePage() {
  const { data: bestSellers } = useSuspenseQuery(bestSellersQuery);
  const signature = bestSellers.slice(0, 6);
  const t = useT();
  const f = useField();

  return (
    <SiteShell>
      {/* Hero video — uploaded video lives in /public/videos so it ships with the repo */}
      <section className="relative -mt-[1px] h-[80svh] min-h-[520px] w-full overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/home-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,16,12,0.15) 0%, rgba(20,16,12,0.05) 50%, rgba(20,16,12,0.5) 100%)",
          }}
        />
        <div className="relative z-10 flex h-full items-end">
          <div className="container-shell pb-14 md:pb-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="display-hero max-w-2xl text-white"
              style={{ textShadow: "0 2px 30px rgba(0,0,0,0.35)" }}
            >
              pinlove.studio
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Chapter I · The Studio */}
      <section className="section-space border-t border-border/80">
        <div className="container-shell grid gap-12 md:grid-cols-2 md:items-start">
          <img
            src="/img/homepage-1.jpg"
            alt="A quiet atelier in Bulgaria"
            loading="lazy"
            className="aspect-[4/5] w-full rounded-sm object-cover"
          />
          <div className="space-y-6 md:pt-6">
            <h2 className="display-section">
              {t("A quiet atelier", "Тихо ателие")}
              <br />
              {t("in Bulgaria.", "в България.")}
            </h2>
            <p className="max-w-md text-base leading-7 text-muted-foreground">
              {t(
                "pinlove.studio is a small Bulgarian house of handcrafted jewelry. Each piece of jewelry is handcrafted using high-quality materials that combine elegance, durability, and style. The designs can also be crafted as a bracelet or anklet to complement your look.",
                "Pinlove Studio е малко българско ателие за ръчно изработени бижута. Всяко бижу се създава ръчно от висококачествени материали, които съчетават елегантност, издръжливост и неподвластен на времето стил. Повечето дизайни могат да бъдат изработени и като гривна или гривна за глезен, за да допълнят по елегантен начин вашата визия.",
              )}
            </p>
            <p className="max-w-md text-base leading-7 text-muted-foreground">
              {t(
                "Our design language is quiet: timeless silhouettes, honest materials, and meticulous craftsmanship that celebrates quality over excess.",
                "Нашият дизайнерски почерк е ненатрапчив – изчистени, неподвластни на времето форми, естествени материали и прецизна изработка, в която качеството винаги е на първо място.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Chapter II · The Commission (dark) */}
      <section className="bg-[#111] py-24 text-white md:py-32">
        <div className="container-shell grid gap-12 md:grid-cols-2 md:items-start">
          <div className="space-y-3">
            <video
              className="aspect-[4/3] w-full rounded-sm object-cover"
              src="/videos/homepage-2.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <video
                  className="aspect-square w-full rounded-sm object-cover"
                  src="/videos/homepage-3.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <p className="label-caps text-white/60">{t("Sketching", "Скициране")}</p>
              </div>
              <div className="space-y-2">
                <video
                  className="aspect-square w-full rounded-sm object-cover"
                  src="/videos/homepage-4.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <p className="label-caps text-white/60">{t("Shaping", "Оформяне")}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6 md:pt-6">
            <h2 className="display-section text-white">
              {t("A piece made", "Едно бижу, създадено")}
              <br />
              {t("only for you.", "само за теб.")}
            </h2>
            <p className="max-w-md text-base leading-7 text-white/70">
              {t(
                "Custom sizing is available upon request.",
                " Персонализиран размер е наличен по заявка.",
              )}
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-4 border-white/40 bg-transparent text-white hover:bg-white hover:text-black"
            >
              <Link to="/craft-your-own">{t("Start your custom piece →", "Създай своето бижу →")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Signature Collection */}
      <section className="section-space border-t border-border/80">
        <div className="container-shell space-y-12">
          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            <h2 className="display-section">
              {t("A small, considered", "Внимателно селектирана")}
              <br />
              {t("collection.", "колекция.")}
            </h2>
            <p className="max-w-md text-base leading-7 text-muted-foreground md:justify-self-end">
              {t(
                "A curated collection of carefully selected designs.",
                "Подбрана колекция от внимателно избрани дизайни.",
              )}
            </p>
          </div>

          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {signature.map((product, index) => (
              <motion.article
                key={product.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group flex flex-col"
              >
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
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="aspect-[4/5] w-full bg-secondary/50" />
                  )}
                </Link>
                <div className="flex items-baseline justify-between gap-3 pt-3">
                  <Link
                    to="/shop/$slug"
                    params={{ slug: product.slug }}
                    className="font-serif text-sm italic text-foreground hover:underline"
                  >
                    {f(product.name, product.name_bg)}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    €{product.price_eur.toFixed(0)}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Link
              to="/shop"
              className="label-caps border-b border-foreground/40 pb-1 text-foreground hover:border-foreground"
            >
              {t("View Signature Collection →", "Виж основната колекция →")}
            </Link>
          </div>
        </div>
      </section>

      {/* Made slowly. Made once. */}
      <section className="section-space border-t border-border/80">
        <div className="container-shell space-y-10">
          <h2 className="display-section">{t("Made slowly. Made once.", "Създадено с търпение. Създадено с мисъл.")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <video
              className="aspect-[4/5] w-full rounded-sm object-cover"
              src="/videos/homepage-5.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
            <video
              className="aspect-[4/5] w-full rounded-sm object-cover"
              src="/videos/homepage-6.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
            <video
              className="aspect-[4/5] w-full rounded-sm object-cover"
              src="/videos/homepage-7.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </section>

      {/* Instagram feed */}
      <section className="section-space border-t border-border/80 bg-secondary/30">
        <div className="container-shell space-y-8">
          <div className="grid gap-6 md:grid-cols-[1.2fr_auto] md:items-end">
            <div className="space-y-3">
              <p className="label-caps text-muted-foreground">@pinlove.studio</p>
              <h2 className="display-section">{t("From the studio, daily.", "От ателието, всеки ден.")}</h2>
            </div>
            <a
              href="https://instagram.com/pinlove.studio"
              target="_blank"
              rel="noreferrer"
              className="label-caps border-b border-foreground/40 pb-1 text-foreground hover:border-foreground md:justify-self-end"
            >
              {t("Follow on Instagram →", "Последвай в Instagram →")}
            </a>
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            <img
              src="/img/studio-1.jpg"
              alt="From the studio"
              loading="lazy"
              className="aspect-square w-full rounded-sm object-cover"
            />
            <img
              src="/img/studio-2.jpg"
              alt="From the studio"
              loading="lazy"
              className="aspect-square w-full rounded-sm object-cover"
            />
            <img
              src="/img/studio-3.jpg"
              alt="From the studio"
              loading="lazy"
              className="aspect-square w-full rounded-sm object-cover"
            />
            <img
              src="/img/studio-4.jpg"
              alt="From the studio"
              loading="lazy"
              className="aspect-square w-full rounded-sm object-cover"
            />
            <img
              src="/img/studio-5.jpg"
              alt="From the studio"
              loading="lazy"
              className="aspect-square w-full rounded-sm object-cover"
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
