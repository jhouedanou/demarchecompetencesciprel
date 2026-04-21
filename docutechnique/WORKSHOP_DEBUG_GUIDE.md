# Guide de Débogage : Workshops Admin

## Problème Identifié
Les changements effectués depuis `/admin/workshops` ne sont pas reflétés dans la section "workshops métiers" et le bouton "Sauvegarder" ne fonctionne pas.

## Causes Possibles

### 1. Problème d'Authentification
L'utilisateur utilise l'authentification locale (`ciprel_admin_auth` dans localStorage) au lieu de l'authentification Supabase. Les appels API nécessitent un JWT token Supabase valide.

**Symptômes:**
- Le bouton "Sauvegarder" ne fait rien
- Aucun message d'erreur visible
- Les changements ne persistent pas

**Vérification:**
```javascript
// Dans la console du navigateur:
console.log(localStorage.getItem('ciprel_admin_auth'))
// Devrait retourner: {"isAuthenticated":true,"username":"admin"}
```

### 2. Problème de Token JWT
L'API `/api/admin/workshops` utilise `requireAdmin()` qui vérifie:
1. Token JWT valide dans le header `Authorization`
2. Profil utilisateur avec role `ADMIN` ou `MANAGER` dans Supabase

**Vérification:**
```javascript
// Dans la console du navigateur:
const { data: { session } } = await supabase.auth.getSession()
console.log(session?.access_token) // Doit retourner un token JWT
```

## Solution: Migration vers Authentification Supabase

### Étape 1: Créer un Utilisateur Admin dans Supabase

1. **Accéder à Supabase Dashboard:**
   - Aller sur https://supabase.com
   - Se connecter à votre projet
   - Aller dans `Authentication` → `Users`

2. **Créer un utilisateur admin:**
   ```
   Email: admin@ciprel.ci (ou votre email)
   Password: [mot de passe sécurisé]
   ```
   
3. **Vérifier l'email:**
   - Confirmer l'email de l'utilisateur

### Étape 2: Assigner le Rôle Admin dans la Table Profiles

1. **Via SQL Editor dans Supabase:**
   ```sql
   -- Vérifier que l'utilisateur existe
   SELECT id, email FROM auth.users WHERE email = 'admin@ciprel.ci';
   
   -- Vérifier le profil
   SELECT * FROM public.profiles WHERE email = 'admin@ciprel.ci';
   
   -- Mettre à jour le rôle
   UPDATE public.profiles 
   SET role = 'ADMIN',
       updated_at = NOW()
   WHERE email = 'admin@ciprel.ci';
   
   -- Vérification finale
   SELECT id, email, role FROM public.profiles WHERE email = 'admin@ciprel.ci';
   ```

2. **Vérifier la fonction is_admin:**
   ```sql
   -- Tester la fonction
   SELECT public.is_admin();
   ```

### Étape 3: Se Connecter avec le Compte Supabase

1. **Déconnecter l'admin local:**
   - Aller sur `/admin/workshops`
   - Ouvrir la console du navigateur
   - Exécuter: `localStorage.removeItem('ciprel_admin_auth')`
   - Recharger la page

2. **Se connecter via Supabase:**
   - Aller sur `/login`
   - Utiliser les identifiants créés à l'étape 1
   - Vous serez redirigé vers `/admin`

3. **Vérifier le token:**
   ```javascript
   // Dans la console:
   const { data: { session } } = await supabase.auth.getSession()
   console.log('Token présent:', !!session?.access_token)
   console.log('User ID:', session?.user?.id)
   ```

### Étape 4: Tester la Sauvegarde

1. **Aller sur `/admin/workshops`**
2. **Éditer un workshop**
3. **Cliquer sur "Sauvegarder"**
4. **Vérifier dans la console du navigateur:**
   - Rechercher les logs réseau (Network tab)
   - Vérifier l'appel à `/api/admin/workshops`
   - Status devrait être 200 OK

## Vérification du Fonctionnement

### Test API Direct

Dans la console du navigateur:

```javascript
// 1. Récupérer le token
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// 2. Tester GET
const response = await fetch('/api/admin/workshops', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
const data = await response.json()
console.log('Workshops:', data)

// 3. Tester UPDATE
const updateResponse = await fetch('/api/admin/workshops', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: 1, // ID du workshop à tester
    onedrive_link: 'https://test.com',
    publication_date: new Date().toISOString()
  })
})
const updateData = await updateResponse.json()
console.log('Update result:', updateData)
```

## Création de Workshops depuis Supabase

### Option 1: Via SQL Editor

```sql
-- Insérer un nouveau workshop
INSERT INTO public.workshops (
  metier_id,
  metier_nom,
  is_active,
  publication_date,
  onedrive_link
) VALUES (
  14, -- ID du métier
  'Nouveau Métier',
  false, -- Inactif par défaut
  NULL,
  NULL
);

-- Vérifier
SELECT * FROM public.workshops ORDER BY metier_id;
```

### Option 2: Via Interface Admin (une fois l'auth fixée)

1. Aller sur `/admin/workshops`
2. Cliquer sur "Sync Métiers"
3. Cela créera automatiquement les workshops pour tous les métiers définis dans `METIERS`

## Liaison Dashboard → Application

### Flow de Données

```
[Admin Dashboard] → [Supabase API] → [Table workshops] → [Public Page /workshops]
      ↓                    ↓                                      ↓
   JWT Auth         RLS Policies                           Active workshops only
```

### Vérification de la Synchronisation

1. **Modifier un workshop dans l'admin:**
   ```
   /admin/workshops → Éditer → Activer → Ajouter lien OneDrive → Sauvegarder
   ```

2. **Vérifier sur la page publique:**
   ```
   /workshops → Le workshop devrait apparaître si is_active = true
   ```

3. **Vérifier dans Supabase:**
   ```sql
   SELECT metier_id, metier_nom, is_active, onedrive_link 
   FROM public.workshops 
   WHERE is_active = true
   ORDER BY metier_id;
   ```

## Debugging Avancé

### Logs Serveur (Next.js)

Dans le terminal où tourne `npm run dev`, rechercher:
```
[API Auth] User authenticated: admin@ciprel.ci
[API Auth] Admin access granted: admin@ciprel.ci Role: ADMIN
```

### Logs Browser

Dans la console du navigateur:
```javascript
// Activer les logs détaillés
localStorage.setItem('debug', 'api:*')

// Vérifier l'état de l'auth
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', {
  user: session?.user?.email,
  expires: session?.expires_at,
  hasToken: !!session?.access_token
})
```

### Politique RLS

Vérifier que les politiques RLS permettent les updates:

```sql
-- Dans Supabase SQL Editor
-- Tester en tant qu'utilisateur authentifié
SELECT current_setting('request.jwt.claims', true)::json->>'sub' as user_id;

-- Vérifier le rôle
SELECT role FROM public.profiles 
WHERE id = current_setting('request.jwt.claims', true)::json->>'sub';

-- Tester un update direct
UPDATE public.workshops 
SET onedrive_link = 'https://test.com'
WHERE id = 1;
-- Si cela échoue, c'est un problème RLS
```

## Correction des Politiques RLS (si nécessaire)

```sql
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Admins can update workshops" ON public.workshops;

-- Créer une politique UPDATE plus permissive pour les admins
CREATE POLICY "Admins can update workshops" ON public.workshops
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role IN ('ADMIN', 'MANAGER')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role IN ('ADMIN', 'MANAGER')
    )
  );
```

## Support

Si le problème persiste après avoir suivi ce guide:

1. **Vérifier les logs:**
   - Terminal Next.js
   - Console du navigateur (onglet Console)
   - Onglet Network du navigateur

2. **Capturer les erreurs:**
   ```javascript
   // Dans la console
   window.addEventListener('error', (e) => console.error('Global error:', e))
   window.addEventListener('unhandledrejection', (e) => console.error('Promise rejection:', e))
   ```

3. **Vérifier la configuration Supabase:**
   - URL: `process.env.NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key: `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Ces valeurs doivent être correctes dans `.env.local`
