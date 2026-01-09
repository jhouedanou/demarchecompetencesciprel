# Guide complet : Gestion des Workshops via Supabase

## 🎯 Vue d'ensemble

Ce guide vous explique comment créer et gérer les workshops métiers via Supabase Dashboard et les lier à votre application.

## 📊 Structure de la table `workshops`

```sql
- id: BIGSERIAL (auto-incrémenté)
- metier_id: INTEGER (1-12, unique)
- metier_nom: VARCHAR(100)
- is_active: BOOLEAN (default: false)
- publication_date: TIMESTAMP WITH TIME ZONE (nullable)
- onedrive_link: TEXT (nullable)
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
```

## 🔧 Méthode 1 : Création via Supabase Dashboard (Recommandé)

### Étape 1 : Accéder à votre projet Supabase

1. Allez sur https://supabase.com/dashboard
2. Connectez-vous à votre compte
3. Sélectionnez votre projet : `yuyjwspittftodncnfbd`

### Étape 2 : Vérifier que la table existe

1. Dans le menu latéral, cliquez sur **Table Editor**
2. Cherchez la table `workshops`
3. Si elle n'existe pas, allez dans **SQL Editor** et exécutez le script de création (voir section "Scripts SQL" ci-dessous)

### Étape 3 : Insérer les données des workshops

1. Dans **SQL Editor**, cliquez sur **New Query**
2. Copiez et collez le script suivant :

```sql
-- Insérer les 12 workshops métiers
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
```

3. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)
4. Vérifiez que le message indique "Success. No rows returned"

### Étape 4 : Vérifier les données insérées

1. Allez dans **Table Editor** > **workshops**
2. Vous devriez voir les 12 lignes avec tous les workshops
3. Notez les valeurs par défaut :
   - `is_active` = false
   - `publication_date` = NULL
   - `onedrive_link` = NULL

### Étape 5 : Modifier un workshop manuellement (optionnel)

1. Dans **Table Editor** > **workshops**
2. Cliquez sur une ligne pour l'éditer
3. Modifiez les champs :
   - `is_active` : true/false
   - `publication_date` : sélectionnez une date
   - `onedrive_link` : collez le lien OneDrive
4. Cliquez sur **Save**

## 🔧 Méthode 2 : Création via l'interface Admin

### Diagnostic du problème actuel

L'erreur provient probablement de l'une de ces causes :

1. **Problème de permissions RLS** : Les politiques Row Level Security bloquent l'insertion
2. **Problème d'authentification** : L'utilisateur n'est pas reconnu comme admin
3. **Contrainte unique violée** : Un workshop avec le même `metier_id` existe déjà

### Solution : Vérifier les politiques RLS

1. Dans Supabase Dashboard, allez dans **Authentication** > **Policies**
2. Sélectionnez la table `workshops`
3. Assurez-vous que la politique "Admins can manage workshops" existe :

```sql
-- Si elle n'existe pas, créez-la dans SQL Editor
CREATE POLICY "Admins can manage workshops" ON public.workshops
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER')
    )
  );
```

### Vérifier votre profil admin

Exécutez cette requête pour vérifier votre rôle :

```sql
SELECT id, email, role FROM public.profiles WHERE id = auth.uid();
```

Si votre rôle n'est pas 'ADMIN' ou 'MANAGER', mettez-le à jour :

```sql
UPDATE public.profiles 
SET role = 'ADMIN' 
WHERE email = 'VOTRE_EMAIL@example.com';
```

## 🔄 Méthode 3 : Script de réinitialisation complet

Si vous voulez tout recommencer :

```sql
-- 1. Supprimer tous les workshops existants
DELETE FROM public.workshops;

-- 2. Réinitialiser le compteur de séquence
ALTER SEQUENCE workshops_id_seq RESTART WITH 1;

-- 3. Réinsérer les données
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
  (12, 'Direction', false, NULL, NULL);
```

## 📱 Lier les workshops à l'application

### 1. Dashboard Admin (déjà configuré)

L'interface admin est à : `/admin/workshops`

**Fonctionnalités disponibles :**
- ✅ Voir tous les workshops
- ✅ Activer/désactiver un workshop
- ✅ Modifier la date de publication
- ✅ Ajouter/modifier le lien OneDrive
- ✅ Sauvegarder les modifications

### 2. Affichage public pour les utilisateurs

Créez une page pour afficher les workshops actifs aux utilisateurs :

**Page suggérée :** `/workshops` ou `/metiers/workshops`

**Logique d'affichage :**
```typescript
// Récupérer uniquement les workshops actifs
const { data: activeWorkshops } = await supabase
  .from('workshops')
  .select('*')
  .eq('is_active', true)
  .order('metier_id', { ascending: true })
```

### 3. Intégration dans les pages métiers

Vous pouvez afficher le workshop lié à chaque métier dans sa page dédiée :

```typescript
// Dans une page de métier, récupérer son workshop
const metierId = 1 // Par exemple pour Production
const { data: workshop } = await supabase
  .from('workshops')
  .select('*')
  .eq('metier_id', metierId)
  .eq('is_active', true)
  .single()

// Si workshop existe et est actif, afficher le lien OneDrive
{workshop?.onedrive_link && (
  <a href={workshop.onedrive_link} target="_blank">
    Accéder au workshop {workshop.metier_nom}
  </a>
)}
```

## 🐛 Debugging : Vérifier les erreurs

### Dans la console du navigateur

1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet **Console**
3. Essayez de créer un workshop depuis `/admin/workshops`
4. Notez l'erreur exacte qui s'affiche

### Erreurs courantes et solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| "new row violates row-level security policy" | RLS bloque l'insertion | Vérifiez que votre profil a le rôle ADMIN |
| "duplicate key value violates unique constraint" | Un workshop avec ce metier_id existe déjà | Utilisez UPDATE au lieu d'INSERT |
| "null value in column violates not-null constraint" | Champs obligatoires manquants | Assurez-vous que metier_id, metier_nom et is_active sont fournis |

### Tester la connexion Supabase

Exécutez cette requête dans **SQL Editor** :

```sql
-- Vérifier que vous pouvez lire la table
SELECT COUNT(*) FROM public.workshops;

-- Vérifier que vous pouvez insérer (en tant qu'admin)
INSERT INTO public.workshops (metier_id, metier_nom, is_active) 
VALUES (99, 'Test', false)
RETURNING *;

-- Nettoyer le test
DELETE FROM public.workshops WHERE metier_id = 99;
```

## 📋 Checklist de mise en place

- [ ] Table `workshops` créée dans Supabase
- [ ] Migration 007 exécutée
- [ ] Politiques RLS configurées
- [ ] Votre profil utilisateur a le rôle ADMIN
- [ ] Les 12 workshops sont insérés dans la base
- [ ] L'interface admin `/admin/workshops` est accessible
- [ ] Vous pouvez modifier un workshop via l'interface
- [ ] Les workshops actifs s'affichent correctement
- [ ] Les liens OneDrive fonctionnent

## 🎨 Exemple de workflow complet

1. **En tant qu'admin** : Allez sur `/admin/workshops`
2. **Sélectionnez un métier** : Par exemple "Production"
3. **Cliquez sur "Éditer"**
4. **Remplissez les champs** :
   - Date de publication : 15/11/2025
   - Lien OneDrive : `https://onedrive.com/...`
5. **Cliquez sur "Sauvegarder"**
6. **Activez le workshop** : Cliquez sur le bouton "Inactif" pour le passer à "Actif"
7. **Vérifiez** : Le workshop est maintenant visible pour tous les utilisateurs

## 🔐 Sécurité

- Les utilisateurs non authentifiés ne voient que les workshops actifs (is_active = true)
- Seuls les ADMIN et MANAGER peuvent créer/modifier les workshops
- Les liens OneDrive doivent être des liens de partage publics ou avec permissions appropriées

## 📞 Support

Si vous rencontrez toujours des erreurs après avoir suivi ce guide :

1. Partagez l'erreur exacte de la console
2. Vérifiez votre rôle dans la table `profiles`
3. Testez directement dans Supabase SQL Editor
4. Vérifiez que les migrations sont bien appliquées
