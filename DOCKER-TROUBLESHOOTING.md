# 🐳 Guide de Résolution - Problèmes Docker

## ❌ Erreur Résolue : "addgroup: gid '1000' in use"

### Problème
```
ERROR [spfx-dev 4/8] RUN addgroup -g 1000 spfx && adduser -D -s /bin/sh -u 1000 -G spfx spfx
addgroup: gid '1000' in use
```

### ✅ Solution Appliquée
Le problème a été résolu en modifiant le Dockerfile pour ne pas forcer les IDs utilisateur/groupe.

## 🚀 Solutions de Démarrage Rapide

### Option 1: Script de Réparation Automatique (Recommandé)
```bash
npm run docker:fix
```
Ce script détecte et résout automatiquement les problèmes Docker.

### Option 2: Configuration Simple
```bash
# Utilise Dockerfile.simple (sans gestion d'utilisateurs)
npm run docker:serve-simple
```

### Option 3: Configuration Standard
```bash
# Utilise le Dockerfile corrigé
npm run docker:serve
```

### Option 4: Démarrage Manuel (Sans Docker)
```bash
# Si Docker pose problème, démarrage direct
npm install
npm run serve
```

## 🔧 Commandes Docker Disponibles

| Commande | Description |
|----------|-------------|
| `npm run docker:fix` | Script de réparation automatique |
| `npm run docker:serve` | Démarrage avec build automatique |
| `npm run docker:serve-simple` | Démarrage avec configuration simple |
| `npm run docker:up` | Démarrage en arrière-plan |
| `npm run docker:down` | Arrêt des services |
| `npm run docker:logs` | Affichage des logs |

## 🐛 Problèmes Courants et Solutions

### 1. Erreur de Permissions (macOS)
```bash
# Solution
sudo chown -R $(whoami) .
npm run docker:fix
```

### 2. Port 4321 déjà utilisé
```bash
# Trouver le processus
lsof -i :4321

# Arrêter le processus
kill -9 <PID>

# Ou changer le port dans docker-compose.yml
ports:
  - "4322:4321"  # Utilise le port 4322 à la place
```

### 3. Docker Desktop non démarré
```bash
# macOS
open /Applications/Docker.app

# Ou via ligne de commande
sudo systemctl start docker  # Linux
```

### 4. Espace disque insuffisant
```bash
# Nettoyage Docker
docker system prune -a
docker volume prune
```

### 5. Erreur de build npm
```bash
# Nettoyage complet
npm run docker:down
docker system prune -a
rm -rf node_modules
npm install
npm run docker:serve-simple
```

## 📍 URLs d'Accès

### Après démarrage réussi :
- **Workbench Local** : http://localhost:4321/temp/workbench.html
- **SharePoint Workbench** : https://YOUR-TENANT.sharepoint.com/_layouts/15/workbench.aspx

### Vérification du statut :
```bash
# Voir les containers actifs
docker ps

# Voir les logs
npm run docker:logs

# Tester la connexion
curl http://localhost:4321
```

## 🔄 Redémarrage Complet

En cas de problème persistant :
```bash
# 1. Arrêt complet
npm run docker:down
npm run docker:down-simple

# 2. Nettoyage
docker system prune -a
docker volume prune

# 3. Redémarrage
npm run docker:fix
```

## 💡 Alternatives sans Docker

### Développement Local Natif
```bash
# Installation des outils SPFx globalement
npm install -g @microsoft/generator-sharepoint gulp-cli yo

# Démarrage local
npm install
npm run serve
```

### Avantages du développement local :
- ✅ Pas de problèmes de permissions Docker
- ✅ Performance native
- ✅ Debugging plus simple
- ✅ Hot reload plus rapide

## 🎯 Pour la Démonstration Client

### Si Docker pose problème :
```bash
# Solution rapide pour démo
npm run serve
# Puis accéder à: https://ciprel.sharepoint.com/_layouts/15/workbench.aspx
```

### URLs de démonstration :
1. **Local** : http://localhost:4321/temp/workbench.html
2. **SharePoint** : https://ciprel.sharepoint.com/_layouts/15/workbench.aspx
3. **Site de démo** : Utiliser le script `Deploy-Demo.ps1`

## 📞 Support

### Si aucune solution ne fonctionne :
1. **Vérifiez** les prérequis système
2. **Utilisez** le développement local natif
3. **Contactez** support@ciprel.ci
4. **Partagez** les logs d'erreur complètes

### Informations utiles pour le support :
```bash
# Versions système
node --version
npm --version
docker --version
docker-compose --version

# Système d'exploitation
uname -a  # Linux/macOS
systeminfo  # Windows
```

---

**🎯 Objectif** : Avoir l'application en cours d'exécution rapidement
**⏱️ Temps estimé** : 5-15 minutes selon la solution choisie
**💡 Recommandation** : Utilisez `npm run docker:fix` pour un diagnostic automatique