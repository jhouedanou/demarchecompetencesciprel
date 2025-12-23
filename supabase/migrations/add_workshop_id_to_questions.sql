-- Migration: Ajouter workshop_id (string) à la table questions
-- Cette migration permet de lier les questions aux workshops métiers par leur ID string

-- Ajouter la colonne workshop_id si elle n'existe pas
ALTER TABLE questions ADD COLUMN IF NOT EXISTS workshop_id TEXT;

-- Créer un index pour la performance
CREATE INDEX IF NOT EXISTS idx_questions_workshop_id ON questions(workshop_id);

-- Mettre à jour les questions existantes en mappant les metier_id aux workshop_id
-- Mapping basé sur la correspondance connue
UPDATE questions SET workshop_id = 'production' WHERE metier_id = 2 AND workshop_id IS NULL;
UPDATE questions SET workshop_id = 'qse' WHERE metier_id = 3 AND workshop_id IS NULL;
UPDATE questions SET workshop_id = 'maintenance' WHERE metier_id = 4 AND workshop_id IS NULL;
UPDATE questions SET workshop_id = 'rh-juridique' WHERE metier_id = 5 AND workshop_id IS NULL;
UPDATE questions SET workshop_id = 'finances' WHERE metier_id = 6 AND workshop_id IS NULL;
UPDATE questions SET workshop_id = 'achats-stocks' WHERE metier_id = 7 AND workshop_id IS NULL;
UPDATE questions SET workshop_id = 'systemes-information' WHERE metier_id = 8 AND workshop_id IS NULL;

-- Note: Les questions avec quiz_type = 'INTRODUCTION' n'ont pas de workshop_id
-- Elles sont liées au quiz d'introduction général
