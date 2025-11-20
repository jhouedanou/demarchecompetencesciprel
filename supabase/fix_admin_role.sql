-- ============================================
-- Script de Correction du Rôle Administrateur
-- ============================================
--
-- PROBLÈME: L'utilisateur jeanluc@bigfiveabidjan.com a le rôle USER au lieu de ADMIN
-- SOLUTION: Mettre à jour son rôle dans la table profiles
--
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- Étape 1: Vérifier le rôle actuel
SELECT
  id,
  email,
  role,
  name,
  created_at,
  updated_at
FROM public.profiles
WHERE id = '3a8a561a-f3f4-4a1b-918f-89d9503dae74'::uuid;

-- Étape 2: Mettre à jour le rôle en ADMIN
UPDATE public.profiles
SET
  role = 'ADMIN',
  updated_at = NOW()
WHERE id = '3a8a561a-f3f4-4a1b-918f-89d9503dae74'::uuid;

-- Étape 3: Vérifier que la mise à jour a fonctionné
SELECT
  id,
  email,
  role,
  name,
  updated_at
FROM public.profiles
WHERE id = '3a8a561a-f3f4-4a1b-918f-89d9503dae74'::uuid;

-- Étape 4: Vérifier que l'utilisateur peut maintenant accéder aux workshops
-- (Cette requête simule ce que font les politiques RLS)
SELECT
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = '3a8a561a-f3f4-4a1b-918f-89d9503dae74'::uuid
    AND role IN ('ADMIN', 'MANAGER')
  ) as has_admin_access;

-- ============================================
-- Alternative: Mettre à jour par email si l'ID change
-- ============================================

-- UPDATE public.profiles
-- SET
--   role = 'ADMIN',
--   updated_at = NOW()
-- WHERE email = 'jeanluc@bigfiveabidjan.com';

-- ============================================
-- NOTES
-- ============================================
/*
1. Après l'exécution de ce script, l'utilisateur devra se reconnecter
   pour que les changements prennent effet dans le JWT.

2. Si le problème persiste après la reconnexion:
   - Vider le cache du navigateur (localStorage et cookies)
   - Se déconnecter complètement
   - Se reconnecter

3. Pour vérifier que tout fonctionne:
   - Ouvrir la console développeur (F12)
   - Aller sur /admin/workshops
   - Vérifier qu'il n'y a pas d'erreur 403
   - Les logs devraient afficher: "User authenticated: Jean Luc Houédanou Role: ADMIN"

4. Les modifications de workshops devraient maintenant fonctionner
*/
