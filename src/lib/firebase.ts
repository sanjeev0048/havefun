import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

/**
 * Firebase configuration for HavFun (project: havefun-9b5b2).
 *
 * Web API keys are NOT secrets — they are meant to ship in the client bundle.
 * Access is protected by Firestore Security Rules, not by hiding this key.
 * Values are read from Vite env vars when present (e.g. on Vercel), with the
 * project defaults as a fallback so local dev works out of the box.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyAscXPT1xD_j_kuZwFL2ToSXnzvLV31kNs',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'havefun-9b5b2.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'havefun-9b5b2',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'havefun-9b5b2.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '708830534197',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:708830534197:web:7479960328418630c52f7c',
};

// Avoid re-initializing during Vite HMR / multiple imports.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
