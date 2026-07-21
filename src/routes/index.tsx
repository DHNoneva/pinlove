import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { LanguageToggle } from "@/components/site-shell";
import { useT } from "@/lib/language-context";


const SEO_TITLE =
  "Pinlove Studio — Handmade Jewelry & Fashion Pins Bulgaria | Ръчно изработени бижута и пинове";
const SEO_DESCRIPTION =
  "Handmade jewelry and fashion pins from Bulgaria — earrings, bracelets, necklaces and custom pins, quietly made one at a time. Ръчно изработени бижута, обеци, гривни, колиета и фешън пинове от България.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      {
        name: "description",
        content: SEO_DESCRIPTION,
      },
      {
        name: "keywords",
        content:
          "handmade jewelry Bulgaria, custom fashion pins, handcrafted earrings, artisan jewelry, ръчно изработени бижута, обеци ръчна изработка, гривни ръчна изработка, колиета България, фешън пинове, поръчкови бижута",
      },
      { property: "og:title", content: SEO_TITLE },
      {
        property: "og:description",
        content: SEO_DESCRIPTION,
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          name: "Pinlove Studio",
          description: SEO_DESCRIPTION,
          url: "https://pinlove.org",
          address: {
            "@type": "PostalAddress",
            addressCountry: "BG",
          },
          makesOffer: [
            { "@type": "Offer", itemOffered: { "@type": "Product", name: "Handmade earrings" } },
            { "@type": "Offer", itemOffered: { "@type": "Product", name: "Handmade bracelets" } },
            { "@type": "Offer", itemOffered: { "@type": "Product", name: "Handmade necklaces" } },
            { "@type": "Offer", itemOffered: { "@type": "Product", name: "Custom fashion pins" } },
          ],
        }),
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Подсигуряваме пускането на видеото на мобилни устройства веднага след зареждане
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Видео автоматичното пускане беше блокирано или прекъснато:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/landing-page.mp4"
          poster="/images/landing-fallback.jpg"
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
              "linear-gradient(180deg, rgba(20,16,12,0.5) 0%, rgba(20,16,12,0.08) 30%, rgba(20,16,12,0.15) 62%, rgba(20,16,12,0.6) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 40%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* Top bar — logo left, atelier label right, echoing a magazine masthead */}
        <div className="animate-fade-up absolute inset-x-0 top-0 z-10">
          <div className="container-shell flex items-center justify-between pt-8">
            <span className="font-serif text-2xl italic text-white">pinlove.studio</span>
            <div className="flex items-center gap-4">
              <span className="label-caps hidden text-white/80 sm:inline">
                {t("Atelier · Bulgaria", "Ателие · България")}
              </span>
              <LanguageToggle className="border-white/40 text-white [&_button]:text-white/80" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-16 text-center md:pb-24">
          <p className="animate-fade-up delay-1 label-caps mb-6 text-white/75">
            {t("Handcrafted in Bulgaria", "Ръчно изработено в България")}
          </p>

          <h1
            className="animate-fade-up delay-2 display-hero max-w-3xl text-balance"
            style={{ color: "white", textShadow: "0 2px 30px rgba(0,0,0,0.35)" }}
          >
            {t("Quietly made.", "Създадено с прецизност")}
          </h1>

          <div className="animate-fade-up delay-3 mt-10">
            <Link
              to="/home"
              className="label-caps group inline-flex items-center gap-3 border-b border-white/50 pb-1 text-white transition-colors hover:border-white"
            >
              {t("Enter the Studio", "Влез в ателието")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className="animate-fade-up delay-4 absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[0.6rem] tracking-[0.3em] text-white/60 uppercase">
          {t("Scroll", "Скрол")}
        </div>
      </section>
    </div>
  );
}