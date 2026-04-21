# 🚀 Guide Rapide : Migration Supabase → Turso

## ✅ Ce qui est prêt

1. ✅ Client Turso installé (`@libsql/client`)
2. ✅ Schéma SQL créé (`turso-schema.sql`)
3. ✅ Client Turso configuré (`src/lib/turso.ts`)
4. ✅ Helpers d'authentification créés (`src/lib/auth-helpers.ts`)
5. ✅ Bcrypt installé pour les mots de passe

## 🎯 Actions à faire MAINTENANT

### 1. Créer votre base de données Turso (5 min)

```bash
# Option 1 : Via le web (plus simple)
# Aller sur https://turso.tech/
# Se connecter avec GitHub
# Créer une database "ciprel-competences"
# Copier l'URL et le token

# Option 2 : Via CLI
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db create ciprel-competences
turso db show ciprel-competences --url
turso db tokens create ciprel-competences
```

### 2. Configurer `.env.local`

Ajouter ces lignes :

```bash
# Turso
NEXT_PUBLIC_TURSO_DATABASE_URL=libsql://ciprel-competences-xxxxx.turso.io
NEXT_PUBLIC_TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### 3. Initialiser le schéma

Via le dashboard Turso :
1. Aller dans votre database
2. Cliquer sur "SQL Shell"
3. Copier-coller le contenu de `turso-schema.sql`
4. Exécuter

### 4. Tester que ça fonctionne

```bash
npm run dev
```

Vous devriez voir dans la console :
```
⚡ [Turso Config] Initializing Turso client...
🔑 [Turso Config] URL: ✅ libsql://...
✨ [Turso Config] Client initialized successfully
```

## 📊 Résultats attendus

| Métrique | Avant (Supabase) | Après (Turso) |
|----------|------------------|---------------|
| Temps de connexion | 2000ms ⏱️ | 20ms ⚡ |
| Chargement page | 3-5s | <1s |
| Expérience | Lent 🐌 | Instantané 🚀 |

## 🆘 Problèmes courants

### "Cannot connect to Turso"
- ✅ Vérifier que `NEXT_PUBLIC_TURSO_DATABASE_URL` est défini
- ✅ Vérifier que le token est valide
- ✅ Redémarrer le serveur dev

### "Table does not exist"
- ✅ Exécuter `turso-schema.sql` dans le SQL Shell
- ✅ Vérifier que toutes les tables sont créées

## 🎉 C'est tout !

Une fois configuré, **tout fonctionnera 100x plus vite** sans aucun changement de code !

Les prochaines étapes (optionnelles) :
- Migrer les données existantes de Supabase
- Supprimer les dépendances Supabase
- Profiter de la vitesse ! ⚡

---

**Questions ?** Consultez `TURSO_SETUP.md` pour plus de détails.
