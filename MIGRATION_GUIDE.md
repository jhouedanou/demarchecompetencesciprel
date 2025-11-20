# Guide de Migration - Gestion des Questions et Résultats

## Migrations à exécuter

### 1. Migration des Questions (déjà exécutée)

Si vous n'avez pas encore exécuté la migration `add_metier_id_to_questions.sql`, exécutez-la :

```bash
# Connectez-vous à votre base de données Supabase
psql -h <your-supabase-host> -U postgres -d postgres

# Exécutez la migration
\i supabase/migrations/add_metier_id_to_questions.sql
```

### 2. Nouvelle Migration - Quiz Results avec WORKSHOP

Pour permettre l'enregistrement des résultats des quiz WORKSHOP :

```bash
# Exécutez la migration
\i supabase/migrations/007_add_workshop_to_quiz_results.sql
```

Ou via le Dashboard Supabase :
1. Allez dans **SQL Editor**
2. Copiez le contenu de `supabase/migrations/007_add_workshop_to_quiz_results.sql`
3. Exécutez la requête

## Fonctionnalités Implémentées

### 1. Gestion des Questions par Métier

**URL:** `http://localhost:3000/admin/metiers/[id]/questions`

Fonctionnalités :
- ✅ Affichage de toutes les questions liées à un métier
- ✅ Création de nouvelles questions
- ✅ Modification des questions existantes
- ✅ Suppression de questions
- ✅ Activation/Désactivation de questions
- ✅ Toutes les questions sont automatiquement liées au `metier_id`

### 2. Affichage des Résultats des Quiz

**URL:** `http://localhost:3000/admin/results`

Fonctionnalités :
- ✅ Affichage de tous les résultats de quiz (INTRODUCTION, SONDAGE, WORKSHOP)
- ✅ Filtrage par type de quiz
- ✅ Pagination des résultats
- ✅ Export CSV des résultats
- ✅ Vue détaillée des réponses individuelles
- ✅ Statistiques complètes (score, pourcentage, durée, tentatives)

### 3. Structure des Données

#### Table `questions`
- `metier_id` : Lien vers le métier (workshop)
- `quiz_type` : INTRODUCTION, SONDAGE, ou WORKSHOP
- `etape` : Type d'étape (INTRODUCTION, SONDAGE, ATELIER, WORKSHOP)
- Tous les autres champs standard

#### Table `quiz_results`
- `user_id` : Utilisateur ayant passé le quiz
- `quiz_type` : INTRODUCTION, SONDAGE, ou WORKSHOP
- `metier_id` : ID du métier (pour les quiz WORKSHOP)
- `score` : Score obtenu
- `max_score` : Score maximum possible
- `percentage` : Pourcentage de réussite
- `responses` : Réponses détaillées (JSONB)
- `duration` : Durée en secondes
- `attempt_number` : Numéro de tentative

## APIs Disponibles

### Questions
- `GET /api/admin/questions` - Liste toutes les questions (avec filtres)
- `POST /api/admin/questions` - Crée une nouvelle question
- `PUT /api/admin/questions/[id]` - Met à jour une question
- `DELETE /api/admin/questions/[id]` - Supprime une question
- `GET /api/quiz?metier_id=[id]` - Récupère les questions d'un métier

### Résultats
- `GET /api/admin/results` - Liste tous les résultats (avec filtres)
- `POST /api/quiz` - Enregistre un résultat de quiz

## Vérification

### Vérifier les questions par métier

```sql
SELECT
  metier_id,
  quiz_type,
  COUNT(*) as question_count
FROM public.questions
WHERE metier_id IS NOT NULL
GROUP BY metier_id, quiz_type
ORDER BY metier_id;
```

### Vérifier les résultats

```sql
SELECT
  quiz_type,
  COUNT(*) as total_results,
  AVG(percentage) as avg_percentage,
  MAX(attempt_number) as max_attempts
FROM public.quiz_results
GROUP BY quiz_type;
```

## Utilisation

1. **Pour créer des questions** :
   - Allez sur `/admin/metiers`
   - Cliquez sur "Questions" pour un métier
   - Cliquez sur "Nouvelle question"
   - Remplissez le formulaire et enregistrez

2. **Pour voir les résultats** :
   - Allez sur `/admin/results`
   - Filtrez par type de quiz si nécessaire
   - Cliquez sur "Détails" pour voir les réponses individuelles
   - Exportez en CSV si besoin

## Notes Importantes

- Les quiz WORKSHOP sont maintenant supportés dans la table `quiz_results`
- Chaque résultat est lié à un utilisateur via `user_id`
- Les résultats de type WORKSHOP peuvent être filtrés par `metier_id`
- L'export CSV inclut toutes les informations pertinentes
- Les résultats sont paginés (20 par page par défaut)
