import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Sends a notification email when a visitor submits a contact message, booking,
 * or waiver. SMTP settings are managed by an admin in /admin → Email (SMTP) and
 * stored in Firestore (settings/smtp, admin-only). This function reads them with
 * the Firebase Admin SDK and sends a fixed-recipient, templated email — it cannot
 * send arbitrary mail to arbitrary addresses.
 *
 * Env required (set in Vercel):
 *   FIREBASE_SERVICE_ACCOUNT  — service-account JSON (single line) for Admin SDK
 */

let app: App | undefined;
function getAdminApp(): App | null {
  if (app) return app;
  if (getApps().length) {
    app = getApps()[0];
    return app;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  const serviceAccount = JSON.parse(raw);
  app = initializeApp({ credential: cert(serviceAccount) });
  return app;
}

interface SmtpConfig {
  enabled?: boolean;
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  fromName?: string;
  fromEmail?: string;
  toEmail?: string;
}

const esc = (v: unknown) =>
  String(v ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));

function buildEmail(type: string, data: Record<string, unknown>): { subject: string; html: string } {
  if (type === 'contact') {
    return {
      subject: `New contact message from ${esc(data.name)}`,
      html: `<h3>New Contact Message</h3>
        <p><b>Name:</b> ${esc(data.name)}</p>
        <p><b>Email:</b> ${esc(data.email)}</p>
        <p><b>Phone:</b> ${esc(data.phone) || '—'}</p>
        <p><b>Message:</b><br>${esc(data.message)}</p>`,
    };
  }
  if (type === 'booking') {
    return {
      subject: `New booking ${esc(data.bookingId)} — ${esc(data.date)} ${esc(data.time)}`,
      html: `<h3>New Booking</h3>
        <p><b>Booking ID:</b> ${esc(data.bookingId)}</p>
        <p><b>Date:</b> ${esc(data.date)}</p>
        <p><b>Time:</b> ${esc(data.time)}</p>
        <p><b>Duration:</b> ${esc(data.duration)} min</p>`,
    };
  }
  // waiver
  const participants = Array.isArray(data.participants)
    ? (data.participants as { name: string; dob: string }[])
        .map((p) => `<li>${esc(p.name)} (DOB: ${esc(p.dob)})</li>`)
        .join('')
    : '';
  const pricing = (data.pricing as { total?: number }) ?? {};
  return {
    subject: `New waiver signed by ${esc(data.name)}`,
    html: `<h3>New Waiver & Booking</h3>
      <p><b>Signatory:</b> ${esc(data.name)}</p>
      <p><b>Email:</b> ${esc(data.email)}</p>
      <p><b>Phone:</b> ${esc(data.phone)}</p>
      <p><b>Visit:</b> ${esc(String(data.visitDate).slice(0, 10))} ${esc(data.visitTime)} (${esc(data.duration)} min)</p>
      <p><b>Participants:</b></p><ul>${participants}</ul>
      <p><b>Total:</b> ₹${esc(pricing.total)}</p>`,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { type, data } = (req.body ?? {}) as { type?: string; data?: Record<string, unknown> };
  if (!type || !data || !['contact', 'booking', 'waiver'].includes(type)) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }

  const adminApp = getAdminApp();
  if (!adminApp) {
    // Not configured for email — succeed quietly so the submission flow isn't blocked.
    res.status(200).json({ skipped: 'no-service-account' });
    return;
  }

  try {
    const snap = await getFirestore(adminApp).doc('settings/smtp').get();
    const cfg = (snap.data() ?? {}) as SmtpConfig;

    if (!cfg.enabled || !cfg.host || !cfg.user || !cfg.pass || !cfg.toEmail) {
      res.status(200).json({ skipped: 'smtp-not-configured' });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port || 587,
      secure: cfg.secure ?? (cfg.port === 465),
      auth: { user: cfg.user, pass: cfg.pass },
    });

    const { subject, html } = buildEmail(type, data);
    await transporter.sendMail({
      from: `"${cfg.fromName || 'HavFun'}" <${cfg.fromEmail || cfg.user}>`,
      to: cfg.toEmail,
      subject,
      html,
    });

    res.status(200).json({ sent: true });
  } catch (err) {
    console.error('notify error:', err);
    res.status(500).json({ error: 'send-failed' });
  }
}
