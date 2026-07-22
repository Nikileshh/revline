"use client";

import { useGallery } from "@/components/ui/shared-element-gallery";
import { Spotlight } from "@/components/ui/spotlight";

interface MarqueeTileProps {
  id: string;
  src: string;
  alt: string;
}

export function MarqueeTile({ id, src, alt }: MarqueeTileProps) {
  const { setSelectedImage } = useGallery();
  return (
    <button
      type="button"
      onClick={() => setSelectedImage({ id, src, alt })}
      aria-label={`View ${alt} full size`}
      className="group h-32 w-48 shrink-0 cursor-zoom-in overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:h-40 sm:w-60"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
      />
      <Spotlight
        size={160}
        className="from-primary/70 via-primary/40 to-transparent mix-blend-soft-light"
      />
    </button>
  );
}
