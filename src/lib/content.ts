/**
 * Firestore content layer for HavFun.
 * Typed fetchers for the static content seeded by scripts/seed-firestore.mjs.
 * Images come back as base64 data URIs stored inline on each document.
 */
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';

export interface SiteSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  phoneE164: string;
  email: string;
  hours: string;
  instagram: string;
  website: string;
  mapsEmbed: string;
  weightLimitKg: number;
  razorpayLink: string;
  logo: string;
  banner: string;
  aboutImage: string;
}

export interface PricingConfig {
  bookingLink: string;
  basic: Record<30 | 60, number>;
  offers: { weekdaySpecial: number; offPeakDiscount: number };
  gripSocks: number;
  gst: number;
  hours: { weekdayOfferStart: number; weekdayOfferEnd: number; offPeakStartDay: number };
}

export interface CafeContent {
  heading: string;
  intro: string;
  categories: { title: string; desc: string }[];
}

export interface Attraction { id: string; title: string; description: string; image: string; order: number; }
export interface SafetyFeature { id: string; title: string; description: string; icon: string; order: number; }
export interface Faq { id: string; question: string; answer: string; order: number; }
export interface GalleryItem { id: string; title: string; subtitle: string; image: string; order: number; type: string; }
export interface CafeImage { id: string; alt: string; image: string; order: number; }
export interface WaiverImage { id: string; image: string; order: number; }

async function getSettingsDoc<T>(id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, 'settings', id));
  return snap.exists() ? (snap.data() as T) : null;
}

async function getOrderedCollection<T>(name: string): Promise<T[]> {
  const snap = await getDocs(query(collection(db, name), orderBy('order')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

export const fetchSite = () => getSettingsDoc<SiteSettings>('site');
export const fetchPricing = () => getSettingsDoc<PricingConfig>('pricing');
export const fetchCafe = () => getSettingsDoc<CafeContent>('cafe');
export const fetchAttractions = () => getOrderedCollection<Attraction>('attractions');
export const fetchSafetyFeatures = () => getOrderedCollection<SafetyFeature>('safetyFeatures');
export const fetchFaqs = () => getOrderedCollection<Faq>('faqs');
export const fetchGallery = () => getOrderedCollection<GalleryItem>('gallery');
export const fetchCafeImages = () => getOrderedCollection<CafeImage>('cafeImages');
export const fetchWaiverImages = () => getOrderedCollection<WaiverImage>('waiverImages');
