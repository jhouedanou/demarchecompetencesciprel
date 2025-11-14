-- Vérifier l'email et le rôle de jeanluc@houedanou.com

-- ÉTAPE 1: Vérifier s'il existe dans auth.users
SELECT
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'jeanluc@houedanou.com';

-- ÉTAPE 2: Vérifier son profil et rôle dans public.profiles
SELECT
  id,
  email,
  name,
  role,
  created_at,
  updated_at
FROM public.profiles
WHERE email = 'jeanluc@houedanou.com';

-- ÉTAPE 3: Vérifier s'il y a plusieurs profils
SELECT
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as admin_count,
  COUNT(CASE WHEN role = 'MANAGER' THEN 1 END) as manager_count,
  COUNT(CASE WHEN role = 'USER' THEN 1 END) as user_count
FROM public.profiles;
