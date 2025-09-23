# Guide de Déploiement - Démarche Compétence CIPREL

## 🎯 Vue d'ensemble du déploiement

Ce guide détaille les étapes complètes pour déployer l'application Démarche Compétence CIPREL dans un environnement SharePoint.

## 📋 Prérequis

### Environnement
- **SharePoint**: SharePoint Online ou SharePoint 2019+
- **Node.js**: Version 18+ LTS
- **PowerShell**: Version 7+
- **Permissions**: Admin SharePoint ou App Catalog

### Comptes et Accès
- Compte administrateur SharePoint
- Accès à l'App Catalog du tenant
- Permissions de création de listes
- Compte de service (optionnel)

## 📦 Phase 1: Préparation

### 1.1 Clonage du Repository
```bash
git clone https://github.com/ciprel/demarche-competence-ciprel.git
cd demarche-competence-ciprel
```

### 1.2 Installation des Dépendances
```bash
# Installation des packages Node.js
npm install

# Vérification de l'installation
npm run --silent
```

### 1.3 Vérification de l'Environnement
```bash
# Vérifier Node.js
node --version  # Doit être 18+

# Vérifier SPFx CLI
npm list -g @microsoft/generator-sharepoint

# Si absent, installer
npm install -g @microsoft/generator-sharepoint
```

## 🏗️ Phase 2: Configuration SharePoint

### 2.1 Création des Listes SharePoint

#### Script Automatisé (Recommandé)
```powershell
# Se connecter et créer les listes
.\scripts\Deploy-SharePointLists.ps1 -SiteUrl "https://ciprel.sharepoint.com/sites/competences"

# Populer avec des données d'exemple
.\scripts\Populate-SampleData.ps1 -SiteUrl "https://ciprel.sharepoint.com/sites/competences"
```

#### Création Manuelle (Alternative)
Si les scripts échouent, créer manuellement :

**Liste 1: Quiz_Introduction**
- Type: Liste personnalisée
- Colonnes:
  - Title (Texte)
  - Question (Texte multiligne)
  - Options (Texte multiligne)
  - CorrectAnswer (Texte)
  - Category (Choix: Définition, Responsabilité, Compétences, Étapes)
  - Points (Nombre)
  - Order (Nombre)

**Liste 2: Quiz_Sondage**
- Type: Liste personnalisée
- Colonnes:
  - Title (Texte)
  - Question (Texte multiligne)
  - QuestionType (Choix: Multiple Choice, Text, Rating)
  - Options (Texte multiligne)
  - Required (Oui/Non)
  - Order (Nombre)

**Liste 3: Quiz_Results**
- Type: Liste personnalisée
- Colonnes:
  - Title (Texte)
  - User (Personne ou groupe)
  - QuizType (Choix: Introduction, Sondage)
  - Responses (Texte multiligne)
  - Score (Nombre)
  - CompletionDate (Date et heure)
  - Duration (Nombre)
  - Status (Choix: Completed, In Progress, Abandoned)

**Liste 4: User_Progress**
- Type: Liste personnalisée
- Colonnes:
  - Title (Texte)
  - User (Personne ou groupe)
  - CompetenceArea (Choix: Leadership, Communication, Technique, Management, Innovation, Qualité)
  - CurrentLevel (Nombre)
  - TargetLevel (Nombre)
  - LastAssessment (Date et heure)
  - NextAssessment (Date et heure)
  - Progress (Nombre)

### 2.2 Configuration des Permissions

```powershell
# Script de configuration des permissions
$siteUrl = "https://ciprel.sharepoint.com/sites/competences"
$lists = @("Quiz_Introduction", "Quiz_Sondage", "Quiz_Results", "User_Progress")

Connect-PnPOnline -Url $siteUrl -Interactive

foreach ($listName in $lists) {
    # Donner accès en lecture à tous les employés
    Set-PnPListPermission -Identity $listName -Group "Membres de ciprel" -AddRole "Lecture"
    
    # Donner accès en écriture pour Quiz_Results et User_Progress
    if ($listName -in @("Quiz_Results", "User_Progress")) {
        Set-PnPListPermission -Identity $listName -Group "Membres de ciprel" -AddRole "Contribution"
    }
    
    # Accès admin pour les RH
    Set-PnPListPermission -Identity $listName -Group "RH CIPREL" -AddRole "Contrôle total"
}
```

## 🔨 Phase 3: Build et Package

### 3.1 Configuration de l'Environnement
```bash
# Modifier config/serve.json
{
  "pageUrl": "https://ciprel.sharepoint.com/sites/competences/_layouts/workbench.aspx"
}
```

### 3.2 Build de Développement (Test)
```bash
# Build en mode développement
npm run build

# Test local
npm run serve
```

### 3.3 Build de Production
```bash
# Nettoyage
npm run clean

# Build de production
npm run package-solution

# Le fichier .sppkg sera dans sharepoint/solution/
```

## 🚀 Phase 4: Déploiement SharePoint

### 4.1 Upload vers l'App Catalog

#### Via Interface Web
1. Aller sur l'App Catalog SharePoint
2. Bibliothèque "Apps for SharePoint"
3. Glisser-déposer le fichier `.sppkg`
4. Cocher "Make this solution available to all sites"
5. Cliquer "Deploy"

#### Via PowerShell
```powershell
$appCatalogUrl = "https://ciprel-admin.sharepoint.com/sites/appcatalog"
$packagePath = ".\sharepoint\solution\demarche-competence-ciprel.sppkg"

Connect-PnPOnline -Url $appCatalogUrl -Interactive

# Upload du package
Add-PnPApp -Path $packagePath -Overwrite

# Déploiement
Install-PnPApp -Identity "demarche-competence-ciprel" -Scope Tenant
```

### 4.2 Installation sur le Site Cible
```powershell
$siteUrl = "https://ciprel.sharepoint.com/sites/competences"

Connect-PnPOnline -Url $siteUrl -Interactive

# Installation de l'app
Install-PnPApp -Identity "demarche-competence-ciprel"

# Vérification
Get-PnPApp -Identity "demarche-competence-ciprel"
```

### 4.3 Ajout du WebPart à une Page
```powershell
# Créer une nouvelle page
$page = Add-PnPClientSidePage -Name "DemarcheCompetence" -LayoutType Article

# Ajouter le webpart
Add-PnPClientSideWebPart -Page $page -DefaultWebPartType "DemarcheCompetence" -Section 1 -Column 1

# Publier la page
Set-PnPClientSidePage -Identity $page -Publish
```

## ⚙️ Phase 5: Configuration Post-Déploiement

### 5.1 Configuration du WebPart
1. Éditer la page contenant le WebPart
2. Cliquer sur l'icône de configuration (⚙️)
3. Configurer les paramètres :
   - **Titre**: "Démarche Compétence CIPREL"
   - **Thème**: Automatique
   - **Sauvegarde automatique**: Activée (30s)
   - **Notifications**: Activées
   - **Mode compact**: Selon préférence

### 5.2 Test Fonctionnel

#### Tests Utilisateur
```powershell
# Script de test automatisé
.\scripts\Test-Application.ps1 -SiteUrl "https://ciprel.sharepoint.com/sites/competences"
```

#### Tests Manuels
1. **Connexion utilisateur**
   - [ ] Authentification automatique
   - [ ] Affichage du nom d'utilisateur
   - [ ] Permissions correctes

2. **Quiz Introduction**
   - [ ] Chargement des questions
   - [ ] Navigation entre questions
   - [ ] Sauvegarde automatique
   - [ ] Calcul du score
   - [ ] Enregistrement des résultats

3. **Sondage Satisfaction**
   - [ ] Disponible après quiz introduction
   - [ ] Types de questions variés
   - [ ] Validation des champs requis
   - [ ] Enregistrement des réponses

4. **Tableau de Bord**
   - [ ] Affichage des statistiques
   - [ ] Progression globale
   - [ ] Actions rapides fonctionnelles

5. **Suivi des Progrès**
   - [ ] Visualisation des compétences
   - [ ] Graphiques interactifs
   - [ ] Export des données

### 5.3 Configuration des Notifications
```powershell
# Configuration des alertes SharePoint
$lists = @("Quiz_Results", "User_Progress")

foreach ($listName in $lists) {
    # Alertes pour les RH
    Add-PnPAlert -List $listName -User "rh@ciprel.ci" -Title "Nouveaux résultats - $listName"
}
```

## 📊 Phase 6: Monitoring et Maintenance

### 6.1 Monitoring des Performances
```javascript
// Ajouter dans DemarcheCompetenceWebPart.ts
console.log('Performance metrics:', {
  loadTime: performance.now(),
  memoryUsage: performance.memory?.usedJSHeapSize,
  timestamp: new Date().toISOString()
});
```

### 6.2 Logs et Diagnostics
```powershell
# Vérification des logs SharePoint
Get-PnPUnifiedAuditLog -StartDate (Get-Date).AddDays(-1) -EndDate (Get-Date) -Operations "PageViewed,FileAccessed"
```

### 6.3 Sauvegarde
```powershell
# Backup des listes critiques
Export-PnPListToSiteTemplate -Out "backup-competences.xml" -List @("Quiz_Results", "User_Progress")
```

## 🔄 Mise à Jour

### 6.4 Processus de Mise à Jour
```bash
# 1. Nouvelle version
npm version patch

# 2. Build
npm run package-solution

# 3. Upload nouvelle version
# (Même processus que déploiement initial)

# 4. Test sur site de staging
# 5. Déploiement en production
```

## 🚨 Résolution de Problèmes

### Problèmes Courants

#### 1. Erreur d'Installation du Package
```
Erreur: "App deployment failed"
Solution: 
- Vérifier les permissions App Catalog
- S'assurer que l'ancienne version est désinstallée
- Redémarrer le service d'application SharePoint
```

#### 2. WebPart ne s'Affiche Pas
```
Erreur: WebPart vide ou erreur de chargement
Solution:
- Vérifier la console navigateur (F12)
- Contrôler les permissions sur les listes
- Vérifier la configuration CDN
```

#### 3. Problème de Performance
```
Erreur: Chargement lent
Solution:
- Activer le cache navigateur
- Optimiser les requêtes SharePoint
- Vérifier la bande passante
```

#### 4. Erreur de Permissions
```
Erreur: "Access denied"
Solution:
- Vérifier les permissions utilisateur
- Contrôler les paramètres de sécurité SharePoint
- Valider l'appartenance aux groupes
```

### Scripts de Diagnostic
```powershell
# Script de diagnostic complet
.\scripts\Diagnose-Deployment.ps1 -SiteUrl "https://ciprel.sharepoint.com/sites/competences"
```

## 📋 Checklist de Déploiement

### Pré-déploiement
- [ ] Environnement SharePoint accessible
- [ ] Permissions administrateur confirmées
- [ ] Sauvegarde du site existant
- [ ] Tests en environnement de développement

### Déploiement
- [ ] Listes SharePoint créées
- [ ] Permissions configurées
- [ ] Package SPFx buildé et testé
- [ ] Application uploadée dans App Catalog
- [ ] WebPart installé sur le site cible
- [ ] Page de test créée

### Post-déploiement
- [ ] Tests fonctionnels complets
- [ ] Formation utilisateurs planifiée
- [ ] Documentation mise à jour
- [ ] Monitoring activé
- [ ] Support utilisateur en place

### Go-Live
- [ ] Communication aux utilisateurs
- [ ] Session de formation réalisée
- [ ] Support actif le jour J
- [ ] Métriques de succès définies

## 📞 Support

### Escalade des Problèmes
1. **Niveau 1**: Support IT CIPREL
2. **Niveau 2**: Équipe de développement
3. **Niveau 3**: Support Microsoft SharePoint

### Contacts
- **Support IT**: support@ciprel.ci
- **Chef de Projet**: chef.projet@ciprel.ci
- **Équipe RH**: rh@ciprel.ci

## 📈 Métriques de Succès

### KPIs à Surveiller
- Taux d'adoption (% d'utilisateurs actifs)
- Temps de completion des quiz
- Satisfaction utilisateur (via sondage)
- Performance technique (temps de chargement)
- Taux d'erreur (<1%)

### Rapports Automatiques
```powershell
# Script de rapport mensuel
.\scripts\Generate-MonthlyReport.ps1 -SiteUrl "https://ciprel.sharepoint.com/sites/competences" -OutputPath "C:\Reports\"
```

---

**Date de dernière mise à jour**: 2025-01-20
**Version du guide**: 1.0
**Responsable**: Équipe IT CIPREL