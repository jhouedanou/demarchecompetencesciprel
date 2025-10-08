# 🎯 Finaliser la Migration SQLite Local

## ✅ Ce qui est FAIT

### **Infrastructure complète créée :**
1. ✅ **SQLite Database** (`src/lib/db.ts`) - Base locale ultra-rapide
2. ✅ **Auth Helpers** (`src/lib/auth-helpers.ts`) - Authentification avec bcrypt
3. ✅ **API Routes** - Toutes créées :
   - `/api/auth/login` - Connexion
   - `/api/auth/signup` - Inscription
   - `/api/auth/logout` - Déconnexion
   - `/api/auth/session` - Vérification session
   - `/api/progress` - Progression (GET, POST, DELETE)
4. ✅ **useUser Hook** (`src/hooks/useUser.ts`) - Hook client moderne

---

## 🔨 Ce qu'il reste à faire

### **Étape 1 : Remplacer les imports dans l'app**

#### **Fichier : `src/app/page.tsx`**
```typescript
// ❌ Supprimer
import { useUser } from '@/lib/supabase/client'

// ✅ Remplacer par
import { useUser } from '@/hooks/useUser'
```

---

### **Étape 2 : Adapter auth-store.ts**

#### **Fichier : `src/stores/auth-store.ts`**

Remplacer la fonction `signIn` (ligne 109-195) par :

```typescript
signIn: async (credentials) => {
  const startTime = performance.now()
  console.log('🔐 [signIn] Starting login for:', credentials.email)

  try {
    set({ isLoading: true })

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      set({ isLoading: false })
      return { error: data.error || 'Erreur de connexion' }
    }

    const { user } = data
    set({ user, isAuthenticated: true, isLoading: false })

    const elapsed = performance.now() - startTime
    console.log(`✨ [signIn] Login complete in ${elapsed.toFixed(0)}ms`)

    return {}
  } catch (error: any) {
    set({ isLoading: false })
    return { error: error.message }
  }
},
```

Remplacer la fonction `signUp` (ligne 196-244) par :

```typescript
signUp: async (credentials) => {
  try {
    set({ isLoading: true })

    if (credentials.password !== credentials.confirmPassword) {
      set({ isLoading: false })
      return { error: 'Les mots de passe ne correspondent pas' }
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      set({ isLoading: false })
      return { error: data.error || 'Erreur lors de la création du compte' }
    }

    const { user } = data
    set({ user, isAuthenticated: true, isLoading: false })

    return {}
  } catch (error: any) {
    set({ isLoading: false })
    return { error: error.message }
  }
},
```

Remplacer la fonction `signOut` (ligne 245-254) par :

```typescript
signOut: async () => {
  try {
    set({ isLoading: true })
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
  } catch (error) {
    console.error('Sign out error:', error)
  } finally {
    set({ user: null, isAuthenticated: false, isLoading: false })
  }
},
```

---

### **Étape 3 : Adapter useReadingProgress.ts**

#### **Fichier : `src/hooks/useReadingProgress.ts`**

Remplacer la fonction `loadProgress` (ligne 72-118) par :

```typescript
const loadProgress = async () => {
  if (!user) return

  const startTime = performance.now()
  console.log('📚 [useReadingProgress] Loading progress for user')

  try {
    const response = await fetch('/api/progress', {
      credentials: 'include',
    })

    const { progress: data } = await response.json()

    const elapsed = performance.now() - startTime
    console.log(`✅ [useReadingProgress] Progress loaded in ${elapsed.toFixed(0)}ms`)

    // Update sections with completed status
    const updatedSections = REQUIRED_SECTIONS.map(section => {
      const progress = data?.find((p: any) => p.section_id === section.id)
      return {
        ...section,
        completed: !!progress,
        reading_time: progress?.reading_time_seconds || 0
      }
    })

    setSections(updatedSections)
    setAllCompleted(areRequiredSectionsCompleted(updatedSections))
  } catch (error) {
    console.error('❌ [useReadingProgress] Error loading progress:', error)
  } finally {
    setLoading(false)
  }
}
```

Remplacer la fonction `markSectionCompleted` (ligne 120-XXX) par :

```typescript
const markSectionCompleted = async (sectionId: string, readingTimeSeconds: number = 0) => {
  if (!user) {
    console.warn('⚠️ [useReadingProgress] User not logged in')
    return
  }

  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ section_id: sectionId, reading_time_seconds: readingTimeSeconds }),
    })

    // Refresh progress
    await loadProgress()
  } catch (error) {
    console.error('❌ [useReadingProgress] Error marking section:', error)
  }
}
```

---

### **Étape 4 : Créer un utilisateur test**

Créer `scripts/create-test-user.ts` :

```typescript
import { createUser } from '../src/lib/auth-helpers'

async function main() {
  try {
    const user = await createUser(
      'test@ciprel.ci',
      'Test1234!',
      'Utilisateur Test'
    )

    console.log('✅ Utilisateur créé:', user)
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

main()
```

Exécuter :
```bash
npx tsx scripts/create-test-user.ts
```

---

### **Étape 5 : Tester**

```bash
npm run dev
```

**Tester :**
1. ✅ Connexion avec `test@ciprel.ci` / `Test1234!`
2. ✅ Vérifier les logs de performance (<5ms !)
3. ✅ Tester la progression de lecture
4. ✅ Déconnexion

---

## 📊 Performance finale attendue

| Opération | Supabase (avant) | SQLite (après) | Gain |
|-----------|------------------|----------------|------|
| Login | 2000ms 🐌 | **<10ms** ⚡ | **200x** |
| Load progress | 500ms | **<5ms** ⚡ | **100x** |
| Save progress | 300ms | **<3ms** ⚡ | **100x** |
| Page load totale | 3-5s | **<1s** 🚀 | **5x** |

---

## 🎉 Après la migration

**Avantages :**
- ✅ **200x plus rapide**
- ✅ **100% gratuit**
- ✅ **Pas de limite de requêtes**
- ✅ **Fonctionne offline**
- ✅ **Vos données chez vous**

**Désavantages :**
- ❌ Ne marche pas sur Vercel tel quel (mais Turso oui !)
- ❌ Pas de realtime (pas nécessaire pour votre cas)

---

## 🚀 Déploiement sur Vercel

Pour déployer sur Vercel, deux options :

### **Option 1 : Turso (recommandé)**
- Changer 2 lignes dans `src/lib/db.ts`
- Utiliser Turso au lieu de SQLite local
- Voir `TURSO_SETUP.md`

### **Option 2 : Vercel Postgres**
- Adapter les queries SQL
- Plus complexe

---

**Prêt ? Suivez les étapes ci-dessus et profitez de la vitesse ! ⚡**
