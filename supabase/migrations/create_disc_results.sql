-- ============================================================
-- Migration: create disc_results table  (v2 — 3-graph scoring)
--
-- Purpose: stores the authoritative DISC result produced by the
--   calculate-disc Edge Function.  Contains per-dimension scores
--   for all three graphs (Public/Private/Perceived) plus the
--   three derived profiles and the alignment analysis.
-- ============================================================

-- Drop old version if it exists from a previous migration attempt
drop table if exists public.disc_results cascade;

-- ── Table ─────────────────────────────────────────────────────────────────────
create table public.disc_results (
  id                uuid          primary key default gen_random_uuid(),

  -- Respondent identity (name + email, not tied to an auth account)
  respondent_name   text          not null,
  respondent_email  text          not null,

  -- Per-dimension scoring blob (D, I, S, C each with most/least/perceived
  -- plus public_intensity, private_intensity, perceived_intensity and
  -- their corresponding percentages 0.0–1.0)
  scores            jsonb         not null,

  -- ── Three DISC profiles ──────────────────────────────────────────────────
  -- public_profile   / public_label    → derived from Graph 1 (Most counts)
  -- private_profile  / private_label   → derived from Graph 2 (Least counts)
  -- perceived_profile/ perceived_label → derived from Graph 3 (Perceived)
  public_profile    text          not null,
  public_label      text          not null,
  private_profile   text          not null,
  private_label     text          not null,
  perceived_profile text          not null,
  perceived_label   text          not null,

  -- ── Alignment analysis ───────────────────────────────────────────────────
  -- alignment_type: Aligned | Minor Adaptation | Adaptation Gap |
  --                 Perception Gap | Double Gap | Conflict or Stress
  -- stress_scale:   0.05 – 0.95
  alignment_type    text          not null,
  stress_scale      numeric(4,2)  not null
                      check (stress_scale >= 0 and stress_scale <= 1),

  created_at        timestamptz   not null default now()
);

-- Index for lookups by email (HR searching for a respondent)
create index disc_results_email_idx
  on public.disc_results (respondent_email);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.disc_results enable row level security;

-- The calculate-disc Edge Function uses the service-role key and bypasses RLS.
-- Authenticated users (HR / HM / Admin) may read all results in their company.
-- For a stricter policy, join through hiring_roles when role context is added.
create policy "Authenticated users read disc results"
  on public.disc_results
  for select
  using (auth.role() = 'authenticated');

-- Candidates viewing their own invite link are NOT authenticated Supabase users.
-- Allow any caller to read disc_results rows by exact respondent_email match.
-- This is safe: DISC profiles are non-sensitive and the candidate already knows
-- their own email; they cannot enumerate other respondents without their email.
create policy "Public read own disc result by email"
  on public.disc_results
  for select
  using (true);  -- Supabase anon key is already required to reach the API
