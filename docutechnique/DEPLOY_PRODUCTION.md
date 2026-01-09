# Guide de Déploiement en Production - Supabase

## 📋 Résumé des Migrations

### Migrations à appliquer (dans l'ordre):

1. **Migration 010** - Ajouter colonne `etape` aux questions
2. **Migration 011** - Fixer les RLS pour workshops
3. **Migration 012** - **Peupler la base + Fixer RLS (COMPLÈTE)**

## 🚀 Déploiement sur Supabase en Ligne

### Option 1: Via Supabase Dashboard (Interface Web)

1. **Accédez à Supabase**: https://supabase.com
2. **Sélectionnez votre projet**: CIPREL
3. **Allez à "SQL Editor"** (Éditeur SQL)
4. **Exécutez cette migration COMPLÈTE** (la plus importante):

```sql
-- Copier/coller le contenu de:
-- supabase/migrations/012_populate_and_fix_rls.sql
```

### Option 2: Via CLI Supabase (Recommandé)

```bash
# Naviguer au répertoire du projet
cd /Users/houedanou/Documents/GitHub/demarchecompetencesciprel

# S'authentifier sur Supabase
supabase login

# Lier le projet local au projet distant
supabase link --project-ref yuyjwspittftodncnfbd

# Appliquer les migrations
supabase migration up --remote
```

### Option 3: Exécution Manuelle SQL

1. Ouvrir Supabase Dashboard → SQL Editor
2. Créer une **nouvelle requête**
3. Copier-coller le contenu de `012_populate_and_fix_rls.sql`
4. Cliquer **"Run"** (Exécuter)

## ✅ Vérification Post-Déploiement

Exécutez ces requêtes SQL pour vérifier:

### 1. Vérifier les Workshops
```sql
SELECT COUNT(*) as total_workshops,
       SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_count
FROM public.workshops;

-- Résultat attendu: 12 workshops (tous inactifs par défaut)
```

### 2. Vérifier les Questions
```sql
SELECT etape, COUNT(*) as count
FROM public.questions
GROUP BY etape;

-- Résultat attendu:
-- INTRODUCTION: 7 questions
-- SONDAGE: 6 questions
```

### 3. Vérifier les RLS Policies
```sql
SELECT tablename, policyname, qual, with_check
FROM pg_policies
WHERE tablename IN ('workshops', 'questions')
ORDER BY tablename, policyname;
```

### 4. Vérifier les Métiers
```sql
SELECT metier_id, metier_nom, is_active
FROM public.workshops
ORDER BY metier_id;
```

## 🔧 Configuration des Utilisateurs Admins

Après le déploiement, assurez-vous que vos utilisateurs admin ont le rôle correct:

```sql
-- Vérifier les rôles des utilisateurs
SELECT id, email, name, role
FROM public.profiles
WHERE role IN ('ADMIN', 'MANAGER')
ORDER BY created_at DESC;

-- Mettre à jour le rôle d'un utilisateur à ADMIN
UPDATE public.profiles
SET role = 'ADMIN'
WHERE email = 'votre-email@ciprel.ci';

-- Vérifier la mise à jour
SELECT * FROM public.profiles WHERE email = 'votre-email@ciprel.ci';
```

## 🐛 Troubleshooting

### Erreur: "RLS policy violation"
**Solution**: Vérifiez que l'utilisateur a le rôle ADMIN/MANAGER dans la table `profiles`

### Erreur: "Duplicate key violates unique constraint"
**Solution**: La migration 012 utilise `ON CONFLICT DO NOTHING`, donc les doublons sont ignorés

### Les workshops n'apparaissent pas
**Solution**:
1. Vérifiez: `SELECT COUNT(*) FROM public.workshops;`
2. Si 0, exécutez manuellement l'insert de la migration 012

### Les questions n'ont pas la colonne "etape"
**Solution**: Exécutez la migration 010 avant la 012

## 📊 État Final de la Base

Après le déploiement, vous aurez:

| Table | Contenu | État |
|-------|---------|------|
| **workshops** | 12 métiers | Tous inactifs (à activer manuellement) |
| **questions** | 7 intro + 6 sondage | Tous actifs |
| **profiles** | Vos utilisateurs | À vérifier les rôles |
| **RLS Policies** | Fixées et sécurisées | ✅ Actives |

## 📝 Notes Importantes

1. **Backup**: Faites un backup de votre DB avant de déployer
   ```bash
   supabase db pull --remote
   ```

2. **Tests**: Testez sur un environnement de staging avant la production

3. **Rollback**: En cas de problème, vous pouvez annuler la dernière migration:
   ```bash
   supabase migration reset --remote
   ```

4. **Monitoring**: Vérifiez les logs Supabase après le déploiement

## 🎯 Prochaines Étapes

Après le déploiement:

1. ✅ Vérifier les workshops dans `/admin/workshops`
2. ✅ Vérifier les questions dans `/admin/questions`
3. ✅ Tester la création/édition de questions
4. ✅ Tester les RLS en mode non-connecté
5. ✅ Activer les workshops via l'admin

## 📞 Support

Consultez les logs Supabase:
- Dashboard → Logs → API Logs
- Dashboard → Logs → Database Activity
