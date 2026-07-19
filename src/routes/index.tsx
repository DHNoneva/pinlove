import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { LanguageToggle } from "@/components/site-shell";
import { useT } from "@/lib/language-context";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "pinlove.studio — Handcrafted Jewelry from Bulgaria" },
      {
        name: "description",
        content:
          "pinlove.studio — a small Bulgarian atelier of handcrafted jewelry and fashion pins. Quietly made, one at a time.",
      },
      { property: "og:title", content: "pinlove.studio — Handcrafted Jewelry from Bulgaria" },
      {
        property: "og:description",
        content:
          "A small Bulgarian atelier of handcrafted jewelry and fashion pins. Quietly made, one at a time.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  const easeOut = [0.22, 1, 0.36, 1] as const;
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
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeOut }}
          className="absolute inset-x-0 top-0 z-10"
        >
          <div className="container-shell flex items-center justify-between pt-8">
            <span className="font-serif text-2xl italic text-white">pinlove.studio</span>
            <div className="flex items-center gap-4">
              <span className="label-caps hidden text-white/80 sm:inline">
                {t("Atelier · Bulgaria", "Ателие · България")}
              </span>
              <LanguageToggle className="border-white/40 text-white [&_button]:text-white/80" />
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-16 text-center md:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: easeOut }}
            className="label-caps mb-6 text-white/75"
          >
            {t("Handcrafted in Bulgaria", "Ръчно изработено в България")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: easeOut }}
            className="display-hero max-w-3xl text-balance"
            style={{ color: "white", textShadow: "0 2px 30px rgba(0,0,0,0.35)" }}
          >
            {t("Quietly made.", "Създадено с прецизност")}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: easeOut }}
            className="mt-10"
          >
            <Link
              to="/home"
              className="label-caps group inline-flex items-center gap-3 border-b border-white/50 pb-1 text-white transition-colors hover:border-white"
            >
              {t("Enter the Studio", "Влез в ателието")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[0.6rem] tracking-[0.3em] text-white/60 uppercase"
        >
          {t("Scroll", "Скрол")}
        </motion.div>
      </section>
    </div>
  );
}