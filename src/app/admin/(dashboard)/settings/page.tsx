import { SettingsForm } from "@/components/admin/settings-form";
import { supabaseServer } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types";

export const dynamic = "force-dynamic";

const DEFAULTS: SiteSettings = {
  instagram_url: "",
  whatsapp_community_url: "",
  terms_md: "",
  contact_email: "",
};

export default async function AdminSettingsPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase.from("site_settings").select("*").maybeSingle();

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Community links and the terms &amp; conditions page.
      </p>
      <div className="mt-8">
        <SettingsForm settings={(data as SiteSettings) ?? DEFAULTS} />
      </div>
    </div>
  );
}
