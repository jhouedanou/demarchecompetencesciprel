-- Migration 008: Seed initial des workshops métiers
-- Cette migration insère les 12 workshops métiers avec leurs configurations par défaut

-- Insérer les 12 workshops métiers
-- ON CONFLICT permet de ne pas créer de doublon si les workshops existent déjà
INSERT INTO public.workshops (metier_id, metier_nom, is_active, publication_date, onedrive_link) VALUES
  (1, 'Production', false, NULL, NULL),
  (2, 'SIDT', false, NULL, NULL),
  (3, 'Maintenance', false, NULL, NULL),
  (4, 'QSE-RSE/Sûreté', false, NULL, NULL),
  (5, 'Contrôle Interne', false, NULL, NULL),
  (6, 'Stocks', false, NULL, NULL),
  (7, 'RH/Juridique', false, NULL, NULL),
  (8, 'Services Généraux', false, NULL, NULL),
  (9, 'DFC', false, NULL, NULL),
  (10, 'Projets', false, NULL, NULL),
  (11, 'Achats & Logistique', false, NULL, NULL),
  (12, 'Direction', false, NULL, NULL)
ON CONFLICT (metier_id) DO NOTHING;

-- Vérifier que l'insertion a réussi
DO $$
DECLARE
  workshop_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO workshop_count FROM public.workshops;
  RAISE NOTICE 'Total workshops in database: %', workshop_count;
  
  IF workshop_count < 12 THEN
    RAISE WARNING 'Expected 12 workshops but found only %. Some workshops may not have been inserted.', workshop_count;
  ELSE
    RAISE NOTICE 'All 12 workshops are present in the database.';
  END IF;
END $$;
