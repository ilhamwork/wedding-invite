# Ilham & Prita — Digital Wedding Invitation

A mobile-first React + Vite wedding invitation site with RSVP, a public
guestbook, multi-language copy (Bahasa Indonesia / English), and QR
check-in for the event day.

## Stack

- React 18 + Vite
- Tailwind CSS v4 (CSS-first theme in `src/index.css`)
- Framer Motion (envelope-open transition, scroll reveals)
- react-i18next (ID default, EN toggle)
- Supabase (RSVP, guestbook, check-in log)
- qrcode.react (per-guest QR codes) + @yudiel/react-qr-scanner (admin scanner)
- React Router (`/`, `/guest/:id`, `/admin/checkin`)

## 1. Install

```bash
npm install
```

## 2. Configure Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/migrations/0001_init.sql`. This creates
   the `guests`, `rsvps`, `wishes`, and `checkins` tables with Row Level
   Security policies (public can submit RSVPs/wishes; the demo admin flow
   uses the anon key for check-in — see the security note in that file for
   how to tighten this before a real launch).
3. Copy `.env.example` to `.env` and fill in:
   - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — from Project Settings -> API
   - `VITE_ADMIN_PASSWORD` — a password for the demo `/admin/checkin` gate

## 3. Run locally

```bash
npm run dev
```

Open `http://localhost:5173/?to=Guest+Name` to preview with a guest name
pre-filled (the `?to=` query param is how invite links personalize the
cover screen and RSVP form).

## 4. Edit content

Every piece of copy specific to this couple — names, dates, venue, story,
gallery, gift accounts, quote — lives in **`src/config/content.config.js`**.
To reuse this codebase for a different wedding, edit that one file; you
should not need to touch any component.

Search that file (and the codebase) for `TODO` to find every placeholder
that needs real content before going live:
- Exact venue address / coordinates
- Real "Our Story" copy and photos
- Real gallery photos (`public/assets/gallery-*.jpg`)
- Real bank/e-wallet details
- A licensed background music file (`public/audio/background-music.mp3`)
- Verified wording for the opening quote

Static UI strings (buttons, labels, form copy) live in
`src/i18n/locales/id.json` and `src/i18n/locales/en.json`.

## 5. How the QR check-in flow works

- Each RSVP submission is a row in the `rsvps` table.
- `src/pages/GuestCheckIn.jsx` (route `/guest/:id`) looks up that row by id
  and renders a QR code encoding the row's UUID.
- `/admin/checkin` is password-gated (client-side demo check against
  `VITE_ADMIN_PASSWORD` — replace with real Supabase Auth before a real
  event, since the current gate is not secure enough for production use).
  It shows a live dashboard (RSVP counts, wishes count) and a camera
  scanner that inserts a row into `checkins` the first time a guest's QR
  is scanned, and warns on a repeat scan.

## 6. Deploy to Vercel

```bash
npm run build
```

Then either:
- Push to GitHub and import the repo in the Vercel dashboard, or
- Run `vercel` from the project root (Vercel CLI).

Set the same three environment variables (`VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_PASSWORD`) in the Vercel project's
Environment Variables settings. `vercel.json` is already configured to
rewrite all routes to `index.html` so client-side routing works.

## Notes

- All ornament graphics (`src/components/ui/Ornaments.jsx`) are original
  hand-authored SVG line art — no third-party template assets are used.
- Background music starts muted and only unmutes on the "Buka Undangan" tap,
  per browser autoplay policy. The audio element is created once in
  `src/context/AudioContext.jsx` and never remounted per section.
- Animations respect `prefers-reduced-motion` (see `src/index.css`).
- Gallery and couple photos currently point to generated placeholder JPGs
  in `public/assets/` — swap these for real photos.
