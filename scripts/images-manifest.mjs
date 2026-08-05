/**
 * Master list of every image referenced by the HavFun site.
 * Used by build-image-data.mjs to download/compress each one to <=600 KB and
 * emit a base64 data URI for inline storage in Firestore.
 *
 * `kind`:
 *   - 'photo' : full-colour photograph -> JPEG, resized, quality-tuned
 *   - 'icon'  : logo / transparent PNG -> keep alpha (PNG/WebP), resized small
 *
 * `source`:
 *   - http(s) URL  -> downloaded
 *   - relative path -> read from repo (resolved against project root)
 */

const WP = 'https://havfuntrampolinepark.com/wp-content/uploads/2024/10';

export const IMAGES = [
  // ---- Branding ----
  { key: 'logo',   category: 'branding', kind: 'icon',  source: `${WP}/IMG_7567-e1739166515549.png` },
  { key: 'banner', category: 'branding', kind: 'photo', source: `${WP}/DSC08279-min-scaled.jpg` },
  { key: 'about',  category: 'branding', kind: 'photo', source: `${WP}/DSC08415-min-scaled.jpg` },

  // ---- Attractions (6) ----
  { key: 'kids-zone',      category: 'attractions', kind: 'photo', source: `${WP}/DSC08420-min-1024x683.jpg` },
  { key: 'foam-pits',      category: 'attractions', kind: 'photo', source: `${WP}/DSC08204-min-scaled.jpg` },
  { key: 'slam-dunk-zone', category: 'attractions', kind: 'photo', source: `${WP}/DSC08368-min-scaled.jpg` },
  { key: 'wipe-out',       category: 'attractions', kind: 'photo', source: `${WP}/DSC08218-min-scaled.jpg` },
  { key: 'main-court',     category: 'attractions', kind: 'photo', source: `${WP}/DSC08259-min-scaled.jpg` },
  { key: 'spider-wall',    category: 'attractions', kind: 'photo', source: `${WP}/DSC08254-min-scaled.jpg` },

  // ---- Safety icons (4) ----
  { key: 'trained-professionals', category: 'safety', kind: 'icon', source: `${WP}/WhatsApp-Image-2024-10-08-at-4.17.20-PM3.jpeg1_.png` },
  { key: 'safety-equipment',      category: 'safety', kind: 'icon', source: `${WP}/WhatsApp-Image-2024-10-08-at-4.17.20-PM3.png` },
  { key: 'first-aid-ready',       category: 'safety', kind: 'icon', source: `${WP}/WhatsApp-Image-2024-10-08-at-4.17.20-PM2.jpeg.png` },
  { key: 'clean-sanitized',       category: 'safety', kind: 'icon', source: `${WP}/WhatsApp-Image-2024-10-08-at-4.17.20-PM11.png` },

  // ---- Gallery (6 active, with titles in seed) ----
  { key: 'gallery-foam-pit',  category: 'gallery', kind: 'photo', source: `${WP}/DSC08204-min-scaled.jpg` },
  { key: 'gallery-slam-dunk', category: 'gallery', kind: 'photo', source: `${WP}/DSC08368-min-scaled.jpg` },
  { key: 'gallery-obstacle',  category: 'gallery', kind: 'photo', source: `${WP}/DSC08218-min-scaled.jpg` },
  { key: 'gallery-main-court',category: 'gallery', kind: 'photo', source: `${WP}/DSC08259-min-scaled.jpg` },
  { key: 'gallery-spider',    category: 'gallery', kind: 'photo', source: `${WP}/DSC08254-min-scaled.jpg` },
  { key: 'gallery-cafe',      category: 'gallery', kind: 'photo', source: `${WP}/DSC08314-min-scaled.jpg` },

  // ---- Cafe (4) ----
  { key: 'cafe-drink',   category: 'cafe', kind: 'photo', source: `${WP}/DSC08314-min-scaled.jpg` },
  { key: 'cafe-food',    category: 'cafe', kind: 'photo', source: `${WP}/DSC08409-min-scaled.jpg` },
  { key: 'cafe-burger',  category: 'cafe', kind: 'photo', source: `${WP}/DSC08245-min1-scaled.jpg` },
  { key: 'cafe-seating', category: 'cafe', kind: 'photo', source: `${WP}/DSC08382-min-scaled.jpg` },

  // ---- Waiver step images (local PNGs, oversized -> must compress) ----
  { key: 'trampoline-zone',  category: 'waiver', kind: 'photo', source: 'src/assets/trampoline-zone.png' },
  { key: 'jungle-playground',category: 'waiver', kind: 'photo', source: 'src/assets/jungle-playground.png' },
  { key: 'basketball-zone',  category: 'waiver', kind: 'photo', source: 'src/assets/basketball-zone.png' },
  { key: 'bubble-balls',     category: 'waiver', kind: 'photo', source: 'src/assets/bubble-balls.png' },
  { key: 'obstacle-zone',    category: 'waiver', kind: 'photo', source: 'src/assets/obstacle-zone.png' },
];

// Videos are too large to inline in a Firestore doc (1 MB cap) -> Firebase Storage.
export const VIDEOS = [
  { key: 'havefun01', source: 'src/assets/havefun01.mp4' },
  { key: 'havefun02', source: 'src/assets/havefun02.mp4' },
  { key: 'havefun03', source: 'src/assets/havefun03.mp4' },
];

export const MAX_BYTES = 600 * 1024; // 600 KB target for inline base64
