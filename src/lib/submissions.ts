/**
 * Client-side writes for visitor submissions (contact, bookings, waivers).
 * These replace the old Express/Nodemailer endpoints — data is now persisted in
 * Firestore. Security Rules allow create-only (no public read) on these
 * collections; see firestore.rules.
 */
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface BookingInput {
  duration: 30 | 60;
  date: string; // ISO date (yyyy-mm-dd)
  time: string;
  bookingId: string;
}

export interface WaiverParticipant {
  name: string;
  dob: string;
}

export interface WaiverInput {
  name: string;
  email: string;
  phone: string;
  emergencyContact?: string;
  userType: 'sovereign' | 'guardian';
  participants: WaiverParticipant[];
  duration: 30 | 60;
  needsSocks: boolean;
  visitDate: string; // ISO
  visitTime: string;
  acknowledged: boolean;
  liabilityAccepted: boolean;
  medicalConsent: boolean;
  signed: boolean;
  signature: string | null; // PNG data URL
  pricing: { subtotal: number; gst: number; total: number };
}

/**
 * Best-effort email notification via the Vercel function (/api/notify).
 * Never throws — a failed/absent notifier must not block the user's submission.
 * In local dev there's no /api route, so this simply no-ops.
 */
async function notify(type: 'contact' | 'booking' | 'waiver', data: Record<string, unknown>) {
  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });
  } catch {
    /* ignore — notifications are non-critical */
  }
}

export async function submitContactMessage(input: ContactInput) {
  const ref = await addDoc(collection(db, 'contactMessages'), {
    ...input,
    phone: input.phone ?? '',
    status: 'new',
    createdAt: serverTimestamp(),
  });
  void notify('contact', { ...input });
  return ref;
}

export async function submitBooking(input: BookingInput) {
  const ref = await addDoc(collection(db, 'bookings'), {
    ...input,
    status: 'confirmed',
    createdAt: serverTimestamp(),
  });
  void notify('booking', { ...input });
  return ref;
}

export async function submitWaiver(input: WaiverInput) {
  const ref = await addDoc(collection(db, 'waivers'), {
    ...input,
    status: 'signed',
    createdAt: serverTimestamp(),
  });
  // Omit the base64 signature from the email payload — not needed and large.
  const { signature, ...summary } = input;
  void notify('waiver', summary);
  return ref;
}

// ---- Admin reads (allowlisted users only; enforced by Firestore rules) ----

export interface WithMeta {
  id: string;
  status?: string;
  createdAt?: { seconds: number; nanoseconds: number } | null;
}

async function listByCreatedAt<T>(name: string): Promise<T[]> {
  const snap = await getDocs(query(collection(db, name), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

export const listContactMessages = () =>
  listByCreatedAt<ContactInput & WithMeta>('contactMessages');
export const listBookings = () => listByCreatedAt<BookingInput & WithMeta>('bookings');
export const listWaivers = () => listByCreatedAt<WaiverInput & WithMeta>('waivers');
