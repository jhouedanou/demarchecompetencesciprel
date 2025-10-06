# Modaux d'authentification

## Vue d'ensemble

Les fonctionnalités de connexion et déconnexion ont été migrées vers des modaux réutilisables au lieu de routes dédiées.

## Composants créés

### 1. `AuthModal.tsx`
**Emplacement**: `src/components/auth/AuthModal.tsx`

Modal d'authentification avec deux modes:
- **Mode connexion**: Formulaire de connexion avec email et mot de passe
- **Mode inscription**: Formulaire d'inscription avec nom, email, mot de passe et confirmation

**Fonctionnalités**:
- Basculement entre connexion et inscription
- Validation des mots de passe (minimum 8 caractères)
- Vérification de correspondance des mots de passe
- Affichage/masquage des mots de passe
- Messages d'erreur contextuels
- Redirection automatique après succès
- Lien vers le support

**Props**:
```typescript
{
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'register'
}
```

### 2. `LogoutModal.tsx`
**Emplacement**: `src/components/auth/LogoutModal.tsx`

Modal de confirmation de déconnexion.

**Fonctionnalités**:
- Affichage du nom de l'utilisateur
- Confirmation avant déconnexion
- Nettoyage du localStorage (admin auth)
- Message informatif sur la persistance des données
- Conseil sur l'usage (appareils partagés)

**Props**:
```typescript
{
  isOpen: boolean
  onClose: () => void
}
```

## Intégrations

### 1. Page d'accueil (`src/app/page.tsx`)

Le modal d'authentification s'ouvre via des événements personnalisés:

```typescript
// Déclencher l'ouverture du modal de connexion
window.dispatchEvent(new Event('open-login'))

// Déclencher l'ouverture du modal de déconnexion
window.dispatchEvent(new Event('open-logout'))
```

**Exemple d'utilisation**:
```tsx
<button onClick={() => window.dispatchEvent(new Event('open-login'))}>
  Se connecter
</button>
```

### 2. GlobalLoginGate (`src/components/auth/GlobalLoginGate.tsx`)

Composant global qui écoute l'événement `open-login` et affiche le modal d'authentification.

**Comportement**:
- Écoute l'événement `open-login`
- N'affiche pas le modal sur les pages `/login`, `/register`, `/reset-password`, `/forgot-password`
- Se ferme automatiquement après une connexion réussie

### 3. Navbar Admin (`src/components/layout/Navbar.tsx`)

Le bouton "Se déconnecter" dans le dropdown ouvre maintenant le modal de confirmation au lieu de déconnecter directement.

## Avantages

1. **UX améliorée**: L'utilisateur ne quitte plus la page en cours
2. **Confirmation**: Évite les déconnexions accidentelles
3. **Réutilisabilité**: Les modaux peuvent être utilisés partout dans l'application
4. **Cohérence**: Design uniforme sur toute l'application
5. **Accessibilité**: Composants Dialog accessibles avec gestion du focus

## Routes conservées

Les routes suivantes sont conservées pour compatibilité et accès direct:
- `/login` - Page de connexion dédiée
- `/register` - Page d'inscription dédiée
- `/reset-password` - Réinitialisation de mot de passe
- `/forgot-password` - Mot de passe oublié

## Événements personnalisés

### `open-login`
Ouvre le modal d'authentification en mode connexion.

```javascript
window.dispatchEvent(new Event('open-login'))
```

### `open-logout`
Ouvre le modal de confirmation de déconnexion.

```javascript
window.dispatchEvent(new Event('open-logout'))
```

## Styles

Les modaux utilisent les composants shadcn/ui:
- `Dialog`
- `DialogContent`
- `DialogTitle`
- `DialogDescription`

Les couleurs suivent la charte CIPREL:
- Vert principal: `ciprel-green-600`
- Orange: `ciprel-orange-600`

## Tests recommandés

1. ✅ Ouverture/fermeture des modaux
2. ✅ Basculement connexion/inscription
3. ✅ Validation des formulaires
4. ✅ Messages d'erreur
5. ✅ Redirection après connexion
6. ✅ Déconnexion avec confirmation
7. ✅ Responsive (mobile/desktop)
8. ✅ Accessibilité (navigation clavier)
