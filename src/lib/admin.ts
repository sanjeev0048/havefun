/**
 * Admin allowlist. Only these emails may sign in to /admin and read submissions
 * (bookings, waivers, contact messages).
 *
 * ⚠️ Keep this list in sync with the `isAdmin()` helper in firestore.rules — the
 * client list controls UI access; the rules list is what actually protects the
 * data server-side. Both must include an email for that admin to see anything.
 */
export const ADMIN_EMAILS = [
  'havfuntrampolinepark@gmail.com',
  // add more admin emails here
];

export const isAdminEmail = (email: string | null | undefined): boolean =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());
