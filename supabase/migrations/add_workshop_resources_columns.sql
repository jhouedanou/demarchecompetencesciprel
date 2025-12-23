-- Migration pour ajouter les colonnes de ressources aux workshops métiers
-- Date: 2025-12-23
-- Description: Ajoute les colonnes support_url et referentiel_url pour gérer les liens de téléchargement des ressources

-- Ajouter la colonne support_url si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workshops_metiers' 
        AND column_name = 'support_url'
    ) THEN
        ALTER TABLE workshops_metiers 
        ADD COLUMN support_url TEXT;
        
        COMMENT ON COLUMN workshops_metiers.support_url IS 
        'URL du support de présentation (OneDrive, Google Drive, etc.)';
    END IF;
END $$;

-- Ajouter la colonne referentiel_url si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workshops_metiers' 
        AND column_name = 'referentiel_url'
    ) THEN
        ALTER TABLE workshops_metiers 
        ADD COLUMN referentiel_url TEXT;
        
        COMMENT ON COLUMN workshops_metiers.referentiel_url IS 
        'URL du référentiel de compétences (OneDrive, Google Drive, etc.)';
    END IF;
END $$;

-- Note: Les colonnes video et onedrive existent déjà dans la structure actuelle
-- Cette migration ajoute uniquement les nouvelles colonnes pour les ressources téléchargeables
