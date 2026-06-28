/**
 * Downloads/reads every image in images-manifest.mjs, compresses it to <= 600 KB,
 * and writes base64 data URIs to scripts/generated/image-data.json.
 *
 * The seed script (seed-firestore.mjs) consumes that JSON to inline images into
 * Firestore documents.
 *
 *   node scripts/build-image-data.mjs
 *
 * Notes on the 600 KB target: a Firestore document is capped at 1 MB. base64
 * inflates bytes ~33%, so a 600 KB binary encodes to ~800 KB — safely under the
 * cap. The script warns if any encoded string would exceed 1 MB.
 */
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { IMAGES, MAX_BYTES } from './images-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(__dirname, 'generated');
const OUT_FILE = resolve(OUT_DIR, 'image-data.json');
const FIRESTORE_DOC_LIMIT = 1024 * 1024;

async function loadBytes(source) {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${source}`);
    return Buffer.from(await res.arrayBuffer());
  }
  return readFile(resolve(ROOT, source));
}

/**
 * Compress to <= MAX_BYTES. Photos -> JPEG (no alpha needed). Icons -> WebP to
 * preserve transparency at small size. Steps down dimension + quality until the
 * output fits the byte budget.
 */
async function compress(input, kind) {
  const widths = kind === 'icon' ? [512, 384, 256, 192] : [1600, 1280, 1024, 900, 768];
  const qualities = kind === 'icon' ? [90, 80, 70, 60] : [80, 72, 64, 55, 45];

  let best = null;
  for (const width of widths) {
    for (const quality of qualities) {
      const pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: true });
      const out =
        kind === 'icon'
          ? await pipeline.webp({ quality }).toBuffer()
          : await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
      best = { buf: out, width, quality, format: kind === 'icon' ? 'webp' : 'jpeg' };
      if (out.byteLength <= MAX_BYTES) return best;
    }
  }
  return best; // smallest we could achieve, even if > target
}

const fmt = (n) => `${(n / 1024).toFixed(0)} KB`;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const result = {};
  let warnings = 0;

  for (const img of IMAGES) {
    try {
      const raw = await loadBytes(img.source);
      const { buf, width, quality, format } = await compress(raw, img.kind);
      const mime = format === 'webp' ? 'image/webp' : 'image/jpeg';
      const dataUri = `data:${mime};base64,${buf.toString('base64')}`;
      const encodedBytes = Buffer.byteLength(dataUri, 'utf8');

      const over = buf.byteLength > MAX_BYTES;
      const overDoc = encodedBytes > FIRESTORE_DOC_LIMIT;
      if (over || overDoc) warnings++;

      result[img.key] = {
        key: img.key,
        category: img.category,
        dataUri,
        bytes: buf.byteLength,
        encodedBytes,
        width,
        format,
      };

      const flag = overDoc ? '  ⛔ >1MB encoded' : over ? '  ⚠ >600KB raw' : '';
      console.log(
        `✓ ${img.key.padEnd(22)} ${fmt(raw.byteLength).padStart(8)} → ${fmt(buf.byteLength).padStart(7)} ` +
          `(${format} w${width} q${quality}, b64 ${fmt(encodedBytes)})${flag}`
      );
    } catch (err) {
      console.error(`✗ ${img.key.padEnd(22)} FAILED: ${err.message}`);
      warnings++;
    }
  }

  await writeFile(OUT_FILE, JSON.stringify(result, null, 2));
  console.log(`\nWrote ${Object.keys(result).length} images → ${OUT_FILE}`);
  if (warnings) console.log(`⚠ ${warnings} image(s) need attention (see flags above).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
