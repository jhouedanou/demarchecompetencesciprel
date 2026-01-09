# 🚀 Quick Start : Workshops CIPREL

## ⚡ Mise en place rapide (5 minutes)

### Étape 1 : Exécuter les migrations Supabase

Allez sur https://supabase.com/dashboard → Votre projet → **SQL Editor**

**A. Créer la table** (si elle n'existe pas déjà) :
```sql
-- Copiez le contenu de : supabase/migrations/007_create_workshops_table.sql
-- Cliquez sur "Run"
```

**B. Insérer les workshops** :
```sql
-- Copiez le contenu de : supabase/migrations/008_seed_workshops.sql
-- Cliquez sur "Run"
```

**C. Configurer les permissions** :
```sql
-- Copiez le contenu de : supabase/migrations/009_fix_workshops_rls.sql
-- Cliquez sur "Run"
```

### Étape 2 : Vérifier votre profil admin

Dans **SQL Editor**, exécutez :
```sql
SELECT id, email, role FROM public.profiles WHERE id = auth.uid();
```

Si votre rôle n'est pas `ADMIN`, exécutez :
```sql
UPDATE public.profiles SET role = 'ADMIN' WHERE id = auth.uid();
```

### Étape 3 : Tester l'application

1. **Interface admin** : http://localhost:3000/admin/workshops
2. **Page publique** : http://localhost:3000/workshops

---

## 🎯 Utilisation quotidienne

### Créer/Modifier un workshop via l'interface

1. Allez sur `/admin/workshops`
2. Cliquez sur **Éditer** sur un métier
3. Remplissez :
   - **Date de publication** : Date à laquelle le workshop sera publié
   - **Lien OneDrive** : Lien vers les ressources du workshop
4. Cliquez sur **Sauvegarder**
5. Activez le workshop en cliquant sur le badge "Inactif"

### Créer un workshop via Supabase Dashboard

1. Allez dans **Table Editor** > `workshops`
2. Cliquez sur **Insert** > **Insert row**
3. Remplissez :
   - `metier_id` : 1-12
   - `metier_nom` : Nom du métier
   - `is_active` : true/false
   - `publication_date` : Date (optionnel)
   - `onedrive_link` : URL (optionnel)
4. Cliquez sur **Save**

---

## 🐛 Résolution des problèmes courants

### Erreur : "new row violates row-level security policy"

**Cause** : Vous n'avez pas le rôle ADMIN

**Solution** :
```sql
UPDATE public.profiles SET role = 'ADMIN' WHERE id = auth.uid();
```

### Erreur : "duplicate key value violates unique constraint"

**Cause** : Un workshop avec ce `metier_id` existe déjà

**Solution** : Utilisez UPDATE au lieu d'INSERT, ou supprimez le workshop existant

### Les workshops ne s'affichent pas sur la page publique

**Cause** : Les workshops ne sont pas activés

**Solution** : 
1. Allez sur `/admin/workshops`
2. Activez les workshops en cliquant sur "Inactif"

### L'interface admin ne charge pas

**Cause** : Problème de connexion Supabase ou RLS

**Solution** : Exécutez le script de diagnostic :
```sql
-- Copiez le contenu de : supabase/test_workshops_diagnostic.sql
-- Cliquez sur "Run"
```

---

## 📋 Checklist de vérification

- [ ] Table `workshops` créée dans Supabase
- [ ] 12 workshops insérés (Production, SIDT, Maintenance, etc.)
- [ ] Politiques RLS configurées
- [ ] Votre profil a le rôle `ADMIN`
- [ ] L'interface `/admin/workshops` est accessible
- [ ] La page `/workshops` affiche les workshops actifs
- [ ] Les liens OneDrive fonctionnent

---

## 📞 Besoin d'aide ?

Consultez le guide complet : **WORKSHOPS_SUPABASE_GUIDE.md**

---

## 🔗 Liens rapides

- **Admin workshops** : `/admin/workshops`
- **Workshops publics** : `/workshops`
- **Supabase Dashboard** : https://supabase.com/dashboard
- **Projet Supabase** : https://yuyjwspittftodncnfbd.supabase.co
