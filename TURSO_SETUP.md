# 🚀 Configuration Turso pour CIPREL

## Étape 1 : Créer un compte Turso

1. Aller sur https://turso.tech/
2. Cliquer sur "Sign up" (connexion avec GitHub recommandée)
3. Se connecter

## Étape 2 : Créer une base de données

### Option A : Via l'interface web (Recommandé)

1. Dans le dashboard Turso : https://turso.tech/app
2. Cliquer sur "Create Database"
3. Nom : `ciprel-competences`
4. Region : Choisir la plus proche (ex: `fra` pour Paris)
5. Cliquer sur "Create"

### Option B : Via CLI (si installé)

```bash
# Installer Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Se connecter
turso auth login

# Créer la base
turso db create ciprel-competences --location fra

# Obtenir l'URL
turso db show ciprel-competences --url
```

## Étape 3 : Récupérer les credentials

1. Dans le dashboard, cliquer sur votre base `ciprel-competences`
2. Copier **Database URL**
3. Cliquer sur "Create Token" pour obtenir un token d'authentification

## Étape 4 : Configurer les variables d'environnement

Ajouter dans `.env.local` :

```bash
# Turso Database
NEXT_PUBLIC_TURSO_DATABASE_URL=libsql://ciprel-competences-xxxxx.turso.io
NEXT_PUBLIC_TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...

# Garder Supabase temporairement pour la migration
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Étape 5 : Créer le schéma

### Option A : Via Turso Shell (Web)

1. Dans le dashboard, cliquer sur votre database
2. Cliquer sur "SQL Shell"
3. Copier-coller le contenu de `turso-schema.sql`
4. Exécuter

### Option B : Via CLI

```bash
turso db shell ciprel-competences < turso-schema.sql
```

### Option C : Via un script Node.js

Créer `scripts/init-turso.ts` :

```typescript
import { turso } from './src/lib/turso'
import fs from 'fs'

async function initDatabase() {
  const schema = fs.readFileSync('turso-schema.sql', 'utf-8')
  const statements = schema.split(';').filter(s => s.trim())

  for (const statement of statements) {
    if (statement.trim()) {
      await turso.execute(statement)
      console.log('✅ Executed:', statement.substring(0, 50) + '...')
    }
  }

  console.log('✨ Database initialized!')
}

initDatabase().catch(console.error)
```

Exécuter :
```bash
npx tsx scripts/init-turso.ts
```

## Étape 6 : Migrer les données (Optionnel)

Si vous avez des données existantes dans Supabase :

```typescript
// scripts/migrate-from-supabase.ts
import { supabase } from './src/lib/supabase/client'
import { turso } from './src/lib/turso'
import { hashPassword } from './src/lib/auth-helpers'

async function migrate() {
  // 1. Migrer les profils
  const { data: profiles } = await supabase.from('profiles').select('*')

  for (const profile of profiles || []) {
    // Note: Vous devrez réinitialiser les mots de passe
    const tempPassword = 'Changeme123!' // Les utilisateurs devront le changer
    const passwordHash = await hashPassword(tempPassword)

    await turso.execute({
      sql: `INSERT INTO profiles (id, email, name, role, password_hash, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        profile.id,
        profile.email || `user${profile.id}@ciprel.ci`,
        profile.name || 'Utilisateur',
        profile.role || 'USER',
        passwordHash,
        profile.created_at,
        profile.updated_at
      ]
    })
  }

  // 2. Migrer la progression
  const { data: progress } = await supabase.from('user_reading_progress').select('*')

  for (const item of progress || []) {
    await turso.execute({
      sql: `INSERT INTO user_reading_progress (user_id, section_id, reading_time_seconds, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        item.user_id,
        item.section_id,
        item.reading_time_seconds || 0,
        item.created_at,
        item.updated_at
      ]
    })
  }

  console.log('✨ Migration completed!')
}

migrate().catch(console.error)
```

## Étape 7 : Tester

```bash
npm run dev
```

Vérifier dans la console :
- ✅ Logs Turso avec temps de réponse <50ms
- ✅ Connexion réussie
- ✅ Queries rapides

## Performance attendue

| Opération | Avant (Supabase) | Après (Turso) |
|-----------|------------------|---------------|
| Login | ~2000ms | ~20ms |
| Load progress | ~500ms | ~15ms |
| Save progress | ~300ms | ~10ms |

## Support

- Documentation: https://docs.turso.tech/
- Discord: https://discord.gg/turso
- GitHub: https://github.com/tursodatabase/libsql

## Avantages Turso vs Supabase

✅ **100x plus rapide** (~20ms vs ~2000ms)
✅ **Gratuit** (9GB, 1B lectures/mois)
✅ **SQLite** (familier, simple)
✅ **Edge réplication** (données proches des utilisateurs)
✅ **Pas de serveur** à gérer
✅ **Fonctionne offline** (développement local)

🎉 **Prêt à migrer !**
