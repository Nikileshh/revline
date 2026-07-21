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
    const supabase = supabaseBrowser();

    // Core settings — always present.
    const { error } = await supabase
      .from("site_settings")
      .update({
        instagram_url: draft.instagram_url.trim(),
        whatsapp_community_url: draft.whatsapp_community_url.trim(),
        contact_email: draft.contact_email.trim(),
        terms_md: draft.terms_md,
      })
      .eq("id", true);

    if (error) {
      setSaving(false);
      toast.error(error.message);
      return;
    }

    // Stat overrides — may not exist yet if the columns haven't been added.
    const { error: statError } = await supabase
      .from("site_settings")
      .update({ stat_athletes: draft.stat_athletes, stat_sessions: draft.stat_sessions })
      .eq("id", true);

    setSaving(false);

    if (statError) {
      toast.warning(
        "Links & terms saved. The stat numbers need the one-time SQL migration first.",
      );
    } else {
      toast.success("Settings saved");
    }
    router.refresh();
  }

  function setStat(key: "stat_athletes" | "stat_sessions", value: string) {
    const n = value.trim() === "" ? null : Math.max(0, Math.round(Number(value)));
    setDraft((d) => ({ ...d, [key]: Number.isFinite(n as number) ? n : null }));
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

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide">
            Homepage stats
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The two big numbers on the landing page. Leave blank to use the live
            count from registrations and completed events.
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="set-athletes">Athletes joined so far</Label>
              <Input
                id="set-athletes"
                type="number"
                min={0}
                inputMode="numeric"
                value={draft.stat_athletes ?? ""}
                onChange={(e) => setStat("stat_athletes", e.target.value)}
                placeholder="Auto (live count)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-sessions">Sessions hosted</Label>
              <Input
                id="set-sessions"
                type="number"
                min={0}
                inputMode="numeric"
                value={draft.stat_sessions ?? ""}
                onChange={(e) => setStat("stat_sessions", e.target.value)}
                placeholder="Auto (live count)"
              />
            </div>
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
