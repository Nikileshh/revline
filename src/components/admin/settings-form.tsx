"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { SiteSettings } from "@/types";

interface SettingsFormProps {
  settings: SiteSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabaseBrowser()
      .from("site_settings")
      .update({
        instagram_url: draft.instagram_url.trim(),
        whatsapp_community_url: draft.whatsapp_community_url.trim(),
        contact_email: draft.contact_email.trim(),
        terms_md: draft.terms_md,
      })
      .eq("id", true);
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Settings saved");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <fieldset disabled={saving} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="set-ig">Instagram URL</Label>
            <Input
              id="set-ig"
              type="url"
              value={draft.instagram_url}
              onChange={(e) => setDraft((d) => ({ ...d, instagram_url: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="set-wa">WhatsApp community link</Label>
            <Input
              id="set-wa"
              type="url"
              value={draft.whatsapp_community_url}
              onChange={(e) =>
                setDraft((d) => ({ ...d, whatsapp_community_url: e.target.value }))
              }
              placeholder="https://chat.whatsapp.com/…"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="set-email">Contact email</Label>
            <Input
              id="set-email"
              type="email"
              value={draft.contact_email}
              onChange={(e) => setDraft((d) => ({ ...d, contact_email: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="set-terms">Terms &amp; Conditions (Markdown)</Label>
          <Textarea
            id="set-terms"
            rows={18}
            value={draft.terms_md}
            onChange={(e) => setDraft((d) => ({ ...d, terms_md: e.target.value }))}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Supports Markdown: ## headings, **bold**, - lists. Shown on the public /terms page.
          </p>
        </div>
      </fieldset>

      <Button type="submit" size="lg" className="font-semibold" disabled={saving}>
        {saving ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Save className="size-4" aria-hidden />
        )}
        Save settings
      </Button>
    </form>
  );
}
