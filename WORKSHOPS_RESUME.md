# 📋 Résumé : Configuration des Workshops CIPREL

## ✅ Ce qui a été créé

### 1. Migrations Supabase
- ✅ `007_create_workshops_table.sql` - Création de la table workshops
- ✅ `008_seed_workshops.sql` - Insertion des 12 workshops métiers
- ✅ `009_fix_workshops_rls.sql` - Configuration des politiques RLS

### 2. Composants Frontend
- ✅ `/admin/workshops` - Interface d'administration (déjà existante)
- ✅ `/workshops` - Page publique pour afficher les workshops actifs

### 3. Scripts et Documentation
- ✅ `WORKSHOPS_SUPABASE_GUIDE.md` - Guide complet détaillé
- ✅ `WORKSHOPS_QUICKSTART.md` - Guide de démarrage rapide
- ✅ `test_workshops_diagnostic.sql` - Script de diagnostic
- ✅ `setup-workshops.sh` - Script d'installation interactif

## 🚀 Prochaines étapes (À FAIRE MAINTENANT)

### Étape 1 : Aller sur Supabase Dashboard

1. Ouvrez https://supabase.com/dashboard
2. Connectez-vous et sélectionnez votre projet `yuyjwspittftodncnfbd`

### Étape 2 : Exécuter les migrations (dans SQL Editor)

**A. Migration 007 - Créer la table**
```bash
# Ouvrez : supabase/migrations/007_create_workshops_table.sql
# Copiez tout le contenu dans SQL Editor
# Cliquez sur "Run" ou Ctrl+Enter
```

**B. Migration 008 - Insérer les workshops**
```bash
# Ouvrez : supabase/migrations/008_seed_workshops.sql
# Copiez tout le contenu dans SQL Editor
# Cliquez sur "Run" ou Ctrl+Enter
```

**C. Migration 009 - Configurer RLS**
```bash
# Ouvrez : supabase/migrations/009_fix_workshops_rls.sql
# Copiez tout le contenu dans SQL Editor
# Cliquez sur "Run" ou Ctrl+Enter
```

### Étape 3 : Vérifier votre profil admin

Dans SQL Editor :
```sql
SELECT id, email, role FROM public.profiles WHERE id = auth.uid();
```

Si le rôle n'est pas `ADMIN` :
```sql
UPDATE public.profiles SET role = 'ADMIN' WHERE id = auth.uid();
```

### Étape 4 : Tester l'application

1. Démarrez le serveur de développement :
```bash
npm run dev
```

2. Testez l'interface admin :
```
http://localhost:3000/admin/workshops
```

3. Testez la page publique :
```
http://localhost:3000/workshops
```

## 🔍 Diagnostic en cas d'erreur

Si vous rencontrez une erreur lors de la création d'un workshop :

### Option 1 : Utiliser le script de diagnostic

Dans Supabase SQL Editor, exécutez :
```bash
# Ouvrez : supabase/test_workshops_diagnostic.sql
# Copiez tout le contenu
# Exécutez-le dans SQL Editor
```

Ce script va :
- ✅ Vérifier que la table existe
- ✅ Compter les workshops
- ✅ Tester vos permissions
- ✅ Afficher votre profil utilisateur

### Option 2 : Créer les workshops manuellement

Dans Supabase Dashboard > Table Editor > workshops :

1. Cliquez sur "Insert" > "Insert row"
2. Remplissez pour chaque métier :
   - `metier_id` : 1 à 12
   - `metier_nom` : Nom du métier
   - `is_active` : false
   - Laissez le reste à NULL

## 🎯 Utilisation après configuration

### Pour les admins

1. Allez sur `/admin/workshops`
2. Pour chaque métier :
   - Cliquez sur "Éditer"
   - Ajoutez la date de publication
   - Ajoutez le lien OneDrive
   - Cliquez sur "Sauvegarder"
   - Activez le workshop (cliquez sur "Inactif" → devient "Actif")

### Pour les utilisateurs

1. Allez sur `/workshops`
2. Seuls les workshops actifs s'affichent
3. Cliquez sur "Accéder au workshop" pour ouvrir le lien OneDrive

## 🔗 Architecture de liaison

```
Supabase (Base de données)
    ↓
useWorkshops hook (src/hooks/useWorkshops.ts)
    ↓
    ├─→ Admin Interface (/admin/workshops)
    │   └─→ Créer, modifier, activer workshops
    │
    └─→ Public Page (/workshops)
        └─→ Afficher workshops actifs uniquement
```

## 🔐 Sécurité (RLS)

- **Lecture publique** : Tous peuvent voir les workshops actifs
- **Lecture admin** : Les ADMIN/MANAGER voient tous les workshops
- **Modification** : Seuls les ADMIN/MANAGER peuvent modifier
- **Création** : Seuls les ADMIN/MANAGER peuvent créer
- **Suppression** : Seuls les ADMIN/MANAGER peuvent supprimer

## ⚠️ Points importants

1. **Ne supprimez pas la table workshops** - Elle contient les configurations
2. **Sauvegardez avant de modifier** - Les modifications sont instantanées
3. **Testez les liens OneDrive** - Assurez-vous qu'ils sont accessibles
4. **Activez progressivement** - Ne pas tout activer d'un coup

## 📞 En cas de problème

### Erreur de permissions
```sql
-- Solution : Promouvoir votre utilisateur en admin
UPDATE public.profiles SET role = 'ADMIN' WHERE id = auth.uid();
```

### Workshops en double
```sql
-- Solution : Supprimer les doublons
DELETE FROM public.workshops WHERE id IN (
  SELECT id FROM public.workshops
  WHERE metier_id IN (
    SELECT metier_id FROM public.workshops
    GROUP BY metier_id HAVING COUNT(*) > 1
  )
  AND id NOT IN (
    SELECT MIN(id) FROM public.workshops GROUP BY metier_id
  )
);
```

### Réinitialisation complète
```sql
-- ATTENTION : Cela supprime tout !
DELETE FROM public.workshops;
ALTER SEQUENCE workshops_id_seq RESTART WITH 1;
-- Puis ré-exécutez la migration 008
```

## 📚 Documentation complète

- **Guide détaillé** : `WORKSHOPS_SUPABASE_GUIDE.md`
- **Démarrage rapide** : `WORKSHOPS_QUICKSTART.md`
- **Structure** : `WORKSHOPS_README.md`

## ✨ Prochaines améliorations possibles

- [ ] Ajouter un système de notifications par email
- [ ] Créer un historique des modifications
- [ ] Ajouter des statistiques de consultation
- [ ] Permettre l'upload direct de fichiers
- [ ] Créer des catégories de workshops

---

**Date de création** : 14 novembre 2025
**Version** : 1.0
**Auteur** : GitHub Copilot
