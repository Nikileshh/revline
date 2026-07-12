-- ============================================================
-- RevLine — database schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL).
-- ============================================================

-- EVENTS ------------------------------------------------------
create table if not exists public.events (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  sport             text not null default 'other'
                    check (sport in ('running','football','trekking','swimming','turf','cycling','workout','other')),
  description       text not null default '',
  rules             text,
  venue             text not null default '',
  venue_map_url     text,
  event_date        timestamptz not null,
  capacity          integer check (capacity is null or capacity > 0),
  price             numeric(10,2),
  whatsapp_group_url text,
  poster_url        text,
  status            text not null default 'upcoming'
                    check (status in ('upcoming','completed','cancelled')),
  drive_link        text,
  registration_open boolean not null default true,
  questions         jsonb not null default '[]'::jsonb,
  created_at        timestamptz not null default now()
);

-- REGISTRATIONS ----------------------------------------------
create table if not exists public.registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events(id) on delete cascade,
  name       text not null,
  age        integer not null,
  phone      text not null,
  email      text,
  answers    jsonb not null default '{}'::jsonb,
  status     text not null default 'confirmed' check (status in ('confirmed','waitlist')),
  created_at timestamptz not null default now(),
  unique (event_id, phone)
);

create index if not exists registrations_event_idx on public.registrations(event_id);

-- CREW --------------------------------------------------------
create table if not exists public.crew_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text not null default 'Crew',
  bio           text,
  photo_url     text,
  instagram_url text,
  sort_order    integer not null default 0
);

-- TESTIMONIALS ------------------------------------------------
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  label      text,
  quote      text not null,
  photo_url  text,
  sort_order integer not null default 0,
  published  boolean not null default true
);

-- EVENT PHOTOS ------------------------------------------------
create table if not exists public.event_photos (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events(id) on delete cascade,
  url        text not null,
  caption    text,
  sort_order integer not null default 0
);

create index if not exists event_photos_event_idx on public.event_photos(event_id);

-- SITE SETTINGS (single row) ---------------------------------
create table if not exists public.site_settings (
  id                     boolean primary key default true check (id), -- enforces one row
  instagram_url          text not null default 'https://www.instagram.com/revline.club',
  whatsapp_community_url text not null default '',
  contact_email          text not null default '',
  terms_md               text not null default ''
);

insert into public.site_settings (id) values (true) on conflict do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- Public visitors: read-only. Writes happen through the site's
-- server (service role) or a logged-in admin.
-- ============================================================
alter table public.events        enable row level security;
alter table public.registrations enable row level security;
alter table public.crew_members  enable row level security;
alter table public.testimonials  enable row level security;
alter table public.event_photos  enable row level security;
alter table public.site_settings enable row level security;

-- Public read access to site content
create policy "public read events"        on public.events        for select using (true);
create policy "public read crew"          on public.crew_members  for select using (true);
create policy "public read testimonials"  on public.testimonials  for select using (published);
create policy "public read event photos"  on public.event_photos  for select using (true);
create policy "public read settings"      on public.site_settings for select using (true);

-- Admin (any authenticated user — keep Supabase signups disabled!)
create policy "admin all events"        on public.events        for all to authenticated using (true) with check (true);
create policy "admin all registrations" on public.registrations for all to authenticated using (true) with check (true);
create policy "admin all crew"          on public.crew_members  for all to authenticated using (true) with check (true);
create policy "admin all testimonials"  on public.testimonials  for all to authenticated using (true) with check (true);
create policy "admin all photos"        on public.event_photos  for all to authenticated using (true) with check (true);
create policy "admin update settings"   on public.site_settings for update to authenticated using (true) with check (true);

-- Registrations are inserted by the server with the service-role key,
-- which bypasses RLS — no anon insert policy on purpose.

-- ============================================================
-- STORAGE — public bucket for posters, crew & session photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "admin write media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

create policy "admin update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media');

create policy "admin delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');
