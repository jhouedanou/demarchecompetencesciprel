# 🎯 Gestion des Workshops Métiers CIPREL

## 📋 Vue d'ensemble

Le système de gestion des workshops métiers permet aux administrateurs de configurer et gérer les workshops pour chacun des 12 métiers de CIPREL. Cette fonctionnalité s'intègre parfaitement dans l'écosystème existant de la plateforme de démarche compétences.

## 🎨 Design et Thème

Les workshops respectent la charte graphique CIPREL :
- **Couleur primaire** : Vert CIPREL `#58A636`
- **Couleur secondaire** : Orange CIPREL `#EE7F00`
- **Palette complète** : Définie dans `tailwind.config.ts`

## 📦 Installation et Configuration

### 1. Exécuter le Script SQL dans Supabase

1. Connectez-vous à votre dashboard Supabase
2. Allez dans l'onglet **SQL Editor**
3. Ouvrez le fichier `supabase_workshops_setup.sql`
4. Copiez et exécutez le contenu du script
5. Vérifiez que les tables ont été créées :
   ```sql
   SELECT * FROM public.workshops;
   SELECT * FROM public.workshop_stats;
   ```

### 2. Structure des Tables Créées

#### Table `workshops`
Stocke les informations principales des workshops :
- `id` : Identifiant unique
- `metier_id` : ID du métier (1-12)
- `metier_nom` : Nom du métier
- `is_active` : Statut actif/inactif
- `publication_date` : Date de publication
- `onedrive_link` : Lien vers le dossier OneDrive
- `created_at`, `updated_at` : Timestamps

#### Table `workshop_resources`
Gère les ressources documentaires :
- Documents PDF, vidéos, présentations
- Types : `'document'`, `'video'`, `'presentation'`, `'guide'`
- Ordre d'affichage personnalisable

#### Table `workshop_access_logs`
Enregistre les analytics d'accès :
- Tracking des vues, téléchargements, partages
- Analytics par utilisateur et par workshop
- IP et user-agent pour statistiques détaillées

### 3. Les 12 Métiers CIPREL

Les workshops sont automatiquement créés pour tous les métiers :

1. **Production** ⚡
2. **SIDT** 💻
3. **Maintenance** 🔧
4. **QSE-RSE/Sûreté** 🛡️
5. **Contrôle Interne** 📊
6. **Stocks** 📦
7. **RH/Juridique** ⚖️
8. **Services Généraux** 🏢
9. **DFC** 💰
10. **Projets** 🎯
11. **Achats & Logistique** 🚚
12. **Direction** 👔

## 🔐 Sécurité et Permissions

### Row Level Security (RLS)

Le système implémente des politiques RLS strictes :

#### Pour les utilisateurs standard :
- ✅ Voir les workshops **actifs** uniquement
- ✅ Voir les ressources **publiques** des workshops actifs
- ✅ Créer leurs propres logs d'accès
- ✅ Consulter leurs propres statistiques

#### Pour les administrateurs :
- ✅ Accès complet à tous les workshops (actifs et inactifs)
- ✅ Créer, modifier, supprimer des workshops
- ✅ Gérer toutes les ressources
- ✅ Consulter tous les logs et analytics

### Vérification des Permissions

Les permissions sont vérifiées via la table `profiles` :
```sql
SELECT role FROM public.profiles WHERE id = auth.uid()
-- Rôle attendu : 'admin'
```

## 🖥️ Interface d'Administration

### Accès à l'interface

1. **URL** : `/admin/workshops`
2. **Navigation** :
   - Menu latéral : "Workshops Métiers" 🎯
   - Tableau de bord : Action rapide "Gérer les workshops"

### Fonctionnalités Disponibles

#### 1. Gestion du Statut
- **Bouton toggle** : Activer/désactiver un workshop d'un clic
- **Couleurs** :
  - 🟢 Actif : Badge vert
  - ⚫ Inactif : Badge gris

#### 2. Configuration de la Date
- **Datepicker** : Sélection facile de la date de publication
- **Format** : Affichage en français (jj/mm/aaaa)
- **Optionnel** : Peut rester vide

#### 3. Lien OneDrive
- **Champ URL** : Validation automatique du format
- **Lien cliquable** : Ouvre dans un nouvel onglet
- **Placeholder** : "https://..."

#### 4. Actions d'Édition
- **Bouton Éditer** 🖊️ : Passe en mode édition
- **Bouton Sauvegarder** 💾 : Enregistre les modifications
- **Bouton Annuler** ❌ : Annule les changements

### Captures d'Écran du Tableau

| Colonne | Contenu | Actions |
|---------|---------|---------|
| Métier | Nom du métier | - |
| Statut | Badge actif/inactif | Toggle |
| Date de publication | Date formatée ou "Non définie" | Edit |
| Lien OneDrive | Lien cliquable ou "Non défini" | Edit |
| Actions | Boutons d'édition | Edit/Save/Cancel |

## 📱 Intégration Frontend

### Page d'Accueil - Slide Workshops

Dans `src/app/page.tsx`, le slide 3 affiche les workshops :

```tsx
// Swiper horizontal des métiers
{METIERS.map((metier) => (
  <SwiperSlide key={metier.id}>
    <button
      onClick={() => {
        setActiveMetier({ id: metier.id, titre: metier.nom })
        setWorkshopModalOpen(true)
      }}
      className={`bg-gradient-to-br ${metier.color}`}
    >
      <div className="text-6xl">{metier.icon}</div>
      <h3>{metier.nom}</h3>
    </button>
  </SwiperSlide>
))}
```

### Modal Workshop

Le modal s'ouvre automatiquement et :
- Affiche le titre du métier
- Vérifie si le workshop est actif
- Propose le lien OneDrive si disponible
- Sinon affiche un message informatif

## 🔧 Hook React : `useWorkshops`

### Utilisation

```tsx
import { useWorkshops } from '@/hooks/useWorkshops'

const {
  workshops,           // Liste des workshops
  loading,            // État de chargement
  error,              // Message d'erreur
  getWorkshops,       // Recharger la liste
  getWorkshopByMetierId, // Récupérer un workshop spécifique
  createWorkshop,     // Créer un nouveau workshop
  updateWorkshop,     // Mettre à jour un workshop
  deleteWorkshop,     // Supprimer un workshop
  toggleWorkshopActive // Toggle actif/inactif
} = useWorkshops()
```

### Exemple de Mise à Jour

```tsx
// Mettre à jour un workshop
await updateWorkshop(workshopId, {
  onedrive_link: 'https://onedrive.com/...',
  publication_date: new Date().toISOString(),
  is_active: true
})

// Toggle actif/inactif
await toggleWorkshopActive(workshopId, currentStatus)
```

## 📊 Analytics et Statistiques

### Vue `workshop_stats`

Une vue SQL consolidée fournit des statistiques en temps réel :

```sql
SELECT
  metier_nom,
  is_active,
  total_resources,      -- Nombre de ressources
  unique_visitors,      -- Visiteurs uniques
  total_views,          -- Vues totales
  last_access          -- Dernier accès
FROM workshop_stats;
```

### Fonction de Logging

Enregistrer automatiquement les accès :

```sql
SELECT log_workshop_access(
  p_workshop_id := 1,
  p_access_type := 'view',
  p_resource_id := NULL
);
```

Types d'accès supportés :
- `'view'` : Consultation du workshop
- `'download'` : Téléchargement de ressource
- `'share'` : Partage du workshop

## 🚀 Déploiement

### Checklist de Mise en Production

- [ ] Script SQL exécuté dans Supabase
- [ ] Tables créées et vérifiées
- [ ] Politiques RLS activées
- [ ] 12 workshops métiers initialisés
- [ ] Hook `useWorkshops` testé
- [ ] Interface admin accessible
- [ ] Navigation dans AdminSidebar active
- [ ] Action rapide dans QuickActions visible
- [ ] Page d'accueil intégrée (slide 3)
- [ ] Modal fonctionnel

### Tests à Effectuer

1. **En tant qu'Admin** :
   - [ ] Connexion à `/admin/workshops`
   - [ ] Modification d'un workshop
   - [ ] Activation/désactivation
   - [ ] Ajout de lien OneDrive
   - [ ] Définition de date de publication

2. **En tant qu'Utilisateur** :
   - [ ] Consultation des workshops actifs
   - [ ] Clic sur un métier (slide 3)
   - [ ] Ouverture du modal
   - [ ] Accès au lien OneDrive (si actif)
   - [ ] Message si workshop inactif

3. **Tests de Sécurité** :
   - [ ] Utilisateur normal ne voit pas les workshops inactifs
   - [ ] Tentative d'accès direct à un workshop inactif bloquée
   - [ ] Policies RLS respectées

## 🆘 Dépannage

### Erreur : "workshops table does not exist"

**Solution** : Exécuter le script SQL `supabase_workshops_setup.sql` dans Supabase.

### Erreur : "permission denied for table workshops"

**Solution** : Vérifier que les politiques RLS sont bien activées :
```sql
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
```

### Les workshops n'apparaissent pas

**Vérifications** :
1. Table `workshops` contient bien 12 entrées
2. L'utilisateur a les permissions adéquates
3. La requête Supabase n'a pas d'erreur dans la console

### Le toggle actif/inactif ne fonctionne pas

**Solution** : Vérifier que l'utilisateur connecté est admin dans la table `profiles`.

## 📞 Support

Pour toute question ou problème :
- **Email** : it@ciprel.ci
- **Documentation** : Consulter ce README
- **Logs Supabase** : Vérifier dans le dashboard Supabase

## 📝 Changelog

### Version 1.0.0 (2024)
- ✅ Création des tables Supabase
- ✅ Implémentation du hook `useWorkshops`
- ✅ Interface d'administration complète
- ✅ Intégration dans le menu et actions rapides
- ✅ Sécurité RLS complète
- ✅ Analytics et logging
- ✅ Vue statistiques consolidée

---

**Fait avec 💚 pour CIPREL** - Développement de la plateforme Démarche Compétences
