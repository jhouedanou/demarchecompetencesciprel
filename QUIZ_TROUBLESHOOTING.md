# Guide de résolution des problèmes - Quiz

## Erreur : "Erreur lors de la sauvegarde"

### Causes possibles

#### 1. Utilisateur non connecté (Code 401)
**Symptôme** : Message "Vous devez être connecté pour sauvegarder vos résultats."

**Solution** :
- Vérifiez que l'utilisateur est bien connecté avant de démarrer le quiz
- Consultez la console du navigateur pour voir l'état de la session
- Testez la connexion en appelant `supabase.auth.getSession()`

```typescript
// Vérifier la session avant de démarrer le quiz
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  // Rediriger vers la page de connexion
  router.push('/login')
}
```

#### 2. Données manquantes ou invalides (Code 400)
**Symptôme** : Message indiquant des données manquantes

**Solution** :
- Vérifiez que tous les champs requis sont présents :
  - `quiz_type` : 'INTRODUCTION' ou 'SONDAGE'
  - `responses` : Array de réponses
  - `score` : Nombre >= 0
  - `total_questions` : Nombre > 0

#### 3. Problème de base de données (Code 500)
**Symptôme** : Erreur lors de l'insertion dans Supabase

**Solutions** :
1. **Vérifier les permissions RLS** :
   ```sql
   -- Dans Supabase SQL Editor
   SELECT * FROM pg_policies WHERE tablename = 'quiz_results';
   ```

2. **Vérifier la structure de la table** :
   ```sql
   \d quiz_results
   ```

3. **Tester l'insertion manuelle** :
   ```sql
   INSERT INTO quiz_results (
     user_id,
     quiz_type,
     score,
     max_score,
     total_questions,
     correct_answers,
     responses,
     duration,
     percentage,
     attempt_number
   ) VALUES (
     'votre-user-id',
     'INTRODUCTION',
     5,
     7,
     7,
     5,
     '{"answers": []}'::jsonb,
     120,
     71.43,
     1
   );
   ```

4. **Appliquer la migration** :
   ```bash
   # Si vous utilisez Supabase CLI
   supabase migration up
   
   # Ou appliquez manuellement le fichier :
   # supabase/migrations/006_improve_quiz_results.sql
   ```

## Commandes de débogage

### Console du navigateur
```javascript
// Vérifier la session utilisateur
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// Vérifier le store du quiz
console.log('Quiz Store:', useQuizStore.getState())
```

### Logs API
Les logs détaillés sont disponibles dans :
- Console du terminal où tourne `npm run dev`
- Supabase Dashboard > Logs

### Vérifier les données envoyées
Ouvrez les DevTools > Network > api/quiz (méthode POST) pour voir :
- Request Payload : Les données envoyées
- Response : L'erreur retournée

## Migration recommandée

Si le problème persiste, exécutez la migration SQL :

```bash
# Connectez-vous à votre base Supabase et exécutez
cat supabase/migrations/006_improve_quiz_results.sql | supabase db execute
```

Cette migration :
- ✅ Ajoute des valeurs par défaut
- ✅ Ajoute des contraintes de validation
- ✅ Améliore les index pour les performances
- ✅ Ajoute de la documentation

## Support

Si le problème persiste après ces vérifications :
1. Consultez les logs Supabase
2. Vérifiez les permissions RLS
3. Contactez l'administrateur système
