-- Script pour modifier l'email de l'admin
-- Ancien email: admin@ciprel.ci
-- Nouvel email: jhouedanou@gmail.com

-- ÉTAPE 1: Récupérer l'ID de l'utilisateur admin (vérification)
SELECT id, email FROM auth.users WHERE email = 'admin@ciprel.ci';

-- ÉTAPE 2: Modifier l'email dans auth.users
UPDATE auth.users
SET email = 'jhouedanou@gmail.com', email_confirmed_at = NOW()
WHERE email = 'admin@ciprel.ci';

-- ÉTAPE 3: Modifier l'email dans public.profiles
UPDATE public.profiles
SET email = 'jhouedanou@gmail.com', updated_at = NOW()
WHERE email = 'admin@ciprel.ci';

-- ÉTAPE 4: Vérifier que la modification a été effectuée
SELECT id, email FROM auth.users WHERE email = 'jhouedanou@gmail.com';
SELECT id, email, role FROM public.profiles WHERE email = 'jhouedanou@gmail.com';
