# Démarche Compétence CIPREL - Application SharePoint

## 📋 Vue d'ensemble

Cette application SharePoint Framework (SPFx) avec React permet de gérer la démarche compétence chez CIPREL. Elle offre des quiz interactifs, un suivi des progrès, et une intégration complète avec l'écosystème SharePoint.

## 🏗️ Architecture

### Technologies Utilisées
- **Frontend**: React 17 + TypeScript
- **Framework**: SharePoint Framework (SPFx) 1.18.2
- **État**: Redux Toolkit (store management)
- **API**: PnP.js v3 pour SharePoint
- **UI**: Fluent UI React
- **Build**: Webpack + Gulp
- **Conteneurisation**: Docker

### Structure du Projet
```
demarche-competence-ciprel/
├── config/                 # Configuration SPFx
├── scripts/                # Scripts de déploiement
├── src/
│   ├── components/         # Composants React
│   ├── webparts/
│   │   └── demarcheCompetence/
│   │       ├── app/        # Application principale
│   │       ├── services/   # Services SharePoint
│   │       ├── stores/     # Gestion d'état Redux Toolkit
│   │       ├── types/      # Définitions TypeScript
│   │       └── utils/      # Utilitaires
│   └── assets/            # Ressources statiques
├── docker-compose.yml     # Configuration Docker
├── Dockerfile            # Image Docker
└── README.md
```

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+
- SharePoint Online ou SharePoint 2019+
- PowerShell 7+ (pour les scripts de déploiement)
- Docker (optionnel, pour le développement)

### 1. Installation des Dépendances
```bash
npm install
```

### 2. Configuration SharePoint

#### Création des Listes SharePoint
```powershell
# Exécuter le script de déploiement des listes
.\scripts\Deploy-SharePointLists.ps1 -SiteUrl "https://votre-tenant.sharepoint.com/sites/votre-site"

# Populer avec des données d'exemple
.\scripts\Populate-SampleData.ps1 -SiteUrl "https://votre-tenant.sharepoint.com/sites/votre-site"
```

#### Listes Créées
1. **Quiz_Introduction** - Questions du quiz d'introduction
2. **Quiz_Sondage** - Questions du sondage de satisfaction
3. **Quiz_Results** - Résultats des quiz et sondages
4. **User_Progress** - Suivi des progrès utilisateurs

### 3. Configuration du Développement

#### Option A: Développement Local
```bash
# Servir l'application en mode développement
npm run serve

# URL de test
https://localhost:4321/temp/workbench.html
```

#### Option B: Développement avec Docker
```bash
# Construire et lancer avec Docker
npm run docker:serve

# Ou avec docker-compose
docker-compose up
```

### 4. Configuration SPFx

Modifier `config/serve.json` avec votre URL SharePoint :
```json
{
  "pageUrl": "https://votre-tenant.sharepoint.com/sites/votre-site/_layouts/workbench.aspx"
}
```

## 📦 Déploiement

### Option 1 · Déploiement express (≈15 minutes)
- Exécuter le script d'automatisation complet pour provisionner les listes, empaqueter la solution et la déployer :
  ```powershell
  .\scripts\Deploy-Demo.ps1 -TenantUrl "https://ciprel.sharepoint.com"
  ```
- Le script génère le fichier `.sppkg`, l'ajoute à l'App Catalog et active la Web Part sur le site cible.

### Option 2 · Environnement docker local (≈5 minutes)
- Lancer la Workbench locale fournie par SPFx dans un conteneur :
  ```bash
  npm run docker:serve
  ```
- Une fois le container démarré, ouvrir `http://localhost:4321/temp/workbench.html` pour tester la Web Part sans dépendre du tenant SharePoint.

### Option 3 · SharePoint Workbench en ligne (≈2 minutes)
- Servir la Web Part depuis votre machine en mode développement :
  ```bash
  npm run serve
  ```
- Dans votre navigateur, naviguer vers `https://ciprel.sharepoint.com/_layouts/15/workbench.aspx`, ajouter la Web Part et valider le comportement directement dans SharePoint Online.

## 🎯 Fonctionnalités

### Quiz Interactifs
- **Quiz d'Introduction**: Évaluation des connaissances sur la démarche compétence
- **Sondage de Satisfaction**: Collecte de feedback utilisateur
- Sauvegarde automatique des progrès
- Timer et validation en temps réel
- Résultats détaillés avec feedback

### Tableau de Bord
- Vue d'ensemble des progrès
- Statistiques personnalisées
- Actions rapides
- Notifications en temps réel

### Suivi des Compétences
- 6 domaines de compétence prédéfinis
- Niveaux de progression (1-5)
- Planification des évaluations
- Historique des assessments

### Gestion des Données
- Intégration native SharePoint
- Synchronisation temps réel
- Export des données (CSV/JSON)
- Gestion des permissions

## 🛠️ Configuration

### Paramètres du WebPart
- **Titre**: Titre affiché de l'application
- **Thème**: Clair/Sombre/Automatique
- **Sauvegarde automatique**: Intervalle configurable
- **Notifications**: Activées/Désactivées
- **Mode compact**: Interface condensée

### Variables d'Environnement
```javascript
// Dans DemarcheCompetenceWebPart.ts
const config = {
  autoSaveInterval: 30000, // 30 secondes
  cacheTimeout: 300000,    // 5 minutes
  maxRetries: 3,
  offlineMode: false
};
```

## 📊 Structure des Données

### Quiz_Introduction
```json
{
  "Title": "Question 1",
  "Question": "Qu'est-ce que la démarche compétence ?",
  "Options": "['Option A', 'Option B', 'Option C']",
  "CorrectAnswer": "Option A",
  "Category": "Définition",
  "Points": 1,
  "Order": 1
}
```

### Quiz_Results
```json
{
  "User": "user@company.com",
  "QuizType": "Introduction",
  "Responses": "[{questionId: '1', answer: 'A', correct: true, timeSpent: 45}]",
  "Score": 85,
  "CompletionDate": "2025-01-20T10:15:00Z",
  "Duration": 900,
  "Status": "Completed"
}
```

### User_Progress
```json
{
  "User": "user@company.com",
  "CompetenceArea": "Leadership",
  "CurrentLevel": 3,
  "TargetLevel": 5,
  "LastAssessment": "2025-01-15T14:30:00Z",
  "NextAssessment": "2025-07-15T14:30:00Z",
  "Progress": 60
}
```

## 🔧 Développement

### Structure des Composants React
```typescript
// Composant principal
DemarcheCompetenceApp.tsx
├── Dashboard.tsx
├── QuizIntroduction.tsx
├── QuizSondage.tsx
└── ProgressTracker.tsx
```

### Services
```typescript
// SharePointService - Interface avec les listes SharePoint
// QuizService - Logique métier des quiz
// UserService - Gestion des utilisateurs et progrès
```

### Stores Redux Toolkit
```typescript
// app slice    - État global de l'application
// quiz slice   - Gestion des quiz et résultats
// user slice   - Données utilisateur et progrès
```

### Ajout de Nouvelles Fonctionnalités

#### 1. Nouveau Composant
```bash
# Créer dans src/components/
touch src/components/NouveauComposant.tsx
```

#### 2. Nouveau Service
```typescript
// src/services/NouveauService.ts
import { SharePointService } from './SharePointService';

export class NouveauService {
  constructor(private sharePointService: SharePointService) {}
  
  async nouvelleMethode(): Promise<any> {
    // Implementation
  }
}
```

#### 3. Nouveau Store
```typescript
// src/webparts/demarcheCompetence/stores/nouveauSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NouveauState {
  valeur: string;
}

const initialState: NouveauState = {
  valeur: ''
};

export const nouveauSlice = createSlice({
  name: 'nouveau',
  initialState,
  reducers: {
    setValeur(state, action: PayloadAction<string>) {
      state.valeur = action.payload;
    }
  }
});

export const { setValeur } = nouveauSlice.actions;
export default nouveauSlice.reducer;
```

## 🧪 Tests

### Tests Unitaires
```bash
npm run test
```

### Tests E2E
```bash
npm run test:e2e
```

### Tests de Performance
```bash
npm run test:performance
```

## 📱 Responsivité

L'application est entièrement responsive avec :
- Design mobile-first
- Sidebar adaptative
- Composants Fluent UI
- Gestes tactiles supportés

## 🔒 Sécurité

### Authentification
- Intégration SharePoint SSO
- Gestion des permissions par liste
- Validation côté client et serveur

### Données
- Chiffrement des données sensibles
- Audit trail automatique
- Respect RGPD

## 🌐 Internationalisation

Support multilingue avec :
- Français (par défaut)
- Anglais
- Fichiers de ressources dans `/loc/`

## ⚡ Performance

### Optimisations
- Lazy loading des composants
- Cache intelligent avec TTL
- Pagination automatique
- Compression des assets

### Métriques
- Temps de chargement < 3s
- First Contentful Paint < 1.5s
- Cumulative Layout Shift < 0.1

## 🐛 Dépannage

### Problèmes Courants

#### 1. Erreur de Permission
```
Solution: Vérifier les permissions sur les listes SharePoint
```

#### 2. Échec de Chargement
```
Solution: Vider le cache navigateur et redémarrer
```

#### 3. Problème de Build
```bash
npm run clean
npm install
npm run build
```

### Logs et Debugging
- Console du navigateur : F12
- Logs SharePoint : ULS Logs
- Mode debug : Paramètre WebPart

## 📞 Support

### Documentation
- [SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/)
- [Vue.js 3](https://vuejs.org/guide/)
- [Pinia](https://pinia.vuejs.org/)
- [PnP.js](https://pnp.github.io/pnpjs/)

### Contact
- **Équipe RH CIPREL**: rh@ciprel.ci
- **Support IT**: support@ciprel.ci
- **Repository**: [GitHub](https://github.com/ciprel/demarche-competence)

## 📄 Licence

© 2025 CIPREL - Usage interne uniquement

## 🗺️ Roadmap

### Version 1.1 (Q2 2025)
- [ ] Module d'évaluation 360°
- [ ] Integration Teams
- [ ] Rapports avancés
- [ ] API REST externe

### Version 1.2 (Q3 2025)
- [ ] IA pour recommandations
- [ ] Mobile app native
- [ ] Intégration Power BI
- [ ] Workflows automatisés

### Version 1.3 (Q4 2025)
- [ ] Multi-tenant support
- [ ] Advanced analytics
- [ ] Integration Outlook
- [ ] Voice commands
