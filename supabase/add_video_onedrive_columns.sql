-- Migration : Ajouter les colonnes video et onedrive à la table workshops_metiers
-- Date : 2024-12-05
-- IMPORTANT : Exécutez ce script dans Supabase SQL Editor

-- Version simplifiée (recommandée) - Exécuter ces 2 lignes :
ALTER TABLE workshops_metiers ADD COLUMN IF NOT EXISTS video TEXT DEFAULT '';
ALTER TABLE workshops_metiers ADD COLUMN IF NOT EXISTS onedrive TEXT DEFAULT '';

-- Vérification : Afficher la structure actuelle de la table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'workshops_metiers'
ORDER BY ordinal_position;
