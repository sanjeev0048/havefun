# HavFun — Firebase Setup & Runbook

Backend migrated from Express/Nodemailer to **Firebase** (Firestore), frontend deploys to **Vercel**.
Project: `havefun-9b5b2`. See [DATA_INVENTORY.md](./DATA_INVENTORY.md) for the original data catalogue.

## Architecture

| Concern | Implementation |
|---------|----------------|
| Content (site, pricing, attractions, safety, faqs, gallery, cafe, waiver images) | Firestore, read via TanStack Query hooks (`src/hooks/useContent.ts`) |
| Images | Compressed to ≤600 KB and stored **inline as base64** on each Firestore doc (one image per doc — a Firestore doc is capped at 1 MB) |
| Videos | Still bundled local assets (`src/assets/*.mp4`). Too large to inline → **Firebase Storage** is the follow-up (see below) |
| Contact / Booking / Waiver submissions | Written to Firestore via `src/lib/submissions.ts` (was `localhost:5000`) |
| Signature | Captured as PNG data URL by `SignaturePad`, stored inline on the waiver doc |

## Firestore collections

```
settings/site          settings/pricing       settings/cafe
attractions/*          safetyFeatures/*       faqs/*
gallery/*              cafeImages/*           waiverImages/*
contactMessages/*      bookings/*             waivers/*   (visitor submissions)
```

## First-time setup

1. **Create the Firestore database** in the Firebase console (Native mode) if not already done.
2. **Config**: web config lives in `src/lib/firebase.ts` (env-overridable). Copy `.env.example` → `.env` for local dev. The web API key is not a secret — Security Rules protect access.
3. **Build image data** (needs Node ≥ 20.9 for `sharp`; this repo's default Node 18 will fail):
   ```bash
   nvm use 22   # or any Node >= 20.9
   npm run images:build      # downloads + compresses → scripts/generated/image-data.json
   ```
4. **Seed Firestore** (runs on any Node):
   ```bash
   npm run seed
   ```
   ⚠️ The seed writes content via the Web SDK, which the production rules **block**. Seed while the
   database is in **test mode**, or temporarily set the content collections to `allow write: if true`
   in the console, then restore the locked rules.
5. **Deploy security rules** (`firestore.rules`, `storage.rules`) via the console or Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules,storage
   ```

## Deploy to Vercel

- `vercel.json` sets framework=vite, build=`npm run build`, output=`dist`, and an SPA rewrite so
  `/booking` and `/waiver` resolve on refresh.
- Set the `VITE_FIREBASE_*` env vars in Vercel (values in `.env.example`) — optional, since
  `firebase.ts` falls back to the project defaults.

## Editing content later

Change a doc in the Firestore console (or re-run `npm run seed` after editing `scripts/seed-content.mjs`).
To replace an image, regenerate base64 with `npm run images:build` (update `scripts/images-manifest.mjs`
first) and re-seed. The site picks up changes within the 1-hour query cache (`staleTime`).

## Admin page (`/admin`)

A login-gated dashboard at `/admin` lists bookings, waivers (with signature image), and
contact messages. Access is restricted to an **email allowlist**.

**One-time setup:**
1. In the Firebase console → **Authentication** → enable the **Email/Password** provider.
2. **Authentication → Users → Add user** — create the admin account (e.g.
   `havfuntrampolinepark@gmail.com`) with a password. (There is no public signup.)
3. Make sure that email is in **both** places (already set for the business email):
   - `src/lib/admin.ts` → `ADMIN_EMAILS` (controls UI access)
   - `firestore.rules` → `isAdmin()` (controls data access — the real boundary)
4. Deploy the updated `firestore.rules`.

Then visit `/admin`, sign in, and review submissions. To add another admin, add their email
to both lists and create their user in the console.

### Content editing (CMS)

`/admin` has two views: **Submissions** and **Site Content**. Under *Site Content* an admin can
full-CRUD everything the site renders:
- **Settings**: Site Info (name, contact, hours, logo/banner/about images, maps, Razorpay link),
  Pricing (all prices, offers, GST, hours), Cafe (heading, intro, categories).
- **Collections** (add/edit/delete): Attractions, Safety Features, FAQs, Gallery, Cafe Images.
  Waiver Images are edit-only (fixed section ids).

Image uploads are compressed in the browser (canvas) to ≤600 KB and stored inline as base64,
matching the seed pipeline. Saved changes invalidate the site's query cache, so the public site
reflects edits within the hour cache window (or immediately on next load).

Content writes are gated by `isAdmin()` in `firestore.rules` — deploy those rules for editing to work.
Note: because content is now `write: if isAdmin()`, re-running `npm run seed` (unauthenticated Web SDK)
requires test-mode rules, or switch the seed to the Admin SDK.

## Email notifications (Vercel `/api/notify`)

Replaces the old Express/Nodemailer server. A Vercel serverless function (`api/notify.ts`) emails the
business on every new contact message, booking, and waiver.

**How it works:** after a submission is saved, the site calls `/api/notify`. The function reads SMTP
settings from Firestore (`settings/smtp`, admin-only) using the Firebase Admin SDK and sends a
**fixed-recipient, templated** email (it can't be abused to send arbitrary mail).

**Setup:**
1. **Configure SMTP in the admin:** `/admin` → Site Content → **Email (SMTP)**. Enter host, port,
   username, password, from/to, and toggle **Enable**. (Gmail: use an *App Password*, host
   `smtp.gmail.com`, port 587.) The password is write-only in the UI — blank means "keep current".
2. **Give Vercel a service-account key** so the function can read the admin-only SMTP doc:
   - Firebase console → Project settings → **Service accounts** → *Generate new private key* → download JSON.
   - In Vercel → Settings → Environment Variables, add **`FIREBASE_SERVICE_ACCOUNT`** = the full JSON
     (single line). This is a **secret** — unlike the `VITE_FIREBASE_*` web config.
3. Deploy. Until both are set, `/api/notify` no-ops gracefully (submissions still save fine).

> Note: `/api/notify` only runs on Vercel. In local `npm run dev` there's no `/api`, so notifications
> are skipped (submissions still work).

## Follow-ups / known gaps
- **Videos** (`src/assets/*.mp4`, up to 7 MB) still bundle into the build. Move to Firebase Storage and
  reference by URL (`videos/` bucket rules already in `storage.rules`).
- **Booking slots are still mock** (`Math.random()` availability in `BookingAssistant.tsx`). Bookings are
  now persisted, but real capacity needs a `slots/{date}` model + a transactional write.
- **Old `server/` directory** (Express/Nodemailer) is no longer used by the frontend — keep for the email
  templates or remove once Cloud Functions replace it.
- **Admin view**: submissions are create-only/no public read. Build an authenticated admin page (or use
  the Firebase console) to review bookings/waivers.
```
