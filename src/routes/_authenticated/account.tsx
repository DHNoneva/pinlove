import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useBag } from "@/lib/bag-context";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Account — pinlove.studio" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, signOut } = useAuth();
  const { count } = useBag();
  const navigate = useNavigate();

  return (
    <SiteShell>
      <section className="section-space">
        <div className="container-shell max-w-3xl space-y-8">
          <div>
            <p className="label-caps text-muted-foreground">Account</p>
            <h1 className="display-section mt-2">Hello{user?.email ? `, ${user.email}` : ""}.</h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-sm border border-border/80 p-6">
              <p className="label-caps text-muted-foreground">Your bag</p>
              <p className="mt-3 text-3xl font-medium">
                {count} {count === 1 ? "piece" : "pieces"}
              </p>
              <Button asChild className="mt-5" variant="outline" size="sm">
                <Link to="/bag">Open bag</Link>
              </Button>
            </div>
            <div className="rounded-sm border border-border/80 p-6">
              <p className="label-caps text-muted-foreground">Continue browsing</p>
              <p className="mt-3 text-sm text-muted-foreground">Best sellers from the studio.</p>
              <Button asChild className="mt-5" variant="outline" size="sm">
                <Link to="/shop">Shop best sellers</Link>
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
          >
            Sign out
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
