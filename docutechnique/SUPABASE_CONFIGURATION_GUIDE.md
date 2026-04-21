# Guide de Configuration Supabase

Ce document décrit toutes les configurations nécessaires dans Supabase pour que l'application fonctionne correctement.

## 1. Configuration de l'Authentification

### Email Templates (Templates d'email)

Accédez à: **Authentication → Email Templates** dans le dashboard Supabase

#### A. Confirm Email (Confirmation d'inscription)
```html
<h2>Confirmer votre adresse email</h2>
<p>Cliquez sur le lien ci-dessous pour confirmer votre inscription à CIPREL Démarche Compétences:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
```

#### B. Reset Password (Réinitialisation de mot de passe)

**⚠️ IMPORTANT**: C'est ici que se configure le lien de réinitialisation

```html
<h2>Réinitialisation de votre mot de passe</h2>
<p>Vous avez demandé à réinitialiser votre mot de passe pour CIPREL Démarche Compétences.</p>
<p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe:</p>
<p><a href="{{ .ConfirmationURL }}">Réinitialiser mon mot de passe</a></p>
<p><strong>Ce lien est valable pendant 60 minutes.</strong></p>
<p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
```

### URL Configuration (Configuration des URLs)

Accédez à: **Authentication → URL Configuration**

**Site URL**: `http://localhost:3001` (développement) ou `https://votre-domaine.com` (production)

**Redirect URLs** (URLs de redirection autorisées):
```
http://localhost:3001/reset-password
http://localhost:3001/auth/callback
https://votre-domaine.com/reset-password
https://votre-domaine.com/auth/callback
```

### Email Settings (Paramètres Email)

Accédez à: **Project Settings → Auth → Email**

**Enable Email Confirmations**: ✅ Activé
**Secure Email Change**: ✅ Activé (recommandé)

**SMTP Settings** (Optionnel - pour utiliser votre propre serveur email):
- Host: `smtp.votre-serveur.com`
- Port: `587`
- Username: `noreply@ciprel.ci`
- Password: `[votre mot de passe SMTP]`
- Sender email: `noreply@ciprel.ci`
- Sender name: `CIPREL Démarche Compétences`

> **Note**: Si vous ne configurez pas SMTP, Supabase utilisera son service email par défaut (limité à 3-4 emails par heure en développement).

## 2. Configuration Row Level Security (RLS)

### Table: profiles

Les politiques RLS sont déjà définies dans le fichier [setup_workshops_admin.sql](supabase/setup_workshops_admin.sql).

Vérifiez qu'elles sont bien activées:

```sql
-- Vérifier que RLS est activé
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "users_view_own_profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Politique: Les admins peuvent voir tous les profils
CREATE POLICY "admins_view_all_profiles" ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER')
    )
  );
```

### Table: workshops

Les politiques sont dans [setup_workshops_admin.sql](supabase/setup_workshops_admin.sql):

```sql
-- Public voit les workshops actifs
CREATE POLICY "workshops_select_public" ON public.workshops
  FOR SELECT
  USING (is_active = true);

-- Admins voient et modifient tous les workshops
CREATE POLICY "workshops_select_admin" ON public.workshops
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('ADMIN', 'MANAGER')
    )
  );

-- etc. (voir le fichier pour toutes les politiques)
```

## 3. Configuration de l'Utilisateur Admin

### Étape 1: Créer l'utilisateur via l'interface Supabase

1. Allez dans **Authentication → Users**
2. Cliquez sur **Add User**
3. Remplissez:
   - Email: `jeanluc@bigfiveabidjan.com` (ou votre email admin)
   - Password: `[choisir un mot de passe sécurisé]`
   - Auto Confirm User: ✅ Activé (pour ne pas avoir à confirmer l'email)

### Étape 2: Mettre à jour le rôle dans la table profiles

Utilisez le script SQL [fix_admin_role.sql](supabase/fix_admin_role.sql):

```sql
-- Vérifier l'ID de l'utilisateur
SELECT id, email FROM auth.users WHERE email = 'jeanluc@bigfiveabidjan.com';

-- Mettre à jour le rôle (remplacer USER_ID par l'ID obtenu ci-dessus)
UPDATE public.profiles
SET
  role = 'ADMIN',
  updated_at = NOW()
WHERE id = 'USER_ID'::uuid;

-- Vérifier
SELECT id, email, role FROM public.profiles WHERE email = 'jeanluc@bigfiveabidjan.com';
```

## 4. Configuration des Variables d'Environnement

Votre fichier `.env.local` doit contenir:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yuyjwspittftodncnfbd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

**⚠️ SÉCURITÉ**:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` peuvent être publics
- ❌ `SUPABASE_SERVICE_ROLE_KEY` doit RESTER SECRET (ne jamais commiter dans Git)

## 5. Vérification de la Configuration

### Test 1: Connexion Email/Password

```bash
# Dans la console navigateur
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'jeanluc@bigfiveabidjan.com',
  password: 'votre_mot_de_passe'
})
console.log('Session:', data.session)
```

### Test 2: Reset Password

1. Aller sur `/forgot-password`
2. Entrer votre email
3. Vérifier que vous recevez l'email
4. Cliquer sur le lien (doit rediriger vers `/reset-password`)
5. Changer le mot de passe
6. Vérifier que vous pouvez vous connecter avec le nouveau mot de passe

### Test 3: Permissions Admin

```bash
# Dans la console navigateur (une fois connecté en tant qu'admin)
const response = await fetch('/api/admin/workshops', {
  headers: {
    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
  }
})
console.log('Status:', response.status) // Devrait être 200
```

## 6. Problèmes Courants et Solutions

### Problème: Erreur 403 sur les endpoints admin

**Cause**: L'utilisateur n'a pas le rôle ADMIN dans la table profiles

**Solution**: Exécuter [fix_admin_role.sql](supabase/fix_admin_role.sql) et se reconnecter

### Problème: Email de reset non reçu

**Causes possibles**:
1. SMTP non configuré (emails limités en dev)
2. Email dans les spams
3. URL de redirection non autorisée

**Solutions**:
1. Configurer SMTP custom
2. Vérifier le dossier spam
3. Ajouter l'URL dans **Authentication → URL Configuration → Redirect URLs**

### Problème: "Lien invalide ou expiré" lors du reset

**Causes**:
1. Le token a expiré (60 minutes)
2. Le lien de redirection est incorrect
3. L'URL dans les templates email est mal configurée

**Solutions**:
1. Redemander un nouveau lien
2. Vérifier que l'URL de redirection est dans la liste autorisée
3. Vérifier le template email dans Supabase

## 7. Données vs JSON

**✅ Configuration actuelle**: Toutes les données sont dans Supabase

- **profiles**: Table Supabase
- **workshops**: Table Supabase
- **questions**: Table Supabase
- **quiz_results**: Table Supabase
- **user_reading_progress**: Table Supabase

**⚠️ Exception**: Le fichier [metiers-blocks.json](src/data/metiers-blocks.json) existe mais n'est PAS utilisé dans le code. Il peut être supprimé.

**Vérification**:
```bash
# Aucun import de metiers-blocks.json n'est trouvé dans le code
grep -r "metiers-blocks.json" src/
# (aucun résultat)
```

## 8. Migration Complète vers Supabase

Toutes les données sont déjà dans Supabase. Voici la structure:

```sql
-- Tables principales
- auth.users (géré par Supabase Auth)
- public.profiles
- public.workshops
- public.questions
- public.metiers
- public.quiz_results
- public.user_reading_progress
```

Aucune donnée n'est stockée en JSON local. Tout passe par l'API Supabase.

## 9. Checklist de Déploiement

Avant de déployer en production:

- [ ] Configurer les templates email avec le bon domaine
- [ ] Ajouter les URLs de production dans Redirect URLs
- [ ] Configurer SMTP custom (recommandé)
- [ ] Créer l'utilisateur admin en production
- [ ] Mettre à jour les variables d'environnement
- [ ] Tester la réinitialisation de mot de passe
- [ ] Vérifier les permissions admin (403 → 200)
- [ ] Activer les politiques RLS sur toutes les tables
- [ ] Sauvegarder la clé SERVICE_ROLE en lieu sûr

## Support

En cas de problème:
1. Vérifier les logs Supabase: **Logs → API**
2. Vérifier les politiques RLS: **Database → Policies**
3. Tester dans le SQL Editor: **SQL Editor**
