-- Script de Configuration des Workshops et Admin
-- À exécuter dans Supabase SQL Editor

-- ============================================
-- PARTIE 1: Vérification de la Table Workshops
-- ============================================

-- Vérifier que la table existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'workshops'
) as table_exists;

-- Afficher la structure actuelle
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
-- PARTIE 2: Initialiser les Workshops Métiers
-- ============================================

-- Supprimer les workshops existants si nécessaire (ATTENTION: supprime toutes les données)
-- TRUNCATE TABLE public.workshops CASCADE;

-- Insérer tous les workshops métiers
INSERT INTO public.workshops (metier_id, metier_nom, is_active, publication_date, onedrive_link)
VALUES
  (1, 'Introduction DC', false, NULL, NULL),
  (2, 'Production', false, NULL, NULL),
  (3, 'SIDT', false, NULL, NULL),
  (4, 'Maintenance', false, NULL, NULL),
  (5, 'QSE-RSE/Sûreté', false, NULL, NULL),
  (6, 'Contrôle Interne', false, NULL, NULL),
  (7, 'Stocks', false, NULL, NULL),
  (8, 'RH/Juridique', false, NULL, NULL),
  (9, 'Services Généraux', false, NULL, NULL),
  (10, 'DAF', false, NULL, NULL),
  (11, 'Projets', false, NULL, NULL),
  (12, 'Achats & Logistique', false, NULL, NULL),
  (13, 'Campagne Sensibilisation', false, NULL, NULL)
ON CONFLICT (metier_id) 
DO UPDATE SET 
  metier_nom = EXCLUDED.metier_nom,
  updated_at = NOW();

-- Vérifier l'insertion
SELECT 
  id,
  metier_id,
  metier_nom,
  is_active,
  publication_date,
  onedrive_link,
  created_at,
  updated_at
FROM public.workshops
ORDER BY metier_id;

-- ============================================
-- PARTIE 3: Création de l'Utilisateur Admin
-- ============================================

-- NOTE: L'utilisateur doit être créé via l'interface Supabase:
-- Authentication → Users → Add User
-- Email: admin@ciprel.ci
-- Password: [votre mot de passe sécurisé]
-- Confirm Email: true

-- Après création de l'utilisateur, récupérer son ID:
SELECT id, email FROM auth.users WHERE email = 'admin@ciprel.ci';

-- Exemple de sortie:
-- id: 123e4567-e89b-12d3-a456-426614174000
-- email: admin@ciprel.ci

-- ============================================
-- PARTIE 4: Configuration du Profil Admin
-- ============================================

-- Vérifier si un profil existe pour cet utilisateur
SELECT * FROM public.profiles WHERE email = 'admin@ciprel.ci';

-- Si le profil n'existe pas, le créer
-- (Remplacer 'USER_ID_HERE' par l'ID obtenu à l'étape précédente)
INSERT INTO public.profiles (id, email, role, full_name)
VALUES (
  'USER_ID_HERE'::uuid, 
  'admin@ciprel.ci', 
  'ADMIN',
  'Administrateur CIPREL'
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'ADMIN',
  updated_at = NOW();

-- OU, si le profil existe déjà, juste mettre à jour le rôle
UPDATE public.profiles 
SET 
  role = 'ADMIN',
  updated_at = NOW()
WHERE email = 'admin@ciprel.ci';

-- Vérification finale
SELECT 
  id,
  email,
  role,
  full_name,
  created_at,
  updated_at
FROM public.profiles 
WHERE email = 'admin@ciprel.ci';

-- ============================================
-- PARTIE 5: Vérification des Politiques RLS
-- ============================================

-- Vérifier que RLS est activé
SELECT 
  schemaname, 
  tablename, 
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'workshops';

-- Lister les politiques existantes
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
WHERE schemaname = 'public' AND tablename = 'workshops';

-- ============================================
-- PARTIE 6: Correction des Politiques RLS (si nécessaire)
-- ============================================

-- Supprimer les anciennes politiques conflictuelles
DROP POLICY IF EXISTS "Admins can manage workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can view all workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can update workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can insert workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can delete workshops" ON public.workshops;
DROP POLICY IF EXISTS "Public can view active workshops" ON public.workshops;
DROP POLICY IF EXISTS "Anyone can view active workshops" ON public.workshops;

-- Recréer les politiques proprement

-- SELECT: Public voit les workshops actifs
CREATE POLICY "workshops_select_public" ON public.workshops
  FOR SELECT
  USING (is_active = true);

-- SELECT: Admins voient tous les workshops
CREATE POLICY "workshops_select_admin" ON public.workshops
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('ADMIN', 'MANAGER')
    )
  );

-- INSERT: Seuls les admins peuvent créer
CREATE POLICY "workshops_insert_admin" ON public.workshops
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('ADMIN', 'MANAGER')
    )
  );

-- UPDATE: Seuls les admins peuvent modifier
CREATE POLICY "workshops_update_admin" ON public.workshops
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('ADMIN', 'MANAGER')
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('ADMIN', 'MANAGER')
    )
  );

-- DELETE: Seuls les admins peuvent supprimer
CREATE POLICY "workshops_delete_admin" ON public.workshops
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('ADMIN', 'MANAGER')
    )
  );

-- ============================================
-- PARTIE 7: Tests de Fonctionnement
-- ============================================

-- Test 1: Vérifier qu'un admin peut voir tous les workshops
SET request.jwt.claims = '{"sub": "USER_ID_HERE", "role": "authenticated"}';
SELECT COUNT(*) as total_workshops FROM public.workshops;

-- Test 2: Essayer une mise à jour (en tant qu'admin)
UPDATE public.workshops 
SET onedrive_link = 'https://test-link.com'
WHERE metier_id = 1;

-- Vérifier la mise à jour
SELECT metier_id, metier_nom, onedrive_link 
FROM public.workshops 
WHERE metier_id = 1;

-- Test 3: Vérifier les workshops actifs (vue publique)
SELECT 
  metier_id,
  metier_nom,
  publication_date,
  onedrive_link
FROM public.workshops
WHERE is_active = true
ORDER BY metier_id;

-- ============================================
-- PARTIE 8: Activation d'un Workshop de Test
-- ============================================

-- Activer un workshop pour tester
UPDATE public.workshops 
SET 
  is_active = true,
  publication_date = NOW(),
  onedrive_link = 'https://onedrive.live.com/?id=EXAMPLE_LINK',
  updated_at = NOW()
WHERE metier_id = 1; -- Introduction DC

-- Vérifier
SELECT * FROM public.workshops WHERE metier_id = 1;

-- ============================================
-- PARTIE 9: Fonctions Utilitaires
-- ============================================

-- Fonction pour vérifier si l'utilisateur actuel est admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
    AND role IN ('ADMIN', 'MANAGER')
  );
END;
$$;

-- Test de la fonction
SELECT public.is_current_user_admin();

-- ============================================
-- PARTIE 10: Statistiques et Monitoring
-- ============================================

-- Compter les workshops par statut
SELECT 
  is_active,
  COUNT(*) as count,
  COUNT(CASE WHEN onedrive_link IS NOT NULL THEN 1 END) as with_link,
  COUNT(CASE WHEN publication_date IS NOT NULL THEN 1 END) as with_date
FROM public.workshops
GROUP BY is_active;

-- Lister les workshops actifs avec toutes leurs infos
SELECT 
  metier_id,
  metier_nom,
  TO_CHAR(publication_date, 'DD/MM/YYYY') as date_publication,
  CASE 
    WHEN onedrive_link IS NOT NULL THEN 'Oui'
    ELSE 'Non'
  END as lien_disponible,
  CASE 
    WHEN is_active THEN 'Actif'
    ELSE 'Inactif'
  END as statut
FROM public.workshops
ORDER BY metier_id;

-- ============================================
-- NOTES IMPORTANTES
-- ============================================

/*
1. L'utilisateur admin doit être créé via Supabase UI (Authentication → Users)
2. Remplacer 'USER_ID_HERE' par l'ID réel de l'utilisateur
3. Les politiques RLS utilisent une sous-requête pour vérifier le rôle
4. Les workshops sont inactifs par défaut pour la sécurité
5. La page publique /workshops n'affiche que les workshops actifs
6. La page admin /admin/workshops nécessite une authentification Supabase valide

ORDRE D'EXÉCUTION RECOMMANDÉ:
1. Créer l'utilisateur admin via Supabase UI
2. Exécuter PARTIE 4 (avec le bon USER_ID)
3. Exécuter PARTIE 2 (initialisation des workshops)
4. Exécuter PARTIE 6 (politiques RLS)
5. Exécuter PARTIE 8 (activer un workshop de test)
6. Tester via l'application web

DÉPANNAGE:
- Si les updates ne fonctionnent pas, vérifier les politiques RLS (PARTIE 6)
- Si l'authentification échoue, vérifier le profil (PARTIE 4)
- Si les workshops n'apparaissent pas, vérifier is_active (PARTIE 8)
*/
