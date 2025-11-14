-- ============================================================================
-- QUICK DEPLOY SCRIPT FOR SUPABASE
-- Copier-coller ce script dans Supabase SQL Editor et l'exécuter
-- ============================================================================

-- Vérifier que les tables existent
SELECT
  'workshops' as table_name,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workshops') as exists
UNION ALL
SELECT
  'questions' as table_name,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'questions') as exists;

-- ============================================================================
-- PART 1: POPULATE WORKSHOPS (12 METIERS)
-- ============================================================================

-- Désactiver RLS temporairement
ALTER TABLE public.workshops DISABLE ROW LEVEL SECURITY;

-- Insérer les 12 workshops métiers
INSERT INTO public.workshops (metier_id, metier_nom, is_active, publication_date, onedrive_link, created_at, updated_at) VALUES
  (1, 'Production', false, NULL, NULL, NOW(), NOW()),
  (2, 'SIDT', false, NULL, NULL, NOW(), NOW()),
  (3, 'Maintenance', false, NULL, NULL, NOW(), NOW()),
  (4, 'QSE-RSE/Sûreté', false, NULL, NULL, NOW(), NOW()),
  (5, 'Contrôle Interne', false, NULL, NULL, NOW(), NOW()),
  (6, 'Stocks', false, NULL, NULL, NOW(), NOW()),
  (7, 'RH/Juridique', false, NULL, NULL, NOW(), NOW()),
  (8, 'Services Généraux', false, NULL, NULL, NOW(), NOW()),
  (9, 'DFC', false, NULL, NULL, NOW(), NOW()),
  (10, 'Projets', false, NULL, NULL, NOW(), NOW()),
  (11, 'Achats & Logistique', false, NULL, NULL, NOW(), NOW()),
  (12, 'Direction', false, NULL, NULL, NOW(), NOW())
ON CONFLICT (metier_id) DO UPDATE SET updated_at = NOW();

SELECT COUNT(*) as workshops_count FROM public.workshops;

-- ============================================================================
-- PART 2: UPDATE QUESTIONS WITH ETAPE COLUMN
-- ============================================================================

-- Ajouter la colonne etape si elle n'existe pas
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS etape TEXT DEFAULT 'INTRODUCTION'
CHECK (etape IN ('INTRODUCTION', 'SONDAGE', 'WORKSHOP', 'AUTRE'));

-- Mettre à jour les questions existantes avec l'étape correcte
UPDATE public.questions
SET etape = CASE
  WHEN quiz_type = 'INTRODUCTION' THEN 'INTRODUCTION'
  WHEN quiz_type = 'SONDAGE' THEN 'SONDAGE'
  ELSE 'AUTRE'
END,
updated_at = NOW()
WHERE etape = 'INTRODUCTION' AND quiz_type IN ('INTRODUCTION', 'SONDAGE');

SELECT etape, COUNT(*) as count FROM public.questions GROUP BY etape;

-- ============================================================================
-- PART 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_questions_etape ON public.questions(etape);
CREATE INDEX IF NOT EXISTS idx_questions_etape_active ON public.questions(etape, active);
CREATE INDEX IF NOT EXISTS idx_workshops_metier_id ON public.workshops(metier_id);
CREATE INDEX IF NOT EXISTS idx_workshops_is_active ON public.workshops(is_active);

-- ============================================================================
-- PART 4: RECREATE RLS POLICIES
-- ============================================================================

-- Réactiver RLS
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- Drop existing workshops policies
DROP POLICY IF EXISTS "Public can view active workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can view all workshops" ON public.workshops;
DROP POLICY IF EXISTS "Authenticated users can insert workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can insert workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can update workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can delete workshops" ON public.workshops;

-- WORKSHOPS POLICIES
CREATE POLICY "Public can view active workshops" ON public.workshops
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all workshops" ON public.workshops
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  );

CREATE POLICY "Admins can insert workshops" ON public.workshops
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  );

CREATE POLICY "Admins can update workshops" ON public.workshops
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  );

CREATE POLICY "Admins can delete workshops" ON public.workshops
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  );

-- Drop existing questions policies
DROP POLICY IF EXISTS "Anyone can read active questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can manage questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can read all questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questions;

-- QUESTIONS POLICIES
CREATE POLICY "Anyone can read active questions" ON public.questions
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can read all questions" ON public.questions
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  );

CREATE POLICY "Admins can insert questions" ON public.questions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  );

CREATE POLICY "Admins can update questions" ON public.questions
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  );

CREATE POLICY "Admins can delete questions" ON public.questions
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Vérifier les workshops
SELECT
  'WORKSHOPS' as category,
  COUNT(*) as total,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active,
  SUM(CASE WHEN NOT is_active THEN 1 ELSE 0 END) as inactive
FROM public.workshops;

-- Vérifier les questions
SELECT
  'QUESTIONS' as category,
  COUNT(*) as total,
  COUNT(DISTINCT etape) as etapes,
  COUNT(DISTINCT quiz_type) as quiz_types
FROM public.questions;

-- Détail par étape
SELECT etape, COUNT(*) as count FROM public.questions GROUP BY etape ORDER BY etape;

-- Vérifier les RLS policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('workshops', 'questions')
ORDER BY tablename, policyname;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT
  'Migration terminée avec succès!' as status,
  NOW() as timestamp,
  (SELECT COUNT(*) FROM public.workshops) as workshops_count,
  (SELECT COUNT(*) FROM public.questions) as questions_count;
