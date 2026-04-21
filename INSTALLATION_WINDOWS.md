# Guide d'Installation - Windows

Guide complet pour installer et executer l'application CIPREL Competences en local sur Windows.

---

## Prerequis

Avant de commencer, vous devez installer les outils suivants :

### 1. Node.js (version 18 ou superieure)

**Telecharger et installer :**
1. Aller sur https://nodejs.org/
2. Telecharger la version **LTS** (Long Term Support)
3. Executer l'installateur `.msi`
4. Suivre les instructions (garder les options par defaut)

**Verifier l'installation :**
```powershell
node --version
npm --version
```

Vous devriez voir quelque chose comme :
```
v18.17.0
9.8.1
```

### 2. Git

**Telecharger et installer :**
1. Aller sur https://git-scm.com/download/win
2. Telecharger Git pour Windows
3. Executer l'installateur
4. Suivre les instructions (garder les options par defaut)

**Verifier l'installation :**
```powershell
git --version
```

### 3. Un editeur de code (recommande)

- **Visual Studio Code** : https://code.visualstudio.com/
- **WebStorm** : https://www.jetbrains.com/webstorm/

### 4. Windows Terminal (optionnel mais recommande)

- Telecharger depuis le Microsoft Store : https://aka.ms/terminal
- Offre une meilleure experience que l'invite de commande classique

---

## Installation de l'application

### Etape 1 : Cloner le repository

Ouvrir **PowerShell** ou **Windows Terminal** et executer :

```powershell
# Naviguer vers le dossier ou vous voulez installer l'application
cd C:\Users\VotreNom\Documents

# Cloner le repository
git clone https://github.com/votre-username/demarchecompetencesciprel.git

# Entrer dans le dossier
cd demarchecompetencesciprel
```

### Etape 2 : Installer les dependances

```powershell
# Installer toutes les dependances npm
npm install
```

Cette etape peut prendre 2-5 minutes selon votre connexion internet.

**Note :** Si vous utilisez Yarn au lieu de npm :
```powershell
yarn install
```

### Etape 3 : Configurer les variables d'environnement

1. **Copier le fichier d'exemple :**

```powershell
copy .env.example .env.local
```

2. **Editer le fichier `.env.local` :**

Ouvrir le fichier `.env.local` avec votre editeur de code et verifier/modifier les variables :

```env
# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=CIPREL Competences
NEXT_PUBLIC_COMPANY_NAME=CIPREL
NEXT_PUBLIC_COMPANY_EMAIL=contact@ciprel.ci

# GDPR Configuration
NEXT_PUBLIC_GDPR_ENABLED=true

# Base de donnees locale (SQLite)
# Aucune configuration necessaire pour le developpement local
# La base sera creee automatiquement dans ./data/ciprel.db
```

**Important :** Pour le developpement local, vous n'avez PAS besoin de configurer Turso ou Supabase. L'application utilisera SQLite automatiquement.

### Etape 4 : Creer le dossier de la base de donnees

```powershell
# Creer le dossier data s'il n'existe pas
mkdir data -ErrorAction SilentlyContinue
```

### Etape 5 : Lancer l'application

```powershell
npm run dev
```

Vous devriez voir :

```
   ▲ Next.js 14.2.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.3s
⚡ [SQLite] Initializing database at: C:\...\data\ciprel.db
✅ [SQLite] Database initialized successfully
```

### Etape 6 : Ouvrir l'application dans le navigateur

Ouvrir votre navigateur et aller sur :

```
http://localhost:3000
```

---

## Creer le premier utilisateur administrateur

Au premier lancement, la base de donnees est vide. Vous devez creer un compte administrateur.

### Option 1 : Via l'interface web

1. Aller sur http://localhost:3000/login
2. Cliquer sur "Creer un compte"
3. Remplir le formulaire d'inscription
4. Une fois inscrit, vous devez promouvoir votre compte en admin

### Option 2 : Via la base de donnees (recommande)

**Installer DB Browser for SQLite :**

1. Telecharger : https://sqlitebrowser.org/dl/
2. Installer l'application
3. Ouvrir DB Browser for SQLite
4. Cliquer sur "Open Database"
5. Naviguer vers `C:\...\demarchecompetencesciprel\data\ciprel.db`

**Promouvoir votre utilisateur en admin :**

1. Aller dans l'onglet "Execute SQL"
2. Executer cette requete (remplacer par votre email) :

```sql
-- Voir tous les utilisateurs
SELECT id, email, name, role FROM profiles;

-- Promouvoir votre compte en ADMIN
UPDATE profiles
SET role = 'ADMIN'
WHERE email = 'votre-email@exemple.com';

-- Verifier
SELECT id, email, name, role FROM profiles WHERE email = 'votre-email@exemple.com';
```

3. Rafraichir la page web (F5)
4. Vous avez maintenant acces a `/admin`

---

## Structure du projet

```
demarchecompetencesciprel/
├── data/
│   └── ciprel.db              # Base de donnees SQLite (creee automatiquement)
├── public/                     # Fichiers statiques (images, etc.)
├── src/
│   ├── app/                   # Pages Next.js (App Router)
│   │   ├── admin/            # Pages administration
│   │   ├── api/              # API Routes
│   │   └── ...
│   ├── components/            # Composants React
│   ├── lib/                   # Utilitaires
│   │   ├── db.ts            # Client SQLite
│   │   └── auth-helpers.ts  # Authentification
│   └── types/                 # Types TypeScript
├── .env.local                 # Variables d'environnement (NE PAS COMMITER)
├── .env.example              # Exemple de configuration
├── package.json              # Dependances npm
└── tsconfig.json             # Configuration TypeScript
```

---

## Commandes utiles

### Developpement

```powershell
# Demarrer le serveur de developpement
npm run dev

# Construire pour la production
npm run build

# Demarrer en mode production
npm run start

# Linter le code
npm run lint

# Corriger les erreurs de lint
npm run lint:fix

# Verifier les types TypeScript
npm run type-check

# Lancer les tests
npm run test
```

### Base de donnees

```powershell
# Reinitialiser la base de donnees
Remove-Item data\ciprel.db
npm run dev  # La DB sera recree automatiquement

# Backup de la base
$date = Get-Date -Format "yyyyMMdd"
Copy-Item data\ciprel.db -Destination "data\ciprel.db.backup-$date"

# Voir la taille de la base
Get-Item data\ciprel.db | Select-Object Name, Length
```

---

## Acceder aux pages principales

Une fois connecte en tant qu'administrateur :

| Page | URL | Description |
|------|-----|-------------|
| Accueil | http://localhost:3000 | Page d'accueil |
| Connexion | http://localhost:3000/login | Page de connexion |
| Dashboard Admin | http://localhost:3000/admin | Tableau de bord |
| Utilisateurs | http://localhost:3000/admin/users | Gestion des utilisateurs |
| Workshops | http://localhost:3000/admin/workshops-metiers | Gestion des workshops |
| Questions | http://localhost:3000/admin/questions | Gestion des questions |
| Resultats | http://localhost:3000/admin/results | Consultation des resultats |
| Rapports | http://localhost:3000/admin/reports | Statistiques et exports |

---

## Troubleshooting

### Erreur : "Cannot find module 'better-sqlite3'"

**Solution :**
```powershell
npm install better-sqlite3
```

Si l'erreur persiste, installer les outils de build Windows :
```powershell
npm install --global windows-build-tools
npm rebuild better-sqlite3
```

### Erreur : "Port 3000 is already in use"

**Solution :**

1. Trouver le processus qui utilise le port 3000 :
```powershell
netstat -ano | findstr :3000
```

2. Tuer le processus (remplacer PID par le numero trouve) :
```powershell
taskkill /PID <PID> /F
```

3. Ou utiliser un autre port :
```powershell
# Modifier package.json, script "dev" :
# "dev": "next dev -p 3001"
npm run dev
```

### Erreur : "EACCES: permission denied"

**Solution :**

1. Executer PowerShell en tant qu'administrateur
2. Ou changer les permissions du dossier :
```powershell
icacls data /grant Users:F /t
```

### Erreur : "Database is locked"

**Solution :**

1. Fermer tous les processus Node.js :
```powershell
# Trouver les processus node.exe
Get-Process node

# Arreter tous les processus Node.js
Stop-Process -Name node -Force
```

2. Fermer DB Browser for SQLite s'il est ouvert
3. Redemarrer le serveur

### L'application ne se lance pas apres `npm run dev`

**Solutions :**

1. Verifier les logs dans le terminal
2. Supprimer le dossier `.next` et rebuilder :
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

3. Reinstaller les dependances :
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Erreur : "Module not found" ou "Cannot resolve module"

**Solution :**
```powershell
# Nettoyer le cache npm
npm cache clean --force

# Reinstaller
Remove-Item -Recurse -Force node_modules
npm install
```

### Les modifications de code ne sont pas prises en compte

**Solution :**

1. Verifier que le serveur de developpement est bien lance
2. Rafraichir le navigateur (Ctrl + F5 pour vider le cache)
3. Redemarrer le serveur :
```powershell
# Dans le terminal ou le serveur tourne : Ctrl + C
npm run dev
```

### Erreur : "Python not found" lors de l'installation

**Solution :**

Certaines dependances natives necessitent Python. Installer Python 3 :

1. Telecharger : https://www.python.org/downloads/
2. Lors de l'installation, cocher "Add Python to PATH"
3. Reinstaller les dependances :
```powershell
npm install
```

---

## Bonnes pratiques

### 1. Utiliser Git correctement

```powershell
# Avant de commencer a travailler
git pull origin main

# Creer une branche pour vos modifications
git checkout -b feature/ma-fonctionnalite

# Faire vos modifications...

# Commiter vos changements
git add .
git commit -m "Description de vos changements"

# Pousser sur GitHub
git push origin feature/ma-fonctionnalite
```

### 2. Ne JAMAIS commiter le fichier .env.local

Le fichier `.env.local` contient des informations sensibles. Il est deja dans `.gitignore`.

**Verification :**
```powershell
# Verifier que .env.local n'est pas suivi par git
git status
```

Si `.env.local` apparait, l'ajouter a `.gitignore` :
```powershell
echo .env.local >> .gitignore
```

### 3. Faire des backups reguliers de la base de donnees

```powershell
# Script de backup automatique (a executer regulierement)
$date = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item data\ciprel.db -Destination "backups\ciprel.db.backup-$date"
```

### 4. Utiliser le mode developpement

Toujours utiliser `npm run dev` en developpement, jamais `npm run build` puis `npm run start` (sauf pour tester la production).

---

## Passer en mode production (Vercel)

Pour deployer sur Vercel, l'application doit utiliser **Turso** au lieu de SQLite local.

Voir le guide detaille : `TURSO_SETUP.md`

**Resume :**

1. Creer un compte Turso
2. Creer une base de donnees
3. Obtenir l'URL et le token
4. Ajouter dans `.env.local` :
```env
TURSO_DATABASE_URL=libsql://votre-db.turso.io
TURSO_AUTH_TOKEN=votre-token
```

5. Deployer sur Vercel

---

## Performance

L'application utilise SQLite en local, ce qui la rend extremement rapide :

| Operation | Temps moyen |
|-----------|-------------|
| Connexion a la BD | < 5ms |
| Lecture d'un utilisateur | < 2ms |
| Ecriture dans la BD | < 3ms |
| Chargement d'une page | < 1s |

---

## Support et documentation

### Guides disponibles

| Fichier | Description |
|---------|-------------|
| `INSTALLATION_WINDOWS.md` | Ce guide |
| `GUIDE_ADMIN.md` | Guide d'utilisation de l'interface admin |
| `SQLITE_LOCAL_GUIDE.md` | Fonctionnement de SQLite local |
| `TURSO_SETUP.md` | Configuration Turso pour production |
| `VERCEL_DEPLOYMENT.md` | Deploiement sur Vercel |

### Ressources utiles

- **Next.js Documentation** : https://nextjs.org/docs
- **React Documentation** : https://react.dev/
- **TypeScript Documentation** : https://www.typescriptlang.org/docs/
- **SQLite Documentation** : https://www.sqlite.org/docs.html
- **Turso Documentation** : https://docs.turso.tech/

---

## Checklist d'installation

- [ ] Node.js installe (v18+)
- [ ] Git installe
- [ ] Repository clone
- [ ] Dependances installees (`npm install`)
- [ ] Fichier `.env.local` cree
- [ ] Dossier `data/` cree
- [ ] Application lancee (`npm run dev`)
- [ ] Page http://localhost:3000 accessible
- [ ] Base de donnees creee (`data/ciprel.db` existe)
- [ ] Compte utilisateur cree
- [ ] Compte promu en ADMIN
- [ ] Acces a `/admin` fonctionne

---

**Version** : 1.0
**Derniere mise a jour** : Janvier 2025
**Plateforme cible** : Windows 10/11

**Felicitations ! Votre environnement de developpement est pret !**
