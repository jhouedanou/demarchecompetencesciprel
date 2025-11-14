-- Migration 012: Peupler la base de données et fixer les RLS
-- Cette migration:
-- 1. Désactive RLS temporairement pour insérer les données
-- 2. Peuple les workshops (12 métiers)
-- 3. Peuple les questions (introduction + sondage)
-- 4. Réactive et configure RLS correctement

-- ============================================================================
-- PART 1: POPULATE WORKSHOPS (12 METIERS)
-- ============================================================================

-- Désactiver RLS temporairement pour insérer les données
ALTER TABLE public.workshops DISABLE ROW LEVEL SECURITY;

-- Vider les workshops existantes si nécessaire
TRUNCATE TABLE public.workshops CASCADE;

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
ON CONFLICT (metier_id) DO NOTHING;

-- ============================================================================
-- PART 2: POPULATE QUESTIONS
-- ============================================================================

-- Désactiver RLS sur questions aussi
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;

-- Vider les questions existantes si nécessaire (OPTIONNEL - commenter si vous voulez garder les anciennes)
-- TRUNCATE TABLE public.questions CASCADE;

-- Insérer les questions INTRODUCTION
INSERT INTO public.questions (title, question, option_a, option_b, option_c, correct_answer, category, quiz_type, etape, points, active, order_index, feedback, explanation) VALUES
-- Question 1 - DEFINITION
('Définition de la démarche compétence',
'La démarche compétence c''est :',
'Un moyen de retenir les potentiels et les talents',
'Un levier de performance',
'Un levier de certification qualité',
ARRAY['A', 'B'],
'DEFINITION',
'INTRODUCTION',
'INTRODUCTION',
2,
true,
1,
'Excellente réponse ! La démarche compétence est effectivement un moyen de retenir les talents et un levier de performance.',
'La démarche compétence vise à optimiser les ressources humaines en identifiant, développant et retenant les compétences clés. Elle constitue un véritable levier de performance organisationnelle.'),

-- Question 2 - RESPONSABILITE
('Responsabilité de la démarche compétence',
'La démarche compétence est la responsabilité de :',
'Tous',
'La direction générale',
'Le groupe ERANOVE',
ARRAY['A'],
'RESPONSABILITE',
'INTRODUCTION',
'INTRODUCTION',
1,
true,
2,
'Parfait ! La démarche compétence implique tous les acteurs de l''organisation.',
'La réussite de la démarche compétence nécessite l''engagement et la participation de tous les niveaux hiérarchiques, de la direction aux collaborateurs.'),

-- Question 3 - COMPETENCES
('Compétences requises pour manager',
'Pour manager, il faut avoir des compétences :',
'Techniques uniquement',
'Managériales uniquement',
'Techniques et managériales',
ARRAY['C'],
'COMPETENCES',
'INTRODUCTION',
'INTRODUCTION',
1,
true,
3,
'Correct ! Un manager efficace doit maîtriser à la fois les aspects techniques et managériaux.',
'Le management moderne exige une double compétence : technique pour la crédibilité et managériale pour l''efficacité dans la conduite des équipes.'),

-- Question 4 - ETAPES
('Première étape de la démarche',
'La première étape de la démarche compétence consiste à :',
'Former les collaborateurs',
'Identifier les compétences requises',
'Évaluer les performances',
ARRAY['B'],
'ETAPES',
'INTRODUCTION',
'INTRODUCTION',
1,
true,
4,
'Exact ! Tout commence par l''identification des compétences nécessaires.',
'L''identification des compétences requises constitue le socle de toute démarche compétence. Elle permet de définir le référentiel sur lequel s''appuieront toutes les actions suivantes.'),

-- Question 5 - COMPETENCES
('Types de compétences',
'Les compétences se déclinent en :',
'Savoir uniquement',
'Savoir et savoir-faire',
'Savoir, savoir-faire et savoir-être',
ARRAY['C'],
'COMPETENCES',
'INTRODUCTION',
'INTRODUCTION',
1,
true,
5,
'Parfait ! Les trois dimensions des compétences sont essentielles.',
'Une compétence complète intègre les connaissances (savoir), les aptitudes pratiques (savoir-faire) et les comportements professionnels (savoir-être).'),

-- Question 6 - DEFINITION
('Objectifs de la démarche compétence',
'La démarche compétence vise principalement à :',
'Réduire les coûts de formation',
'Améliorer la performance et l''employabilité',
'Standardiser les pratiques',
ARRAY['B'],
'DEFINITION',
'INTRODUCTION',
'INTRODUCTION',
1,
true,
6,
'Correct ! L''amélioration de la performance et de l''employabilité sont au cœur de la démarche.',
'La démarche compétence a pour objectif d''optimiser la performance organisationnelle tout en développant l''employabilité et la motivation des collaborateurs.'),

-- Question 7 - ETAPES
('Évaluation des compétences',
'L''évaluation des compétences permet de :',
'Sanctionner les lacunes',
'Identifier les écarts et planifier le développement',
'Classer les collaborateurs',
ARRAY['B'],
'ETAPES',
'INTRODUCTION',
'INTRODUCTION',
1,
true,
7,
'Excellent ! L''évaluation est un outil de développement, pas de sanction.',
'L''évaluation des compétences est un processus constructif qui vise à identifier les écarts entre compétences acquises et requises pour planifier des actions de développement adaptées.')
ON CONFLICT DO NOTHING;

-- Insérer les questions SONDAGE
INSERT INTO public.questions (title, question, option_a, option_b, option_c, option_d, correct_answer, category, quiz_type, etape, points, active, order_index, feedback) VALUES
-- Sondage Question 1
('Connaissance de la démarche compétence',
'Savez-vous ce que c''est que la démarche compétence ?',
'Oui',
'Non',
'J''ai une vague idée',
NULL,
ARRAY['A', 'B', 'C'],
'OPINION',
'SONDAGE',
'SONDAGE',
0,
true,
1,
'Merci pour votre réponse sincère.'),

-- Sondage Question 2
('Définition personnelle',
'Selon vous, comment définiriez-vous la démarche compétence ?',
'Un processus RH',
'Un outil de développement',
'Une stratégie d''entreprise',
'Autre',
ARRAY['A', 'B', 'C', 'D'],
'OPINION',
'SONDAGE',
'SONDAGE',
0,
true,
2,
'Votre vision est précieuse pour nous.'),

-- Sondage Question 3
('Bénéfices perçus',
'Selon vous quels sont les principaux bénéfices d''une telle démarche pour CIPREL ?',
'L''optimisation des ressources',
'Aide à l''évolution professionnelle',
'Meilleure adéquation besoins/compétences',
'Meilleure gestion des talents',
ARRAY['A', 'B', 'C', 'D'],
'OPINION',
'SONDAGE',
'SONDAGE',
0,
true,
3,
'Merci d''avoir partagé votre vision.'),

-- Sondage Question 4
('Attentes personnelles',
'Quelles sont vos attentes vis-à-vis de cette démarche ?',
'Développement personnel',
'Évolution de carrière',
'Amélioration des conditions de travail',
'Reconnaissance des compétences',
ARRAY['A', 'B', 'C', 'D'],
'OPINION',
'SONDAGE',
'SONDAGE',
0,
true,
4,
'Vos attentes nous guideront dans la mise en œuvre.'),

-- Sondage Question 5
('Inquiétudes',
'Avez-vous des inquiétudes concernant cette démarche ?',
'Surcharge de travail',
'Évaluation trop stricte',
'Manque de moyens',
'Aucune inquiétude',
ARRAY['A', 'B', 'C', 'D'],
'OPINION',
'SONDAGE',
'SONDAGE',
0,
true,
5,
'Nous prenons en compte vos préoccupations.'),

-- Sondage Question 6
('Sources d''information souhaitées',
'Par quels moyens souhaiteriez-vous être informé sur cette démarche ?',
'Réunions d''information',
'Communications internes',
'Formation spécifique',
'Documentation en ligne',
ARRAY['A', 'B', 'C', 'D'],
'OPINION',
'SONDAGE',
'SONDAGE',
0,
true,
6,
'Nous adapterons notre communication selon vos préférences.')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PART 3: FIX RLS POLICIES
-- ============================================================================

-- Réactiver RLS
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques de workshops
DROP POLICY IF EXISTS "Public can view active workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can view all workshops" ON public.workshops;
DROP POLICY IF EXISTS "Authenticated users can insert workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can update workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can delete workshops" ON public.workshops;

-- WORKSHOPS RLS POLICIES (FIXES)
-- 1. SELECT: Public can view active workshops
CREATE POLICY "Public can view active workshops" ON public.workshops
  FOR SELECT
  USING (is_active = true);

-- 2. SELECT: Admins can view all workshops
CREATE POLICY "Admins can view all workshops" ON public.workshops
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- 3. INSERT: Admins can create workshops
CREATE POLICY "Admins can insert workshops" ON public.workshops
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- 4. UPDATE: Admins can update workshops
CREATE POLICY "Admins can update workshops" ON public.workshops
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- 5. DELETE: Admins can delete workshops
CREATE POLICY "Admins can delete workshops" ON public.workshops
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- ============================================================================
-- QUESTIONS RLS POLICIES (VERIFICATION)
-- ============================================================================

-- Supprimer les anciennes politiques de questions
DROP POLICY IF EXISTS "Anyone can read active questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can manage questions" ON public.questions;

-- 1. SELECT: Anyone can read active questions
CREATE POLICY "Anyone can read active questions" ON public.questions
  FOR SELECT
  USING (active = true);

-- 2. SELECT: Admins can read all questions (active and inactive)
CREATE POLICY "Admins can read all questions" ON public.questions
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- 3. INSERT: Admins can create questions
CREATE POLICY "Admins can insert questions" ON public.questions
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- 4. UPDATE: Admins can update questions
CREATE POLICY "Admins can update questions" ON public.questions
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- 5. DELETE: Admins can delete questions
CREATE POLICY "Admins can delete questions" ON public.questions
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- ============================================================================
-- VERIFICATION AND LOGGING
-- ============================================================================

DO $$
DECLARE
  workshop_count INTEGER;
  question_count INTEGER;
  intro_count INTEGER;
  sondage_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO workshop_count FROM public.workshops;
  SELECT COUNT(*) INTO question_count FROM public.questions;
  SELECT COUNT(*) INTO intro_count FROM public.questions WHERE etape = 'INTRODUCTION';
  SELECT COUNT(*) INTO sondage_count FROM public.questions WHERE etape = 'SONDAGE';

  RAISE NOTICE '====================================';
  RAISE NOTICE 'Migration 012 - Populate & Fix RLS';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Workshops created: %', workshop_count;
  RAISE NOTICE 'Total questions: %', question_count;
  RAISE NOTICE '  - Introduction questions: %', intro_count;
  RAISE NOTICE '  - Survey questions: %', sondage_count;
  RAISE NOTICE 'RLS Policies: UPDATED';
  RAISE NOTICE 'Status: SUCCESS';
  RAISE NOTICE '====================================';
END $$;
