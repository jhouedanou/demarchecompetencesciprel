-- Ajouter les colonnes pour les ressources téléchargeables aux workshops métiers
-- À exécuter dans Supabase SQL Editor

-- Ajouter la colonne support_url si elle n'existe pas
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workshops_metiers' AND column_name = 'support_url') THEN
        ALTER TABLE workshops_metiers ADD COLUMN support_url TEXT;
        COMMENT ON COLUMN workshops_metiers.support_url IS 'URL du support de présentation (PowerPoint, PDF)';
    END IF;
END $$;

-- Ajouter la colonne referentiel_url si elle n'existe pas
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workshops_metiers' AND column_name = 'referentiel_url') THEN
        ALTER TABLE workshops_metiers ADD COLUMN referentiel_url TEXT;
        COMMENT ON COLUMN workshops_metiers.referentiel_url IS 'URL du référentiel de compétences';
    END IF;
END $$;

-- Vérifier que la colonne video existe
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workshops_metiers' AND column_name = 'video') THEN
        ALTER TABLE workshops_metiers ADD COLUMN video TEXT;
        COMMENT ON COLUMN workshops_metiers.video IS 'URL de la vidéo du workshop';
    END IF;
END $$;

-- Vérifier que la colonne onedrive existe
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workshops_metiers' AND column_name = 'onedrive') THEN
        ALTER TABLE workshops_metiers ADD COLUMN onedrive TEXT;
        COMMENT ON COLUMN workshops_metiers.onedrive IS 'Lien OneDrive vers les ressources';
    END IF;
END $$;

-- Afficher le résultat
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'workshops_metiers'
ORDER BY ordinal_position;
