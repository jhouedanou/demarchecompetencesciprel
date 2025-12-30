# Guide d'Administration - Plateforme CIPREL

## Connexion au systeme

**URL de connexion**
https://demarchecompetencesciprel.vercel.app/ciprel-admin

**Identifiants administrateur**

| Champ | Valeur |
|-------|--------|
| Nom d'utilisateur | `jeanluc@houedanou` |
| Mot de passe | `kY*N@Cn7-T@QxJm` |

**Remarque** : Apres 3 tentatives de connexion echouees, l'acces est temporairement bloque. Patientez quelques minutes avant de reessayer.

---

## Navigation principale

Une fois connecte, vous accedez au tableau de bord. Le menu lateral gauche permet d'acceder aux differentes sections :

| Section | URL | Description |
|---------|-----|-------------|
| Tableau de bord | `/admin` | Vue d'ensemble et statistiques |
| Utilisateurs | `/admin/users` | Gestion des comptes utilisateurs |
| Workshops | `/admin/workshops-metiers` | Gestion des workshops metiers |
| Resultats | `/admin/results` | Consultation des resultats de quiz |
| Rapports | `/admin/reports` | Statistiques detaillees et exports |

---

## 1. Tableau de bord

Le tableau de bord affiche les indicateurs cles de la plateforme :

- Nombre total d'utilisateurs inscrits
- Nombre de quiz completes
- Score moyen des participants
- Taux de completion
- Utilisateurs actifs du jour

La section "Activites recentes" liste les dernieres inscriptions et les quiz recemment completes.

---

## 2. Gestion des utilisateurs

**Acces** : Menu lateral > Utilisateurs

### Consulter la liste des utilisateurs

La page affiche tous les utilisateurs enregistres avec les informations suivantes :
- Nom
- Email
- Telephone
- Role (USER, MANAGER, ADMIN)
- Date de creation

### Creer un nouvel utilisateur

1. Cliquer sur "Creer un utilisateur"
2. Remplir le formulaire :
   - **Email** : adresse email (obligatoire)
   - **Nom** : nom complet (obligatoire)
   - **Mot de passe** : minimum 6 caracteres (obligatoire)
   - **Telephone** : numero de telephone (optionnel)
   - **Role** : selectionner parmi USER, MANAGER ou ADMIN
3. Cliquer sur "Creer"

### Roles disponibles

| Role | Droits |
|------|--------|
| USER | Acces utilisateur standard (quiz, profil, workshops) |
| MANAGER | Acces administration limite (statistiques, questions, workshops) |
| ADMIN | Acces administration complet (tous les droits) |

### Modifier un utilisateur

1. Cliquer sur l'icone de modification (crayon) sur la ligne de l'utilisateur
2. Modifier les champs souhaites
3. Cliquer sur "Enregistrer"

### Supprimer un utilisateur

1. Cliquer sur l'icone de suppression (corbeille)
2. Confirmer la suppression

**Restrictions** : Seuls les administrateurs peuvent supprimer des utilisateurs. Il est impossible de supprimer son propre compte.

---

## 3. Gestion des workshops metiers

**Acces** : Menu lateral > Workshops

### Vue d'ensemble

La page liste tous les workshops metiers avec :
- Titre du workshop
- Statut (Actif/Inactif)
- Nombre de questions associees

### Modifier un workshop

1. Cliquer sur "Editer" sur le workshop concerne
2. Le formulaire d'edition comporte 7 onglets :

#### Onglet General
- Titre du workshop
- Icone (emoji)
- Couleur (classe Tailwind)
- Ordre d'affichage
- URL de la video
- Lien du dossier OneDrive

#### Onglet Presentation
- Description du workshop
- Piliers/entites
- Domaines d'activite

#### Onglet Organisation
- Fonctions et roles
- Titre de chaque fonction
- Description des roles

#### Onglet Competences
- Savoir (connaissances)
- Savoir-faire (competences techniques)
- Savoir-etre (competences comportementales)

#### Onglet Partenariats
- Partenaires internes
- Partenaires externes

#### Onglet Temoignage
- Citation principale
- Signature/devise
- Points de fierte

#### Onglet Ressources
- URL du support de presentation
- URL du referentiel de competences
- Lien du dossier OneDrive
- URL de la video du workshop

3. Cliquer sur "Enregistrer" pour sauvegarder les modifications

### Activer ou desactiver un workshop

Utiliser le bouton de statut pour basculer entre Actif et Inactif. Un workshop inactif n'est pas visible par les utilisateurs.

### Gerer les questions d'un workshop

1. Cliquer sur le bouton "Quiz" du workshop concerne
2. La page affiche toutes les questions associees au workshop

---

## 4. Gestion des questions

### Consulter les questions

Chaque workshop dispose de sa propre liste de questions accessible via le bouton "Quiz".

Les informations affichees pour chaque question :
- Texte de la question
- Options de reponse (A, B, C, D)
- Reponse(s) correcte(s) (surlignee en vert)
- Points attribues
- Statut (Actif/Inactif)

### Creer une nouvelle question

1. Cliquer sur "Nouvelle question"
2. Remplir le formulaire :
   - **Titre** : titre court (optionnel)
   - **Question** : texte complet de la question (obligatoire)
   - **Option A** : premiere reponse (obligatoire)
   - **Option B** : deuxieme reponse (obligatoire)
   - **Option C** : troisieme reponse (optionnel)
   - **Option D** : quatrieme reponse (optionnel)
   - **Reponse(s) correcte(s)** : cocher une ou plusieurs reponses
   - **Points** : nombre de points (defaut : 10)
   - **Categorie** : DEFINITION, RESPONSABILITE, COMPETENCES, ETAPES ou OPINION
   - **Statut** : Actif ou Inactif
3. Cliquer sur "Creer"

### Modifier une question

1. Cliquer sur l'icone de modification sur la ligne de la question
2. Modifier les champs souhaites
3. Cliquer sur "Enregistrer"

### Supprimer une question

1. Cliquer sur l'icone de suppression
2. Confirmer la suppression

### Activer ou desactiver une question

Utiliser l'icone d'oeil pour basculer le statut. Une question inactive n'apparait pas dans les quiz.

---

## 5. Consultation des resultats

**Acces** : Menu lateral > Resultats

### Vue d'ensemble

La page affiche tous les resultats de quiz avec :
- Nom et email de l'utilisateur
- Type de quiz (Introduction, Sondage, Workshop)
- Date et heure de completion
- Duree du quiz
- Numero de tentative
- Score (points et pourcentage)
- Nombre de reponses correctes
- Statut (Reussi si >= 60%)

### Filtrer les resultats

Utiliser le menu deroulant pour filtrer par type de quiz :
- Tous
- Introduction
- Sondage
- Workshop

### Voir le detail d'un resultat

Cliquer sur "Details" pour afficher les reponses detaillees de l'utilisateur.

### Exporter les resultats

Cliquer sur "Exporter CSV" pour telecharger l'ensemble des resultats au format CSV.

---

## 6. Rapports et statistiques

**Acces** : Menu lateral > Rapports

### Indicateurs affiches

- Nombre total d'utilisateurs
- Nombre total de quiz completes
- Nombre total de questions
- Score moyen (pourcentage)

### Graphiques

- Distribution par type de quiz
- Taux de completion global

### Periode d'analyse

Selectionner la periode souhaitee :
- 7 derniers jours
- 30 derniers jours
- 90 derniers jours
- 1 an

### Actions disponibles

- **Actualiser** : recharger les donnees
- **Exporter** : telecharger les statistiques au format CSV

---

## 7. Operations courantes

### Ajouter un nouveau workshop avec quiz

1. Acceder a la page Workshops
2. Editer le workshop concerne
3. Completer tous les onglets (General, Presentation, Organisation, Competences, Partenariats, Temoignage, Ressources)
4. Enregistrer les modifications
5. Cliquer sur "Quiz" pour acceder aux questions
6. Ajouter les questions du quiz
7. Activer le workshop

### Consulter les performances d'un workshop

1. Acceder a la page Resultats
2. Filtrer par "Workshop"
3. Consulter les scores et taux de reussite
4. Exporter les donnees si necessaire

### Desactiver temporairement du contenu

Pour masquer du contenu sans le supprimer :
- Workshop : basculer le statut sur "Inactif"
- Question : basculer le statut sur "Inactif" via l'icone d'oeil

---

## 8. Deconnexion

Pour vous deconnecter :
1. Cliquer sur le bouton de deconnexion dans le menu lateral
2. Vous serez redirige vers la page de connexion

---

## 9. Support technique

En cas de probleme technique :

| Probleme | Solution |
|----------|----------|
| Connexion impossible | Verifier les identifiants, attendre si blocage apres 3 tentatives |
| Modifications non visibles | Rafraichir la page (Ctrl+F5 ou Cmd+Shift+R) |
| Erreur lors d'une action | Verifier la connexion internet, reessayer l'operation |
| Question non affichee dans le quiz | Verifier que la question est active et associee au bon workshop |

---

**Version** : 1.0
**Derniere mise a jour** : Decembre 2024
