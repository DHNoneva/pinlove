import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminSettings,
});

type Settings = {
  store_name: string;
  contact_email: string;
  contact_phone: string;
  homepage_banner: string;
};

function AdminSettings() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("site_settings" as never)
        .select("store_name, contact_email, contact_phone, homepage_banner")
        .eq("id", true as never)
        .maybeSingle();
      if (error) return toast.error(error.message);
      setS((data as Settings | null) ?? { store_name: "", contact_email: "", contact_phone: "", homepage_banner: "" });
    })();
  }, []);

  async function save() {
    if (!s) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings" as never)
      .update(s as never)
      .eq("id", true as never);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }

  if (!s) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Store settings</h1>
        <p className="text-sm text-muted-foreground">Basic information about your store.</p>
      </div>
      <div className="grid gap-4">
        <div className="space-y-1">
          <Label>Store name</Label>
          <Input value={s.store_name} onChange={(e) => setS({ ...s, store_name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Contact email</Label>
          <Input type="email" value={s.contact_email} onChange={(e) => setS({ ...s, contact_email: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Contact phone</Label>
          <Input value={s.contact_phone} onChange={(e) => setS({ ...s, contact_phone: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Homepage banner text</Label>
          <Textarea rows={3} value={s.homepage_banner} onChange={(e) => setS({ ...s, homepage_banner: e.target.value })} />
        </div>
        <div>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>
      </div>
    </div>
  );
}
