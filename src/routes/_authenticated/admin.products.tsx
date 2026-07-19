import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/products")({
  head: () => ({ meta: [{ title: "Products — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminProducts,
});

type Product = {
  id: string;
  slug: string;
  name: string;
  name_bg: string | null;
  eyebrow: string | null;
  eyebrow_bg: string | null;
  price_eur: number;
  foot_price_eur: number | null;
  dimensions: string;
  dimensions_bg: string | null;
  artisan_note: string | null;
  artisan_note_bg: string | null;
  category: string | null;
  is_available: boolean;
  sort_order: number;
  image?: string | null;
};

type Draft = Omit<Product, "id" | "image"> & { id?: string };

function emptyDraft(): Draft {
  return {
    slug: "",
    name: "",
    name_bg: "",
    eyebrow: "",
    eyebrow_bg: "",
    price_eur: 0,
    foot_price_eur: null,
    dimensions: "",
    dimensions_bg: "",
    artisan_note: "",
    artisan_note_bg: "",
    category: "",
    is_available: true,
    sort_order: 0,
  };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function AdminProducts() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, slug, name, name_bg, eyebrow, eyebrow_bg, price_eur, foot_price_eur, dimensions, dimensions_bg, artisan_note, artisan_note_bg, category, is_available, sort_order, product_images(url, sort_order)",
      )
      .order("sort_order", { ascending: true });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    setRows(
      (data ?? []).map((p: any) => {
        const imgs = (p.product_images ?? [])
          .slice()
          .sort((a: any, b: any) => a.sort_order - b.sort_order);
        return { ...p, image: imgs[0]?.url ?? null } as Product;
      }),
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.category && set.add(r.category));
    return Array.from(set).sort();
  }, [rows]);

  const filtered = rows.filter((r) => {
    if (cat !== "all" && (r.category ?? "") !== cat) return false;
    if (q) {
      const s = q.toLowerCase();
      if (!(r.name.toLowerCase().includes(s) || r.slug.toLowerCase().includes(s))) return false;
    }
    return true;
  });

  async function save() {
    if (!editing) return;
    if (!editing.name.trim() || !editing.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: editing.slug.trim(),
        name: editing.name.trim(),
        name_bg: editing.name_bg?.trim() || null,
        eyebrow: editing.eyebrow || null,
        eyebrow_bg: editing.eyebrow_bg || null,
        price_eur: Number(editing.price_eur) || 0,
        foot_price_eur:
          editing.category === "bracelet" && editing.foot_price_eur != null
            ? Number(editing.foot_price_eur)
            : null,
        dimensions: editing.dimensions || "",
        dimensions_bg: editing.dimensions_bg || null,
        artisan_note: editing.artisan_note || "",
        artisan_note_bg: editing.artisan_note_bg || null,
        category: editing.category || null,
        is_available: editing.is_available,
        sort_order: Number(editing.sort_order) || 0,
      };
      let productId = editing.id;
      if (productId) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        productId = data.id;
      }

      if (file && productId) {
        const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
        const maxBytes = 5 * 1024 * 1024;
        if (!allowedTypes.has(file.type) || file.size > maxBytes) {
          throw new Error("Use a JPEG, PNG, or WebP image up to 5 MB.");
        }
        const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const path = `${productId}/${Date.now()}.${ext}`;
        const up = await supabase.storage.from("products").upload(path, file, { upsert: false });
        if (up.error) throw up.error;
        const { data: pub } = supabase.storage.from("products").getPublicUrl(path);
        const { error: imgErr } = await supabase
          .from("product_images")
          .insert({ product_id: productId, url: pub.publicUrl, alt: payload.name, sort_order: 0 });
        if (imgErr) throw imgErr;
      }

      toast.success(editing.id ? "Product updated" : "Product created");
      setEditing(null);
      setFile(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function del(p: Product) {
    if (!confirm(`Delete "${p.name}"? This also removes its images.`)) return;
    // remove image rows first (FK)
    await supabase.from("product_images").delete().eq("product_id", p.id);
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    load();
  }

  async function toggleAvailable(p: Product) {
    const { error } = await supabase
      .from("products")
      .update({ is_available: !p.is_available })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">{rows.length} total</p>
        </div>
        <Button
          onClick={() => {
            setEditing(emptyDraft());
            setFile(null);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add product
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search by name or slug…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border/60 bg-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Slug</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-right">Foot price</th>
              <th className="px-4 py-2 text-center">Available</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                  No products.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border/40">
                <td className="px-4 py-2">
                  {p.image ? (
                    <img src={p.image} alt="" className="h-12 w-12 rounded object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted" />
                  )}
                </td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2 font-mono text-xs">{p.slug}</td>
                <td className="px-4 py-2">{p.category ?? "—"}</td>
                <td className="px-4 py-2 text-right">{Number(p.price_eur).toFixed(2)} €</td>
                <td className="px-4 py-2 text-right">
                  {p.foot_price_eur != null ? `${Number(p.foot_price_eur).toFixed(2)} €` : "—"}
                </td>
                <td className="px-4 py-2 text-center">
                  <Switch checked={p.is_available} onCheckedChange={() => toggleAvailable(p)} />
                </td>
                <td className="px-4 py-2 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing({ ...p });
                      setFile(null);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => del(p)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit product" : "New product"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label>Name</Label>
                <Input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      name: e.target.value,
                      slug: editing.slug || slugify(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Name (Bulgarian) <span className="text-muted-foreground font-normal">— optional, falls back to English</span></Label>
                <Input
                  value={editing.name_bg ?? ""}
                  onChange={(e) => setEditing({ ...editing, name_bg: e.target.value })}
                  placeholder="напр. Сребърна гривна"
                />
              </div>
              <div className="space-y-1">
                <Label>Slug</Label>
                <Input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Price (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editing.price_eur}
                  onChange={(e) => setEditing({ ...editing, price_eur: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select
                  value={editing.category || "none"}
                  onValueChange={(v) => setEditing({ ...editing, category: v === "none" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    <SelectItem value="bracelet">Bracelet</SelectItem>
                    <SelectItem value="necklace">Necklace</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Eyebrow</Label>
                <Input
                  value={editing.eyebrow ?? ""}
                  onChange={(e) => setEditing({ ...editing, eyebrow: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Eyebrow (Bulgarian)</Label>
                <Input
                  value={editing.eyebrow_bg ?? ""}
                  onChange={(e) => setEditing({ ...editing, eyebrow_bg: e.target.value })}
                />
              </div>
              {editing.category === "bracelet" && (
                <div className="space-y-1">
                  <Label>Foot / ankle price (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editing.foot_price_eur ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        foot_price_eur: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    placeholder="e.g. 24.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank to disable the hand/foot choice for this bracelet.
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <Label>Dimensions</Label>
                <Input
                  value={editing.dimensions}
                  onChange={(e) => setEditing({ ...editing, dimensions: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Dimensions (Bulgarian)</Label>
                <Input
                  value={editing.dimensions_bg ?? ""}
                  onChange={(e) => setEditing({ ...editing, dimensions_bg: e.target.value })}
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Handmade caption (shown on every product page)</Label>
                <Textarea
                  rows={6}
                  value={editing.artisan_note ?? ""}
                  onChange={(e) => setEditing({ ...editing, artisan_note: e.target.value })}
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Handmade caption (Bulgarian) <span className="text-muted-foreground font-normal">— optional, falls back to English</span></Label>
                <Textarea
                  rows={6}
                  value={editing.artisan_note_bg ?? ""}
                  onChange={(e) => setEditing({ ...editing, artisan_note_bg: e.target.value })}
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Product image{" "}
                  {editing.id ? "(adds a new image)" : ""}
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const next = e.target.files?.[0] ?? null;
                    if (next && (!["image/jpeg", "image/png", "image/webp"].includes(next.type) || next.size > 5 * 1024 * 1024)) {
                      toast.error("Use a JPEG, PNG, or WebP image up to 5 MB.");
                      e.currentTarget.value = "";
                      setFile(null);
                      return;
                    }
                    setFile(next);
                  }}
                />
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <Switch
                  id="avail"
                  checked={editing.is_available}
                  onCheckedChange={(v) => setEditing({ ...editing, is_available: v })}
                />
                <Label htmlFor="avail">Available on storefront</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
