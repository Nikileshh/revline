/**
 * Client-side image normalization for admin uploads. Any input format
 * (including iPhone HEIC/HEIF that browsers can't render natively) is decoded,
 * downscaled to a sane max dimension, and re-encoded as WebP at high quality.
 *
 * The output is smaller and universally renderable — Next.js can then
 * further optimize per-request without ever hitting a decode failure.
 */

const DEFAULT_QUALITY = 0.9;
const DEFAULT_MAX_DIMENSION = 2400;

export interface CompressOptions {
  quality?: number;
  maxDimension?: number;
}

export async function compressImage(
  file: File,
  { quality = DEFAULT_QUALITY, maxDimension = DEFAULT_MAX_DIMENSION }: CompressOptions = {},
): Promise<File> {
  const source = isHeic(file) ? await decodeHeic(file) : file;

  // `imageOrientation: 'from-image'` respects EXIF rotation so iPhone photos
  // don't come out sideways after the canvas re-encode.
  const bitmap = await createImageBitmap(source, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const dstW = Math.round(bitmap.width * scale);
  const dstH = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = dstW;
  canvas.height = dstH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, dstW, dstH);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality),
  );
  if (!blob) throw new Error("WebP encoding failed");

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.webp`, {
    type: "image/webp",
    lastModified: file.lastModified,
  });
}

function isHeic(file: File): boolean {
  return (
    /^image\/(heic|heif)/i.test(file.type) ||
    /\.(heic|heif)$/i.test(file.name)
  );
}

async function decodeHeic(file: File): Promise<Blob> {
  // Dynamic import keeps the ~1MB HEIC decoder out of non-admin bundles.
  const { default: heic2any } = await import("heic2any");
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.95 });
  return Array.isArray(result) ? result[0] : result;
}
