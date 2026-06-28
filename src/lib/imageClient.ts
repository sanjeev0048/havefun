/**
 * Browser-side image compression for the admin CMS.
 *
 * The Node pipeline (scripts/build-image-data.mjs) uses sharp, which can't run in
 * the browser. This mirrors it with a canvas: resize + step quality down until the
 * base64 data URI fits MAX_ENCODED_BYTES, keeping every image safely under the 1 MB
 * Firestore document limit (encoded size, not raw, is what counts against the cap).
 */

const MAX_ENCODED_BYTES = 850 * 1024; // ~600 KB raw ≈ 800 KB base64; cushion under 1 MB
const PHOTO_WIDTHS = [1600, 1280, 1024, 900, 768, 640];
const ICON_WIDTHS = [512, 384, 256, 192];
const QUALITIES = [0.82, 0.72, 0.62, 0.52, 0.42];

export type ImageKind = 'photo' | 'icon';

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = dataUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function render(img: HTMLImageElement, width: number, mime: string, quality: number): string {
  const scale = Math.min(1, width / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL(mime, quality);
}

/**
 * Compress a user-selected file to a base64 data URI <= ~600 KB.
 * Photos → JPEG. Icons → WebP (preserves transparency for logos/icons).
 */
export async function compressImageFile(file: File, kind: ImageKind = 'photo'): Promise<string> {
  const src = await readFileAsDataUrl(file);
  const img = await loadImage(src);
  const widths = kind === 'icon' ? ICON_WIDTHS : PHOTO_WIDTHS;
  const mime = kind === 'icon' ? 'image/webp' : 'image/jpeg';

  let smallest = '';
  for (const width of widths) {
    for (const quality of QUALITIES) {
      const out = render(img, width, mime, quality);
      if (!smallest || out.length < smallest.length) smallest = out;
      if (out.length <= MAX_ENCODED_BYTES) return out;
    }
  }
  // Couldn't hit target; return the smallest we produced (caller may warn).
  return smallest;
}

export const encodedBytes = (dataUri: string) => Math.ceil((dataUri.length * 3) / 4);
export const isUnderFirestoreLimit = (dataUri: string) => encodedBytes(dataUri) < 1024 * 1024;
