import { GalleryManager } from "@/components/admin/gallery-manager";
import { supabaseServer } from "@/lib/supabase/server";
import type { GalleryPhoto } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const supabase = await supabaseServer();
  // Admin view mirrors the public sort but includes unpublished so drafts
  // stay visible in the manager.
  const { data } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide">Gallery</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The curated wall shown on the public /gallery page.
      </p>
      <div className="mt-6">
        <GalleryManager photos={(data as GalleryPhoto[]) ?? []} />
      </div>
    </div>
  );
}
