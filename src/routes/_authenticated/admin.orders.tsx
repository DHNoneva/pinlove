import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminOrders,
});

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  status: string;
  subtotal_eur: number;
  notes: string | null;
  created_at: string;
};

type Item = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price_eur: number;
};

function AdminOrders() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_country, status, subtotal_eur, notes, created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as OrderRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function openOrder(id: string) {
    setOpenId(id);
    const { data, error } = await supabase
      .from("order_items")
      .select("id, product_name, quantity, unit_price_eur")
      .eq("order_id", id);
    if (error) toast.error(error.message);
    setItems((data ?? []) as Item[]);
  }

  async function updateStatus(id: string, status: Status) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this order?")) return;
    await supabase.from("order_items").delete().eq("order_id", id);
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order deleted");
    setOpenId(null);
    load();
  }

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const current = openId ? rows.find((r) => r.id === openId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-muted-foreground">{rows.length} total</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border/60 bg-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left">Order</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">No orders.</td></tr>}
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-border/40">
                <td className="px-4 py-2 font-mono text-xs">{o.order_number}</td>
                <td className="px-4 py-2">{o.customer_name}</td>
                <td className="px-4 py-2">{o.customer_email}</td>
                <td className="px-4 py-2">
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as Status)}>
                    <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-2 text-right">{Number(o.subtotal_eur).toFixed(2)} €</td>
                <td className="px-4 py-2">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right">
                  <Button size="sm" variant="ghost" onClick={() => openOrder(o.id)}><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => del(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order {current?.order_number}</DialogTitle>
          </DialogHeader>
          {current && (
            <div className="space-y-4 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <div><span className="text-muted-foreground">Name:</span> {current.customer_name}</div>
                <div><span className="text-muted-foreground">Email:</span> {current.customer_email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {current.customer_phone || "—"}</div>
                <div><span className="text-muted-foreground">Status:</span> <span className="capitalize">{current.status}</span></div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Address:</span> {current.shipping_address}, {current.shipping_city}, {current.shipping_country}
                </div>
                {current.notes && <div className="sm:col-span-2"><span className="text-muted-foreground">Notes:</span> {current.notes}</div>}
              </div>
              <div className="rounded-md border border-border/60">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-widest text-muted-foreground">
                    <tr><th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Qty</th><th className="px-3 py-2 text-right">Price</th><th className="px-3 py-2 text-right">Subtotal</th></tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr key={it.id} className="border-t border-border/40">
                        <td className="px-3 py-2">{it.product_name}</td>
                        <td className="px-3 py-2 text-right">{it.quantity}</td>
                        <td className="px-3 py-2 text-right">{Number(it.unit_price_eur).toFixed(2)} €</td>
                        <td className="px-3 py-2 text-right">{(Number(it.unit_price_eur) * it.quantity).toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right font-medium">Total: {Number(current.subtotal_eur).toFixed(2)} €</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
