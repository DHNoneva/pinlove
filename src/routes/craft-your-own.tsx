import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, Transition, Variants } from "framer-motion";
import { Sparkles, Hammer, ShieldCheck, Gift, ArrowRight, Compass, Eye, Heart } from "lucide-react";

import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/language-context";

export const Route = createFileRoute("/craft-your-own")({
  head: () => ({
    meta: [
      { title: "Craft Your Own — pinlove.studio" },
      {
        name: "description",
        content: "Commission a one-of-a-kind piece from the pinlove.studio atelier.",
      },
      { property: "og:title", content: "Craft Your Own — pinlove.studio" },
      {
        property: "og:description",
        content: "Commission a one-of-a-kind piece from the pinlove.studio atelier.",
      },
      { property: "og:url", content: "/craft-your-own" },
    ],
    links: [{ rel: "canonical", href: "/craft-your-own" }],
  }),
  component: CraftYourOwnPage,
});

// Explicitly typing transition and variants to eliminate TypeScript complaints
const fadeUpTransition: Transition = { 
  duration: 0.8, 
  ease: [0.16, 1, 0.3, 1] 
};

const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  initial: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function CraftYourOwnPage() {
  const [mounted, setMounted] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    explanation: "",
  });
  const t = useT();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  if (!mounted) return null;

  return (
    <SiteShell>
      <div className="bg-[#FAF8F4] text-[#1C1917] font-sans antialiased overflow-x-hidden selection:bg-[#EAE6DF]">
        
        {/* HERO & COMMISSION FORM SECTION */}
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 sm:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
            
            {/* HERO LEFT COLUMN */}
            <div className="lg:col-span-6 space-y-12">
              <motion.div
                initial="initial"
                animate="animate"
                variants={fadeUpVariants}
                transition={fadeUpTransition}
                className="space-y-6"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] font-semibold">
                  
                </span>
                <h1 className="font-serif text-5xl sm:text-7xl font-light tracking-tight text-[#1C1917] leading-[1.1]">
                  {t("Made for", "Създадено за")} <br />
                  {t("your story.", "твоята история.")}
                </h1>
                <p className="text-base sm:text-lg leading-relaxed text-[#57534E] max-w-lg font-light whitespace-pre-line">
                  {t(
                    `Create a piece that is uniquely yours. Share your vision, preferred style, materials, charms, or any special details, and we will carefully bring your idea to life. Once we receive your request, we will contact you via the email address you provide to discuss the design, confirm the details, and finalize your order.

Bracelets wrist — €22
Bracelet ankle — €24
Necklaces — €28
Fashion Pins
3 charms — €15
5 charms — €17

Every piece is handcrafted to order, making each creation truly one of a kind.`,
                    `Създайте бижу, което е изцяло ваше.

Споделете своята идея, предпочитан стил, материали, висулки и всички детайли, които бихте искали да включим. Ние ще превърнем вашата концепция в ръчно изработено бижу, създадено специално за вас.

След като получим вашето запитване, ще се свържем с вас на посочения имейл, за да обсъдим дизайна, да уточним всички детайли и да потвърдим поръчката.

Гривни за китка  — €22
 гривна за глезен — €24
Колиета — €28
Модни брошки
• 3 висулки — €15
• 5 висулки — €17

Всяко бижу се изработва ръчно по поръчка, което превръща всяко изделие в уникално и лично създание.`,

                  )}
                </p>
              </motion.div>

              
              {/* Cinematic Video Player */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="overflow-hidden rounded-[32px] aspect-[4/3] relative bg-[#EAE6DF] shadow-[0_4px_30px_rgba(28,25,23,0.03)]"
              >
                <video 
                  src="/videos/craftyouown.mp4" 
                  className="object-cover w-full h-full filter brightness-[0.97] contrast-[1.02]"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </motion.div>
            </div>

            {/* COMMISSION FORM RIGHT COLUMN */}
            <div className="lg:col-span-6 lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="bg-white p-8 sm:p-12 rounded-[36px] shadow-[0_8px_40px_-12px_rgba(28,25,23,0.05)] border border-[#F5F2EB]"
              >
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="h-12 w-12 rounded-full bg-[#FAF8F4] flex items-center justify-center mx-auto text-[#1C1917]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-3xl font-light text-[#1C1917]">{t("Brief Received", "Заявката е получена")}</h3>
                    <p className="text-sm font-light text-[#57534E] max-w-sm mx-auto leading-relaxed">
                      {t(
                        `Thank you, ${formData.name}. Our master jeweler will review your vision and connect within 48 hours to schedule your design alignment.`,
                        `Благодарим ти, ${formData.name}. Нашият майстор бижутер ще прегледа визията ти и ще се свърже в рамките на 48 часа, за да уточните дизайна.`,
                      )}
                    </p>
                    <Button 
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", explanation: "" });
                      }}
                      variant="link" 
                      className="text-xs uppercase tracking-widest text-[#78716C] hover:text-[#1C1917] mt-4"
                    >
                      {t("Submit another project brief", "Изпрати друга заявка за проект")}
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="font-serif text-3xl font-light text-[#1C1917]">{t("Begin your project", "Започни своя проект")}</h3>
                      <p className="text-xs text-[#78716C] font-light">
                        {t(
                          "Fill out your initial ideas to initiate our design workflow.",
                          "Попълни първоначалните си идеи, за да стартираме нашия дизайнерски процес.",
                        )}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-[#78716C] font-semibold">{t("Your Name", "Твоето име")}</label>
                        <Input
                          type="text"
                          placeholder={t("Aleksandra Ivanova", "Александра Иванова")}
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-transparent border-b border-[#EAE6DF] focus-visible:ring-0 focus-visible:border-[#1C1917] rounded-none px-0 h-10 shadow-none transition-colors duration-300 placeholder:text-[#A8A29E] font-light"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-[#78716C] font-semibold">{t("Email Address", "Имейл адрес")}</label>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-transparent border-b border-[#EAE6DF] focus-visible:ring-0 focus-visible:border-[#1C1917] rounded-none px-0 h-10 shadow-none transition-colors duration-300 placeholder:text-[#A8A29E] font-light"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-[#78716C] font-semibold">{t("Phone Number", "Телефонен номер")}</label>
                          <Input
                            type="tel"
                            placeholder="+(359) 000-0000"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-transparent border-b border-[#EAE6DF] focus-visible:ring-0 focus-visible:border-[#1C1917] rounded-none px-0 h-10 shadow-none transition-colors duration-300 placeholder:text-[#A8A29E] font-light"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-[#78716C] font-semibold">{t("Describe your concept", "Опиши концепцията си")}</label>
                        <Textarea
                          placeholder={t(
                            "Describe your vision in as much detail as possible....",
                            "Опиши визията си възможно най-подробно....",
                          )}
                          rows={4}
                          required
                          value={formData.explanation}
                          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                          className="bg-transparent border-b border-[#EAE6DF] focus-visible:ring-0 focus-visible:border-[#1C1917] rounded-none px-0 py-2 shadow-none transition-colors duration-300 placeholder:text-[#A8A29E] font-light resize-none min-h-[100px]"
                        />
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        type="submit"
                        className="w-full font-light tracking-[0.15em] text-xs uppercase py-7 bg-[#1C1917] text-white rounded-[16px] hover:bg-[#2E2A27] transition-all duration-300 shadow-sm"
                      >
                        {t("Start your commission", "Започни своята поръчка")}
                      </Button>
                    </motion.div>
                  </form>
                )}
              </motion.div>
            </div>

          </div>
        </section>
      </div>
    </SiteShell>
  );
}