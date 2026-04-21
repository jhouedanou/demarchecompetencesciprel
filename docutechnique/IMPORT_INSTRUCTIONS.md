# Guide d'importation des Questions

Ce guide explique comment importer les questions de `questions.json` vers Supabase.

## Prérequis

1. Avoir les variables d'environnement Supabase configurées:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Avoir Node.js et npm installés

## Étapes d'importation

### 1. Préparation

Assurez-vous que:
- Le fichier `questions.json` est à la racine du projet
- La table `questions` existe dans Supabase avec la structure correcte
- Les variables d'environnement sont définies dans `.env.local`

### 2. Exécution du script d'import

```bash
# Méthode 1: Utiliser ts-node
npx ts-node scripts/import-questions.ts

# Méthode 2: Si ts-node n'est pas disponible
npm run import:questions
```

### 3. Vérification

Après l'import:
1. Allez sur `/admin/questions-workshops`
2. Allez dans l'onglet "Questions"
3. Vérifiez que les questions sont bien importées
4. Vous pouvez maintenant éditer, activer/désactiver, ou supprimer des questions

## Structure de la table `questions`

La table doit avoir les colonnes suivantes:

```sql
CREATE TABLE public.questions (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT,
  correct_answer INTEGER[] NOT NULL,
  category VARCHAR(50) NOT NULL,
  quiz_type VARCHAR(50) NOT NULL,
  points INTEGER DEFAULT 1,
  feedback TEXT,
  explanation TEXT,
  order_index INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Format du fichier `questions.json`

Le fichier doit respecter ce format:

```json
{
  "quizzes": [
    {
      "title": "Nom du Quiz",
      "questions": [
        {
          "id": 1,
          "question": "La question?",
          "options": [
            "a) Réponse A",
            "b) Réponse B",
            "c) Réponse C",
            "d) Réponse D"
          ],
          "correct_answer": "a",
          "source_ref": "[cite: 1, 2]"
        }
      ]
    }
  ]
}
```

## Gestion des questions via l'interface admin

### Créer une question

1. Allez sur `/admin/questions-workshops`
2. Cliquez sur "Nouvelle question"
3. Remplissez les champs obligatoires
4. Sélectionnez la/les bonne(s) réponse(s)
5. Cliquez sur "Créer"

### Modifier une question

1. Allez sur `/admin/questions-workshops`
2. Cliquez sur l'icône d'édition (crayon) à côté de la question
3. Modifiez les champs
4. Cliquez sur "Mettre à jour"

### Supprimer une question

1. Allez sur `/admin/questions-workshops`
2. Cliquez sur l'icône de corbeille à côté de la question
3. Confirmez la suppression

### Activer/Désactiver une question

Utilisez le filtre "Statut" pour afficher les questions inactives, puis modifiez la question pour changer le statut "Actif".

## Gestion des workshops

### Activer un workshop

1. Allez sur `/admin/questions-workshops`
2. Allez dans l'onglet "Workshops"
3. Cliquez sur le bouton "Activer" en face du workshop
4. Optionnel: Modifiez le lien OneDrive et la date de publication

### Désactiver un workshop

1. Allez sur `/admin/questions-workshops`
2. Allez dans l'onglet "Workshops"
3. Cliquez sur le bouton "Désactiver" en face du workshop

### Éditer les informations du workshop

1. Allez sur `/admin/questions-workshops`
2. Allez dans l'onglet "Workshops"
3. Cliquez sur l'icône d'édition (crayon)
4. Modifiez le lien OneDrive et/ou la date de publication
5. Cliquez sur l'icône de sauvegarde (disquette)

## Dépannage

### Le script ne s'exécute pas

- Vérifiez que les variables d'environnement sont correctement définies
- Vérifiez que `questions.json` existe
- Vérifiez les permissions Supabase

### Les questions ne s'importent pas

- Vérifiez la structure du JSON
- Vérifiez que la table `questions` existe
- Vérifiez les logs de la console

### Les questions importées ne s'affichent pas sur le site

- Vérifiez que `active` est à `true`
- Les questions doivent être associées à un workshop actif
- Vérifiez les filtres appliqués

## API disponibles

### GET /api/workshops
Récupère les workshops actifs (pas de filtre par défaut)

Paramètres:
- `activeOnly` (default: true) - Filtrer uniquement les workshops actifs

### GET /api/admin/workshops
Récupère tous les workshops (pour les admins uniquement)

### PUT /api/admin/workshops
Mise à jour d'un workshop (pour les admins uniquement)

### GET /api/admin/questions
Récupère les questions avec pagination

Paramètres:
- `page` (default: 1)
- `limit` (default: 10)
- `category` - Filtrer par catégorie
- `quiz_type` - Filtrer par type de quiz
- `active` - Filtrer par statut actif/inactif

### POST /api/admin/questions
Créer une nouvelle question (pour les admins uniquement)

### GET /api/admin/questions/[id]
Récupère une question spécifique

### PUT /api/admin/questions/[id]
Mise à jour d'une question

### DELETE /api/admin/questions/[id]
Supprime une question

## Notes importantes

1. Les données proviennent entièrement de Supabase
2. Les workshops inactifs ne s'affichent pas aux utilisateurs publiques
3. Les admins peuvent voir tous les workshops et les modifier
4. Les questions importées héritent du statut actif par défaut
5. Le script d'import est idempotent (vous pouvez le relancer sans créer de doublons)
