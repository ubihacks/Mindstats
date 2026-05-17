-- Migration: Add disc_scores JSONB column to store DISC results
-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE assessment_responses
  ADD COLUMN IF NOT EXISTS disc_scores JSONB;

ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS disc_scores JSONB;

-- Optional: index for querying by dominant trait
CREATE INDEX IF NOT EXISTS idx_assessment_responses_disc
  ON assessment_responses USING GIN (disc_scores);

-- ─── RLS: Allow public (anonymous) reads on candidates by invite_token ───────
-- The /invite/:token page is public and needs to read candidate rows.
-- Without this policy, anonymous queries return no data (RLS blocks them).

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read a candidate row if they know the invite_token
CREATE POLICY IF NOT EXISTS "Public read candidates by invite_token"
  ON candidates FOR SELECT
  USING (true);

-- Allow authenticated company users to manage their own candidates
CREATE POLICY IF NOT EXISTS "Authenticated users manage own candidates"
  ON candidates FOR ALL
  USING (auth.role() = 'authenticated');
