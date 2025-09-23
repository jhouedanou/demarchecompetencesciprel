# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à la solution Démarche Compétences CIPREL ! Ce guide vous explique comment participer au développement.

## 🎯 Comment contribuer

### Types de contributions acceptées

- 🐛 **Corrections de bugs** : Signalement et résolution de problèmes
- ✨ **Nouvelles fonctionnalités** : Propositions d'améliorations
- 📚 **Documentation** : Amélioration des guides et README
- 🎨 **Interface utilisateur** : Améliorations UX/UI
- ⚡ **Performance** : Optimisations du code
- 🧪 **Tests** : Ajout de tests unitaires et d'intégration

### Avant de commencer

1. **Lisez** la documentation existante
2. **Vérifiez** les issues ouvertes pour éviter les doublons
3. **Discutez** des changements majeurs via une issue
4. **Respectez** notre code de conduite

## 🔧 Configuration de l'environnement de développement

### Prérequis

- Node.js 22.14.0+
- npm 10+
- Git
- Visual Studio Code (recommandé)
- PowerShell 7+ (pour les scripts)

### Installation

```bash
# 1. Fork et clone
git clone https://github.com/votre-username/demarchecompetencesciprel.git
cd demarchecompetencesciprel

# 2. Installation des dépendances
npm install

# 3. Configuration de l'environnement
cp .env.example .env.local  # Si nécessaire

# 4. Démarrage en mode développement
npm start
```

### Extensions VS Code recommandées

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

## 📝 Standards de développement

### Style de code

- ✅ **TypeScript** strict mode activé
- ✅ **ESLint** + **Prettier** configurés
- ✅ **Naming conventions** : camelCase pour variables, PascalCase pour composants
- ✅ **Indentation** : 2 espaces
- ✅ **Quotes** : Simples pour JS/TS, doubles pour JSX

### Structure des commits

Utilisez le format [Conventional Commits](https://conventionalcommits.org/) :

```
type(scope): description courte

Description détaillée si nécessaire

Fixes #123
```

**Types de commits** :
- `feat`: nouvelle fonctionnalité
- `fix`: correction de bug
- `docs`: documentation
- `style`: formatage, point-virgules manquants
- `refactor`: refactoring du code
- `test`: ajout de tests
- `chore`: mise à jour des dépendances

**Exemples** :
```
feat(quiz): add timer functionality

Add optional timer for quiz questions with visual countdown
and auto-submit when time expires.

Closes #45
```

```
fix(dashboard): resolve chart rendering issue

Fix chart not displaying on smaller screens by adjusting
responsive breakpoints in recharts configuration.

Fixes #78
```

### Tests

```bash
# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

**Guidelines tests** :
- ✅ Tests unitaires pour la logique métier
- ✅ Tests d'intégration pour les services SharePoint
- ✅ Tests de composants React avec React Testing Library
- ✅ Minimum 80% de couverture de code

## 🌟 Processus de contribution

### 1. Issues et discussions

#### Signaler un bug
```
**Titre** : [BUG] Description courte

**Description** :
- Comportement observé
- Comportement attendu
- Étapes pour reproduire

**Environnement** :
- OS : 
- Navigateur : 
- Version SharePoint : 

**Captures d'écran** : (si pertinent)
```

#### Proposer une fonctionnalité
```
**Titre** : [FEATURE] Nom de la fonctionnalité

**Description** :
- Problème à résoudre
- Solution proposée
- Cas d'usage

**Mockups/Wireframes** : (si disponibles)
```

### 2. Pull Requests

#### Processus

1. **Créez une branche** depuis `main`
   ```bash
   git checkout -b feature/nom-fonctionnalite
   # ou
   git checkout -b fix/nom-bug
   ```

2. **Développez** votre fonctionnalité
   - Respectez les standards de code
   - Ajoutez des tests
   - Mettez à jour la documentation

3. **Testez** vos changements
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. **Committez** avec des messages clairs
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Poussez** votre branche
   ```bash
   git push origin feature/nom-fonctionnalite
   ```

6. **Créez** une Pull Request

#### Template de Pull Request

```markdown
## Description
Description claire des changements apportés.

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests manuels effectués
- [ ] Tous les tests passent

## Captures d'écran
(Si changements UI)

## Checklist
- [ ] Code respecte les standards
- [ ] Documentation mise à jour
- [ ] Pas de console.log oubliés
- [ ] Changements testés en local
```

### 3. Review et merge

#### Critères d'acceptation

- ✅ **Code review** approuvée par au moins 1 mainteneur
- ✅ **Tests** passent tous
- ✅ **Lint** sans erreurs
- ✅ **Build** réussit
- ✅ **Documentation** à jour si nécessaire

#### Processus de review

1. **Reviewers assignés** automatiquement
2. **Feedback** constructif donné
3. **Changements demandés** si nécessaire
4. **Approval** une fois satisfait
5. **Merge** par un mainteneur

## 📋 Tâches spécifiques

### Développement frontend

#### Créer un nouveau composant

```typescript
// src/components/MonComposant.tsx
import * as React from 'react';
import { Stack, Text } from '@fluentui/react';
import styles from './MonComposant.module.scss';

export interface MonComposantProps {
  title: string;
  onAction?: () => void;
}

const MonComposant: React.FC<MonComposantProps> = ({ title, onAction }) => {
  return (
    <Stack className={styles.container}>
      <Text variant="large">{title}</Text>
      {/* Votre contenu */}
    </Stack>
  );
};

export default React.memo(MonComposant);
```

#### Tests de composants

```typescript
// src/components/MonComposant.test.tsx
import { render, screen } from '@testing-library/react';
import MonComposant from './MonComposant';

describe('MonComposant', () => {
  it('should render title', () => {
    render(<MonComposant title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### Développement backend (Services)

#### Créer un nouveau service

```typescript
// src/services/MonService.ts
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFx } from '@pnp/sp';

export class MonService {
  private sp: any;

  constructor(context: WebPartContext) {
    this.sp = spfi().using(SPFx(context));
  }

  public async maMethode(): Promise<any> {
    try {
      // Logique métier
      return result;
    } catch (error) {
      console.error('Erreur dans MonService:', error);
      throw error;
    }
  }
}
```

## 🎨 Guidelines UI/UX

### Design System

- 🎨 **Fluent UI** comme base
- 🎨 **Couleurs CIPREL** : Orange (#ff6600), Vert (#107c10)
- 🎨 **Typography** : Segoe UI
- 🎨 **Spacing** : Multiples de 8px
- 🎨 **Breakpoints** : Mobile 768px, Tablet 1024px, Desktop 1200px

### Accessibilité

- ♿ **WCAG 2.1 AA** compliance minimum
- ♿ **Keyboard navigation** supportée
- ♿ **Screen readers** compatibles
- ♿ **Color contrast** respecté
- ♿ **ARIA labels** appropriés

### Performance

- ⚡ **Bundle size** : Surveiller les imports
- ⚡ **Lazy loading** : Composants lourds
- ⚡ **Memoization** : React.memo, useMemo, useCallback
- ⚡ **Image optimization** : WebP, lazy loading

## 🔍 Debug et troubleshooting

### Outils de développement

```bash
# Build avec source maps détaillées
npm run build:dev

# Analyse du bundle
npm run analyze

# Debug SharePoint local
gulp serve --nobrowser
```

### Logs et erreurs

- 📊 **Console logs** : Utilisez des niveaux appropriés
- 🐛 **Error boundaries** : Implémentez pour les composants critiques
- 📝 **Error tracking** : Structured logging

### SharePoint spécifique

```typescript
// Debug PnP.js
import { Logger, LogLevel } from '@pnp/logging';
Logger.activeLogLevel = LogLevel.Verbose;

// Debug WebPart context
console.log('SPFx Context:', this.context);
```

## 📚 Ressources

### Documentation officielle

- [SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/)
- [Fluent UI React](https://developer.microsoft.com/en-us/fluentui/)
- [PnP.js](https://pnp.github.io/pnpjs/)
- [React](https://reactjs.org/)

### Outils utiles

- [SPFx Toolkit](https://marketplace.visualstudio.com/items?itemName=m365pnp.viva-connections-toolkit)
- [PnP PowerShell](https://pnp.github.io/powershell/)
- [SharePoint REST API](https://docs.microsoft.com/en-us/sharepoint/dev/apis/rest/)

### Communauté

- [Microsoft 365 PnP Community](https://pnp.github.io/)
- [SPFx Discord](https://discord.gg/sharepoint)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/sharepoint-framework)

## 🏆 Reconnaissance

Les contributeurs sont reconnus dans :
- 📋 **CONTRIBUTORS.md** : Liste des contributeurs
- 🎉 **Release notes** : Mentions des contributions
- 💬 **Discord** : Canal #contributors pour les discussions

### Niveaux de contribution

- 🌟 **Contributeur occasionnel** : 1-5 PRs
- 🚀 **Contributeur actif** : 6-20 PRs
- 🏆 **Contributeur core** : 21+ PRs, reviews régulières
- 👑 **Mainteneur** : Accès en écriture, responsabilités de maintenance

## 📞 Contact

### Questions techniques
- 💬 **Discord** : #dev-discussions
- 📧 **Email** : dev@ciprel.ci

### Questions projet
- 📧 **Project lead** : lead@ciprel.ci
- 💼 **Product owner** : po@ciprel.ci

---

**Merci de contribuer à la solution Démarche Compétences CIPREL ! 🙏**

*Votre temps et expertise sont précieux pour améliorer l'expérience de tous les utilisateurs.*
