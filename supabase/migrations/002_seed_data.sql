-- Seed data for CIPREL competence application

-- Insert quiz questions for INTRODUCTION type
INSERT INTO public.questions (title, question, option_a, option_b, option_c, correct_answer, category, quiz_type, points, feedback, explanation, order_index) VALUES

-- Question 1 - DEFINITION category
('Définition de la démarche compétence',
'La démarche compétence c''est :',
'Un moyen de retenir les potentiels et les talents',
'Un levier de performance',
'Un levier de certification qualité',
ARRAY['A', 'B'],
'DEFINITION',
'INTRODUCTION',
2,
'Excellente réponse ! La démarche compétence est effectivement un moyen de retenir les talents et un levier de performance.',
'La démarche compétence vise à optimiser les ressources humaines en identifiant, développant et retenant les compétences clés. Elle constitue un véritable levier de performance organisationnelle.',
1),

-- Question 2 - RESPONSABILITE category
('Responsabilité de la démarche compétence',
'La démarche compétence est la responsabilité de :',
'Tous',
'La direction générale',
'Le groupe ERANOVE',
ARRAY['A'],
'RESPONSABILITE',
'INTRODUCTION',
1,
'Parfait ! La démarche compétence implique tous les acteurs de l''organisation.',
'La réussite de la démarche compétence nécessite l''engagement et la participation de tous les niveaux hiérarchiques, de la direction aux collaborateurs.',
2),

-- Question 3 - COMPETENCES category
('Compétences requises pour manager',
'Pour manager, il faut avoir des compétences :',
'Techniques uniquement',
'Managériales uniquement',
'Techniques et managériales',
ARRAY['C'],
'COMPETENCES',
'INTRODUCTION',
1,
'Correct ! Un manager efficace doit maîtriser à la fois les aspects techniques et managériaux.',
'Le management moderne exige une double compétence : technique pour la crédibilité et managériale pour l''efficacité dans la conduite des équipes.',
3),

-- Question 4 - ETAPES category
('Première étape de la démarche',
'La première étape de la démarche compétence consiste à :',
'Former les collaborateurs',
'Identifier les compétences requises',
'Évaluer les performances',
ARRAY['B'],
'ETAPES',
'INTRODUCTION',
1,
'Exact ! Tout commence par l''identification des compétences nécessaires.',
'L''identification des compétences requises constitue le socle de toute démarche compétence. Elle permet de définir le référentiel sur lequel s''appuieront toutes les actions suivantes.',
4),

-- Question 5 - COMPETENCES category
('Types de compétences',
'Les compétences se déclinent en :',
'Savoir uniquement',
'Savoir et savoir-faire',
'Savoir, savoir-faire et savoir-être',
ARRAY['C'],
'COMPETENCES',
'INTRODUCTION',
1,
'Parfait ! Les trois dimensions des compétences sont essentielles.',
'Une compétence complète intègre les connaissances (savoir), les aptitudes pratiques (savoir-faire) et les comportements professionnels (savoir-être).',
5),

-- Question 6 - DEFINITION category
('Objectifs de la démarche compétence',
'La démarche compétence vise principalement à :',
'Réduire les coûts de formation',
'Améliorer la performance et l''employabilité',
'Standardiser les pratiques',
ARRAY['B'],
'DEFINITION',
'INTRODUCTION',
1,
'Correct ! L''amélioration de la performance et de l''employabilité sont au cœur de la démarche.',
'La démarche compétence a pour objectif d''optimiser la performance organisationnelle tout en développant l''employabilité et la motivation des collaborateurs.',
6),

-- Question 7 - ETAPES category
('Évaluation des compétences',
'L''évaluation des compétences permet de :',
'Sanctionner les lacunes',
'Identifier les écarts et planifier le développement',
'Classer les collaborateurs',
ARRAY['B'],
'ETAPES',
'INTRODUCTION',
1,
'Excellent ! L''évaluation est un outil de développement, pas de sanction.',
'L''évaluation des compétences est un processus constructif qui vise à identifier les écarts entre compétences acquises et requises pour planifier des actions de développement adaptées.',
7);

-- Insert sondage questions for SONDAGE type
INSERT INTO public.questions (title, question, option_a, option_b, option_c, option_d, correct_answer, category, quiz_type, points, feedback, order_index) VALUES

-- Sondage Question 1
('Connaissance de la démarche compétence',
'Savez-vous ce que c''est que la démarche compétence ?',
'Oui',
'Non',
'J''ai une vague idée',
NULL,
ARRAY['A', 'B', 'C'], -- All answers are valid for survey
'OPINION',
'SONDAGE',
0,
'Merci pour votre réponse sincère.',
1),

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
0,
'Votre vision est précieuse pour nous.',
2),

-- Sondage Question 3
('Bénéfices perçus',
'Selon vous quels sont les principaux bénéfices d''une telle démarche pour CIPREL ?',
'L''optimisation des ressources',
'Aide à l''évolution professionnelle',
'Meilleure adéquation besoins/compétences',
'Meilleure gestion des talents',
ARRAY['A', 'B', 'C', 'D'], -- Multiple choice possible
'OPINION',
'SONDAGE',
0,
'Merci d''avoir partagé votre vision.',
3),

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
0,
'Vos attentes nous guideront dans la mise en œuvre.',
4),

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
0,
'Nous prenons en compte vos préoccupations.',
5),

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
0,
'Nous adapterons notre communication selon vos préférences.',
6);

-- Insert sample videos
INSERT INTO public.videos (title, description, filename, url, thumbnail, duration, active, featured, order_index) VALUES

('Introduction à la démarche compétence',
'Découvrez les fondamentaux de la démarche compétence chez CIPREL',
'intro-demarche-competence.mp4',
'https://example.com/videos/intro-demarche-competence.mp4',
'https://example.com/thumbnails/intro-demarche-competence.jpg',
180,
true,
true,
1),

('Les 3 piliers des compétences',
'Savoir, savoir-faire et savoir-être expliqués simplement',
'3-piliers-competences.mp4',
'https://example.com/videos/3-piliers-competences.mp4',
'https://example.com/thumbnails/3-piliers-competences.jpg',
120,
true,
true,
2),

('Évaluation des compétences',
'Comment bien évaluer les compétences de vos équipes',
'evaluation-competences.mp4',
'https://example.com/videos/evaluation-competences.mp4',
'https://example.com/thumbnails/evaluation-competences.jpg',
150,
true,
false,
3),

('Plan de développement individuel',
'Créer un PDI efficace pour progresser',
'plan-developpement-individuel.mp4',
'https://example.com/videos/plan-developpement-individuel.mp4',
'https://example.com/thumbnails/plan-developpement-individuel.jpg',
200,
true,
false,
4),

('Management par les compétences',
'Adapter votre style de management aux compétences',
'management-competences.mp4',
'https://example.com/videos/management-competences.mp4',
'https://example.com/thumbnails/management-competences.jpg',
160,
true,
false,
5),

('Entretien annuel et compétences',
'Intégrer les compétences dans l''entretien annuel',
'entretien-annuel-competences.mp4',
'https://example.com/videos/entretien-annuel-competences.mp4',
'https://example.com/thumbnails/entretien-annuel-competences.jpg',
140,
true,
false,
6);

-- Create an admin user (password should be changed in production)
-- Note: This will only work if you have the actual auth.users entry
-- In production, create admin accounts through the Supabase auth interface

-- Insert sample consent record
INSERT INTO public.consent_records (session_id, essential, analytics, marketing, functional, consent_version) VALUES
('demo-session-001', true, true, false, true, '1.0');

-- Insert sample visits for analytics
INSERT INTO public.visits (session_id, page, title, device_type) VALUES
('demo-session-001', '/', 'Accueil - Démarche Compétences CIPREL', 'desktop'),
('demo-session-001', '/competences/quiz-introduction', 'Quiz Introduction', 'desktop'),
('demo-session-002', '/competences/videos', 'Vidéothèque', 'mobile'),
('demo-session-003', '/competences/sondage', 'Sondage Opinion', 'tablet');

-- Update sequences to ensure proper auto-incrementing
SELECT setval('public.questions_order_index_seq', (SELECT MAX(order_index) FROM public.questions) + 1, false);

-- Create indexes for better performance on frequently queried data
CREATE INDEX IF NOT EXISTS idx_questions_quiz_type_order ON public.questions(quiz_type, order_index);
CREATE INDEX IF NOT EXISTS idx_videos_featured_active ON public.videos(featured, active, order_index);

-- Add some notifications templates for admin
INSERT INTO public.data_processing_log (data_type, action, purpose, legal_basis, details) VALUES
('PERSONAL_INFO', 'CREATE', 'System initialization with sample data', 'LEGITIMATE_INTEREST', '{"source": "database_seed", "description": "Initial data setup for application testing"}');

COMMIT;