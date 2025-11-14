-- Script pour vérifier si jhouedanou@gmail.com est un admin

-- ÉTAPE 1: Vérifier l'utilisateur dans auth.users
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'jhouedanou@gmail.com';

-- ÉTAPE 2: Vérifier le profil et le rôle dans public.profiles
SELECT
  id,
  email,
  name,
  role,
  created_at,
  updated_at
FROM public.profiles
WHERE email = 'jhouedanou@gmail.com';

-- ÉTAPE 3: Vérifier que le rôle est bien ADMIN
SELECT
  CASE
    WHEN (SELECT role FROM public.profiles WHERE email = 'jhouedanou@gmail.com') = 'ADMIN'
    THEN 'OUI - L''utilisateur est un ADMIN'
    ELSE 'NON - L''utilisateur n''est pas un ADMIN'
  END as is_admin;
