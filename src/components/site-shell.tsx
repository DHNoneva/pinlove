import type { ElementType, ReactNode } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useBag } from "@/lib/bag-context";
import { useLanguage, useT } from "@/lib/language-context";

const navItems = [
  { to: "/home", en: "Home", bg: "Начало" },
  { to: "/craft-your-own", en: "Craft Your Own", bg: "Създай свой" },
  { to: "/shop", en: "Signature Collection", bg: "Основна колекция" },
  { to: "/fashion-pins", en: "Fashion Pins", bg: "Модни пинове" },

  { to: "/contact", en: "Contact", bg: "Контакти" },
] as const;

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-md border border-input text-xs font-medium ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`px-2.5 py-1.5 transition-colors ${
          language === "en"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("bg")}
        aria-pressed={language === "bg"}
        className={`px-2.5 py-1.5 transition-colors ${
          language === "bg"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        BG
      </button>
    </div>
  );
}

export function BilingualText({
  en,
  bg,
  as: Comp = "p",
  className = "",
}: {
  en: string;
  bg: string;
  as?: ElementType;
  className?: string;
  /** @deprecated kept for backwards-compat with existing call sites, no longer used */
  bgClassName?: string;
}) {
  const t = useT();
  return <Comp className={className}>{t(en, bg)}</Comp>;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, adminChecked } = useAuth();
  const { count } = useBag();
  const navigate = useNavigate();
  const t = useT();

  // Admin accounts are for managing the store, not shopping — keep them in the
  // admin panel instead of the public storefront.
  useEffect(() => {
    if (!loading && user && adminChecked && isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [loading, user, adminChecked, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="container-shell flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="font-serif text-3xl leading-none tracking-normal text-foreground"
            >
              pinlove.studio
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/home" }}
                  activeProps={{ className: "text-foreground" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="text-sm transition-colors hover:text-foreground"
                >
                  {t(item.en, item.bg)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle className="hidden sm:inline-flex" />
            {!loading &&
              (user ? (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/account">{t("Account", "Профил")}</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                    <Link to="/auth">{t("Login", "Вход")}</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/auth">{t("Register", "Регистрация")}</Link>
                  </Button>
                </>
              ))}
            <Link
              to="/bag"
              aria-label={t(`Bag, ${count} items`, `Чанта, ${count} артикула`)}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input text-foreground transition-colors hover:bg-accent"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav className="container-shell flex items-center gap-5 overflow-x-auto pb-3 text-sm md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/home" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="shrink-0 transition-colors hover:text-foreground"
            >
              {t(item.en, item.bg)}
            </Link>
          ))}
          <LanguageToggle className="shrink-0 sm:hidden" />
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border/80 bg-secondary/30">
        <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <p className="font-serif text-3xl leading-none">pinlove.studio</p>
            <BilingualText
              en="Handcrafted jewelry and fashion pins from Bulgaria, designed as quiet keepsakes with a modern presence."
              bg="Ръчно изработени бижута и модни пинове от България, създадени като тихи лични съкровища с модерно присъствие."
              className="max-w-xl text-sm leading-6"
            />
          </div>

          <div className="space-y-3">
            <p className="label-caps text-muted-foreground">{t("Navigate", "Навигация")}</p>
            <div className="flex flex-col gap-2 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(item.en, item.bg)}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p className="label-caps text-muted-foreground">{t("Contact", "Контакти")}</p>
            <a
              className="block text-muted-foreground transition-colors hover:text-foreground"
              href="mailto:pinlove.studio@outlook.com"
            >
              pinlove.studio@outlook.com
            </a>
            <a
              className="block text-muted-foreground transition-colors hover:text-foreground"
              href="https://instagram.com/pinlove.studio"
            >
              Instagram
            </a>
            <p className="text-muted-foreground">
              {t("Crafted in Bulgaria", "Създадено в България")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
