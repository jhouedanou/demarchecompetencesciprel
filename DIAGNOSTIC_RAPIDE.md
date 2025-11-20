# Diagnostic Rapide - Page Blanche

La page localhost:3001 n'affiche plus rien après l'exécution des scripts SQL.

## Étapes de Diagnostic

### 1. Vérifier la Console Navigateur (F12)

Ouvrez la console développeur et regardez les erreurs:
- Erreurs rouges ?
- Erreurs réseau (Network tab) ?
- Requêtes échouées vers Supabase ?

### 2. Vider le Cache

```bash
# Sur Mac
Cmd + Shift + R

# Sur Windows/Linux
Ctrl + Shift + R
```

### 3. Vérifier que Supabase répond

Ouvrez cette URL dans le navigateur:
```
https://yuyjwspittftodncnfbd.supabase.co/rest/v1/workshops?select=*
```

**Attendu**: Un JSON avec les workshops ou une erreur d'auth
**Problème**: Si timeout ou 500

### 4. Test SQL Direct dans Supabase

Dans Supabase SQL Editor, exécutez:
```sql
-- Vérifier que les workshops existent
SELECT COUNT(*) FROM public.workshops;

-- Devrait retourner 13 si le script cleanup a fonctionné

-- Vérifier le rôle admin
SELECT id, email, role FROM public.profiles
WHERE email = 'jeanluc@bigfiveabidjan.com';

-- Devrait afficher role = 'ADMIN'
```

### 5. Vérifier les Logs du Serveur

Dans le terminal où tourne `npm run dev`:
```bash
# Chercher les erreurs
grep -i "error\|fail"

# Il devrait afficher les requêtes en cours
```

### 6. Redémarrer le Serveur

```bash
# Tuer les processus Node
pkill -f "next dev"

# Relancer
cd /Users/houedanou/Documents/GitHub/demarchecompetencesciprel
npm run dev
```

### 7. Test Manuel de l'API

```bash
# Tester l'API workshops (devrait retourner 403 si pas connecté)
curl http://localhost:3001/api/admin/workshops

# Tester la page d'accueil
curl -I http://localhost:3001
```

## Causes Possibles

### A. Scripts SQL ont cassé quelque chose

**Symptômes**:
- Page blanche après l'exécution des scripts
- Erreurs dans la console sur "workshops"

**Solution**:
```sql
-- Dans Supabase SQL Editor
SELECT * FROM public.workshops;
-- Si vide ou erreur, relancer cleanup_workshops.sql
```

### B. Le hook useWorkshops plante

**Symptômes**:
- Erreur JavaScript dans la console
- Mention de "useWorkshops" ou "workshops"

**Solution temporaire**:
Commenter temporairement l'appel à useWorkshops dans page.tsx:

```typescript
// const { workshops, loading: workshopsLoading } = useWorkshops()
const workshops = []
const workshopsLoading = false
```

### C. Problème d'Authentification Supabase

**Symptômes**:
- Erreur "Invalid JWT" ou "Auth session failed"
- Timeout de 5 secondes

**Solution**:
1. Vider localStorage du navigateur (F12 → Application → Local Storage → Tout supprimer)
2. Se déconnecter
3. Se reconnecter

### D. Problème RLS (Row Level Security)

**Symptômes**:
- Erreurs 403 sur les requêtes Supabase
- "permission denied for table workshops"

**Solution**:
```sql
-- Vérifier que RLS n'empêche pas la lecture publique
SELECT * FROM pg_policies WHERE tablename = 'workshops';

-- Désactiver temporairement RLS pour test
ALTER TABLE public.workshops DISABLE ROW LEVEL SECURITY;

-- Tester, puis réactiver
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
```

## Solution Rapide (Reset Complet)

Si rien ne fonctionne, reset complet:

```bash
# 1. Arrêter le serveur
pkill -f "next dev"

# 2. Nettoyer Next.js
rm -rf .next
rm -rf node_modules/.cache

# 3. Vider le cache npm
npm cache clean --force

# 4. Dans Supabase SQL Editor, relancer les scripts
# - cleanup_workshops.sql
# - fix_admin_role.sql

# 5. Vider le cache navigateur + localStorage
# F12 → Application → Clear storage → Clear site data

# 6. Redémarrer
npm run dev

# 7. Aller sur http://localhost:3001
```

## Que Faire Ensuite?

Une fois la page qui charge:

1. ✅ Vérifier que vous voyez la page d'accueil
2. ✅ Se connecter en tant qu'admin (jeanluc@bigfiveabidjan.com)
3. ✅ Aller sur `/admin/workshops`
4. ✅ Vérifier qu'il y a exactement 13 workshops
5. ✅ Activer quelques workshops (cliquer sur "Inactif" → "Actif")
6. ✅ Retourner sur la page d'accueil
7. ✅ Aller sur le slide "Workshops Métiers"
8. ✅ Vérifier que seuls les workshops actifs sont cliquables

## Contact

Si le problème persiste, copiez-moi:
1. Les erreurs de la console navigateur (F12)
2. Les dernières lignes du terminal (serveur)
3. Le résultat de: `SELECT * FROM public.workshops LIMIT 5;` dans Supabase
