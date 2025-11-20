-- ============================================================================
-- MIGRATION: Add metier_id to questions table
-- ============================================================================
-- This migration adds a metier_id column to link questions to workshops/métiers

BEGIN;

-- Step 1: Add metier_id column (nullable for now)
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS metier_id INTEGER;

-- Step 2: Map existing questions to their métiers based on title keywords
-- INTRODUCTION (metier_id = 1)
UPDATE public.questions 
SET metier_id = 1 
WHERE quiz_type = 'INTRODUCTION' AND metier_id IS NULL;

-- SONDAGE (no metier_id - general survey)
UPDATE public.questions 
SET metier_id = NULL 
WHERE quiz_type = 'SONDAGE';

-- WORKSHOP questions - Map by title keywords
-- DAF (metier_id = 10)
UPDATE public.questions 
SET metier_id = 10 
WHERE quiz_type = 'WORKSHOP' 
  AND metier_id IS NULL
  AND (title ILIKE '%DAF%' OR title ILIKE '%Comptabilité%' OR title ILIKE '%Trésorerie%' OR title ILIKE '%Finance%' OR title ILIKE '%Contrôleur Gestion%');

-- RH/Juridique (metier_id = 8)
UPDATE public.questions 
SET metier_id = 8 
WHERE quiz_type = 'WORKSHOP' 
  AND metier_id IS NULL
  AND (title ILIKE '%RH%' OR title ILIKE '%Juridique%' OR title ILIKE '%Développement RH%' OR title ILIKE '%Administration RH%');

-- Stocks (metier_id = 7)
UPDATE public.questions 
SET metier_id = 7 
WHERE quiz_type = 'WORKSHOP' 
  AND metier_id IS NULL
  AND (title ILIKE '%Stock%' OR title ILIKE '%Gestion Stock%' OR title ILIKE '%Immobilisation%');

-- Projets (metier_id = 11)
UPDATE public.questions 
SET metier_id = 11 
WHERE quiz_type = 'WORKSHOP' 
  AND metier_id IS NULL
  AND (title ILIKE '%Projet%' OR title ILIKE '%Responsable Projet%' OR title ILIKE '%Directeur Développement%' OR title ILIKE '%Superviseur Projet%');

-- SIDT (metier_id = 3)
UPDATE public.questions 
SET metier_id = 3 
WHERE quiz_type = 'WORKSHOP' 
  AND metier_id IS NULL
  AND (title ILIKE '%SIDT%' OR title ILIKE '%Informatique%' OR title ILIKE '%Cybersécurité%' OR title ILIKE '%Ingénieur Informatique%' OR title ILIKE '%Technicien Informatique%');

-- Achats & Logistique (metier_id = 12)
UPDATE public.questions 
SET metier_id = 12 
WHERE quiz_type = 'WORKSHOP' 
  AND metier_id IS NULL
  AND (title ILIKE '%Achat%' OR title ILIKE '%Logistique%' OR title ILIKE '%Fournisseur%' OR title ILIKE '%Importation%');

-- Services Généraux (metier_id = 9)
UPDATE public.questions 
SET metier_id = 9 
WHERE quiz_type = 'WORKSHOP' 
  AND metier_id IS NULL
  AND (title ILIKE '%Services Généraux%' OR title ILIKE '%Service%');

-- QSE-RSE/Sûreté (metier_id = 5)
UPDATE public.questions 
SET metier_id = 5 
WHERE quiz_type = 'WORKSHOP' 
  AND metier_id IS NULL
  AND (title ILIKE '%QSE%' OR title ILIKE '%RSE%' OR title ILIKE '%Sûreté%' OR title ILIKE '%Qualité%' OR title ILIKE '%Sécurité%');

-- Production (metier_id = 2)
UPDATE public.questions 
SET metier_id = 2 
WHERE quiz_type = 'WORKSHOP' 
  AND metier_id IS NULL
  AND (title ILIKE '%Production%' OR title ILIKE '%Conduite%' OR title ILIKE '%Chimiste%' OR title ILIKE '%Technicien%' OR title ILIKE '%Conducteur%');

-- Introduction workshop questions (metier_id = 1)
UPDATE public.questions 
SET metier_id = 1 
WHERE quiz_type = 'WORKSHOP' 
  AND metier_id IS NULL
  AND (title ILIKE '%Démarche Compétence Intro%' OR title ILIKE '%Intro%');

-- Step 3: Add index for performance
CREATE INDEX IF NOT EXISTS idx_questions_metier_id 
ON public.questions(metier_id) 
WHERE metier_id IS NOT NULL;

-- Step 4: Add index on quiz_type and metier_id combination
CREATE INDEX IF NOT EXISTS idx_questions_quiz_type_metier 
ON public.questions(quiz_type, metier_id);

COMMIT;

-- Verification queries
SELECT 
  'VERIFICATION' as check_type,
  metier_id,
  quiz_type,
  COUNT(*) as question_count,
  STRING_AGG(DISTINCT title, ', ' ORDER BY title) as sample_titles
FROM public.questions
GROUP BY metier_id, quiz_type
ORDER BY metier_id NULLS FIRST, quiz_type;

-- Show any unmapped WORKSHOP questions
SELECT 
  'UNMAPPED WORKSHOP' as status,
  id,
  title,
  quiz_type
FROM public.questions
WHERE quiz_type = 'WORKSHOP' AND metier_id IS NULL;
