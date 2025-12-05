-- Migration : Ajouter les colonnes video et onedrive à la table workshops_metiers
-- Date : 2024-12-05

-- Vérifier si la colonne video existe, sinon l'ajouter
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workshops_metiers' AND column_name = 'video'
    ) THEN
        ALTER TABLE workshops_metiers ADD COLUMN video TEXT DEFAULT '';
        COMMENT ON COLUMN workshops_metiers.video IS 'URL de la vidéo du workshop (YouTube, Vimeo, etc.)';
    END IF;
END $$;

-- Vérifier si la colonne onedrive existe, sinon l'ajouter
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workshops_metiers' AND column_name = 'onedrive'
    ) THEN
        ALTER TABLE workshops_metiers ADD COLUMN onedrive TEXT DEFAULT '';
        COMMENT ON COLUMN workshops_metiers.onedrive IS 'Lien OneDrive vers les ressources du workshop';
    END IF;
END $$;

-- Vérification : Afficher la structure actuelle de la table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'workshops_metiers'
ORDER BY ordinal_position;
