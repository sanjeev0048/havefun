/**
 * Client-side writes for visitor submissions (contact, bookings, waivers).
 * These replace the old Express/Nodemailer endpoints — data is now persisted in
 * Firestore. Security Rules allow create-only (no public read) on these
 * collections; see firestore.rules.
 */
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
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

export async function submitContactMessage(input: ContactInput) {
  return addDoc(collection(db, 'contactMessages'), {
    ...input,
    phone: input.phone ?? '',
    status: 'new',
    createdAt: serverTimestamp(),
  });
}

export async function submitBooking(input: BookingInput) {
  return addDoc(collection(db, 'bookings'), {
    ...input,
    status: 'confirmed',
    createdAt: serverTimestamp(),
  });
}

export async function submitWaiver(input: WaiverInput) {
  return addDoc(collection(db, 'waivers'), {
    ...input,
    status: 'signed',
    createdAt: serverTimestamp(),
  });
}
