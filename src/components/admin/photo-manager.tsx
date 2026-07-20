"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { compressImage } from "@/lib/image";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { EventPhoto } from "@/types";

interface PhotoManagerProps {
  eventId: string;
  photos: EventPhoto[];
}

export function PhotoManager({ eventId, photos }: PhotoManagerProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    const supabase = supabaseBrowser();
    let uploaded = 0;

    for (const original of Array.from(files)) {
      try {
        const file = await compressImage(original);
        const path = `events/${eventId}/${Date.now()}-${uploaded}.webp`;
        const { error: storageError } = await supabase.storage
          .from("media")
          .upload(path, file, { cacheControl: "31536000", contentType: "image/webp" });
        if (storageError) throw storageError;

        const { data } = supabase.storage.from("media").getPublicUrl(path);
        const { error: dbError } = await supabase.from("event_photos").insert({
          event_id: eventId,
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

  async function deletePhoto(photo: EventPhoto) {
    setDeletingId(photo.id);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from("event_photos").delete().eq("id", photo.id);
    setDeletingId(null);

    if (error) {
      toast.error(error.message);
      return;
    }
    // Best-effort storage cleanup
    const marker = "/media/";
    const idx = photo.url.indexOf(marker);
    if (idx !== -1) {
      await supabase.storage.from("media").remove([photo.url.slice(idx + marker.length)]);
    }
    toast.success("Photo removed");
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
            Session photos
          </h2>
          <p className="text-sm text-muted-foreground">
            Shown in the gallery on the event page — for upcoming and completed events.
          </p>
        </div>
        <Button asChild variant="outline" disabled={uploading}>
          <label htmlFor="photo-upload" className="cursor-pointer">
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="size-4" aria-hidden />
            )}
            Upload photos
          </label>
        </Button>
        <input
          id="photo-upload"
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
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              <Image
                src={photo.url}
                alt={photo.caption ?? "Session photo"}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                aria-label="Delete photo"
                disabled={deletingId === photo.id}
                onClick={() => void deletePhoto(photo)}
                className="absolute right-2 top-2 size-8 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
              >
                {deletingId === photo.id ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Trash2 className="size-4" aria-hidden />
                )}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No photos yet. Upload the best shots from the session.
        </p>
      )}
    </div>
  );
}
