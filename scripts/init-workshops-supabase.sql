-- Script pour initialiser les workshops dans Supabase
-- À exécuter dans le SQL Editor de Supabase Dashboard

-- D'abord, vérifier s'il y a des workshops existants
SELECT * FROM public.workshops;

-- Insérer les workshops pour tous les métiers (si pas déjà présents)
INSERT INTO public.workshops (metier_id, metier_nom, is_active, publication_date, onedrive_link)
VALUES
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

-- Vérifier les workshops créés
SELECT * FROM public.workshops ORDER BY metier_id;
