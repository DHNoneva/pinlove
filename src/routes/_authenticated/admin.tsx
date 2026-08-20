import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Hammer } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Admin — pinlove.studio" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/commissions", label: "Commissions", icon: Hammer },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const { user, loading, isAdmin, adminChecked, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const status: "checking" | "ok" | "denied" =
    loading || !adminChecked ? "checking" : isAdmin ? "ok" : "denied";

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }
  if (status === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user?.email}) does not have admin privileges.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              Go home
            </Button>
            <Button
              onClick={async () => {
                await signOut();
                navigate({ to: "/auth" });
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="px-4 py-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">pinlove</p>
              <p className="text-lg font-semibold">Admin</p>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.map((item) => {
                    const active = item.exact
                      ? pathname === item.to
                      : pathname === item.to || pathname.startsWith(item.to + "/");
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild isActive={active}>
                          <Link to={item.to} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={async () => {
                        await signOut();
                        navigate({ to: "/auth" });
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-14 items-center gap-2 border-b border-border/60 bg-surface px-4">
            <SidebarTrigger />
            <div className="ml-2 text-sm text-muted-foreground">Signed in as {user?.email}</div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
