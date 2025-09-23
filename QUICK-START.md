# 🚀 Guide de Démarrage Rapide

## Lancement Automatique de l'Environnement de Développement

Plusieurs options pour démarrer automatiquement l'environnement de développement complet (SPFx + React + Docker) :

### 🎯 Option 1 : Scripts de lancement rapide

#### Sur macOS/Linux :
```bash
# Méthode 1 : Script direct
./start.sh

# Méthode 2 : Via NPM
npm run dev
```

#### Sur Windows :
```cmd
# Méthode 1 : Script batch
start.bat

# Méthode 2 : Via NPM
npm run start:dev:win
```

### 🎯 Option 2 : Scripts détaillés

#### Sur macOS/Linux :
```bash
# Script complet avec toutes les options
./scripts/Start-Dev.sh

# Via NPM
npm run start:dev
```

#### Sur Windows PowerShell :
```powershell
# Script PowerShell complet
./scripts/Start-Dev.ps1

# Avec options
./scripts/Start-Dev.ps1 -SkipBrowser -SkipLogs
```

### 🎯 Option 3 : Commandes Docker manuelles

```bash
# Démarrage manuel
docker-compose down --remove-orphans
docker-compose up -d --build

# Générer le certificat SPFx
docker-compose exec spfx-dev gulp trust-dev-cert

# Voir les logs
docker-compose logs -f
```

## 📋 Ce que fait le lancement automatique

1. **Vérification des prérequis** : Docker, Docker Compose
2. **Nettoyage** : Suppression des conteneurs existants
3. **Construction** : Build des images Docker
4. **Démarrage** : Lancement des services
5. **Installation** : Vérification et installation des dépendances npm
6. **Configuration** : Génération du certificat SPFx
7. **Build initial** : Compilation de l'application SPFx
8. **Redémarrage** : Redémarrage du serveur avec les derniers builds
9. **Vérification** : Test de disponibilité des services
10. **Information** : Affichage des URLs et commandes utiles

## 🌐 Services démarrés

| Service | URL | Description |
|---------|-----|-------------|
| **Workbench Local** | http://localhost:8080 | Interface de test des WebParts |
| **Serveur SPFx** | http://localhost:4321 | Serveur de développement avec hot reload |
| **LiveReload** | http://localhost:35729 | Service de rechargement automatique |

## 🛠️ Commandes utiles après démarrage

```bash
# Voir tous les logs
docker-compose logs -f

# Voir seulement les logs SPFx
docker-compose logs -f spfx-dev

# Redémarrer le serveur SPFx
docker-compose restart spfx-dev

# Build manuel
docker-compose exec spfx-dev npx gulp bundle

# Serveur manuel
docker-compose exec spfx-dev npx gulp serve

# Arrêter tous les services
docker-compose down

# Nettoyage complet
docker-compose down --volumes --remove-orphans
```

## 🔗 Développement SharePoint

Pour tester dans un environnement SharePoint réel, ajoutez cette query string à votre workbench SharePoint :

```
?debugManifestsFile=http://localhost:4321/temp/manifests.js
```

Exemple d'URL complète :
```
https://votre-tenant.sharepoint.com/_layouts/15/workbench.aspx?debugManifestsFile=http://localhost:4321/temp/manifests.js
```

## 🎨 Fonctionnalités

- ✅ **Hot Reload** : Rechargement automatique lors des modifications
- ✅ **TypeScript** : Compilation en temps réel
- ✅ **React** : Support complet avec JSX et hooks
- ✅ **Redux Toolkit** : Gestion d'état moderne
- ✅ **SCSS** : Styles avec variables et mixins
- ✅ **Linting** : ESLint + Prettier
- ✅ **Docker** : Environnement isolé et reproductible

## 🐛 Dépannage

### Le conteneur SPFx ne démarre pas
```bash
# Vérifier les logs
docker-compose logs spfx-dev

# Nettoyer et redémarrer
docker-compose down --volumes
docker-compose up -d --build
```

### Problème de certificat
```bash
# Régénérer le certificat
docker-compose exec spfx-dev gulp trust-dev-cert
docker-compose restart spfx-dev
```

### Port déjà utilisé
```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :4321
netstat -tulpn | grep :8080

# Arrêter les processus conflictuels ou modifier les ports dans docker-compose.yml
```

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs avec `docker-compose logs -f`
2. Consultez le fichier `DOCKER-TROUBLESHOOTING.md`
3. Redémarrez l'environnement avec les scripts de nettoyage
