import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import {
  Gallery,
  GalleryGrid,
  GalleryImage,
} from "@/components/ui/shared-element-gallery";
import { getGalleryPhotos } from "@/server/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Moments from past RevLine sessions — turf, trails, treks and everything in between.",
};

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Moments
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold uppercase tracking-wide sm:text-6xl">
          Gallery
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          A wall of memories from past sessions. Tap any photo to expand — drag
          down to dismiss.
        </p>
      </Reveal>

      <section aria-label="Session photos" className="mt-12">
        {photos.length > 0 ? (
          <Gallery>
            <GalleryGrid>
              {photos.map((photo) => (
                <GalleryImage
                  key={photo.id}
                  id={photo.id}
                  src={photo.url}
                  alt={photo.alt ?? photo.caption ?? "RevLine session photo"}
                />
              ))}
            </GalleryGrid>
          </Gallery>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <ImageIcon className="mx-auto size-8 text-muted-foreground" aria-hidden />
            <p className="mt-4 font-medium">The wall is still filling up</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Photos from recent sessions will land here soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
