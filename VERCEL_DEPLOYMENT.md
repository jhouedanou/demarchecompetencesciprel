# 🚀 Déploiement sur Vercel avec Turso

## 📋 Prérequis

- Un compte Vercel (gratuit)
- Un compte Turso (gratuit - 500 DB, 9GB de stockage)

---

## 🔧 Étape 1 : Créer la base Turso

### 1.1 Installer Turso CLI

```bash
brew install tursodatabase/tap/turso
```

### 1.2 S'authentifier

```bash
turso auth signup
```

### 1.3 Créer la base de données

```bash
turso db create ciprel
```

### 1.4 Obtenir l'URL de la base

```bash
turso db show ciprel --url
```

Copier l'URL (ex: `libsql://ciprel-xxx.turso.io`)

### 1.5 Générer le token d'authentification

```bash
turso db tokens create ciprel
```

Copier le token (ex: `eyJhbG...`)

### 1.6 Migrer le schéma

```bash
turso db shell ciprel < turso-schema.sql
```

---

## 📝 Étape 2 : Créer un utilisateur test sur Turso

### 2.1 Se connecter à la base

```bash
turso db shell ciprel
```

### 2.2 Insérer un utilisateur

```sql
INSERT INTO profiles (id, email, name, role, password_hash, created_at, updated_at)
VALUES (
  'user-test-123',
  'test@ciprel.ci',
  'Utilisateur Test',
  'USER',
  '$2a$10$xyz...', -- Hash bcrypt de "Test1234!"
  datetime('now'),
  datetime('now')
);
```

Pour générer le hash bcrypt de votre mot de passe :

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('Test1234!', 10))"
```

---

## 🌐 Étape 3 : Configurer Vercel

### 3.1 Connecter votre repo à Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "Add New Project"
3. Importer votre repo GitHub

### 3.2 Ajouter les variables d'environnement

Dans les paramètres du projet Vercel, ajouter :

| Variable | Valeur |
|----------|--------|
| `TURSO_DATABASE_URL` | `libsql://ciprel-xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | `eyJhbG...` |
| `NEXT_PUBLIC_APP_URL` | `https://votre-app.vercel.app` |
| `NEXT_PUBLIC_SITE_NAME` | `CIPREL Compétences` |
| `NEXT_PUBLIC_COMPANY_NAME` | `CIPREL` |
| `NEXT_PUBLIC_COMPANY_EMAIL` | `contact@ciprel.ci` |
| `NEXT_PUBLIC_GDPR_ENABLED` | `true` |

### 3.3 Déployer

Cliquer sur "Deploy" - Vercel va automatiquement :
1. Build l'application
2. Se connecter à Turso via les variables d'environnement
3. Déployer sur CDN global

---

## ✅ Étape 4 : Vérifier

1. Ouvrir votre URL Vercel
2. Cliquer sur "Connexion"
3. Se connecter avec `test@ciprel.ci` / `Test1234!`
4. Vérifier que tout fonctionne

---

## 📊 Performance attendue

| Métrique | Valeur |
|----------|--------|
| Temps de réponse | **<50ms** (depuis n'importe où dans le monde) |
| Disponibilité | **99.9%** |
| Coût | **Gratuit** (jusqu'à 500 DB et 9GB) |

---

## 🔍 Debugging

### Voir les logs Turso

```bash
turso db shell ciprel
```

```sql
SELECT * FROM profiles;
SELECT * FROM user_reading_progress;
```

### Voir les logs Vercel

1. Aller sur vercel.com
2. Sélectionner votre projet
3. Onglet "Logs"

---

## 🔄 Mettre à jour le schéma

Si vous modifiez le schéma :

```bash
turso db shell ciprel < turso-schema.sql
```

Redéployer sur Vercel (push sur GitHub ou redéploiement manuel)

---

## 💡 Astuce : Développement local

Pour tester en local avec Turso (au lieu de SQLite) :

1. Créer `.env.local` :

```bash
TURSO_DATABASE_URL=libsql://ciprel-xxx.turso.io
TURSO_AUTH_TOKEN=eyJhbG...
```

2. Relancer le serveur :

```bash
npm run dev
```

L'app utilisera automatiquement Turso au lieu de SQLite local.

---

## 📚 Resources

- [Documentation Turso](https://docs.turso.tech/)
- [Documentation Vercel](https://vercel.com/docs)
- [Pricing Turso](https://turso.tech/pricing) (gratuit jusqu'à 500 DB)
- [Pricing Vercel](https://vercel.com/pricing) (gratuit pour projets personnels)
