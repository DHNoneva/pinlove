import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/language-context";

function buildSchema(t: (en: string, bg: string) => string) {
  return z.object({
    email: z.string().trim().email(t("Please enter a valid email", "Моля, въведете валиден имейл")).max(255),
  });
}

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Reset your password — pinlove.studio" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const t = useT();
  const schema = buildSchema(t);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("Invalid input", "Невалидни данни"));
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      // Always show the same confirmation, whether or not the address has an
      // account — this avoids revealing which emails are registered.
      setSent(true);
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
            <h1 className="display-section text-balance">{t("Reset your password.", "Нулирай паролата си.")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "Enter the email on your account and we'll send you a link to set a new password.",
                "Въведи имейла на акаунта си и ще ти изпратим линк за нова парола.",
              )}
            </p>

            {sent ? (
              <p className="mt-8 text-sm text-foreground">
                {t(
                  `If an account exists for ${email}, a reset link is on its way. Check your inbox (and spam folder) in the next few minutes.`,
                  `Ако съществува акаунт за ${email}, линк за нулиране е на път. Провери входящата поща (и спам папката) в следващите няколко минути.`,
                )}
              </p>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={onSubmit}>
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

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? t("Sending…", "Изпращане…") : t("Send reset link", "Изпрати линк за нулиране")}
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
