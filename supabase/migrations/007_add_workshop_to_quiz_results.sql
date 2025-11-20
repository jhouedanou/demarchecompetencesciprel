-- ============================================================================
-- MIGRATION: Add WORKSHOP to quiz_results quiz_type constraint
-- ============================================================================
-- This migration updates the quiz_type constraint to include WORKSHOP quizzes

BEGIN;

-- Drop the existing constraint
ALTER TABLE public.quiz_results
  DROP CONSTRAINT IF EXISTS quiz_results_quiz_type_check;

-- Add the new constraint with WORKSHOP included
ALTER TABLE public.quiz_results
  ADD CONSTRAINT quiz_results_quiz_type_check
  CHECK (quiz_type IN ('INTRODUCTION', 'SONDAGE', 'WORKSHOP'));

-- Add metier_id column to link workshop results to specific workshops
ALTER TABLE public.quiz_results
  ADD COLUMN IF NOT EXISTS metier_id INTEGER;

-- Create index for better performance on workshop results
CREATE INDEX IF NOT EXISTS idx_quiz_results_metier_id
  ON public.quiz_results(metier_id)
  WHERE metier_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.quiz_results.metier_id IS 'ID du métier pour les quiz de type WORKSHOP';

COMMIT;

-- Verification
SELECT 'VERIFICATION' as status, 'WORKSHOP type added to quiz_results' as result;
