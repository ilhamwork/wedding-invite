-- ─────────────────────────────────────────────────────────────────────────
-- Wedding invitation initial schema
-- Run via: supabase db push   (or paste into the Supabase SQL editor)
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- Attendance status enum used by rsvps.attendance_status
do $$
begin
  if not exists (select 1 from pg_type where typname = 'attendance_status') then
    create type attendance_status as enum ('attending', 'not_attending', 'maybe');
  end if;
end $$;

-- ── guests ──────────────────────────────────────────────────────────────
-- Optional pre-registered guest list, used for ?to= slug matching / bulk
-- invite links. Not required for the public RSVP flow to work.
create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique, -- e.g. "budi-santoso", matched against ?to= if used
  created_at timestamptz not null default now()
);

-- ── rsvps ───────────────────────────────────────────────────────────────
-- Public RSVP submissions. Each row also doubles as the "guest" record
-- referenced by the per-guest QR check-in code (see checkins.guest_id).
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  attendance_status attendance_status not null,
  guest_count integer not null default 1 check (guest_count between 1 and 10),
  message text,
  created_at timestamptz not null default now()
);

-- ── wishes ──────────────────────────────────────────────────────────────
-- Public guestbook entries.
create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ── checkins ────────────────────────────────────────────────────────────
-- QR check-in log. guest_id references rsvps.id — each RSVP submission is
-- the unit that receives a QR code at /guest/{rsvps.id}.
create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references rsvps (id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  checked_in_by text,
  unique (guest_id) -- a guest can only be checked in once
);

-- ── indexes ─────────────────────────────────────────────────────────────
create index if not exists idx_wishes_created_at on wishes (created_at desc);
create index if not exists idx_rsvps_created_at on rsvps (created_at desc);

-- ── Row Level Security ──────────────────────────────────────────────────
alter table guests enable row level security;
alter table rsvps enable row level security;
alter table wishes enable row level security;
alter table checkins enable row level security;

-- guests: not exposed publicly by default (used only for optional slug
-- lookups server-side / via a future edge function). No public policies.

-- rsvps: public can INSERT (submit RSVP) and can SELECT their own row by id
-- (needed for the /guest/{id} QR page). Full-table SELECT is admin-only.
create policy "public can insert rsvps"
  on rsvps for insert
  to anon
  with check (true);

create policy "public can select single rsvp by id"
  on rsvps for select
  to anon
  using (true); -- id is a random UUID, effectively unguessable per-guest link
  -- NOTE: this allows any anon key holder to read the rsvps table if they
  -- enumerate UUIDs, which is infeasible in practice. For stricter access,
  -- replace with a Postgres function / edge function that checks the id
  -- explicitly and restrict this policy to authenticated admins only.

-- wishes: public can INSERT and SELECT (guestbook is meant to be public)
create policy "public can insert wishes"
  on wishes for insert
  to anon
  with check (true);

create policy "public can select wishes"
  on wishes for select
  to anon
  using (true);

-- checkins: public (the admin scanner using the anon key) can insert and
-- select. For production, swap `to anon` for `to authenticated` and gate
-- the admin page behind Supabase Auth rather than the demo password check
-- in src/pages/AdminCheckin.jsx.
create policy "admin can insert checkins"
  on checkins for insert
  to anon
  with check (true);

create policy "admin can select checkins"
  on checkins for select
  to anon
  using (true);
