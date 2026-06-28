/**
 * Seeds HavFun static content into Firestore (project: havefun-9b5b2).
 *
 *   npm run seed
 *
 * Uses the Firebase Web SDK (no service-account key needed). Because writes go
 * through Security Rules, run this ONCE while the project is in test mode, or
 * temporarily allow writes (see firestore.rules — `SEEDING` note), then deploy
 * the locked-down rules.
 *
 * Idempotent: every document uses a deterministic ID, so re-running overwrites
 * instead of duplicating.
 *
 * Requires Node >= 20.9 only if you also run the image build; the seed itself
 * runs on any Node. Reads scripts/generated/image-data.json (run
 * `npm run images:build` first).
 */
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import * as content from './seed-content.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyAscXPT1xD_j_kuZwFL2ToSXnzvLV31kNs',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'havefun-9b5b2.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID ?? 'havefun-9b5b2',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'havefun-9b5b2.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '708830534197',
  appId: process.env.VITE_FIREBASE_APP_ID ?? '1:708830534197:web:7479960328418630c52f7c',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadImages() {
  const file = resolve(__dirname, 'generated/image-data.json');
  try {
    const json = JSON.parse(await readFile(file, 'utf8'));
    return json;
  } catch {
    console.error(`\n✗ Missing ${file}\n  Run \`npm run images:build\` first.\n`);
    process.exit(1);
  }
}

const img = (images, key) => {
  const entry = images[key];
  if (!entry) {
    console.warn(`  ⚠ image key "${key}" not found in image-data.json`);
    return '';
  }
  return entry.dataUri;
};

async function seedCollection(images, name, items, mapFn) {
  const batch = writeBatch(db);
  for (const item of items) {
    batch.set(doc(db, name, item.id), mapFn(item, images));
  }
  await batch.commit();
  console.log(`✓ ${name.padEnd(16)} ${items.length} docs`);
}

async function main() {
  const images = await loadImages();
  console.log(`Seeding project "${firebaseConfig.projectId}"...\n`);

  // --- settings (single docs) ---
  await setDoc(doc(db, 'settings', 'site'), {
    ...content.site,
    logo: img(images, 'logo'),
    banner: img(images, 'banner'),
    aboutImage: img(images, 'about'),
    updatedAt: Date.now(),
  });
  await setDoc(doc(db, 'settings', 'pricing'), { ...content.pricing, updatedAt: Date.now() });
  await setDoc(doc(db, 'settings', 'cafe'), { ...content.cafe, updatedAt: Date.now() });
  console.log('✓ settings/site, settings/pricing, settings/cafe');

  // --- content collections ---
  await seedCollection(images, 'attractions', content.attractions, (a, im) => ({
    title: a.title, description: a.description, image: img(im, a.imageKey), order: a.order,
  }));
  await seedCollection(images, 'safetyFeatures', content.safetyFeatures, (s, im) => ({
    title: s.title, description: s.description, icon: img(im, s.imageKey), order: s.order,
  }));
  await seedCollection(images, 'faqs', content.faqs, (f) => ({
    question: f.question, answer: f.answer, order: f.order,
  }));
  await seedCollection(images, 'gallery', content.gallery, (g, im) => ({
    title: g.title, subtitle: g.subtitle, image: img(im, g.imageKey), order: g.order, type: 'image',
  }));
  await seedCollection(images, 'cafeImages', content.cafeImages, (c, im) => ({
    alt: c.alt, image: img(im, c.imageKey), order: c.order,
  }));
  await seedCollection(images, 'waiverImages', content.waiverImages, (w, im) => ({
    image: img(im, w.imageKey), order: w.order,
  }));

  console.log('\n✅ Seed complete.');
  process.exit(0);
}

main().catch((e) => {
  console.error('\n✗ Seed failed:', e.message);
  process.exit(1);
});
