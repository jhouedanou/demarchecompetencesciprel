# Guide Complet de Configuration - Supabase Production

## 🎯 Objectifs

✅ Peupler la base de données avec:
- 12 métiers (workshops)
- 13 questions (7 intro + 6 sondage)

✅ Configurer les RLS (Row-Level Security):
- Permettre à tous de voir les contenus actifs
- Restreindre l'édition aux admins
- Sécuriser les données des utilisateurs

✅ Corriger les erreurs 403 Forbidden

---

## 🚀 Déploiement Rapide (5 minutes)

### Étape 1: Accéder à Supabase

1. Ouvrir: https://supabase.com
2. Se connecter avec votre compte
3. Sélectionner le projet: **CIPREL**

### Étape 2: Accéder à l'Éditeur SQL

1. Dans le menu à gauche → **SQL Editor**
2. Cliquer sur **New Query**

### Étape 3: Copier-Coller le Script

1. Ouvrir le fichier: `supabase/QUICK_DEPLOY.sql`
2. **Copier tout le contenu**
3. **Coller dans Supabase SQL Editor**
4. Cliquer **Run** (Exécuter)

### Étape 4: Vérifier le Succès

À la fin de l'exécution, vous verrez:
```
status: "Migration terminée avec succès!"
workshops_count: 12
questions_count: 13 (ou plus si vous en aviez déjà)
```

---

## 🔍 Vérifications Post-Déploiement

### Vérifier les Workshops

Dans SQL Editor, exécuter:
```sql
SELECT COUNT(*) as total_workshops FROM public.workshops;
-- Résultat attendu: 12
```

Voir la liste:
```sql
SELECT metier_id, metier_nom, is_active FROM public.workshops ORDER BY metier_id;
```

### Vérifier les Questions

```sql
SELECT etape, COUNT(*) as count FROM public.questions GROUP BY etape;
-- Résultat attendu:
-- INTRODUCTION: 7
-- SONDAGE: 6
```

### Vérifier les RLS

```sql
SELECT COUNT(*) as policies_count FROM pg_policies WHERE tablename IN ('workshops', 'questions');
-- Résultat attendu: 10 policies (5 pour workshops + 5 pour questions)
```

---

## 👤 Configuration des Utilisateurs Admins

### Vérifier les Admins Actuels

```sql
SELECT email, name, role FROM public.profiles WHERE role IN ('ADMIN', 'MANAGER');
```

### Promouvoir un Utilisateur en Admin

```sql
UPDATE public.profiles
SET role = 'ADMIN'
WHERE email = 'votre-email@ciprel.ci';

-- Vérifier la mise à jour
SELECT email, role FROM public.profiles WHERE email = 'votre-email@ciprel.ci';
```

---

## 🧪 Tests Fonctionnels

### Test 1: Accès Public aux Workshops Actifs

```sql
-- Que voit un utilisateur non-connecté?
SELECT COUNT(*) FROM public.workshops WHERE is_active = true;
-- Résultat attendu: 0 (tous sont inactifs par défaut)
```

### Test 2: Activer un Workshop

Aller à `/admin/workshops`:
1. Cliquer sur **Éditer** pour un métier
2. Activer le workshop
3. Cliquer **Sauvegarder**

Vérifier:
```sql
SELECT COUNT(*) FROM public.workshops WHERE is_active = true;
-- Résultat attendu: 1 (ou plus)
```

### Test 3: Tester les Questions

Aller à `/admin/questions`:
1. Voir la liste des questions
2. Groupées par étape (Introduction, Sondage)
3. Pouvoir éditer/créer des questions

---

## 🐛 Troubleshooting

### Erreur: "Permission denied"

**Cause**: Vous n'êtes pas authentifié ou n'avez pas le rôle ADMIN

**Solution**:
```sql
-- Vérifier votre rôle
SELECT email, role FROM public.profiles WHERE email = 'VOS_IDENTIFIANTS';

-- Si rôle n'est pas ADMIN, mettre à jour
UPDATE public.profiles SET role = 'ADMIN' WHERE email = 'VOS_IDENTIFIANTS';
```

### Erreur: "Duplicate key violates unique constraint"

**Cause**: Les workshops existent déjà

**Solution**: Normal, le script utilise `ON CONFLICT DO UPDATE` qui met à jour les existants

### Les workshops n'apparaissent pas dans l'admin

**Cause**: RLS ou données manquantes

**Solution**:
```sql
-- Vérifier si les données existent
SELECT COUNT(*) FROM public.workshops;

-- Vérifier les RLS policies
SELECT policyname FROM pg_policies WHERE tablename = 'workshops';
```

### Erreur 403 lors de la création de questions

**Cause**: Rôle utilisateur non reconnu

**Solution**:
1. Vérifier que vous êtes connecté
2. Vérifier votre rôle en DB
3. Attendre 1-2 minutes pour que le cache se rafraîchisse

---

## 📊 Données Peuplées

### Workshops (12 métiers)

| ID | Métier | Statut |
|----|--------|--------|
| 1 | Production | Inactif |
| 2 | SIDT | Inactif |
| 3 | Maintenance | Inactif |
| 4 | QSE-RSE/Sûreté | Inactif |
| 5 | Contrôle Interne | Inactif |
| 6 | Stocks | Inactif |
| 7 | RH/Juridique | Inactif |
| 8 | Services Généraux | Inactif |
| 9 | DFC | Inactif |
| 10 | Projets | Inactif |
| 11 | Achats & Logistique | Inactif |
| 12 | Direction | Inactif |

### Questions Introduction (7 questions)

1. Définition de la démarche compétence
2. Responsabilité de la démarche compétence
3. Compétences requises pour manager
4. Première étape de la démarche
5. Types de compétences
6. Objectifs de la démarche compétence
7. Évaluation des compétences

### Questions Sondage (6 questions)

1. Connaissance de la démarche compétence
2. Définition personnelle
3. Bénéfices perçus
4. Attentes personnelles
5. Inquiétudes
6. Sources d'information souhaitées

---

## 🔐 Politiques de Sécurité (RLS)

### Workshops

| Action | Public | Admin |
|--------|--------|-------|
| **Voir actifs** | ✅ | ✅ |
| **Voir tous** | ❌ | ✅ |
| **Créer** | ❌ | ✅ |
| **Éditer** | ❌ | ✅ |
| **Supprimer** | ❌ | ✅ |

### Questions

| Action | Public | Admin |
|--------|--------|-------|
| **Voir actives** | ✅ | ✅ |
| **Voir toutes** | ❌ | ✅ |
| **Créer** | ❌ | ✅ |
| **Éditer** | ❌ | ✅ |
| **Supprimer** | ❌ | ✅ |

---

## 📝 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `supabase/QUICK_DEPLOY.sql` | Script à copier-coller dans Supabase |
| `supabase/migrations/010_add_etape_column.sql` | Migration: ajouter colonne étape |
| `supabase/migrations/011_fix_workshops_rls_for_init.sql` | Migration: fixer RLS workshops |
| `supabase/migrations/012_populate_and_fix_rls.sql` | Migration complète: peupler + fixer |
| `DEPLOY_PRODUCTION.md` | Guide détaillé du déploiement |
| `SETUP_GUIDE.md` | Ce fichier |

---

## ✅ Checklist Post-Déploiement

- [ ] Script `QUICK_DEPLOY.sql` exécuté sans erreurs
- [ ] 12 workshops dans la BD
- [ ] 13+ questions dans la BD
- [ ] Questions groupées par étape
- [ ] RLS policies créées et actives
- [ ] Admin peut voir la page `/admin/workshops`
- [ ] Admin peut voir la page `/admin/questions`
- [ ] Admin peut éditer les questions/workshops
- [ ] Utilisateurs non-connectés ne voient que les éléments actifs
- [ ] Pas d'erreur 403 lors de l'édition

---

## 🎓 Prochaines Étapes

1. **Activer les workshops** → Va dans `/admin/workshops` et active certains métiers
2. **Tester les questions** → Va dans `/admin/questions` et crée de nouvelles questions
3. **Tester les quiz** → Va dans `/quiz-introduction` et teste les questions
4. **Tester le sondage** → Va dans `/sondage` et réponds aux questions

---

## 📞 Besoin d'Aide?

### Logs Supabase

Dashboard → **Logs** → **API Logs** ou **Database Activity**

### Vérifier la Connexion

```sql
-- Qui suis-je?
SELECT auth.uid() as user_id;

-- Quel est mon rôle?
SELECT role FROM public.profiles WHERE id = auth.uid();
```

### Reset Complet (DANGER! ⚠️)

Seulement si vous voulez recommencer à zéro:

```sql
-- ATTENTION: Cela supprimera TOUTES les données!
TRUNCATE public.workshops CASCADE;
TRUNCATE public.questions CASCADE;
-- Puis réexécuter le script QUICK_DEPLOY.sql
```

---

**✨ Configuration terminée! Vous êtes prêt pour la production! ✨**
