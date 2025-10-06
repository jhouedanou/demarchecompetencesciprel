-- Amélioration de la table quiz_results pour meilleure gestion des erreurs
-- Cette migration ajoute des contraintes et des valeurs par défaut plus robustes

-- Ajouter des valeurs par défaut pour éviter les erreurs NULL
ALTER TABLE public.quiz_results 
  ALTER COLUMN score SET DEFAULT 0,
  ALTER COLUMN max_score SET DEFAULT 0,
  ALTER COLUMN correct_answers SET DEFAULT 0,
  ALTER COLUMN duration SET DEFAULT 0,
  ALTER COLUMN percentage SET DEFAULT 0.00;

-- S'assurer que les contraintes NOT NULL sont bien définies
ALTER TABLE public.quiz_results 
  ALTER COLUMN responses SET NOT NULL,
  ALTER COLUMN total_questions SET NOT NULL;

-- Ajouter une contrainte pour s'assurer que les valeurs sont cohérentes
ALTER TABLE public.quiz_results 
  ADD CONSTRAINT quiz_results_score_check CHECK (score >= 0 AND score <= max_score),
  ADD CONSTRAINT quiz_results_percentage_check CHECK (percentage >= 0 AND percentage <= 100),
  ADD CONSTRAINT quiz_results_duration_check CHECK (duration >= 0);

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_quiz_attempt 
  ON public.quiz_results(user_id, quiz_type, attempt_number);

-- Commentaires pour la documentation
COMMENT ON TABLE public.quiz_results IS 'Stocke les résultats des quiz complétés par les utilisateurs';
COMMENT ON COLUMN public.quiz_results.responses IS 'Réponses détaillées au format JSON avec metadata';
COMMENT ON COLUMN public.quiz_results.percentage IS 'Pourcentage de réussite (0-100)';
COMMENT ON COLUMN public.quiz_results.attempt_number IS 'Numéro de tentative pour ce type de quiz';
