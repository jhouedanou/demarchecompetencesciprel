-- Migration pour mettre à jour les compétences savoir-faire des workshops métiers
-- Date: 2025-12-23
-- Note: Ce script met à jour uniquement le champ savoir_faire dans le JSON "referentiel"

-- Production (workshop_production)
UPDATE workshops_metiers
SET contenu = jsonb_set(
  contenu::jsonb,
  '{referentiel,savoir_faire}',
  '["Esprit d''analyse et objectivité", "Communication ouverte et efficace", "Progression continue", "Appartenance", "Esprit d''équipe et coopération", "Réactivité et prise d''initiative", "Rigueur"]'::jsonb
)
WHERE id = 'workshop_production';

-- Maintenance (workshop_maintenance)
UPDATE workshops_metiers
SET contenu = jsonb_set(
  contenu::jsonb,
  '{referentiel,savoir_faire}',
  '["Esprit d''analyse et objectivité", "Communication ouverte et efficace", "Appartenance", "Réactivité et prise d''initiative", "Rigueur", "Ouverture durable à l''autre"]'::jsonb
)
WHERE id = 'workshop_maintenance';

-- Achats et Logistique (workshop_achats_logistique)
UPDATE workshops_metiers
SET contenu = jsonb_set(
  contenu::jsonb,
  '{referentiel,savoir_faire}',
  '["Rigueur", "Organisation du travail", "Communication ouverte et efficace", "Sens du service et la disponibilité aux autres"]'::jsonb
)
WHERE id = 'workshop_achats_logistique';

-- RH & Juridique (workshop_rh_juridique)
-- Note: Ce workshop a une structure différente avec rh et juridique séparés
UPDATE workshops_metiers
SET contenu = jsonb_set(
  jsonb_set(
    contenu::jsonb,
    '{referentiel,rh,savoir_faire}',
    '["Moteur pour le développement du collectif", "Rigueur", "Communication ouverte et efficace", "Sens du service et la disponibilité aux autres", "Appartenance"]'::jsonb
  ),
  '{referentiel,juridique,savoir_faire}',
  '["Moteur pour le développement du collectif", "Rigueur", "Communication ouverte et efficace", "Sens du service et la disponibilité aux autres", "Appartenance"]'::jsonb
)
WHERE id = 'workshop_rh_juridique';

-- Système d'information et Transformation Digitale (workshop_sitd)
UPDATE workshops_metiers
SET contenu = jsonb_set(
  contenu::jsonb,
  '{referentiel,savoir_faire}',
  '["Communication ouverte et efficace", "Esprit d''équipe et coopération", "Sens du service et la disponibilité aux autres", "Créativité", "Leadership du changement"]'::jsonb
)
WHERE id = 'workshop_sitd';

-- Contrôle interne (workshop_controle_interne)
UPDATE workshops_metiers
SET contenu = jsonb_set(
  contenu::jsonb,
  '{referentiel,savoir_faire}',
  '["Rigueur", "Organisation du travail", "Esprit d''analyse et objectivité", "Communication ouverte et efficace"]'::jsonb
)
WHERE id = 'workshop_controle_interne';

-- Direction Financière et Comptabilité (workshop_daf)
UPDATE workshops_metiers
SET contenu = jsonb_set(
  contenu::jsonb,
  '{referentiel,savoir_faire}',
  '["Rigueur", "Organisation du travail", "Esprit d''analyse et objectivité", "Sens du service et la disponibilité aux autres"]'::jsonb
)
WHERE id = 'workshop_daf';

-- QSE - RSE & Sureté (workshop_qse_rse_surete)
UPDATE workshops_metiers
SET contenu = jsonb_set(
  contenu::jsonb,
  '{referentiel,savoir_faire}',
  '["Rigueur", "Organisation du travail", "Esprit d''analyse et objectivité", "Sens du service et la disponibilité aux autres", "Communication ouverte et efficace", "Moteur pour le développement du collectif"]'::jsonb
)
WHERE id = 'workshop_qse_rse_surete';

-- Service généraux (workshop_services_generaux)
UPDATE workshops_metiers
SET contenu = jsonb_set(
  contenu::jsonb,
  '{referentiel,savoir_faire}',
  '["Rigueur", "Organisation du travail", "Sens du service et la disponibilité aux autres", "Appartenance"]'::jsonb
)
WHERE id = 'workshop_services_generaux';

-- Gestion de Stock (workshop_gestion_stock)
UPDATE workshops_metiers
SET contenu = jsonb_set(
  contenu::jsonb,
  '{referentiel,savoir_faire}',
  '["Organisation du travail", "Rigueur", "Appartenance", "Esprit d''analyse et objectivité"]'::jsonb
)
WHERE id = 'workshop_gestion_stock';
