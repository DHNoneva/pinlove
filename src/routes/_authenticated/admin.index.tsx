import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Admin" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

type Stats = {
  products: number;
  orders: number;
  pending: number;
  completed: number;
  revenue: number;
  latest: {
    id: string;
    order_number: string;
    customer_name: string;
    status: string;
    subtotal_eur: number;
    created_at: string;
  }[];
};

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [prod, ordCount, pend, done, all, latest] = await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("orders").select("id", { count: "exact", head: true }),
          supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "delivered"),
          supabase.from("orders").select("subtotal_eur"),
          supabase
            .from("orders")
            .select("id, order_number, customer_name, status, subtotal_eur, created_at")
            .order("created_at", { ascending: false })
            .limit(8),
        ]);
        const revenue = (all.data ?? []).reduce((s, r) => s + Number(r.subtotal_eur), 0);
        setStats({
          products: prod.count ?? 0,
          orders: ordCount.count ?? 0,
          pending: pend.count ?? 0,
          completed: done.count ?? 0,
          revenue,
          latest: (latest.data ?? []) as Stats["latest"],
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, []);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!stats) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const cards = [
    { label: "Total products", value: stats.products },
    { label: "Total orders", value: stats.orders },
    { label: "Pending orders", value: stats.pending },
    { label: "Completed orders", value: stats.completed },
    { label: "Total revenue", value: `${stats.revenue.toFixed(2)} €` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-md border border-border/60 bg-surface p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
            <p className="mt-2 text-2xl font-medium">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border/60 bg-surface">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <h2 className="text-sm font-medium">Latest orders</h2>
          <Link to={"/admin/orders" as never} className="text-xs text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Order</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.latest.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No orders yet.</td></tr>
              )}
              {stats.latest.map((o) => (
                <tr key={o.id} className="border-t border-border/40">
                  <td className="px-4 py-2 font-mono text-xs">{o.order_number}</td>
                  <td className="px-4 py-2">{o.customer_name}</td>
                  <td className="px-4 py-2 capitalize">{o.status}</td>
                  <td className="px-4 py-2 text-right">{Number(o.subtotal_eur).toFixed(2)} €</td>
                  <td className="px-4 py-2">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
