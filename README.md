# Krazy Music Studio — Full-Stack Website

Stage 1–5 of the roadmap: animated marketing site + working booking system with real
email notifications. Stages 6–9 (admin auth, gallery/portfolio management, deployment
hardening) are outlined at the bottom so you can keep building the same way.

## What's included right now

- Next.js 14 (App Router) + TypeScript + Tailwind
- Framer Motion animations: hero load sequence, scroll reveals, hover micro-interactions,
  animated waveform, animated counters, mobile menu transitions — all respecting
  `prefers-reduced-motion`
- Custom audio player (no autoplay), lightbox gallery, testimonials
- Prisma schema for Users, Services, Bookings, Portfolio, Gallery, Reviews, Contact messages
- `/api/bookings` — validates with Zod, re-checks the service exists, blocks double-booking
  server-side, saves to Postgres **before** sending email so a failed send never loses the
  booking, then emails both the studio owner and the customer via Resend
- `/api/contact` — same pattern for the contact form
- `.env.example`, `.gitignore`, seed script

---

## Step 1 — Install prerequisites

You'll need on your machine:

1. **Node.js 18.18+** — check with `node -v`
2. **A PostgreSQL database** — easiest options for a student project:
   - [Neon](https://neon.tech) (free tier, serverless Postgres)
   - [Supabase](https://supabase.com) (free tier)
   - Or a local Postgres via `brew install postgresql` / `apt install postgresql`
3. **A Resend account** — [resend.com](https://resend.com), free tier gives you 100
   emails/day and a sandbox sender (`onboarding@resend.dev`) you can use immediately
   without a custom domain.

## Step 2 — Install dependencies

```bash
cd krazy-music-studio
npm install
```

## Step 3 — Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```
DATABASE_URL="postgresql://..."       # from Neon/Supabase/local Postgres
RESEND_API_KEY="re_..."               # from resend.com dashboard
STUDIO_OWNER_EMAIL="you@example.com"  # where booking alerts land
EMAIL_FROM="Krazy Music Studio <onboarding@resend.dev>"  # sandbox sender works immediately
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## Step 4 — Set up the database

```bash
npx prisma migrate dev --name init   # creates tables from prisma/schema.prisma
npx prisma db seed                   # populates the 6 services so booking IDs are real
```

Optional: `npx prisma studio` opens a GUI at localhost:5555 to browse your data.

## Step 5 — Run it locally

```bash
npm run dev
```

Visit `http://localhost:3000`. Try the booking form at `/booking` — submit it and check:

- The studio owner inbox (`STUDIO_OWNER_EMAIL`) for the new-appointment email
- The customer email inbox for the confirmation
- `npx prisma studio` → `Booking` table for the saved row

If `RESEND_API_KEY` isn't set, the booking still saves — you'll just see a console
warning instead of emails. This is intentional (Step 17 of the original spec: never
lose a booking because of an email failure).

---

## Step 6 — Testing checklist

Manual pass before you consider a feature "done":

**Booking form**
- [ ] Submit with all fields valid → success screen, two emails arrive
- [ ] Submit with an invalid email → inline error, no request sent
- [ ] Submit with a past date → server rejects with 400
- [ ] Submit the same service/date/time twice → second one gets 409 "slot taken"
- [ ] Kill your dev server's network tab (throttle to offline) → see the network-error
      message, not a silent failure

**Responsive**
- [ ] Resize to 375px, 768px, 1440px — nav collapses to the full-screen mobile menu,
      grids reflow to single/double column, booking form stays usable one-handed

**Accessibility**
- [ ] Tab through the whole homepage — every interactive element gets a visible focus ring
- [ ] Enable "reduce motion" in your OS settings → animations should stop, not just slow

**Copy**
- [ ] Replace every `[STUDIO ADDRESS]`, `[STUDIO PHONE]`, `[STUDIO EMAIL]`,
      `[STUDIO STORY]` placeholder in `components/Footer.tsx` and `components/About.tsx`
      with real studio info before launch — don't ship placeholders live.

Once you're ready for automated tests, add Playwright (`npm install -D @playwright/test`)
and write one end-to-end spec per checklist item above — happy to generate those specs
in a follow-up once the manual pass is clean.

---

## Step 7 — Deploy

**Frontend + API routes → Vercel**

```bash
npm install -g vercel
vercel
```

In the Vercel dashboard → Project → Settings → Environment Variables, add every key
from `.env` (Vercel never reads your local `.env` file). Redeploy after adding them.

**Database** — if you used Neon/Supabase, it's already hosted; just make sure the
`DATABASE_URL` you put in Vercel is the *pooled* connection string (Neon/Supabase both
give you a separate pooled URL for serverless environments — use that one, not the
direct one, to avoid connection exhaustion).

**Run migrations against production** (one-time, from your machine):

```bash
DATABASE_URL="<production-url>" npx prisma migrate deploy
DATABASE_URL="<production-url>" npx prisma db seed
```

**Domain** — point your domain's DNS at Vercel (Project → Settings → Domains gives you
the exact records). Once your domain is verified, switch `EMAIL_FROM` in Resend to send
from `notifications@yourdomain.com` instead of the sandbox address — Resend walks you
through domain verification (SPF/DKIM records) in their dashboard.

---

## What's next (Stages 6–9 — not built yet)

Build these the same incremental way — one stage, tested, before the next:

1. **Admin auth** — NextAuth or a hand-rolled session with Argon2id password hashing,
   `/admin/login`, a middleware guard on every `/admin/*` route and `/api/admin/*` route
2. **Admin dashboard** — booking list with status filters, confirm/cancel/complete
   actions that also email the customer on status change
3. **Content management** — CRUD for services, portfolio tracks, gallery images
   (Cloudinary or S3 for the actual media files — never store binary blobs in Postgres)
4. **Real assets** — replace the emoji placeholders in Portfolio/Gallery with real
   studio photos and audio files
5. **SEO polish** — sitemap.xml, robots.txt, Open Graph image, structured data
6. **Rate limiting** on `/api/bookings` and `/api/contact` to prevent spam submissions

Say the word for any of these and I'll build it the same way — working code, one file
at a time, with a test pass before moving on.
