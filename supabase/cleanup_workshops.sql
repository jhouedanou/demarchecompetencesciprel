-- ============================================
-- Script de Nettoyage et Réinitialisation des Workshops
-- ============================================
--
-- PROBLÈME IDENTIFIÉ:
-- - Doublons de workshops (ex: 2 "Introduction DC")
-- - IDs métiers négatifs (ex: -153, -156)
-- - État is_active non cohérent entre base de données et interface
--
-- SOLUTION:
-- 1. Supprimer tous les workshops existants
-- 2. Recréer la structure propre avec les bons métiers
-- 3. Activer uniquement ceux qui doivent l'être
-- ============================================

-- ÉTAPE 1: Vérifier l'état actuel
SELECT
  id,
  metier_id,
  metier_nom,
  is_active,
  publication_date,
  onedrive_link
FROM public.workshops
ORDER BY metier_id;

-- ÉTAPE 2: Sauvegarder les liens OneDrive existants (à copier manuellement si besoin)
SELECT
  metier_nom,
  onedrive_link,
  publication_date
FROM public.workshops
WHERE onedrive_link IS NOT NULL;

-- ÉTAPE 3: Supprimer TOUS les workshops existants
-- ⚠️ ATTENTION: Cette commande va supprimer toutes les données de la table workshops
DELETE FROM public.workshops;

-- ÉTAPE 4: Recréer les workshops avec la bonne structure
-- Ces workshops correspondent aux métiers définis dans METIERS (constants.ts)
INSERT INTO public.workshops (metier_id, metier_nom, is_active, publication_date, onedrive_link)
VALUES
  -- Métier 1: Introduction DC
  (1, 'Introduction DC', false, NULL, NULL),

  -- Métier 2: Production
  (2, 'Production', false, NULL, NULL),

  -- Métier 3: SIDT
  (3, 'SIDT', false, NULL, NULL),

  -- Métier 4: Maintenance
  (4, 'Maintenance', false, NULL, NULL),

  -- Métier 5: QSE-RSE/Sûreté
  (5, 'QSE-RSE/Sûreté', false, NULL, NULL),

  -- Métier 6: Contrôle Interne
  (6, 'Contrôle Interne', false, NULL, NULL),

  -- Métier 7: Stocks
  (7, 'Stocks', false, NULL, NULL),

  -- Métier 8: RH/Juridique
  (8, 'RH/Juridique', false, NULL, NULL),

  -- Métier 9: Services Généraux
  (9, 'Services Généraux', false, NULL, NULL),

  -- Métier 10: DAF
  (10, 'DAF', false, NULL, NULL),

  -- Métier 11: Projets
  (11, 'Projets', false, NULL, NULL),

  -- Métier 12: Achats & Logistique
  (12, 'Achats & Logistique', false, NULL, NULL),

  -- Métier 13: Campagne Sensibilisation
  (13, 'Campagne Sensibilisation', false, NULL, NULL)

ON CONFLICT (metier_id) DO NOTHING;

-- ÉTAPE 5: Vérifier que les workshops ont été créés correctement
SELECT
  id,
  metier_id,
  metier_nom,
  is_active,
  created_at
FROM public.workshops
ORDER BY metier_id;

-- ÉTAPE 6: Activer quelques workshops pour test (OPTIONNEL)
-- Décommentez les lignes ci-dessous pour activer certains workshops

/*
UPDATE public.workshops
SET
  is_active = true,
  publication_date = NOW(),
  updated_at = NOW()
WHERE metier_id IN (1, 4, 5, 6, 7, 8);
*/

-- ÉTAPE 7: Vérification finale
-- Cette requête doit retourner 13 lignes (une par métier)
SELECT
  COUNT(*) as total_workshops,
  COUNT(CASE WHEN is_active THEN 1 END) as actifs,
  COUNT(CASE WHEN NOT is_active THEN 1 END) as inactifs
FROM public.workshops;

-- Liste détaillée
SELECT
  metier_id,
  metier_nom,
  CASE WHEN is_active THEN '✅ Actif' ELSE '❌ Inactif' END as statut,
  CASE WHEN onedrive_link IS NOT NULL THEN '🔗 Oui' ELSE '⭕ Non' END as lien
FROM public.workshops
ORDER BY metier_id;

-- ============================================
-- NOTES IMPORTANTES
-- ============================================

/*
APRÈS L'EXÉCUTION DE CE SCRIPT:

1. Vérifiez que vous avez exactement 13 workshops
2. Tous doivent avoir metier_id entre 1 et 13 (pas de négatifs)
3. Tous doivent être inactifs par défaut (is_active = false)
4. Pas de doublons de metier_nom

POUR ACTIVER UN WORKSHOP:

1. Via l'interface admin /admin/workshops:
   - Cliquez sur le bouton "Inactif" pour passer à "Actif"
   - Les changements sont sauvegardés automatiquement

2. Via SQL (si l'interface ne fonctionne pas):
   UPDATE public.workshops
   SET is_active = true, updated_at = NOW()
   WHERE metier_id = 4; -- Remplacer 4 par l'ID du métier souhaité

VÉRIFICATION QUE ÇA FONCTIONNE:

1. Page publique /workshops:
   - Ne doit afficher QUE les workshops avec is_active = true

2. Page admin /admin/workshops:
   - Doit afficher TOUS les workshops (actifs et inactifs)
   - Le bouton toggle doit changer l'état

3. Test SQL:
   SELECT metier_nom, is_active FROM public.workshops WHERE is_active = true;
   -- Doit retourner uniquement les workshops actifs
*/
