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

export const Route = createFileRoute("/_authenticated/admin/commissions")({
  head: () => ({ meta: [{ title: "Commissions — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminCommissions,
});

const STATUSES = ["new", "contacted", "in_progress", "completed", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

type RequestRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  description: string | null;
  status: string;
  created_at: string;
};

function AdminCommissions() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("custom_requests")
      .select("id, full_name, email, phone, description, status, created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as RequestRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: Status) {
    const { error } = await supabase.from("custom_requests").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this request?")) return;
    const { error } = await supabase.from("custom_requests").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Request deleted");
    setOpenId(null);
    load();
  }

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const current = openId ? rows.find((r) => r.id === openId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Craft Your Own — Commission requests</h1>
          <p className="text-sm text-muted-foreground">{rows.length} total</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border/60 bg-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No requests.</td></tr>}
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border/40">
                <td className="px-4 py-2">{r.full_name}</td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">{r.phone || "—"}</td>
                <td className="px-4 py-2">
                  <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v as Status)}>
                    <SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-2">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right">
                  <Button size="sm" variant="ghost" onClick={() => setOpenId(r.id)}><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request from {current?.full_name}</DialogTitle>
          </DialogHeader>
          {current && (
            <div className="space-y-4 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <div><span className="text-muted-foreground">Name:</span> {current.full_name}</div>
                <div><span className="text-muted-foreground">Email:</span> {current.email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {current.phone || "—"}</div>
                <div><span className="text-muted-foreground">Status:</span> <span className="capitalize">{current.status.replace("_", " ")}</span></div>
              </div>
              {current.description && (
                <div>
                  <span className="text-muted-foreground">Concept:</span>
                  <p className="mt-1 whitespace-pre-line">{current.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
