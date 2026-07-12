# RevLine — Hybrid Sports Community Website

Modern community site + admin dashboard for **RevLine**: weekend sessions (running,
football, turf, trekking, swimming), online registrations with a live spots counter
and waitlist, per-event photo galleries, crew page, testimonials, terms — and every
registration mirrored automatically to Google Sheets.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 + shadcn/ui ·
Supabase (Postgres, Auth, Storage) · Motion (Framer) animations.

---

## 1. One-time setup (~15 minutes)

### a) Supabase (database + admin login + photo storage)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the dashboard, open **SQL Editor** and run, in order:
   - `supabase/schema.sql` (tables, security policies, storage bucket)
   - `supabase/seed.sql` (starter events, crew, testimonials, terms — all editable later in the admin panel)
3. **Authentication → Users → Add user**: create YOUR admin account
   (email + password). This is what you'll use to log in at `/admin`.
4. **Authentication → Sign In / Up**: disable "Allow new users to sign up"
   (so nobody else can create an admin account).
5. **Project Settings → API**: copy the *Project URL*, *anon public* key and
   *service_role* key.

### b) Google Sheets sync

1. Create a Google Sheet named **RevLine Registrations**.
2. Extensions → **Apps Script**, paste the contents of `google-sheets/apps-script.js`.
3. **Deploy → New deployment → Web app**, execute as *Me*, access: *Anyone*.
4. Copy the Web app URL (ends in `/exec`).

Every registration then lands in an **All Registrations** tab plus a per-event tab,
automatically.

### c) Environment variables

```bash
cp .env.example .env.local
```

Fill in the values you copied above. `SHEETS_WEBHOOK_URL` is optional — without it
everything still works, registrations just stay in Supabase only.

## 2. Run it

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (log in with the Supabase user you created)

> **Note:** with missing/placeholder env values the site still renders (empty
> states) but pages take a few seconds while the failed database calls time out.
> With real credentials it's fast.

## 3. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it at [vercel.com](https://vercel.com) — it auto-detects Next.js.
3. Add the same env vars from `.env.local` in **Project → Settings →
   Environment Variables**, and set `NEXT_PUBLIC_SITE_URL` to your live URL.
4. Deploy. Point your domain at it when ready.

## Day-to-day: how you run the community

| You want to… | Where |
|---|---|
| Announce this weekend's session | Admin → Events → New event |
| Ask custom questions on the form | The "Registration questions" builder in the event form |
| Cap the session + auto-waitlist | Set "Capacity" on the event |
| See who registered / export CSV | Admin → Registrations |
| Close registrations early | Untick "Registrations open" on the event |
| Mark it done + upload photos | Set status to "Completed", then upload in "Session photos" |
| Update crew / testimonials / terms / links | Admin → Crew / Testimonials / Settings |

Members: every event page has **Register Now** → 2-step form (details → your
questions) → instant confirmation with the event's WhatsApp group link.

## Project layout

```
src/
├── app/
│   ├── (marketing)/      # public: home, events, register, crew, terms
│   ├── admin/            # login + protected dashboard
│   ├── sitemap.ts        # SEO
│   └── robots.ts
├── components/           # ui (shadcn) · shared · home · events · admin
├── lib/                  # supabase clients, env validation, formatting
├── server/               # queries + server actions (registration → DB + Sheets)
└── types/                # shared types + zod schemas
supabase/                 # schema.sql + seed.sql
google-sheets/            # Apps Script webhook
```

Security notes: admin routes are guarded by middleware (`src/proxy.ts`) **and** a
server-side auth check; the database blocks anonymous writes via RLS;
registrations are inserted server-side with the service-role key; the
service-role key and Sheets URL never reach the browser.
