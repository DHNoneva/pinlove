import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Instagram, ShieldCheck, Truck, HelpCircle } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/language-context";
import { submitContactMessage } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "About & Contact — pinlove.studio" },
      {
        name: "description",
        content: "Learn more about our philosophy and get in touch with pinlove.studio.",
      },
    ],
  }),
  component: AboutContactPage,
});

const cubicEase = [0.25, 1, 0.5, 1] as const;

function ScrollFadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: cubicEase, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AboutContactPage() {
  const [mounted, setMounted] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const t = useT();

  const submitContactMessageFn = useServerFn(submitContactMessage);
  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof submitContactMessageFn>[0]["data"]) =>
      submitContactMessageFn({ data }),
    onSuccess: () => {
      setFormSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: (err: Error) => {
      toast.error(
        err.message ||
          t("Something went wrong. Please try again.", "Възникна грешка. Моля, опитайте отново."),
      );
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, email, message });
  };

  return (
    <SiteShell>
      {/* HERO & ABOUT SPLIT SECTION (Photo on the left at the beginning) */}
      <section className="bg-[#fff] pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 md:px-12 border-b border-neutral-100">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            {/* Left Side: The Contact/Studio Photo at the very beginning */}
            <div className="lg:col-span-5">
              <ScrollFadeIn>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 shadow-sm">
                  <img
                    src="/img/contact.png"
                    alt="Pinlove Studio Editorial"
                    className="h-full w-full object-cover transition-transform duration-[2s] ease-out hover:scale-105"
                  />
                </div>
              </ScrollFadeIn>
            </div>

            {/* Right Side: Hero Titles and Story */}
            <div className="lg:col-span-7 space-y-8">
              <div
                className={`transition-all duration-[1400ms] ease-out ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-400 block mb-4">
                  {t("Editorial № 02", "Издание № 02")}
                </span>
                <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light tracking-tight leading-none text-neutral-900">
                  {t("Our Story", "Нашата история")} <br />
                  <span className="italic font-light text-neutral-400 pl-4 sm:pl-12 md:pl-16">
                    {t("& Contact", "& Контакти")}
                  </span>
                </h1>
              </div>

              <div className="space-y-6 font-light text-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed pt-6 border-t border-neutral-100">
                <p className="whitespace-pre-line">
                  {t(
                    `At Pinlove Studio, we believe that jewelry should tell a story—your story.

What began as a passion for creating meaningful, handcrafted pieces has grown into a brand dedicated to individuality, timeless design, and exceptional craftsmanship.

Most of our necklace designs can also be handcrafted as a bracelet or an anklet, giving you the freedom to wear your favorite design in the style that suits you best.

Rather than following trends, we create timeless pieces made to be worn, cherished, and uniquely yours.`,
                    `В Pinlove Studio вярваме, че бижутата трябва да разказват история – вашата история.

Това, което започна като страст към създаването на смислени ръчно изработени бижута, се превърна в бранд, посветен на индивидуалността, непреходния дизайн и изключителното майсторство.

Повечето от нашите дизайни на колиета могат да бъдат изработени и като гривна или гривна за глезен, давайки ви свободата да носите любимия си дизайн по начина, който най-добре отразява вашия стил.

Вместо да следваме тенденциите, ние създаваме вечни бижута, създадени да бъдат носени, ценени и да се превърнат в неразделна част от вашата индивидуалност.`,
                  )}
                </p>
                <p>
                  {t(
                    "Ordering is simple—choose your favorite design or create your own, place your order through our website, and we'll handcraft your piece especially for you. Payment is made upon delivery, so you pay only when your order arrives.",
                    "Поръчването е лесно – изберете своя любим дизайн или създайте собствен, направете своята поръчка чрез нашия уебсайт, а ние ще изработим вашето бижу специално за вас. Плащането се извършва при доставка, така че заплащате само когато вашата поръчка пристигне.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAYMENT & DELIVERY INFORMATION (CRITICAL NOTE) */}
      <section className="bg-[#fafafa] py-16 px-4 sm:px-6 md:px-12 border-y border-neutral-200/60">
        <div className="mx-auto max-w-[1200px]">
          <ScrollFadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
              {/* Delivery info card */}
              <div className="flex gap-4 p-6 bg-white border border-neutral-100 shadow-sm rounded-none">
                <Truck className="h-6 w-6 text-neutral-800 shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-lg text-neutral-900 mb-2">
                    {t("Secure Shipping & Inspection", "Сигурна доставка и проверка")}
                  </h4>
                  <p className="text-sm font-light text-neutral-600 leading-relaxed">
                    {t(
                      "We ship your order directly to your door or preferred pickup point. You have the right to open and fully inspect the package to see the craftsmanship before releasing payment.",
                      "Изпращаме поръчката ви директно до вратата ви или предпочитан пункт за получаване. Имате право да отворите и напълно да прегледате пратката, за да видите изработката, преди да заплатите.",
                    )}
                  </p>
                </div>
              </div>

              {/* Payment info card */}
              <div className="flex gap-4 p-6 bg-white border border-neutral-100 shadow-sm rounded-none">
                <ShieldCheck className="h-6 w-6 text-neutral-800 shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-lg text-neutral-900 mb-2">
                    {t(
                      "Cash on Delivery — No Online Payments",
                      "Наложен платеж — без онлайн плащания",
                    )}
                  </h4>
                  <p className="text-sm font-light text-neutral-600 leading-relaxed">
                    {t(
                      "To make your experience completely stress-free, we do not accept online payments. You only pay cash in hand once your package safely arrives and you are completely happy with it.",
                      "За да направим преживяването ви напълно спокойно, ние не приемаме онлайн плащания. Плащате в брой едва когато пратката ви пристигне безопасно и сте напълно доволни от нея.",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* CONTACT & FORM SECTION */}
      <section className="bg-[#fff] py-20 md:py-32 px-4 sm:px-6 md:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-8">
              <ScrollFadeIn>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-400 block mb-4">
                  {t("Get In Touch", "Свържи се с нас")}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
                  {t("Let's Connect", "Нека се свържем")}
                </h2>
                <p className="mt-4 text-sm font-light text-neutral-500 max-w-sm leading-relaxed">
                  {t(
                    "Have a custom idea, a wholesale inquiry, or just a quick question about sizing? We are here to help.",
                    "Имате идея за персонализирано изделие, запитване за едро количество или бърз въпрос за размерите? Ние сме тук, за да помогнем.",
                  )}
                </p>
              </ScrollFadeIn>

              {/* Direct Social Links */}
              <ScrollFadeIn delay={0.1} className="space-y-6 pt-6 border-t border-neutral-100">
                {/* Email link */}
                <a
                  href="mailto:pinlove.studio@outlook.com"
                  className="flex items-center gap-4 group text-neutral-700 hover:text-black transition-colors"
                >
                  <div className="p-3 bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
                    <Mail className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                      {t("Email us", "Пишете ни")}
                    </span>
                    <span className="text-sm font-light">pinlove.studio@outlook.com</span>
                  </div>
                </a>

                {/* Instagram link */}
                <a
                  href="https://instagram.com/pinlove.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group text-neutral-700 hover:text-black transition-colors"
                >
                  <div className="p-3 bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
                    <Instagram className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                      {t("Follow us", "Последвайте ни")}
                    </span>
                    <span className="text-sm font-light">@pinlove.studio</span>
                  </div>
                </a>
              </ScrollFadeIn>
            </div>

            {/* Interactive Form Column */}
            <div className="lg:col-span-7 bg-[#fafafa] p-6 sm:p-10 border border-neutral-100">
              <ScrollFadeIn delay={0.15}>
                <h3 className="font-serif text-2xl font-light text-neutral-900 mb-6">
                  {t("Send us a Message", "Изпратете ни съобщение")}
                </h3>

                {formSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <p className="font-serif italic text-lg text-neutral-800">
                      {t("Thank you for writing to us!", "Благодарим ви, че ни писахте!")}
                    </p>
                    <p className="text-sm font-light text-neutral-500">
                      {t(
                        "We have received your request and will reply within 24 hours.",
                        "Получихме заявката ви и ще отговорим в рамките на 24 часа.",
                      )}
                    </p>
                    <Button
                      onClick={() => setFormSubmitted(false)}
                      variant="link"
                      className="text-xs uppercase tracking-widest mt-4"
                    >
                      {t("Send another message", "Изпрати друго съобщение")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                          {t("Name", "Име")}
                        </label>
                        <Input
                          type="text"
                          placeholder={t("Your name", "Вашето име")}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="bg-white border-neutral-200 rounded-none focus-visible:ring-neutral-400 font-light text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                          {t("Email Address", "Имейл адрес")}
                        </label>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white border-neutral-200 rounded-none focus-visible:ring-neutral-400 font-light text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                        {t("Message", "Съобщение")}
                      </label>
                      <Textarea
                        placeholder={t("How can we help you?", "Как можем да ви помогнем?")}
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="bg-white border-neutral-200 rounded-none focus-visible:ring-neutral-400 font-light text-sm resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full sm:w-auto font-light tracking-[0.2em] text-[10px] uppercase px-8 py-5 bg-neutral-950 text-white rounded-none hover:bg-neutral-800 transition-colors duration-300"
                    >
                      {mutation.isPending
                        ? t("Sending…", "Изпращане…")
                        : t("Send Message", "Изпрати съобщение")}
                    </Button>
                  </form>
                )}
              </ScrollFadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FAQ SECTION */}
      <section className="bg-[#fafafa] py-20 px-4 sm:px-6 md:px-12 border-t border-neutral-200/60">
        <div className="mx-auto max-w-[1000px]">
          <ScrollFadeIn className="text-center mb-12">
            <HelpCircle className="h-8 w-8 mx-auto text-neutral-400 mb-3" />
            <h3 className="font-serif text-2xl md:text-3xl font-light text-neutral-900">
              {t("Frequently Asked Questions", "Често задавани въпроси")}
            </h3>
          </ScrollFadeIn>

          <div className="space-y-6 max-w-3xl mx-auto">
            <ScrollFadeIn delay={0.05} className="bg-white p-6 border border-neutral-100">
              <h4 className="font-serif text-base text-neutral-900 mb-2">
                {t(
                  "Can I review my items before making a payment?",
                  "Мога ли да прегледам изделията си, преди да платя?",
                )}
              </h4>
              <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                {t(
                  "Absolutely. We strongly encourage you to unpack, touch, and fully inspect the design upon delivery. You only complete the payment to the courier once you verify that it meets your aesthetic standards.",
                  "Разбира се. Силно ви препоръчваме да разопаковате, разгледате и напълно прегледате изделието при доставка. Плащате на куриера едва след като се убедите, че отговаря на вашите очаквания.",
                )}
              </p>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.1} className="bg-white p-6 border border-neutral-100">
              <h4 className="font-serif text-base text-neutral-900 mb-2">
                {t("How do I order?", "Как да поръчам?")}
              </h4>
              <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                {t(
                  "Simply explore our Collection page, add your favorite pins to the cart, and complete the order checkout with your shipping address. No credit card details are needed at checkout.",
                  "Просто разгледайте страницата с колекцията, добавете любимите си пинове в чантата и завършете поръчката с адреса си за доставка. Не са необходими данни за кредитна карта.",
                )}
              </p>
            </ScrollFadeIn>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
