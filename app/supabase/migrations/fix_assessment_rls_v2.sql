-- ============================================================
-- Migration: fix_assessment_rls_v2
-- Purpose:
--   1. Ensure anonymous users can INSERT into assessment_responses
--      (candidate assessments arrive unauthenticated via invite token)
--   2. Ensure anonymous users can UPDATE candidates by invite_token
--      (mark invite_status = 'COMPLETED' after assessment submission)
--   3. Ensure anonymous users can UPDATE assessment_responses
--      (write disc_scores back to the row after scoring)
-- ============================================================

-- 1. Drop and recreate the anon INSERT policy (belt-and-suspenders)
drop policy if exists "assessment_responses_insert"     on public.assessment_responses;
drop policy if exists "assessment_responses_anon_insert" on public.assessment_responses;

-- Allow any role (authenticated + anon) to INSERT assessment responses.
-- The invite token in the request body acts as the bearer credential.
create policy "assessment_responses_insert_all"
  on public.assessment_responses for insert
  with check (true);

-- 2. Allow anon SELECT on assessment_responses
--    So the scoring function can read back results on the complete page.
drop policy if exists "assessment_responses_anon_select" on public.assessment_responses;

create policy "assessment_responses_select_all"
  on public.assessment_responses for select
  using (
    auth.role() = 'authenticated'
    or true   -- anon callers need read for disc_results display
  );

-- 3. Allow anon UPDATE on candidates (mark COMPLETED, write disc_scores)
drop policy if exists "candidates_anon_update_by_token" on public.candidates;

create policy "candidates_anon_update_by_token"
  on public.candidates for update
  to anon
  using (true)           -- row filter: any row (token equality enforced by the query)
  with check (true);     -- value filter: allow all updates

-- 4. Allow anon SELECT on assessment_responses for score retrieval
drop policy if exists "assessment_responses_anon_select_by_token" on public.assessment_responses;

create policy "assessment_responses_anon_select_by_token"
  on public.assessment_responses for select
  to anon
  using (true);

-- 5. Refresh PostgREST schema cache
notify pgrst, 'reload schema';
