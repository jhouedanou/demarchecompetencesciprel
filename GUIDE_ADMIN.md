# Guide d'Utilisation de l'Administration CIPREL

## Table des matières
1. [Connexion à l'administration](#1-connexion-à-ladministration)
2. [Tableau de bord](#2-tableau-de-bord)
3. [Gestion des utilisateurs](#3-gestion-des-utilisateurs)
4. [Gestion des questions de quiz](#4-gestion-des-questions-de-quiz)
5. [Gestion des workshops](#5-gestion-des-workshops)
6. [Consultation des résultats](#6-consultation-des-résultats)
7. [Rôles et permissions](#7-rôles-et-permissions)
8. [Bonnes pratiques](#8-bonnes-pratiques)

---

## 1. Connexion à l'administration

### Accès à l'interface d'administration

1. **Ouvrir la page de connexion admin**
   - URL : `https://votre-site.com/ciprel-admin`

2. **Saisir les identifiants**
   - **Nom d'utilisateur** : `admin`
   - **Mot de passe** : `admin2014!`

3. **Sécurité**
   - Après 3 tentatives échouées, l'accès est temporairement bloqué
   - Assurez-vous d'être sur une connexion sécurisée

> **Note** : Une fois connecté, vous serez redirigé vers le tableau de bord principal.

---

## 2. Tableau de bord

Le tableau de bord (`/admin`) est votre page d'accueil administrative. Il affiche :

### Vue d'ensemble des statistiques

**Statistiques principales** (en haut de page)
- 📊 **Total utilisateurs** : Nombre total d'utilisateurs inscrits
- 📝 **Tentatives de quiz** : Nombre total de quiz effectués
- 🎥 **Vidéos actives** : Nombre de vidéos disponibles
- ⭐ **Score moyen** : Performance moyenne aux quiz
- ✅ **Taux de complétion** : Pourcentage de quiz terminés
- 👥 **Utilisateurs actifs** : Utilisateurs actifs aujourd'hui

### Graphiques analytiques

**1. Activité des utilisateurs**
- Vue sur 7, 30 ou 90 jours
- Courbe de tendance des inscriptions et connexions

**2. Performance par catégorie**
- Graphique en barres des résultats par type de quiz
- Comparaison des performances entre les différentes catégories

**3. Statistiques par appareil**
- Répartition Mobile / Desktop / Tablette
- Aide à optimiser l'expérience utilisateur

### Activités récentes

- **Nouvelles inscriptions** (dernières 24h)
- **Quiz récemment complétés**
- **Vues vidéo récentes**

### Actions rapides

Boutons d'accès rapide vers :
- ➕ Créer un utilisateur
- 📝 Ajouter une question
- 📊 Voir tous les résultats
- ⚙️ Gérer les workshops

---

## 3. Gestion des utilisateurs

Accès : **Menu latéral > Utilisateurs** ou `/admin/users`

### 3.1 Voir la liste des utilisateurs

L'interface affiche tous les utilisateurs avec :
- **Nom**
- **Email**
- **Téléphone**
- **Rôle** (USER, MANAGER, ADMIN)
- **Date de création**
- **Actions** (Modifier, Supprimer)

### 3.2 Créer un nouvel utilisateur

1. Cliquer sur **"Créer un utilisateur"** ou **"+ Nouvel utilisateur"**
2. Remplir le formulaire :
   - **Email** (obligatoire) : adresse email unique
   - **Nom** (obligatoire) : nom complet de l'utilisateur
   - **Mot de passe** (obligatoire) : minimum 6 caractères
   - **Téléphone** (optionnel) : numéro de téléphone
   - **Rôle** (obligatoire) :
     - `USER` : utilisateur standard
     - `MANAGER` : gestionnaire avec droits limités
     - `ADMIN` : administrateur avec tous les droits

3. Cliquer sur **"Créer"**

> **Note** : L'action est automatiquement enregistrée dans le journal de conformité RGPD.

### 3.3 Modifier un utilisateur

1. Cliquer sur l'icône **"Modifier"** (crayon) sur la ligne de l'utilisateur
2. Mettre à jour les champs nécessaires :
   - Nom
   - Téléphone
   - Rôle
   - Avatar (URL de l'image)
3. Cliquer sur **"Enregistrer"**

### 3.4 Supprimer un utilisateur

1. Cliquer sur l'icône **"Supprimer"** (poubelle)
2. Confirmer la suppression

**Restrictions** :
- ❌ Vous ne pouvez pas vous supprimer vous-même
- ⚠️ Seuls les ADMIN peuvent supprimer des utilisateurs
- 📝 Toute suppression est enregistrée dans le journal RGPD

---

## 4. Gestion des questions de quiz

Accès : **Menu latéral > Questions** ou `/admin/questions`

### 4.1 Vue d'ensemble des questions

L'interface permet de :
- Voir toutes les questions existantes
- Filtrer par catégorie, type de quiz, ou statut actif
- Rechercher des questions spécifiques
- Trier par ordre d'affichage

### 4.2 Créer une nouvelle question

1. Cliquer sur **"+ Nouvelle question"** ou **"Créer une question"**
2. Remplir le formulaire :

   **Informations de base**
   - **Titre** (optionnel) : titre court de la question
   - **Question** (obligatoire) : texte complet de la question

   **Options de réponse**
   - **Option A** (obligatoire)
   - **Option B** (obligatoire)
   - **Option C** (obligatoire)
   - **Option D** (obligatoire)

   **Réponse correcte**
   - ✅ Cocher une ou plusieurs bonnes réponses (A, B, C, D)
   - Support des questions à choix multiples

   **Catégorisation**
   - **Catégorie** :
     - `DEFINITION` : Questions de définition
     - `RESPONSABILITE` : Questions sur les responsabilités
     - `COMPETENCES` : Questions sur les compétences
     - `ETAPES` : Questions sur les étapes/processus
     - `OPINION` : Questions d'opinion/sondage

   - **Type de quiz** :
     - `INTRODUCTION` : Quiz d'introduction
     - `SONDAGE` : Sondage/enquête
     - `WORKSHOP` : Questions de workshop

   **Paramètres avancés**
   - **Points** : nombre de points attribués (défaut : 10)
   - **Actif** : cocher pour rendre la question visible
   - **Feedback** (optionnel) : message affiché après réponse
   - **Explication** (optionnel) : explication détaillée de la réponse
   - **Ordre** : position d'affichage (auto-généré si vide)

   **Association**
   - **Métier ID** (optionnel) : lier à un métier spécifique
   - **Workshop ID** (optionnel) : lier à un workshop spécifique

3. Cliquer sur **"Créer"**

### 4.3 Modifier une question existante

1. Cliquer sur **"Modifier"** (icône crayon) sur la question
2. Modifier les champs nécessaires
3. Cliquer sur **"Enregistrer les modifications"**

### 4.4 Supprimer une question

1. Cliquer sur **"Supprimer"** (icône poubelle)
2. Confirmer la suppression

> **Astuce** : Pour désactiver temporairement une question sans la supprimer, décochez simplement "Actif" lors de la modification.

### 4.5 Filtrer et rechercher

**Filtres disponibles** :
- Par catégorie (DEFINITION, RESPONSABILITE, etc.)
- Par type de quiz (INTRODUCTION, SONDAGE, WORKSHOP)
- Par statut (Actives / Inactives)
- Par métier associé
- Par workshop associé

**Pagination** :
- Navigation par pages si plus de 50 questions

---

## 5. Gestion des workshops

Accès : **Menu latéral > Workshops** ou `/admin/workshops-metiers`

### 5.1 Vue des workshops métiers

L'interface affiche :
- Liste de tous les métiers et leurs workshops associés
- Statut (actif/inactif)
- Date de publication
- Lien OneDrive vers les ressources
- Nombre de questions associées

### 5.2 Créer un nouveau workshop métier

1. Cliquer sur **"+ Nouveau métier"**
2. Remplir les informations :
   - **ID** (obligatoire) : identifiant unique (ex: `mtier_1`)
   - **Titre** (obligatoire) : nom du métier
   - **Département** (obligatoire) : département concerné
   - **Ordre** (optionnel) : ordre d'affichage

3. Cliquer sur **"Créer"**

### 5.3 Modifier un workshop

1. Cliquer sur **"Modifier"** sur le workshop
2. Mettre à jour :
   - **Statut actif** : activer/désactiver le workshop
   - **Date de publication** : planifier la publication
   - **Lien OneDrive** : URL vers les ressources externes

3. Cliquer sur **"Enregistrer"**

### 5.4 Gérer les questions d'un workshop

1. Cliquer sur **"Questions"** ou **"Gérer les questions"**
2. Vous serez redirigé vers `/admin/workshops-metiers/[id]/questions`
3. Interface pour :
   - Voir les questions liées à ce workshop
   - Ajouter de nouvelles questions
   - Modifier l'ordre des questions
   - Activer/désactiver des questions

### 5.5 Supprimer un workshop

1. Cliquer sur **"Supprimer"**
2. Confirmer la suppression

⚠️ **Attention** : La suppression d'un workshop peut affecter les questions qui y sont associées.

---

## 6. Consultation des résultats

Accès : **Menu latéral > Résultats** ou `/admin/results`

### 6.1 Vue d'ensemble des résultats

L'interface affiche tous les résultats de quiz avec :
- **Utilisateur** : nom et email
- **Type de quiz** : INTRODUCTION, SONDAGE, WORKSHOP
- **Score** : score obtenu / score maximum
- **Pourcentage** : % de réussite
- **Durée** : temps passé sur le quiz
- **Tentative** : numéro de tentative
- **Date** : date de complétion

### 6.2 Filtrer les résultats

**Filtres disponibles** :
- **Par type de quiz** : sélectionner INTRODUCTION, SONDAGE ou WORKSHOP
- **Par utilisateur** : rechercher par nom ou email
- **Par période** : date de début et fin

### 6.3 Exporter les résultats

1. Appliquer les filtres souhaités (optionnel)
2. Cliquer sur **"Exporter en CSV"** ou **"Télécharger les résultats"**
3. Un fichier CSV sera téléchargé avec toutes les données filtrées

**Données exportées** :
- Informations utilisateur
- Détails du quiz
- Scores et pourcentages
- Réponses détaillées (format JSON)
- Durée et date de complétion

### 6.4 Voir les détails d'un résultat

1. Cliquer sur une ligne de résultat
2. Voir les informations détaillées :
   - Toutes les questions posées
   - Réponses de l'utilisateur
   - Réponses correctes
   - Points obtenus par question
   - Feedback et explications

---

## 7. Rôles et permissions

### Types de rôles

| Rôle | Accès | Permissions |
|------|-------|-------------|
| **USER** | Interface utilisateur uniquement | - Passer des quiz<br>- Voir son profil<br>- Consulter les workshops |
| **MANAGER** | Interface admin limitée | - Voir les statistiques<br>- Consulter les résultats<br>- Gérer les questions<br>- Gérer les workshops |
| **ADMIN** | Interface admin complète | - Toutes les permissions MANAGER<br>- Gérer les utilisateurs<br>- Supprimer des utilisateurs<br>- Accès aux outils avancés<br>- Gérer le cache |

### Contrôle d'accès

**Routes protégées** :
- `/admin/*` : nécessite rôle ADMIN ou MANAGER
- `/ciprel-admin` : authentification admin locale
- `/profile` : utilisateur connecté uniquement
- `/competences` : utilisateur connecté uniquement

**Authentification** :
- Système double : authentification locale admin + Supabase JWT
- Token d'authentification validé sur chaque requête API
- Expiration automatique après inactivité

---

## 8. Bonnes pratiques

### 8.1 Gestion des utilisateurs

✅ **À faire** :
- Vérifier l'email avant de créer un utilisateur (pas de doublons)
- Utiliser des mots de passe forts (minimum 8 caractères, mélange de lettres/chiffres)
- Attribuer le rôle approprié selon les responsabilités
- Mettre à jour régulièrement les informations des utilisateurs

❌ **À éviter** :
- Créer plusieurs comptes avec le même email
- Donner le rôle ADMIN sans nécessité
- Supprimer des utilisateurs sans sauvegarde de leurs données
- Laisser des comptes inactifs avec privilèges élevés

### 8.2 Gestion des questions

✅ **À faire** :
- Relire les questions avant publication
- Tester les questions pour vérifier la clarté
- Fournir des explications pour les réponses complexes
- Utiliser des catégories cohérentes
- Définir un ordre logique d'affichage
- Marquer comme "inactif" les questions à revoir plutôt que de les supprimer

❌ **À éviter** :
- Créer des questions ambiguës ou mal formulées
- Oublier de marquer la bonne réponse
- Mélanger plusieurs concepts dans une seule question
- Laisser des questions non associées à un workshop

### 8.3 Gestion des workshops

✅ **À faire** :
- Planifier la date de publication à l'avance
- Vérifier que le lien OneDrive est valide et accessible
- Créer les questions associées avant d'activer le workshop
- Tester le parcours complet utilisateur
- Désactiver plutôt que supprimer pour historique

❌ **À éviter** :
- Publier un workshop sans contenu
- Supprimer un workshop avec des résultats associés
- Changer drastiquement le contenu sans informer les utilisateurs
- Laisser des liens OneDrive cassés

### 8.4 Sécurité et conformité RGPD

✅ **À faire** :
- Se déconnecter après chaque session admin
- Utiliser une connexion sécurisée (HTTPS)
- Respecter la confidentialité des données utilisateurs
- Exporter et archiver régulièrement les données importantes
- Vérifier les logs de traitement de données (`data_processing_log`)

❌ **À éviter** :
- Partager les identifiants admin
- Accéder à l'admin depuis un réseau public non sécurisé
- Exporter des données personnelles sans raison légitime
- Supprimer des logs de conformité

### 8.5 Surveillance et maintenance

**Tâches quotidiennes** :
- Consulter le tableau de bord pour les activités anormales
- Vérifier les nouveaux utilisateurs inscrits
- Répondre aux problèmes signalés

**Tâches hebdomadaires** :
- Analyser les résultats des quiz
- Vérifier les taux de complétion
- Identifier les questions problématiques (taux d'échec élevé)
- Nettoyer les comptes inactifs ou test

**Tâches mensuelles** :
- Exporter les résultats pour archivage
- Analyser les tendances d'utilisation
- Réviser et mettre à jour le contenu obsolète
- Vérifier les performances du système

---

## Support et dépannage

### Problèmes courants

**1. Je n'arrive pas à me connecter à l'admin**
- Vérifier les identifiants (sensibles à la casse)
- Vider le cache du navigateur
- Vérifier que vous n'avez pas atteint la limite de tentatives (3 max)
- Attendre quelques minutes avant de réessayer

**2. Les modifications ne s'affichent pas**
- Rafraîchir la page (Ctrl+F5 ou Cmd+Shift+R)
- Vider le cache de l'application (`/api/admin/cache` avec secret)
- Vérifier que vous avez bien cliqué sur "Enregistrer"

**3. Impossible de supprimer un utilisateur**
- Vérifier que vous avez le rôle ADMIN
- Vérifier que vous n'essayez pas de vous supprimer vous-même
- Vérifier que l'utilisateur n'a pas de dépendances critiques

**4. Les questions ne s'affichent pas dans le quiz**
- Vérifier que la question est marquée comme "Active"
- Vérifier que la question est associée au bon workshop/métier
- Vérifier l'ordre d'affichage
- Rafraîchir le cache

### Logs et débogage

**Consulter les logs de traitement de données** :
- Table : `data_processing_log`
- Accessible via la base de données Supabase
- Enregistre : action, type de données, objectif, base légale, utilisateur

**Actions enregistrées** :
- CREATE : création d'utilisateur
- READ : consultation de données
- UPDATE : modification de profil
- DELETE : suppression d'utilisateur
- EXPORT : export de données
- ANONYMIZE : anonymisation

---

## Outils avancés

### Gestion du cache

**Accès** : `/api/admin/cache`

**Opérations disponibles** :
- **GET** : Voir les statistiques du cache
  - Nombre d'entrées
  - Utilisation mémoire
  - Taux de hit/miss

- **DELETE** : Vider le cache
  - Nécessite le secret : `CACHE_ADMIN_SECRET`
  - Peut cibler des patterns spécifiques
  - Exemple : supprimer uniquement le cache des questions

**Utilisation** :
```
// Vider tout le cache
DELETE /api/admin/cache
Headers: { "x-cache-secret": "votre_secret" }

// Vider un pattern spécifique
DELETE /api/admin/cache?pattern=questions:*
Headers: { "x-cache-secret": "votre_secret" }
```

### Synchronisation des questions

**Accès** : `/api/admin/sync-questions`

Permet d'importer des questions depuis un fichier JSON :

**Format supporté** :
```json
{
  "workshop_key_1": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": [0],
      "category": "DEFINITION",
      "points": 10
    }
  ]
}
```

**Processus** :
1. Upload du fichier JSON
2. Validation du format
3. Mapping des clés workshop vers IDs
4. Suppression des questions existantes
5. Insertion des nouvelles questions

⚠️ **Attention** : Cette opération supprime les questions existantes du workshop avant import.

---

## Annexes

### Structure des données

**Profile utilisateur** :
- id : UUID
- email : string
- name : string
- role : "USER" | "MANAGER" | "ADMIN"
- phone : string (optionnel)
- avatar_url : string (optionnel)
- created_at : timestamp
- updated_at : timestamp

**Question** :
- id : serial
- title : string
- question : string (texte de la question)
- option_a, option_b, option_c, option_d : string
- correct_answer : array (ex: ["A", "C"] pour choix multiples)
- category : string
- quiz_type : string
- points : integer
- active : boolean
- feedback : string
- explanation : string
- order_index : integer
- metier_id : string (FK vers workshops_metiers)
- workshop_id : integer (FK vers workshops)

**Quiz Result** :
- id : UUID
- user_id : UUID
- quiz_type : string
- score : integer
- max_score : integer
- percentage : float
- responses : jsonb (détails des réponses)
- duration : integer (secondes)
- attempt_number : integer
- completed_at : timestamp

### Variables d'environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cache
CACHE_ADMIN_SECRET=your_secret_key
```

### URLs importantes

- **Page de connexion admin** : `/ciprel-admin`
- **Tableau de bord** : `/admin`
- **Gestion utilisateurs** : `/admin/users`
- **Gestion questions** : `/admin/questions`
- **Gestion workshops** : `/admin/workshops-metiers`
- **Résultats** : `/admin/results`
- **Base de données** : Console Supabase

---

## Aide rapide

| Besoin | Action |
|--------|--------|
| Se connecter | Aller sur `/ciprel-admin` |
| Créer un utilisateur | Admin > Utilisateurs > + Nouvel utilisateur |
| Créer une question | Admin > Questions > + Nouvelle question |
| Voir les résultats | Admin > Résultats |
| Exporter des données | Résultats > Exporter CSV |
| Activer un workshop | Workshops > Modifier > Cocher "Actif" |
| Changer un rôle | Utilisateurs > Modifier > Sélectionner rôle |
| Vider le cache | API : DELETE /api/admin/cache |

---

**Version du guide** : 1.0
**Dernière mise à jour** : Décembre 2024
**Plateforme** : Next.js 14.2 + Supabase

Pour toute question ou problème technique, contactez l'équipe de développement.
