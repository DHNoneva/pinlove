import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/language-context";

function buildSchema(t: (en: string, bg: string) => string) {
  return z.object({
    password: z
      .string()
      .min(8, t("Password must be at least 8 characters", "Паролата трябва да е поне 8 символа"))
      .max(72),
  });
}

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Set a new password — pinlove.studio" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const t = useT();
  const schema = buildSchema(t);

  useEffect(() => {
    // Clicking the emailed link lands here with a recovery token in the URL;
    // supabase-js exchanges it for a temporary session automatically. We just
    // need to wait for that to land (or notice it never does).
    let cancelled = false;

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) setReady(true);
    });

    const timeout = setTimeout(() => {
      if (!cancelled) setLinkInvalid((prev) => prev || !ready);
    }, 4000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("Invalid input", "Невалидни данни"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("Passwords do not match.", "Паролите не съвпадат."));
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/account" }), 1500);
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
            <h1 className="display-section text-balance">{t("Set a new password.", "Задай нова парола.")}</h1>

            {done ? (
              <p className="mt-8 text-sm text-foreground">
                {t("Your password has been updated. Taking you to your account…", "Паролата ти беше обновена. Пренасочваме те към акаунта…")}
              </p>
            ) : linkInvalid && !ready ? (
              <div className="mt-8 space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "This reset link is invalid or has expired. Please request a new one.",
                    "Този линк за нулиране е невалиден или е изтекъл. Моля, заяви нов.",
                  )}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/forgot-password">{t("Request a new link", "Заяви нов линк")}</Link>
                </Button>
              </div>
            ) : !ready ? (
              <p className="mt-8 text-sm text-muted-foreground">{t("Checking your reset link…", "Проверка на линка за нулиране…")}</p>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("New password", "Нова парола")}</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("Confirm new password", "Потвърди новата парола")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? t("Updating…", "Обновяване…") : t("Update password", "Обнови паролата")}
                </Button>
              </form>
            )}

            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link to="/auth" className="hover:text-foreground">
                {t("Back to sign in", "Обратно към вход")}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
