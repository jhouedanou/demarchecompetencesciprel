-- ============================================================================
-- QUERIES FOR RETRIEVING QUESTIONS BY ETAPE (STAGE/QUESTIONNAIRE TYPE)
-- ============================================================================
-- These queries are used to retrieve questions from the admin dashboard
-- categorized by etape (Introduction, Survey, Workshop, Other)

-- ============================================================================
-- 1. GET ALL QUESTIONS WITH CURRENT DATA (All questions with all details)
-- ============================================================================
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
ORDER BY
  CASE q.etape
    WHEN 'INTRODUCTION' THEN 1
    WHEN 'SONDAGE' THEN 2
    WHEN 'WORKSHOP' THEN 3
    ELSE 4
  END,
  q.quiz_type,
  q.order_index;

-- ============================================================================
-- 2. GET QUESTIONS FOR INTRODUCTION QUESTIONNAIRE
-- ============================================================================
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
WHERE q.etape = 'INTRODUCTION'
  AND q.active = true
  AND q.quiz_type = 'INTRODUCTION'
ORDER BY q.order_index ASC;

-- ============================================================================
-- 3. GET QUESTIONS FOR OPINION SURVEY (SONDAGE)
-- ============================================================================
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
WHERE q.etape = 'SONDAGE'
  AND q.active = true
  AND q.quiz_type = 'SONDAGE'
ORDER BY q.order_index ASC;

-- ============================================================================
-- 4. GET QUESTIONS FOR WORKSHOP QUESTIONNAIRES
-- ============================================================================
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
WHERE q.etape = 'WORKSHOP'
  AND q.active = true
ORDER BY q.order_index ASC;

-- ============================================================================
-- 5. GET QUESTIONS SUMMARY - Count by Etape
-- ============================================================================
SELECT
  q.etape,
  q.quiz_type,
  COUNT(*) as nombre_total,
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

-- ============================================================================
-- 6. GET QUESTIONS BY CATEGORY AND ETAPE
-- ============================================================================
SELECT
  q.etape,
  q.category,
  q.quiz_type,
  COUNT(*) as nombre_questions,
  COUNT(*) FILTER (WHERE q.active = true) as nombre_actives
FROM public.questions q
GROUP BY q.etape, q.category, q.quiz_type
ORDER BY
  CASE q.etape
    WHEN 'INTRODUCTION' THEN 1
    WHEN 'SONDAGE' THEN 2
    WHEN 'WORKSHOP' THEN 3
    ELSE 4
  END,
  q.category,
  q.quiz_type;

-- ============================================================================
-- 7. GET INACTIVE QUESTIONS (for admin review)
-- ============================================================================
SELECT
  q.id,
  q.title,
  q.question,
  q.etape,
  q.quiz_type,
  q.category,
  q.active,
  q.created_at,
  q.updated_at
FROM public.questions q
WHERE q.active = false
ORDER BY q.updated_at DESC;

-- ============================================================================
-- 8. GET QUESTIONS FOR ADMIN MANAGEMENT (All including inactive)
-- ============================================================================
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
ORDER BY
  CASE q.etape
    WHEN 'INTRODUCTION' THEN 1
    WHEN 'SONDAGE' THEN 2
    WHEN 'WORKSHOP' THEN 3
    ELSE 4
  END,
  q.quiz_type,
  q.order_index;

-- ============================================================================
-- 9. GET QUESTIONS WITH COMPLETION STATUS
-- ============================================================================
SELECT
  q.etape,
  q.quiz_type,
  COUNT(*) as total_questions,
  COUNT(*) FILTER (WHERE q.option_d IS NOT NULL) as questions_completes,
  COUNT(*) FILTER (WHERE q.option_d IS NULL) as questions_3_options,
  COUNT(*) FILTER (WHERE q.feedback IS NOT NULL) as questions_avec_feedback,
  COUNT(*) FILTER (WHERE q.explanation IS NOT NULL) as questions_avec_explication
FROM public.questions q
GROUP BY q.etape, q.quiz_type;

-- ============================================================================
-- 10. GET QUESTIONS BY ETAPE FOR FRONTEND DISPLAY (Optimized)
-- ============================================================================
-- This is the most efficient query for the admin dashboard display
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
  q.order_index,
  q.feedback,
  q.explanation
FROM public.questions q
WHERE q.active = true
ORDER BY
  CASE q.etape
    WHEN 'INTRODUCTION' THEN 1
    WHEN 'SONDAGE' THEN 2
    WHEN 'WORKSHOP' THEN 3
    ELSE 4
  END,
  q.quiz_type DESC,
  q.order_index ASC;
