import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "bg";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
};

const STORAGE_KEY = "pinlove:lang";
const LanguageContext = createContext<LanguageContextValue | null>(null);

function readLocal(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "bg" || raw === "en" ? raw : "en";
  } catch {
    return "en";
  }
}

function writeLocal(lang: Language) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to "en" on the server and on first client render so the markup
  // matches (avoids hydration mismatches); the real stored preference is
  // applied right after mount.
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    setLanguageState(readLocal());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    writeLocal(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === "en" ? "bg" : "en";
      writeLocal(next);
      return next;
    });
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, toggleLanguage }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

/**
 * Pick between an English and Bulgarian string based on the active language.
 * Usage: const t = useT(); t("Home", "Начало")
 */
export function useT() {
  const { language } = useLanguage();
  return useCallback((en: string, bg: string) => (language === "bg" ? bg : en), [language]);
}

/**
 * Pick between an English and Bulgarian *database* field, falling back to
 * English whenever the Bulgarian translation hasn't been filled in yet.
 * Usage: const f = useField(); f(product.name, product.name_bg)
 */
export function useField() {
  const { language } = useLanguage();
  return useCallback(
    (en: string | null | undefined, bg?: string | null | undefined) => {
      if (language === "bg" && bg && bg.trim().length > 0) return bg;
      return en ?? "";
    },
    [language],
  );
}
