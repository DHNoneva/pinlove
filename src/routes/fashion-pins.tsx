import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/language-context";

export const Route = createFileRoute("/fashion-pins")({
  head: () => ({
    meta: [
      { title: "Fashion Pins — One Pin. Endless Expressions. | pinlove.studio" },
      {
        name: "description",
        content:
          "An editorial journey through handcrafted fashion pins from pinlove.studio — where a single object can rewrite an entire outfit.",
      },
      { property: "og:title", content: "One Pin. Endless Expressions. — pinlove.studio" },
      {
        property: "og:description",
        content:
          "A cinematic editorial of handcrafted fashion pins that transform the personality of an outfit.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/fashion-pins" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/fashion-pins" }],
  }),
  component: FashionPinsPage,
});

const cubicEase = [0.25, 1, 0.5, 1] as const;

/* ---------------------------------------------------------------- */
/* Reusable Premium Components                                      */
/* ---------------------------------------------------------------- */

function ScrollFadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "none";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: direction === "up" ? 30 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.2, ease: cubicEase, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function EditorialVideo({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.muted = true;
      ref.current.play().catch(() => {});
    }
  }, []);

  return (
    <ScrollFadeIn className={`overflow-hidden rounded-none ${className}`}>
      <motion.video
        ref={ref}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-105"
      />
    </ScrollFadeIn>
  );
}

/* ---------------------------------------------------------------- */
/* Fashion Pins Main View                                           */
/* ---------------------------------------------------------------- */

function FashionPinsPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const t = useT();

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"],
  });
  
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.12]);
  const heroOpacity = useTransform(heroProgress, [0, 0.9], [1, 0.2]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, 80]);

  useEffect(() => {
    setMounted(true);
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <SiteShell>
      {/* HERO SECTION */}
      <section
        ref={heroSectionRef}
        className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-black"
      >
        <motion.video
          ref={videoRef}
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/fashion-pins-motion.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80"
        />

        <div
          className={`absolute left-0 right-0 top-0 z-10 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-12 flex items-center justify-between pt-6 md:pt-8 text-white/80">
            <span className="text-xs uppercase tracking-[0.25em] hidden sm:inline">
              {t("pinlove.studio — Fashion Pins", "pinlove.studio — Модни пинове")}
            </span>
          </div>
        </div>

        <motion.div style={{ y: heroTextY }} className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-12 pb-12 md:pb-24">
            <div className="max-w-4xl text-white">
              <p
                className={`text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 md:mb-6 text-white/60 transition-all duration-1000 delay-100 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
              
              </p>

              <h1
                className={`font-serif text-4xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[1.05] text-white transition-all duration-[1400ms] ease-out ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <span className="block">{t("One Pin.", "Един пин.")}</span>
                <span className="block italic font-light text-white/80 mt-1 md:mt-2">
                  {t("Endless Expressions.", "Безкрайно себеизразяване.")}
                </span>
              </h1>

              <p
                className={`mt-6 md:mt-8 max-w-xl text-xs sm:text-sm md:text-base font-light leading-relaxed text-white/70 transition-all duration-1000 delay-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                {t(
                  "A single handcrafted pin can quietly rewrite an entire look — shift its mood, soften its edges, sharpen its intent. Small object. Whole new outfit.",
                  "Понякога е достатъчна само една ръчно изработена брошка, за да промени цялостното усещане на една визия. Деликатен детайл. Забележителен ефект.",
                )}
              </p>

              <div
                className={`mt-10 md:mt-12 flex items-center gap-4 text-white/50 transition-opacity duration-1000 delay-700 ${
                  mounted ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="h-[1px] w-8 md:w-12 bg-white/30" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em]">
                  {t("Scroll — the story begins", "Скрол — историята започва")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

     {/* SECTION 1 — EDITORIAL MANIFESTO */}
<section className="relative overflow-hidden bg-neutral-50 py-24 sm:py-32 lg:py-44 px-6 sm:px-12 md:px-16">
  {/* Ambient background light */}
  <div className="absolute top-0 right-0 -z-10 h-[550px] w-[550px] rounded-full bg-neutral-200/40 blur-3xl" />

  <div className="max-w-[1400px] mx-auto">
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-start">

      {/* LEFT — Bold Balanced Typography */}
      <div className="lg:col-span-7 xl:col-span-8 pr-0">
        <ScrollFadeIn>
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-neutral-400"></div>
            <span className="uppercase tracking-[0.45em] text-[10px] font-medium text-neutral-400">
              {t("Editorial Collection", "Издателска колекция")}
            </span>
          </div>

          <h2 className="mt-7 font-serif text-5xl sm:text-7xl md:text-8xl xl:text-8xl leading-[0.9] font-light tracking-tight text-neutral-900 balance">
            {t("DESIGN YOUR", "СЪЗДАЙ СВОЯТА")}
            <br />
            <span className="italic font-normal block mt-3 ml-8 sm:ml-16 md:ml-24 text-neutral-500/90">
              {t("PIN", "БРОШКА")}
            </span>
          </h2>
        </ScrollFadeIn>
      </div>

      {/* RIGHT — Shifted Left & Text Size Scaled Up */}
      <div className="lg:col-span-5 xl:col-span-4 lg:mt-16">
        <ScrollFadeIn>
          <div className="max-w-sm text-left border-t lg:border-t-0 lg:border-l border-neutral-200 pt-8 lg:pt-2 lg:pl-6">
            
            <p className="text-neutral-600 text-[16px] leading-relaxed font-light mb-6">
              {t(
                "More than an accessory, each handcrafted pin begins with your vision. Choose your favorite charms and let us create a piece that is uniquely yours—designed to elevate your style with timeless elegance and become part of your personal story.",
                "Повече от аксесоар, всяка ръчно изработена брошка започва с вашия избор. Изберете висулките, които най-добре отразяват вашия стил, а ние ще ги превърнем в уникално бижу, създадено специално за вас. Всяка брошка е ръчно изработена, за да допълва вашата визия и да стане част от вашата история.",
              )}
            </p>

            

            {/* Pricing & Customization Menu */}
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <p className="uppercase tracking-[0.3em] text-[11px] text-neutral-400 mb-5">
                {t("Fashion Pins Menu", "Меню за модни пинове")}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center font-serif text-xl font-light text-neutral-900 pb-3 border-b border-neutral-100">
                  <span className="font-sans text-xs uppercase tracking-wider font-medium text-neutral-600">
                    {t("3 Charms", "3 талисмана")}
                  </span>
                  <span>€15</span>
                </div>
                <div className="flex justify-between items-center font-serif text-xl font-light text-neutral-900">
                  <span className="font-sans text-xs uppercase tracking-wider font-medium text-neutral-600">
                    {t("5 Charms", "5 талисмана")}
                  </span>
                  <span>€17</span>
                </div>
              </div>
              
              <Button
                asChild
                variant="ghost"
                className="w-full rounded-none border border-neutral-900 bg-transparent text-neutral-900 hover:bg-neutral-950 hover:text-white transition-all duration-300 px-6 py-7 tracking-[0.25em] uppercase text-xs font-semibold group"
              >
                <Link to="/craft-your-own" className="flex items-center justify-center gap-2">
                  <span>{t("Craft Your Own", "Създай свой")}</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Button>
            </div>

          </div>
        </ScrollFadeIn>
      </div>

    </div>
  </div>
</section>

     

      {/* SECTION 3 — LARGE TYPOGRAPHY QUOTE */}
      <section className="bg-[#fff] py-28 sm:py-40 md:py-64 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <ScrollFadeIn direction="none">
            <span className="h-[1px] w-12 md:w-16 bg-neutral-300 block mx-auto mb-8 md:mb-12" />
            <h2 className="font-serif text-2xl sm:text-4xl md:text-7xl font-light italic text-neutral-950 tracking-tight leading-snug">
              {t(
                "\u201CThe smallest detail can define the entire look.\u201D",
                "\u201CИ най-малкият детайл може да преобрази цялата визия.\u201D",
              )}
            </h2>
            <span className="h-[1px] w-12 md:w-16 bg-neutral-300 block mx-auto mt-8 md:mb-12" />
          </ScrollFadeIn>
        </div>
      </section>

      {/* SECTION 4 — ASYMMETRIC EDITORIAL VIDEO GALLERY */}
      <section className="bg-[#0a0a0a] py-20 sm:py-32 md:py-48 px-4 sm:px-6 md:px-12 text-white">
        <div className="mx-auto max-w-[1600px]">
          <ScrollFadeIn className="mb-16 md:mb-24">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-500 block mb-3">
              {t("Cinematics", "Кинематика")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-neutral-200">
              {t("Moments In Motion", "Моменти, които вдъхновяват.")}
            </h2>
          </ScrollFadeIn>

          {/* Mosaic Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Top Left: Wide Landscape Feature (pin1) */}
            <div className="md:col-span-8">
              <ScrollFadeIn>
                <div className="relative group">
                  <EditorialVideo src="/videos/pin1.mp4" className="aspect-[16/9] sm:aspect-[21/10]" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/60 bg-black/20 backdrop-blur-sm px-2 py-1 font-light">
                      {t("Milano · Cashmere, Brass", "Милано · Кашмир, Месинг")}
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>

            {/* Top Right: Taller Block (pin2) */}
            <div className="md:col-span-4 md:mt-12">
              <ScrollFadeIn delay={0.1}>
                <div className="relative group">
                  <EditorialVideo src="/videos/pin2.mp4" className="aspect-[4/5] md:aspect-[3/4]" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/60 bg-black/20 backdrop-blur-sm px-2 py-1 font-light">
                      {t("Atelier Window", "Прозорецът на ателието")}
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>

            {/* Bottom Left: Square / Vertical Look (pin3) */}
            <div className="md:col-span-4 md:mt-[-4rem] lg:mt-[-8rem] z-10">
              <ScrollFadeIn>
                <div className="relative group">
                  <EditorialVideo src="/videos/pin3.mp4" className="aspect-square md:aspect-[4/5]" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/60 bg-black/20 backdrop-blur-sm px-2 py-1 font-light">
                      {t("Paris · Silk, Undone", "Париж · Коприна, Разпусната")}
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>

            {/* Bottom Right: Dominant Wide Video (pin4) */}
            <div className="md:col-span-8">
              <ScrollFadeIn delay={0.15}>
                <div className="relative group">
                  <EditorialVideo src="/videos/pin4.mp4" className="aspect-[4/3] md:aspect-[16/10]" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/60 bg-black/20 backdrop-blur-sm px-2 py-1 font-light">
                      {t("The Complete Narrative", "Пълният разказ")}
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>

          </div>
        </div>
      </section>

       {/* SECTION 2 — CLEAN EDITORIAL LOOKS (NO DUPLICATION, NO OVERLAPS) */}
      <section className="bg-[#fafafa] py-20 sm:py-32 md:py-48 px-4 sm:px-6 md:px-12 overflow-hidden">
        <div className="mx-auto max-w-[1600px]">
          
          {/* Section Header */}
          <ScrollFadeIn className="mb-16 md:mb-24">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-neutral-200 pb-6 md:pb-8">
              <h3 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-neutral-900">
                {t("Styled Different Ways", "Стилизирано по различни начини")}
              </h3>
              <p className="text-xs sm:text-sm font-light text-neutral-500 max-w-sm">
                {t(
                  "A single handcrafted pin styled across different fabrics, silhouettes, and moods.",
                  "Един ръчно изработен пин, стилизиран с различни тъкани, силуети и настроения.",
                )}
              </p>
            </div>
          </ScrollFadeIn>

          {/* Clean, Non-Overlapping Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-stretch">
            
            {/* Left Column: Vertical Focus (Look I) */}
            <div className="md:col-span-4 flex flex-col justify-between h-full">
              <ScrollFadeIn className="h-full flex flex-col">
                <div className="relative overflow-hidden bg-neutral-100 group flex-grow">
                  <img
                    src="img/looks/look-01.jpg"
                    alt="Look I — Minimal Anchoring"
                    loading="lazy"
                    className="w-full h-full object-cover aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] transition-transform duration-[2.5s] ease-out group-hover:scale-103"
                  />
                </div>
                <div className="mt-4 pt-2 border-t border-neutral-200/60 flex justify-between items-baseline">
                  <p className="font-serif italic text-sm text-neutral-700">{t("Look I", "Визия I")}</p>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                    {t("Minimal Anchoring", "Минимално закотвяне")}
                  </span>
                </div>
              </ScrollFadeIn>
            </div>

            {/* Center Column: Dominant Editorial Landscape (Look II) */}
            <div className="md:col-span-8 flex flex-col justify-between h-full">
              <ScrollFadeIn delay={0.05} className="h-full flex flex-col">
                <div className="relative overflow-hidden bg-neutral-100 group flex-grow">
                  <img
                    src="img/looks/look-02.jpg"
                    alt="Look II — Creative Fluidity"
                    loading="lazy"
                    className="w-full h-full object-cover aspect-[4/3] md:aspect-[16/10] transition-transform duration-[2.5s] ease-out group-hover:scale-103"
                  />
                </div>
                <div className="mt-4 pt-2 border-t border-neutral-200/60 flex justify-between items-baseline">
                  <p className="font-serif italic text-sm text-neutral-700">{t("Look II", "Визия II")}</p>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                    {t("Creative Fluidity", "Творческа плавност")}
                  </span>
                </div>
              </ScrollFadeIn>
            </div>

            {/* Bottom Row - Three Column Grid Layout */}
            {/* Look III */}
            <div className="md:col-span-4 mt-8 md:mt-12">
              <ScrollFadeIn>
                <div className="relative overflow-hidden bg-neutral-100 group">
                  <img
                    src="img/looks/look-03.jpg"
                    alt="Look III — Structural Interlock"
                    loading="lazy"
                    className="w-full aspect-[4/5] object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-103"
                  />
                </div>
                <div className="mt-4 pt-2 border-t border-neutral-200/60 flex justify-between items-baseline">
                  <p className="font-serif italic text-sm text-neutral-700">{t("Look III", "Визия III")}</p>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                    {t("Structural Interlock", "Структурно преплитане")}
                  </span>
                </div>
              </ScrollFadeIn>
            </div>

            {/* Look IV */}
            <div className="md:col-span-4 mt-8 md:mt-12">
              <ScrollFadeIn delay={0.05}>
                <div className="relative overflow-hidden bg-neutral-100 group">
                  <img
                    src="img/looks/look-04.jpg"
                    alt="Look IV — Spatial Detail"
                    loading="lazy"
                    className="w-full aspect-[4/5] object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-103"
                  />
                </div>
                <div className="mt-4 pt-2 border-t border-neutral-200/60 flex justify-between items-baseline">
                  <p className="font-serif italic text-sm text-neutral-700">{t("Look IV", "Визия IV")}</p>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                    {t("Spatial Detail", "Пространствен детайл")}
                  </span>
                </div>
              </ScrollFadeIn>
            </div>

            {/* Look V */}
            <div className="md:col-span-4 mt-8 md:mt-12">
              <ScrollFadeIn delay={0.1}>
                <div className="relative overflow-hidden bg-neutral-100 group">
                  <img
                    src="img/looks/look-05.jpg"
                    alt="Look V — Subtle Counterpoint"
                    loading="lazy"
                    className="w-full aspect-[4/5] object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-103"
                  />
                </div>
                <div className="mt-4 pt-2 border-t border-neutral-200/60 flex justify-between items-baseline">
                  <p className="font-serif italic text-sm text-neutral-700">{t("Look V", "Визия V")}</p>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                    {t("Subtle Counterpoint", "Финен контрапункт")}
                  </span>
                </div>
              </ScrollFadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5 — CRAFTSMANSHIP STORY */}
      <section className="bg-[#fff] py-20 sm:py-32 md:py-48 px-4 sm:px-6 md:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <ScrollFadeIn>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-400 block mb-3">
                  {t("The Atelier", "Ателието")}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-light text-neutral-900 tracking-tight">
                  {t("Crafted by Hand", "Ръчно изработено")}
                </h2>
              </ScrollFadeIn>
            </div>

            <div className="lg:col-span-7 space-y-8 sm:space-y-12 font-light text-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed">
              <ScrollFadeIn delay={0.05}>
                <p>
                  {t(
                    "Every piece begins with intention and is handcrafted to celebrate timeless design. Rather than following passing trends, we create jewelry that becomes a natural extension of your personal style.",
                    "Всяко бижу започва с идея и внимание към детайла, след което се изработва ръчно, за да подчертае красотата на непреходния дизайн. Вместо да следваме мимолетни тенденции, ние създаваме бижута, които се превръщат в естествено продължение на вашия личен стил.",
                  )}
                </p>
              </ScrollFadeIn>
              <ScrollFadeIn delay={0.1}>
                <p>
                  {t(
                    "Each design is carefully crafted with attention to every detail, from the choice of materials to the finishing touches, ensuring exceptional quality and lasting beauty.",
                    "Всеки дизайн се създава с внимание към всеки детайл – от избора на материалите до финалните щрихи, за да гарантира изключително качество и красота, която остава във времето.",
                  )}
                </p>
              </ScrollFadeIn>
              <ScrollFadeIn delay={0.15}>
                <p>
                  {t(
                    "More than an accessory, every piece is made to accompany your journey, carrying memories, meaning, and individuality for years to come.",
                    "Повече от аксесоар, всяко бижу е създадено, за да бъде част от вашия път – да носи спомени, значение и индивидуалност години наред.",
                  )}
                </p>
              </ScrollFadeIn>
            </div>
          </div>
        </div>
      </section>

      
    </SiteShell>
  );
}