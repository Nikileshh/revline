"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Maximize2,
  Pencil,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compressImage } from "@/lib/image";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  GALLERY_SIZE_LABELS,
  type GalleryPhoto,
  type GallerySize,
} from "@/types";

interface GalleryManagerProps {
  photos: GalleryPhoto[];
}

interface CaptionDraft {
  alt: string;
  caption: string;
}

const SIZE_ICONS: Record<GallerySize, typeof Square> = {
  sm: Square,
  wide: RectangleHorizontal,
  tall: RectangleVertical,
  xl: Maximize2,
};

// Preview classes in the admin grid — approximate the public bento footprint
// so admins can see how a size will read on the /gallery page.
const SIZE_PREVIEW: Record<GallerySize, string> = {
  sm: "col-span-1 row-span-1",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
  xl: "col-span-2 row-span-2",
};

export function GalleryManager({ photos }: GalleryManagerProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<GalleryPhoto | null>(null);
  const [draft, setDraft] = useState<CaptionDraft>({ alt: "", caption: "" });
  const [saving, setSaving] = useState(false);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    const supabase = supabaseBrowser();
    let uploaded = 0;

    for (const original of Array.from(files)) {
      try {
        const file = await compressImage(original);
        const path = `gallery/${Date.now()}-${uploaded}.webp`;
        const { error: storageError } = await supabase.storage
          .from("media")
          .upload(path, file, { cacheControl: "31536000", contentType: "image/webp" });
        if (storageError) throw storageError;

        const { data } = supabase.storage.from("media").getPublicUrl(path);
        const { error: dbError } = await supabase.from("gallery_photos").insert({
          url: data.publicUrl,
          sort_order: photos.length + uploaded,
        });
        if (dbError) throw dbError;
        uploaded++;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Failed to upload ${original.name}`);
      }
    }

    setUploading(false);
    if (uploaded > 0) {
      toast.success(`${uploaded} photo${uploaded > 1 ? "s" : ""} added`);
      router.refresh();
    }
  }

  async function updateSize(photo: GalleryPhoto, size: GallerySize) {
    if (photo.size === size) return;
    setBusyId(photo.id);
    const { error } = await supabaseBrowser()
      .from("gallery_photos")
      .update({ size })
      .eq("id", photo.id);
    setBusyId(null);
    if (error) toast.error(error.message);
    else router.refresh();
  }

  async function togglePublished(photo: GalleryPhoto) {
    setBusyId(photo.id);
    const { error } = await supabaseBrowser()
      .from("gallery_photos")
      .update({ published: !photo.published })
      .eq("id", photo.id);
    setBusyId(null);
    if (error) toast.error(error.message);
    else router.refresh();
  }

  async function remove(photo: GalleryPhoto) {
    setBusyId(photo.id);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from("gallery_photos").delete().eq("id", photo.id);
    setBusyId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    // Best-effort storage cleanup — mirror photo-manager
    const marker = "/media/";
    const idx = photo.url.indexOf(marker);
    if (idx !== -1) {
      await supabase.storage.from("media").remove([photo.url.slice(idx + marker.length)]);
    }
    toast.success("Photo removed");
    router.refresh();
  }

  function openEdit(photo: GalleryPhoto) {
    setEditing(photo);
    setDraft({ alt: photo.alt ?? "", caption: photo.caption ?? "" });
  }

  async function saveCaption(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const { error } = await supabaseBrowser()
      .from("gallery_photos")
      .update({
        alt: draft.alt.trim() || null,
        caption: draft.caption.trim() || null,
      })
      .eq("id", editing.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Updated");
    setEditing(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
            Gallery photos
          </h2>
          <p className="text-sm text-muted-foreground">
            Curated wall shown on /gallery. Set a size to control the tile footprint.
          </p>
        </div>
        <Button asChild variant="outline" disabled={uploading}>
          <label htmlFor="gallery-upload" className="cursor-pointer">
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="size-4" aria-hidden />
            )}
            Upload photos
          </label>
        </Button>
        <input
          id="gallery-upload"
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {photos.length > 0 ? (
        <div
          className={cn(
            "mt-6 grid gap-3",
            "grid-cols-2 md:grid-cols-4",
            "auto-rows-[120px] sm:auto-rows-[140px]",
            "[grid-auto-flow:dense]",
          )}
        >
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={cn(
                "group relative overflow-hidden rounded-lg border border-border bg-muted",
                SIZE_PREVIEW[photo.size],
                !photo.published && "opacity-60",
              )}
            >
              <Image
                src={photo.url}
                alt={photo.alt ?? photo.caption ?? "Gallery photo"}
                fill
                sizes={
                  photo.size === "wide" || photo.size === "xl"
                    ? "(max-width: 768px) 100vw, 50vw"
                    : "(max-width: 768px) 50vw, 25vw"
                }
                className="object-cover"
              />

              {/* Bottom-left size picker */}
              <div className="absolute inset-x-2 bottom-2 flex flex-wrap gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                {(Object.keys(SIZE_ICONS) as GallerySize[]).map((size) => {
                  const Icon = SIZE_ICONS[size];
                  const active = photo.size === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      aria-label={`Set size ${GALLERY_SIZE_LABELS[size]}`}
                      aria-pressed={active}
                      disabled={busyId === photo.id}
                      onClick={() => void updateSize(photo, size)}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-md border border-border/60 bg-background/85 text-foreground backdrop-blur-sm transition-colors hover:bg-background",
                        active && "border-primary bg-primary text-primary-foreground hover:bg-primary",
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden />
                    </button>
                  );
                })}
              </div>

              {/* Top-right actions */}
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label={photo.published ? "Hide from site" : "Show on site"}
                  disabled={busyId === photo.id}
                  onClick={() => void togglePublished(photo)}
                  className="size-8"
                >
                  {photo.published ? (
                    <Eye className="size-4" aria-hidden />
                  ) : (
                    <EyeOff className="size-4" aria-hidden />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label="Edit caption"
                  onClick={() => openEdit(photo)}
                  className="size-8"
                >
                  <Pencil className="size-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  aria-label="Delete photo"
                  disabled={busyId === photo.id}
                  onClick={() => void remove(photo)}
                  className="size-8"
                >
                  {busyId === photo.id ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Trash2 className="size-4" aria-hidden />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No gallery photos yet. Upload the best-of shots to build the wall.
        </p>
      )}

      <Dialog open={editing !== null} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit photo</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveCaption} className="space-y-4">
            <fieldset disabled={saving} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="g-alt">Alt text (accessibility)</Label>
                <Input
                  id="g-alt"
                  value={draft.alt}
                  onChange={(e) => setDraft((d) => ({ ...d, alt: e.target.value }))}
                  placeholder="Describe the photo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="g-caption">Caption (optional)</Label>
                <Input
                  id="g-caption"
                  value={draft.caption}
                  onChange={(e) => setDraft((d) => ({ ...d, caption: e.target.value }))}
                  placeholder="Sunrise Trail Run · 10K group"
                />
              </div>
            </fieldset>
            <Button type="submit" className="w-full font-semibold" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
