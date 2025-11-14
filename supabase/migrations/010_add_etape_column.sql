-- Migration 010: Add 'etape' column to questions table for categorizing questionnaires
-- This migration adds a step/stage column to categorize questions by questionnaire type:
-- - INTRODUCTION: Initial questionnaire
-- - SONDAGE: Opinion survey
-- - WORKSHOP: Workshop-specific questions
-- - AUTRE: Other questionnaires

-- 1. Add 'etape' column to questions table
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS etape TEXT DEFAULT 'INTRODUCTION'
CHECK (etape IN ('INTRODUCTION', 'SONDAGE', 'WORKSHOP', 'AUTRE'));

-- 2. Create index for better performance on etape queries
CREATE INDEX IF NOT EXISTS idx_questions_etape ON public.questions(etape);
CREATE INDEX IF NOT EXISTS idx_questions_etape_active ON public.questions(etape, active);
CREATE INDEX IF NOT EXISTS idx_questions_etape_quiz_type ON public.questions(etape, quiz_type, active);

-- 3. Update existing questions based on their quiz_type
UPDATE public.questions
SET etape = CASE
  WHEN quiz_type = 'INTRODUCTION' THEN 'INTRODUCTION'
  WHEN quiz_type = 'SONDAGE' THEN 'SONDAGE'
  ELSE 'AUTRE'
END
WHERE etape = 'INTRODUCTION';

-- 4. Create or replace a view to facilitate questions retrieval by step
CREATE OR REPLACE VIEW questions_by_etape AS
SELECT
  q.id,
  q.title,
  q.question,
  q.option_a,
  q.option_b,
  q.option_c,
  q.option_d,
  q.correct_answer,
  q.category,
  q.quiz_type,
  q.etape,
  q.points,
  q.active,
  q.order_index,
  q.feedback,
  q.explanation,
  q.created_at,
  q.updated_at
FROM public.questions q
WHERE q.active = true
ORDER BY q.etape, q.quiz_type, q.order_index;

-- 5. Create a view for admin dashboard showing questions grouped by etape
CREATE OR REPLACE VIEW questions_summary_by_etape AS
SELECT
  q.etape,
  q.quiz_type,
  COUNT(*) as nombre_questions,
  COUNT(*) FILTER (WHERE q.active = true) as nombre_actives,
  COUNT(*) FILTER (WHERE q.active = false) as nombre_inactives,
  array_agg(DISTINCT q.category) as categories,
  MIN(q.created_at) as premiere_creation,
  MAX(q.updated_at) as derniere_modification
FROM public.questions q
GROUP BY q.etape, q.quiz_type
ORDER BY
  CASE q.etape
    WHEN 'INTRODUCTION' THEN 1
    WHEN 'SONDAGE' THEN 2
    WHEN 'WORKSHOP' THEN 3
    ELSE 4
  END,
  q.quiz_type;

-- 6. Verify the migration
DO $$
DECLARE
  etape_count INTEGER;
  intro_count INTEGER;
  sondage_count INTEGER;
  workshop_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO etape_count FROM public.questions WHERE etape IS NOT NULL;
  SELECT COUNT(*) INTO intro_count FROM public.questions WHERE etape = 'INTRODUCTION';
  SELECT COUNT(*) INTO sondage_count FROM public.questions WHERE etape = 'SONDAGE';
  SELECT COUNT(*) INTO workshop_count FROM public.questions WHERE etape = 'WORKSHOP';

  RAISE NOTICE 'Migration 010 - Add etape column - Verification Results:';
  RAISE NOTICE 'Total questions with etape: %', etape_count;
  RAISE NOTICE 'INTRODUCTION questions: %', intro_count;
  RAISE NOTICE 'SONDAGE questions: %', sondage_count;
  RAISE NOTICE 'WORKSHOP questions: %', workshop_count;
END $$;
