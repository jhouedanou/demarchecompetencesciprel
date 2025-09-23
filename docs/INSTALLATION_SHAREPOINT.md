# Guide d'installation – Démarche Compétence CIPREL (SharePoint Online)

Ce document décrit les étapes pour qu'un administrateur SharePoint installe la solution SPFx « Démarche Compétence CIPREL » sur un tenant client, à partir d'un package remis par l'équipe projet.

## 1. Pré-requis côté client
- **Droits** : Administrateur SharePoint ou App Catalog, avec accès au site cible.
- **Outils** :
  - PowerShell 7+ avec le module `PnP.PowerShell` (ou possibilité d'exécuter les scripts fournis).
  - Navigateur Edge/Chrome pour accéder au SharePoint Admin Center.
- **Fichiers fournis** :
  - `sharepoint/solution/demarche-competence-spfx.sppkg`
  - Scripts PowerShell :
    - `scripts/Deploy-SharePointLists.ps1`
    - `scripts/Populate-SampleData.ps1`
    - (optionnel) `scripts/Deploy-Demo.ps1` pour un déploiement express.

## 2. Préparation de l'environnement SharePoint
1. **Vérifier l'App Catalog** :
   - Se rendre sur `https://<tenant>-admin.sharepoint.com` > **Plus de fonctionnalités** > **Apps**.
   - Créer l'App Catalog si nécessaire (via "Apps" > "App Catalog" > "Create a new app catalog site").

2. **Identifier le site cible** :
   - Choisir le site moderne SharePoint où la Web Part sera utilisée (ex. `https://<tenant>.sharepoint.com/sites/Competences`).
   - Vérifier que l'utilisateur déployant possède le contrôle total sur ce site.

## 3. Provisionnement des listes SharePoint
1. Ouvrir PowerShell 7+.
2. Se placer dans le répertoire contenant les scripts.
3. Exécuter :
   ```powershell
   # Connexion au site cible
   Connect-PnPOnline -Url "https://<tenant>.sharepoint.com/sites/Competences" -Interactive

   # Créer les listes nécessaires
   .\scripts\Deploy-SharePointLists.ps1 -SiteUrl "https://<tenant>.sharepoint.com/sites/Competences"

   # (Facultatif) Injecter des données de démonstration
   .\scripts\Populate-SampleData.ps1 -SiteUrl "https://<tenant>.sharepoint.com/sites/Competences"
   ```
4. Vérifier dans SharePoint que les listes suivantes sont créées : `Quiz_Introduction`, `Quiz_Sondage`, `Quiz_Results`, `User_Progress`.

## 4. Déploiement de la solution SPFx
1. Copier `sharepoint/solution/demarche-competence-spfx.sppkg` sur votre poste.
2. Aller dans l'App Catalog (`https://<tenant>.sharepoint.com/sites/appcatalog`) > **Apps pour SharePoint**.
3. Glisser-déposer le fichier `.sppkg` ou utiliser **Upload**.
4. Une fenêtre **Do you trust DémarcheCompétence?** s'affiche :
   - Cocher "**Make this solution available to all sites in the organization**" si vous souhaitez permettre l'utilisation globale.
   - Cliquer sur **Deploy**.

## 5. Activation sur un site SharePoint
1. Aller sur le site cible (ex : `https://<tenant>.sharepoint.com/sites/Competences`).
2. Ouvrir **Paramètres** (engrenage) > **Ajouter une application**.
3. Dans la section **From Your Organization**, sélectionner "Démarche Compétence CIPREL".
4. Une fois l'application ajoutée, créer / éditer une page moderne.
5. Ajouter une zone de Web Part, puis rechercher **Démarche Compétence** et l'insérer.
6. Configurer les propriétés disponibles (titre, sauvegarde auto, etc.) via le volet de configuration du Web Part.

## 6. Vérifications post-déploiement
- Ouvrir la page contenant la Web Part et confirmer :
  - Chargement du tableau de bord et des quiz.
  - Accès aux listes SharePoint (consultation/écriture).
  - Affichage cohérent des couleurs et du logo.
- Examiner la liste `Quiz_Results` après un test pour s’assurer que les réponses et scores sont bien enregistrés.
- Vérifier que le paramètre `?debugManifestsFile=` n'est PAS utilisé sur la page de production.

## 7. Gestion des permissions
- S’assurer que les utilisateurs finaux disposent d’au moins les droits **Contribute** sur les listes `Quiz_Introduction`, `Quiz_Sondage`, `Quiz_Results` et `User_Progress`.
- Pour restreindre l’accès à la partie administration, utiliser les groupes SharePoint ("Propriétaires", "Membres", etc.) et adapter les composants de l’application si nécessaire.

## 8. Mises à jour ultérieures
1. L’équipe projet fournit un nouveau `.sppkg`.
2. Remplacer l’ancienne version dans l’App Catalog (même nom de package recommandé).
3. SharePoint proposera automatiquement une **mise à jour** sur les sites qui utilisent déjà la Web Part.
4. Après la mise à jour, vérifier de nouveau le fonctionnement général.

## 9. Support & contact
- En cas d’erreur lors de l’installation :
  - Consulter la page **Troubleshooting** du README.
  - Vérifier les logs SharePoint (ULS) ou la console du navigateur.
- Contacter l’équipe projet CIPREL : `support@ciprel.ci`.

---
Document préparé pour l’administrateur SharePoint client. Mise à jour : 2024-06-XX.
