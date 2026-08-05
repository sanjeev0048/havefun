/**
 * Admin CMS writes for site content. Guarded by Firestore rules (isAdmin()).
 * All content collections are seeded by scripts/seed-firestore.mjs; these let an
 * admin create/update/delete the same documents from the /admin UI.
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export interface ContentRow {
  id: string;
  [key: string]: unknown;
}

/** List all docs in a content collection, ordered by `order`. */
export async function listContentDocs(collectionName: string): Promise<ContentRow[]> {
  const snap = await getDocs(query(collection(db, collectionName), orderBy('order')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Create (no id) or update (with id) a content document. Returns the doc id. */
export async function upsertContentDoc(
  collectionName: string,
  id: string | null,
  data: Record<string, unknown>
): Promise<string> {
  if (id) {
    await setDoc(doc(db, collectionName, id), data, { merge: true });
    return id;
  }
  const ref = await addDoc(collection(db, collectionName), data);
  return ref.id;
}

export async function deleteContentDoc(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}

/** Write a single settings document (settings/site, settings/pricing, settings/cafe). */
export async function saveSettings(docId: string, data: Record<string, unknown>): Promise<void> {
  await setDoc(doc(db, 'settings', docId), { ...data, updatedAt: Date.now() }, { merge: true });
}
