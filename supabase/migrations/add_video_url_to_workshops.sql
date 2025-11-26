-- Migration: Ajout du champ video_url à la table workshops
-- Date: 2025-11-26
-- Description: Permet d'associer une URL de vidéo (YouTube ou autre) à chaque workshop métier

-- Ajouter la colonne video_url si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workshops' 
        AND column_name = 'video_url'
    ) THEN
        ALTER TABLE workshops ADD COLUMN video_url TEXT;
        COMMENT ON COLUMN workshops.video_url IS 'URL de la vidéo associée au workshop (YouTube, etc.)';
    END IF;
END $$;

-- Vérification
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'workshops'
ORDER BY ordinal_position;
