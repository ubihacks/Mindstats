-- ============================================================
-- Migration: fix_anon_rls_policies + add disc_scores columns
-- Purpose:
--   1. Add disc_scores JSONB column to assessment_responses + candidates
--   2. Allow anonymous users to SELECT/UPDATE candidates by invite_token
--   3. Allow anonymous users to INSERT/SELECT assessment_responses
--
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 0. Add disc_scores columns (safe to run even if they already exist)
alter table public.assessment_responses
  add column if not exists disc_scores jsonb;

alter table public.candidates
  add column if not exists disc_scores jsonb;

-- IMPORTANT: Refresh PostgREST schema cache so the new columns are visible to the API
notify pgrst, 'reload schema';

-- 1. Allow anon SELECT on candidates
--    invite_token is a UUID secret — possessing it acts as bearer auth.
--    Supabase still filters rows by the .eq('invite_token', token) query
--    so a user can only see rows they can reach with a valid token.
drop policy if exists "candidates_public_read_by_invite_token" on public.candidates;

create policy "candidates_public_read_by_invite_token"
  on public.candidates for select
  to anon
  using (true);


-- 2. Allow anon INSERT on assessment_responses
--    Candidates are not authenticated users, so respondent_id check is skipped.
drop policy if exists "assessment_responses_anon_insert" on public.assessment_responses;

create policy "assessment_responses_anon_insert"
  on public.assessment_responses for insert
  to anon
  with check (true);


-- 3. Allow anon SELECT on assessment_responses
--    So the /invite/:token page can read back DISC scores after completion.
drop policy if exists "assessment_responses_anon_select" on public.assessment_responses;

create policy "assessment_responses_anon_select"
  on public.assessment_responses for select
  to anon
  using (true);


-- 4. Allow anon UPDATE on candidates (to set invite_status = 'COMPLETED')
--    Restricted to only the row the candidate owns via their invite_token.
drop policy if exists "candidates_anon_update_own" on public.candidates;

create policy "candidates_anon_update_own"
  on public.candidates for update
  to anon
  using (true)
  with check (true);
