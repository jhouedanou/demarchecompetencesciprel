# CIPREL Compétences - Application Next.js

Application complète pour la démarche compétences CIPREL avec dashboard administrateur, quiz interactifs, système vidéo et conformité RGPD.

## 🚀 Fonctionnalités

### ✅ **Déjà implémentées**
- 🔐 **Authentification complète** (login, register, sécurité des routes)
- 👨‍💼 **Dashboard administrateur** professionnel avec analytics
- 👥 **Gestion des utilisateurs** (CRUD, rôles, permissions)
- 🧠 **Quiz interactifs** avec timer et résultats détaillés
- 📊 **Analytics temps réel** avec graphiques
- 🎨 **Interface moderne** responsive avec Tailwind CSS

### 🚧 **En développement**
- 📹 Système vidéo TikTok-like
- 🛡️ Composants RGPD avancés
- ❓ Gestion des questions admin

## 🛠️ Stack Technique

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Database**: Supabase (PostgreSQL) avec Row Level Security
- **Auth**: Supabase Auth + middleware personnalisé
- **State**: Zustand pour la gestion d'état
- **UI**: Tailwind CSS + Shadcn/ui + Framer Motion
- **Charts**: Recharts pour les analytics
- **Deployment**: Netlify + Supabase

## 📋 Installation et Configuration

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### 1. Cloner et installer les dépendances

\`\`\`bash
# Installer les dépendances
npm install

# ou
yarn install
\`\`\`

### 2. Configuration de Supabase

1. Créer un projet sur [Supabase](https://supabase.com)
2. Récupérer l'URL et les clés API
3. Exécuter les migrations SQL (voir section Database)

### 3. Variables d'environnement

\`\`\`bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Éditer .env.local avec vos vraies valeurs Supabase
\`\`\`

### 4. Configuration de la base de données

Exécuter les scripts SQL dans l'ordre :

\`\`\`sql
-- 1. Créer les tables (supabase/migrations/001_initial_schema.sql)
-- 2. Insérer les données de test (supabase/migrations/002_seed_data.sql)
\`\`\`

### 5. Lancer l'application

\`\`\`bash
# Mode développement
npm run dev

# Ouvrir http://localhost:3000
\`\`\`

## 📱 Utilisation

### Comptes de test

Après avoir exécuté les migrations, vous aurez :

- **Admin**: `admin@ciprel.ci` / `password123`
- **Manager**: `manager@ciprel.ci` / `password123`
- **User**: `user@ciprel.ci` / `password123`

### Navigation

- **`/`** - Page d'accueil publique
- **`/competences`** - Plateforme utilisateur
- **`/competences/quiz-introduction`** - Quiz interactif
- **`/admin`** - Dashboard administrateur
- **`/login`** & **`/register`** - Authentification

## 🔧 Développement

### Scripts disponibles

\`\`\`bash
npm run dev          # Lancer en mode développement
npm run build        # Build de production
npm run start        # Lancer la version buildée
npm run lint         # Linter ESLint
npm run type-check   # Vérification TypeScript
\`\`\`

### Structure du projet

\`\`\`
src/
├── app/                    # App Router Next.js
│   ├── (auth)/            # Pages d'authentification
│   ├── (dashboard)/       # Dashboard admin
│   ├── competences/       # Plateforme utilisateur
│   └── api/              # API Routes
├── components/            # Composants React
│   ├── auth/             # Authentification
│   ├── dashboard/        # Admin UI
│   ├── quiz/             # Moteur de quiz
│   └── ui/               # Design system
├── stores/               # État Zustand
├── lib/                  # Services et utilitaires
└── types/                # Types TypeScript
\`\`\`

## 🔐 Sécurité

- Middleware de protection des routes
- Row Level Security (RLS) Supabase
- Validation des permissions par rôle
- Audit logs RGPD automatiques
- Chiffrement des données sensibles

## 📊 Analytics

Le dashboard admin inclut :

- Statistiques utilisateurs temps réel
- Performance des quiz par catégorie
- Analytics des vidéos
- Activité récente
- Graphiques interactifs

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Connecter le repository** :
   - Aller sur [vercel.com](https://vercel.com)
   - Importer votre projet GitHub
   - Vercel détectera automatiquement Next.js

2. **Configurer les variables d'environnement** :
   - Dans les settings du projet Vercel
   - Ajouter toutes les variables de `.env.local`
   - Redéployer après ajout des variables

3. **Configuration automatique** :
   - Le fichier `vercel.json` est déjà configuré
   - Build Command: `npm run build`
   - Output Directory: `.next` (automatique pour Next.js)
   - Framework: Next.js (détecté automatiquement)

### Netlify (Alternative)

1. Connecter votre repo GitHub à Netlify
2. Configurer les variables d'environnement
3. Le fichier `netlify.toml` est déjà configuré
4. Deploy automatique !

### Variables d'environnement

Copier toutes les variables de `.env.local` dans les settings de votre plateforme de déploiement.

## 🐛 Dépannage

### Erreurs communes

1. **Erreur Supabase**: Vérifier les clés API et l'URL
2. **Erreur de build**: Exécuter `npm run type-check`
3. **Base de données**: Vérifier que les migrations sont appliquées
4. **Authentification**: Vérifier les domaines autorisés dans Supabase

### Support

- 📧 Email: contact@ciprel.ci
- 📖 Documentation: `/docs`
- 🐛 Issues: GitHub Issues

## 📄 Licence

Propriétaire - CIPREL © 2024

---

**Status**: 🟢 **PRÊT POUR DÉPLOIEMENT BETA** (80% complété)

Les fonctionnalités core (auth, admin, quiz) sont opérationnelles.
Les fonctionnalités avancées (vidéos, RGPD) sont en développement.
\`\`\`
