-- Script de test et diagnostic pour les workshops
-- Exécutez ce script dans Supabase SQL Editor pour diagnostiquer les problèmes

-- ============================================
-- 1. VÉRIFICATION DE LA TABLE
-- ============================================

-- Vérifier que la table existe
SELECT 
  'Table workshops existe' as status,
  COUNT(*) as total_workshops
FROM public.workshops;

-- Vérifier la structure de la table
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'workshops'
ORDER BY ordinal_position;

-- ============================================
-- 2. VÉRIFICATION DES DONNÉES
-- ============================================

-- Lister tous les workshops
SELECT 
  id,
  metier_id,
  metier_nom,
  is_active,
  publication_date,
  CASE 
    WHEN onedrive_link IS NOT NULL THEN 'Oui'
    ELSE 'Non'
  END as has_link,
  created_at,
  updated_at
FROM public.workshops
ORDER BY metier_id;

-- Statistiques
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as actifs,
  COUNT(*) FILTER (WHERE is_active = false) as inactifs,
  COUNT(*) FILTER (WHERE onedrive_link IS NOT NULL) as avec_lien,
  COUNT(*) FILTER (WHERE publication_date IS NOT NULL) as avec_date
FROM public.workshops;

-- ============================================
-- 3. VÉRIFICATION DES POLITIQUES RLS
-- ============================================

-- Lister toutes les politiques RLS sur la table workshops
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'workshops';

-- Vérifier si RLS est activé
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'workshops';

-- ============================================
-- 4. VÉRIFICATION DE VOTRE PROFIL UTILISATEUR
-- ============================================

-- Voir votre profil actuel
SELECT 
  id,
  email,
  role,
  created_at
FROM public.profiles
WHERE id = auth.uid();

-- Si vous n'avez pas de profil, cette requête retournera vide
-- Dans ce cas, créez un profil admin :
/*
INSERT INTO public.profiles (id, email, role)
VALUES (
  auth.uid(),
  'VOTRE_EMAIL@example.com',
  'ADMIN'
);
*/

-- ============================================
-- 5. TEST D'INSERTION
-- ============================================

-- Test d'insertion d'un workshop de test
-- Cette requête testera si vous avez les permissions nécessaires
DO $$
BEGIN
  -- Essayer d'insérer un workshop de test
  INSERT INTO public.workshops (metier_id, metier_nom, is_active)
  VALUES (99, 'Test Workshop', false);
  
  RAISE NOTICE 'SUCCESS: Workshop de test créé avec succès!';
  
  -- Nettoyer le test
  DELETE FROM public.workshops WHERE metier_id = 99;
  RAISE NOTICE 'Test nettoyé avec succès';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ERREUR lors de la création du workshop: %', SQLERRM;
  RAISE NOTICE 'Vérifiez que votre profil a le rôle ADMIN ou MANAGER';
END $$;

-- ============================================
-- 6. TEST DE MISE À JOUR
-- ============================================

-- Test de mise à jour d'un workshop existant
DO $$
DECLARE
  test_workshop_id INTEGER;
BEGIN
  -- Récupérer l'ID du premier workshop
  SELECT id INTO test_workshop_id FROM public.workshops LIMIT 1;
  
  IF test_workshop_id IS NULL THEN
    RAISE NOTICE 'Aucun workshop trouvé pour le test de mise à jour';
  ELSE
    -- Essayer de mettre à jour
    UPDATE public.workshops 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = test_workshop_id;
    
    RAISE NOTICE 'SUCCESS: Mise à jour du workshop % réussie', test_workshop_id;
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ERREUR lors de la mise à jour: %', SQLERRM;
END $$;

-- ============================================
-- 7. SOLUTIONS RAPIDES
-- ============================================

-- Si vous n'avez pas de workshops, les créer tous :
/*
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
*/

-- Si vous n'avez pas le bon rôle, mettez-le à jour :
/*
UPDATE public.profiles 
SET role = 'ADMIN' 
WHERE id = auth.uid();
*/

-- ============================================
-- 8. VÉRIFICATION FINALE
-- ============================================

-- Compter les workshops par statut
SELECT 
  'Workshops actifs' as type,
  COUNT(*) as count
FROM public.workshops
WHERE is_active = true

UNION ALL

SELECT 
  'Workshops inactifs' as type,
  COUNT(*) as count
FROM public.workshops
WHERE is_active = false

UNION ALL

SELECT 
  'Total workshops' as type,
  COUNT(*) as count
FROM public.workshops;

-- ============================================
-- RÉSUMÉ DES COMMANDES UTILES
-- ============================================

/*
-- Pour réinitialiser complètement les workshops :
DELETE FROM public.workshops;
ALTER SEQUENCE workshops_id_seq RESTART WITH 1;

-- Pour désactiver temporairement RLS (ATTENTION : à ne faire qu'en développement) :
ALTER TABLE public.workshops DISABLE ROW LEVEL SECURITY;

-- Pour réactiver RLS :
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- Pour voir tous les utilisateurs et leurs rôles :
SELECT id, email, role FROM public.profiles ORDER BY created_at DESC;

-- Pour promouvoir un utilisateur en admin :
UPDATE public.profiles SET role = 'ADMIN' WHERE email = 'email@example.com';
*/
