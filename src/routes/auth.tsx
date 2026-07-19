import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/language-context";

function buildSchema(t: (en: string, bg: string) => string) {
  return z.object({
    email: z.string().trim().email(t("Please enter a valid email", "Моля, въведете валиден имейл")).max(255),
    password: z
      .string()
      .min(8, t("Password must be at least 8 characters", "Паролата трябва да е поне 8 символа"))
      .max(72),
    displayName: z.string().trim().max(80).optional(),
  });
}

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or register — pinlove.studio" },
      { name: "description", content: "Sign in or create an account to save your bag and orders." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading, isAdmin, adminChecked } = useAuth();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const t = useT();
  const schema = buildSchema(t);

  useEffect(() => {
    if (!loading && user && adminChecked) {
      navigate({ to: isAdmin ? "/admin" : "/account" });
    }
  }, [user, loading, isAdmin, adminChecked, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const parsed = schema.safeParse({
      email,
      password,
      displayName: mode === "register" ? displayName : undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("Invalid input", "Невалидни данни"));
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        // Redirect happens in the effect above once we know the account's role.
      } else {
        const [firstName = "", ...rest] = (parsed.data.displayName ?? "").trim().split(/\s+/);
        const lastName = rest.join(" ");
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { first_name: firstName, last_name: lastName },
          },
        });
        if (error) throw error;
        setInfo(
          t(
            "Account created. If email confirmation is enabled, please check your inbox.",
            "Акаунтът е създаден. Ако потвърждението по имейл е включено, моля, провери входящата поща.",
          ),
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t("Something went wrong", "Нещо се обърка");
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteShell>
      <section className="section-space">
        <div className="container-shell">
          <div className="mx-auto max-w-md rounded-sm border border-border/80 bg-surface p-8 shadow-soft sm:p-10">
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`label-caps flex-1 border-b py-2 transition-colors ${
                  mode === "signin"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {t("Sign in", "Вход")}
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`label-caps flex-1 border-b py-2 transition-colors ${
                  mode === "register"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {t("Register", "Регистрация")}
              </button>
            </div>

            <h1 className="display-section mt-8 text-balance">
              {mode === "signin" ? t("Welcome back.", "Добре дошъл отново.") : t("Create your account.", "Създай своя акаунт.")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? t("Sign in to access your saved bag and order history.", "Влез, за да достъпиш запазената си чанта и история на поръчките.")
                : t("Save your bag and track personal orders with pinlove.studio.", "Запази чантата си и следи личните си поръчки с pinlove.studio.")}
            </p>

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">{t("Name", "Име")}</Label>
                  <Input
                    id="displayName"
                    autoComplete="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email", "Имейл")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("Password", "Парола")}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {mode === "signin" && (
                  <p className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {t("Forgot your password?", "Забравена парола?")}
                    </Link>
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {info && <p className="text-sm text-muted-foreground">{info}</p>}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting
                  ? t("Please wait…", "Моля, изчакай…")
                  : mode === "signin"
                    ? t("Sign in", "Вход")
                    : t("Create account", "Създай акаунт")}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                {t("Back to pinlove.studio", "Обратно към pinlove.studio")}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
