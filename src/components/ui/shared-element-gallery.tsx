"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImageData {
  id: string;
  src: string;
  alt?: string;
}

interface GalleryContextType {
  selectedImage: ImageData | null;
  setSelectedImage: (image: ImageData | null) => void;
}

const GalleryContext = React.createContext<GalleryContextType | null>(null);

export function useGallery() {
  const ctx = React.useContext(GalleryContext);
  if (!ctx) throw new Error("useGallery must be used within a Gallery");
  return ctx;
}

// Shared-element transition physics — tuned so the thumbnail-to-modal morph
// feels crisp without overshoot on large images.
const spring = {
  type: "spring",
  stiffness: 350,
  damping: 35,
  mass: 1,
} as const;

export function Gallery({ children }: { children: React.ReactNode }) {
  const [selectedImage, setSelectedImage] = React.useState<ImageData | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  return (
    <GalleryContext.Provider value={{ selectedImage, setSelectedImage }}>
      {children}
      <GalleryModal />
    </GalleryContext.Provider>
  );
}

export function GalleryGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GalleryImage({
  src,
  alt,
  id,
  className,
}: {
  src: string;
  alt?: string;
  id: string;
  className?: string;
}) {
  const context = React.useContext(GalleryContext);
  if (!context) throw new Error("GalleryImage must be used within a Gallery");
  const reduce = useReducedMotion();

  // Fade+lift keyed to the tile's intersection with the viewport. `once: false`
  // makes it re-trigger on every enter AND exit — motion translates this into
  // an IntersectionObserver internally, so it's cheap even with 50+ tiles.
  //
  // The `amount: 0.15` threshold means the tile animates once ~15% of it is
  // visible: content lands before it's fully on screen, and starts fading out
  // before it's fully gone — matches the "premium browsing" feel.
  const scrollProps = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: false, amount: 0.15 },
        transition: {
          duration: 0.6,
          ease: [0.21, 0.47, 0.32, 0.98] as const,
        },
      };

  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      {...scrollProps}
      className={cn(
        "relative mb-4 cursor-zoom-in overflow-hidden rounded-xl break-inside-avoid",
        className,
      )}
      onClick={() => context.setSelectedImage({ id, src, alt })}
    >
      <motion.img
        layoutId={`image-${id}`}
        src={src}
        alt={alt || "Gallery Image"}
        className="h-auto w-full rounded-xl object-cover"
        variants={{
          hover: { scale: 0.98 },
          tap: { scale: 0.95 },
        }}
        transition={spring}
      />
      <motion.div
        variants={{
          hover: { opacity: 1 },
          tap: { opacity: 1 },
        }}
        initial={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 rounded-xl bg-black/10"
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

function GalleryModal() {
  const context = React.useContext(GalleryContext);
  if (!context) return null;

  const { selectedImage, setSelectedImage } = context;

  return (
    <AnimatePresence>
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          />
          <motion.div
            className="relative z-10 flex h-full w-full cursor-zoom-out items-center justify-center"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={(_, info) => {
              if (
                Math.abs(info.offset.y) > 100 ||
                Math.abs(info.velocity.y) > 300
              ) {
                setSelectedImage(null);
              }
            }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              layoutId={`image-${selectedImage.id}`}
              src={selectedImage.src}
              alt={selectedImage.alt || "Selected gallery image"}
              className="h-auto max-h-[90vh] w-auto max-w-[95vw] rounded-xl object-contain shadow-2xl will-change-transform"
              draggable={false}
              transition={spring}
            />
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
