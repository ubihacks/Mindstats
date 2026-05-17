-- Migration: Add disc_scores JSONB column to store DISC results
-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE assessment_responses
  ADD COLUMN IF NOT EXISTS disc_scores JSONB;

ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS disc_scores JSONB;

-- Optional: index for querying by dominant trait
CREATE INDEX IF NOT EXISTS idx_assessment_responses_disc
  ON assessment_responses USING GIN (disc_scores);
