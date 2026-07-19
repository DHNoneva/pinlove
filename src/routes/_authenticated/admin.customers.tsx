import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  head: () => ({ meta: [{ title: "Customers — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminCustomers,
});

type Customer = {
  email: string;
  name: string;
  phone: string | null;
  orders: number;
  total: number;
};

function AdminCustomers() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("customer_email, customer_name, customer_phone, subtotal_eur");
      if (error) { toast.error(error.message); setLoading(false); return; }
      const byEmail = new Map<string, Customer>();
      for (const o of data ?? []) {
        const key = (o.customer_email || "").toLowerCase();
        if (!key) continue;
        const cur = byEmail.get(key) ?? { email: key, name: o.customer_name, phone: o.customer_phone, orders: 0, total: 0 };
        cur.orders += 1;
        cur.total += Number(o.subtotal_eur);
        if (!cur.phone && o.customer_phone) cur.phone = o.customer_phone;
        byEmail.set(key, cur);
      }
      setRows(Array.from(byEmail.values()).sort((a, b) => b.total - a.total));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="text-sm text-muted-foreground">Aggregated from orders.</p>
      </div>
      <div className="rounded-md border border-border/60 bg-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-right">Orders</th>
              <th className="px-4 py-2 text-right">Total spent</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No customers yet.</td></tr>}
            {rows.map((c) => (
              <tr key={c.email} className="border-t border-border/40">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.phone || "—"}</td>
                <td className="px-4 py-2 text-right">{c.orders}</td>
                <td className="px-4 py-2 text-right">{c.total.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
