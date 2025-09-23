# 🚀 Guide d'Installation - Démarche Compétences CIPREL

Guide détaillé pour l'installation et le déploiement de la solution SPFx.

## 📋 Prérequis système

### Environnement de développement

| Composant | Version minimale | Version recommandée |
|-----------|------------------|---------------------|
| **Node.js** | 22.14.0 | 22.14.0+ (LTS) |
| **npm** | 10.0.0 | Dernière version |
| **PowerShell** | 7.0 | 7.4+ |
| **Git** | 2.30 | Dernière version |

### Environnement SharePoint

| Composant | Versions supportées |
|-----------|-------------------|
| **SharePoint Online** | ✅ Toutes versions |
| **SharePoint 2019** | ✅ On-Premises avec Feature Pack |
| **SharePoint 2016** | ❌ Non supporté |

### Navigateurs supportés

| Navigateur | Version minimale |
|------------|------------------|
| **Microsoft Edge** | Chromium (79+) |
| **Google Chrome** | 90+ |
| **Mozilla Firefox** | 88+ |
| **Safari** | 14+ |

### Permissions requises

| Niveau | Permissions | Usage |
|--------|-------------|--------|
| **Site** | Propriétaire ou Administrateur | Déploiement initial |
| **App Catalog** | Accès en écriture | Upload du package |
| **Tenant** | Administrateur SharePoint | Configuration globale |

## 🔧 Installation étape par étape

### Étape 1 : Préparation de l'environnement

#### 1.1 Installer Node.js

```bash
# Vérifier la version actuelle
node --version
npm --version

# Si version incorrecte, télécharger depuis:
# https://nodejs.org/en/download/
```

#### 1.2 Installer les outils globaux

```bash
# Gulp CLI (requis pour SPFx)
npm install -g gulp-cli

# Yeoman et générateur SPFx (optionnel pour le développement)
npm install -g yo @microsoft/generator-sharepoint
```

#### 1.3 Installer PnP PowerShell

```powershell
# Installation pour l'utilisateur actuel
Install-Module -Name PnP.PowerShell -Scope CurrentUser -Force

# Vérifier l'installation
Get-Module -Name PnP.PowerShell -ListAvailable
```

### Étape 2 : Récupération du code source

#### 2.1 Cloner le repository

```bash
# Cloner depuis GitHub
git clone https://github.com/ciprel/demarchecompetencesciprel.git

# Ou télécharger et extraire l'archive ZIP
cd demarchecompetencesciprel
```

#### 2.2 Installation des dépendances

```bash
# Installation complète
npm install

# En cas de problème, nettoyer et réinstaller
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Étape 3 : Configuration du projet

#### 3.1 Variables d'environnement (optionnel)

```bash
# Créer le fichier de configuration locale
cp .env.example .env.local

# Éditer si nécessaire (généralement pas requis pour SPFx)
# Principalement pour des URLs spécifiques ou options de développement
```

#### 3.2 Validation de l'environnement

```bash
# Tester que tout fonctionne
npm run build

# Si succès, vous devriez voir le dossier 'lib' créé
ls -la lib/
```

### Étape 4 : Build et packaging

#### 4.1 Build de production

```bash
# Nettoyage préalable
npm run clean

# Build optimisé pour la production
npm run build:prod
```

#### 4.2 Création du package

```bash
# Génération du fichier .sppkg
npm run package

# Vérifier que le fichier a été créé
ls -la solution/*.sppkg
```

## 🌐 Déploiement SharePoint

### Option 1 : Déploiement automatique (Recommandé)

#### Installation complète

```powershell
# Script de démarrage rapide
.\scripts\quick-start.ps1 -SiteUrl "https://ciprel.sharepoint.com/sites/competences"
```

#### Déploiement personnalisé

```powershell
# Avec paramètres avancés
.\scripts\deploy.ps1 `
  -SiteUrl "https://ciprel.sharepoint.com/sites/competences" `
  -AppCatalogUrl "https://ciprel.sharepoint.com/sites/appcatalog" `
  -LoadTestData `
  -Force
```

### Option 2 : Déploiement manuel

#### 4.1 Upload vers App Catalog

1. **Accédez** à votre App Catalog SharePoint
2. **Naviguez** vers "Apps for SharePoint"
3. **Uploadez** le fichier `solution/demarchecompetencesciprel.sppkg`
4. **Cliquez** sur "Deploy" dans la pop-up

#### 4.2 Installation sur le site

1. **Accédez** à votre site SharePoint cible
2. **Allez** dans "Site Contents" → "New" → "App"
3. **Sélectionnez** "Démarche Compétences CIPREL"
4. **Cliquez** sur "Add"

#### 4.3 Ajout à une page

1. **Créez** une nouvelle page ou éditez une existante
2. **Cliquez** sur "+" pour ajouter un WebPart
3. **Recherchez** "Démarche Compétences"
4. **Ajoutez** le WebPart à votre page

### Option 3 : Déploiement via CLI (Avancé)

```bash
# Installation de CLI for Microsoft 365
npm install -g @pnp/cli-microsoft365

# Connexion
m365 login

# Upload du package
m365 spo app add --filePath "./solution/demarchecompetencesciprel.sppkg" --appCatalogUrl "https://ciprel.sharepoint.com/sites/appcatalog"

# Déploiement
m365 spo app deploy --name "demarchecompetencesciprel" --appCatalogUrl "https://ciprel.sharepoint.com/sites/appcatalog"

# Installation sur le site
m365 spo app install --name "demarchecompetencesciprel" --siteUrl "https://ciprel.sharepoint.com/sites/competences"
```

## 📊 Configuration post-installation

### Vérification des listes SharePoint

Les listes suivantes doivent être automatiquement créées :

1. **CompetenceQuestions** (`/Lists/CompetenceQuestions`)
   - ✅ Visible dans "Site Contents"
   - ✅ Contient les 7 questions par défaut (si `-LoadTestData` utilisé)

2. **CompetenceResults** (`/Lists/CompetenceResults`)
   - ✅ Visible dans "Site Contents"
   - ✅ Prêt pour recevoir les résultats de quiz

3. **SondageResponses** (`/Lists/SondageResponses`)
   - ✅ Visible dans "Site Contents"
   - ✅ Prêt pour recevoir les réponses de sondages

### Configuration des permissions

#### Permissions par défaut

| Groupe SharePoint | Permissions sur les listes | Accès application |
|-------------------|---------------------------|------------------|
| **Visitors** | Lecture seule | Vue limitée |
| **Members** | Lecture + Ajout d'éléments | Quiz + Sondage |
| **Owners** | Contrôle total | Toutes fonctionnalités |

#### Permissions spéciales

```powershell
# Donner accès au tableau de bord à un groupe spécifique
Connect-PnPOnline -Url "https://ciprel.sharepoint.com/sites/competences"

# Ajouter un groupe "Managers" avec permissions élevées
Add-PnPGroupMember -Group "Managers" -Users "manager@ciprel.ci"

# Configurer les permissions sur les listes (optionnel)
Set-PnPListPermission -Identity "CompetenceResults" -Group "Managers" -AddRole "Read"
```

### Personnalisation des questions

#### Ajouter des questions via interface

1. **Accédez** à la liste "Questions Compétences"
2. **Cliquez** sur "New"
3. **Remplissez** les champs requis :
   - **Title** : Titre de la question
   - **Question** : Texte de la question
   - **OptionA/B/C** : Options de réponse
   - **CorrectAnswer** : A, B ou C
   - **Category** : Definition, Responsabilite, Competences, Etapes
   - **Points** : Nombre de points (1-100)
   - **QuizType** : Introduction ou Sondage

#### Ajouter des questions via PowerShell

```powershell
# Connexion au site
Connect-PnPOnline -Url "https://ciprel.sharepoint.com/sites/competences"

# Ajouter une question
Add-PnPListItem -List "CompetenceQuestions" -Values @{
  Title = "Ma nouvelle question"
  Question = "Quel est l'objectif principal de la démarche compétences ?"
  OptionA = "Réduire les coûts"
  OptionB = "Améliorer les performances"
  OptionC = "Satisfaire les audits"
  CorrectAnswer = "B"
  Category = "Definition"
  Points = 10
  QuizType = "Introduction"
}
```

## 🧪 Tests et validation

### Tests fonctionnels

#### 1. Test du quiz

- [ ] **Accès** : La page quiz se charge correctement
- [ ] **Navigation** : Passage entre les questions fluide
- [ ] **Sauvegarde** : Les réponses sont enregistrées
- [ ] **Résultats** : Le score est calculé correctement
- [ ] **Permissions** : Accessible à tous les utilisateurs authentifiés

#### 2. Test du sondage

- [ ] **Formulaire** : Tous les champs sont présents
- [ ] **Validation** : Les champs obligatoires sont contrôlés
- [ ] **Soumission** : Les données sont enregistrées
- [ ] **Confirmation** : Message de succès affiché
- [ ] **Unicité** : Impossible de répondre plusieurs fois

#### 3. Test du tableau de bord

- [ ] **Accès** : Limité aux managers/RH
- [ ] **Données** : Les métriques s'affichent
- [ ] **Graphiques** : Les charts se chargent
- [ ] **Performance** : Temps de réponse acceptable (< 3s)

### Tests techniques

```bash
# Tests unitaires (si implémentés)
npm test

# Vérification du build
npm run build

# Analyse statique du code
npm run lint
```

### Tests de charge

```powershell
# Simulation de 50 utilisateurs simultanés
# (Script personnalisé requis)
.\scripts\load-test.ps1 -SiteUrl "..." -Users 50 -Duration 300
```

## 🔧 Résolution de problèmes

### Problèmes de build

#### Erreur : "Cannot resolve dependency"

```bash
# Solution 1: Nettoyer et réinstaller
npm run clean
rm -rf node_modules package-lock.json
npm install

# Solution 2: Forcer la résolution
npm install --force
```

#### Erreur : "Gulp command not found"

```bash
# Installer gulp globalement
npm install -g gulp-cli

# Ou utiliser npx
npx gulp bundle --ship
```

### Problèmes de déploiement

#### Erreur : "App deployment failed"

**Causes possibles** :
- Permissions insuffisantes sur l'App Catalog
- Package corrompu ou invalide
- Conflit avec une version existante

**Solutions** :
```powershell
# Vérifier les permissions
Connect-PnPOnline -Url "https://ciprel.sharepoint.com/sites/appcatalog"
Get-PnPAppAuthorizationPolicy

# Forcer la mise à jour
Remove-PnPApp -Identity "demarchecompetencesciprel"
Add-PnPApp -Path "./solution/demarchecompetencesciprel.sppkg" -Overwrite
```

#### Erreur : "Lists not created"

```powershell
# Vérifier que la feature est activée
Get-PnPFeature -Scope Site -Identity "8a4b3c2d-1e5f-4g6h-7i8j-9k0l1m2n3o4p"

# Activer manuellement si nécessaire
Enable-PnPFeature -Identity "8a4b3c2d-1e5f-4g6h-7i8j-9k0l1m2n3o4p" -Scope Site
```

### Problèmes de permissions

#### Erreur : "Access denied to dashboard"

**Vérifications** :
1. L'utilisateur a-t-il des permissions élevées ?
2. Le profil utilisateur contient-il les mots-clés manager ?
3. Les permissions sur les listes sont-elles correctes ?

**Solution** :
```powershell
# Ajouter l'utilisateur au groupe approprié
Add-PnPGroupMember -Group "Site Owners" -Users "user@ciprel.ci"

# Ou ajuster la logique dans UserService.ts
# Modifier la méthode isManagerRole() selon vos besoins
```

### Problèmes de performance

#### Application lente

**Optimisations** :
- Activer le lazy loading des composants
- Optimiser les requêtes SharePoint
- Utiliser le cache local approprié

```typescript
// Exemple d'optimisation dans SharePointService.ts
// Ajouter du cache en mémoire pour les questions
private questionsCache: Map<string, QuizQuestion[]> = new Map();

async getQuizQuestions(quizType: string): Promise<QuizQuestion[]> {
  if (this.questionsCache.has(quizType)) {
    return this.questionsCache.get(quizType)!;
  }
  
  const questions = await this.sp.web.lists.getByTitle("CompetenceQuestions")...
  this.questionsCache.set(quizType, questions);
  return questions;
}
```

## 📞 Support

### Logs de débogage

#### Activer les logs détaillés

```typescript
// Dans SharePointService.ts
import { Logger, LogLevel } from '@pnp/logging';
Logger.activeLogLevel = LogLevel.Verbose;
```

#### Consulter les logs SharePoint

1. **ULS Logs** (On-Premises) : `C:\Program Files\Common Files\microsoft shared\Web Server Extensions\16\LOGS`
2. **Browser DevTools** : Console et Network tabs
3. **SharePoint Admin Center** : Monitoring > Service health

### Contacts support

| Type de problème | Contact |
|------------------|---------|
| **Technique/Build** | dev-support@ciprel.ci |
| **SharePoint/Permissions** | sharepoint-admin@ciprel.ci |
| **Fonctionnel/Métier** | rh@ciprel.ci |
| **Urgences** | +225 XX XX XX XX XX |

### Informations à fournir

Lors d'une demande de support, incluez :
- 🌐 **URL du site** SharePoint
- 👤 **Compte utilisateur** concerné
- 🔍 **Étapes** pour reproduire le problème
- 📸 **Captures d'écran** des erreurs
- 📋 **Messages d'erreur** complets
- 🖥️ **Navigateur** et version utilisés

---

**Installation terminée avec succès ! 🎉**

*Votre solution Démarche Compétences CIPREL est maintenant prête à être utilisée.*
