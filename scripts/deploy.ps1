# ============================================================================
# Script de déploiement automatique pour la solution Démarche Compétences CIPREL
# ============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$AppCatalogUrl = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$LoadTestData = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force = $false
)

# Configuration
$SolutionName = "demarchecompetencesciprel"
$PackageName = "$SolutionName.sppkg"
$PackagePath = "./solution/$PackageName"

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "DÉPLOIEMENT SOLUTION DÉMARCHE COMPÉTENCES CIPREL" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "Site cible: $SiteUrl" -ForegroundColor Yellow
Write-Host "Package: $PackageName" -ForegroundColor Yellow
Write-Host ""

# Étape 1: Build de la solution
if (-not $SkipBuild) {
    Write-Host "🔨 Étape 1: Build de la solution..." -ForegroundColor Green
    
    Write-Host "  - Nettoyage des fichiers de build précédents..."
    npm run clean
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Erreur lors du nettoyage"
        exit 1
    }
    
    Write-Host "  - Build et bundle de la solution..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Erreur lors du build"
        exit 1
    }
    
    Write-Host "  - Création du bundle de production..."
    gulp bundle --ship
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Erreur lors du bundle"
        exit 1
    }
    
    Write-Host "  - Création du package solution..."
    gulp package-solution --ship
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Erreur lors de la création du package"
        exit 1
    }
    
    Write-Host "✅ Build terminé avec succès" -ForegroundColor Green
} else {
    Write-Host "⏭️ Étape 1: Build ignoré (--SkipBuild)" -ForegroundColor Yellow
}

# Vérification de l'existence du package
if (-not (Test-Path $PackagePath)) {
    Write-Error "❌ Le package $PackagePath n'existe pas. Exécutez le build d'abord."
    exit 1
}

# Étape 2: Connexion à SharePoint
Write-Host ""
Write-Host "🔗 Étape 2: Connexion à SharePoint..." -ForegroundColor Green

try {
    Connect-PnPOnline -Url $SiteUrl -Interactive
    Write-Host "✅ Connexion établie" -ForegroundColor Green
} catch {
    Write-Error "❌ Impossible de se connecter à SharePoint: $_"
    exit 1
}

# Étape 3: Détermination de l'App Catalog
Write-Host ""
Write-Host "📦 Étape 3: Configuration App Catalog..." -ForegroundColor Green

$appCatalog = $AppCatalogUrl
if ([string]::IsNullOrEmpty($appCatalog)) {
    Write-Host "  - Détection automatique de l'App Catalog..."
    try {
        $tenant = Get-PnPTenant
        $appCatalog = $tenant.CorporateCatalogUrl
        if ([string]::IsNullOrEmpty($appCatalog)) {
            Write-Error "❌ Aucun App Catalog trouvé. Veuillez spécifier -AppCatalogUrl"
            exit 1
        }
    } catch {
        Write-Warning "⚠️ Impossible de détecter l'App Catalog automatiquement"
        Write-Host "💡 Utilisation du site courant comme App Catalog"
        $appCatalog = $SiteUrl
    }
}

Write-Host "  - App Catalog: $appCatalog" -ForegroundColor Yellow

# Étape 4: Upload et déploiement du package
Write-Host ""
Write-Host "📤 Étape 4: Upload et déploiement..." -ForegroundColor Green

try {
    Write-Host "  - Connexion à l'App Catalog..."
    Connect-PnPOnline -Url $appCatalog -Interactive
    
    Write-Host "  - Upload du package solution..."
    $uploadResult = Add-PnPApp -Path $PackagePath -Overwrite:$Force
    
    if ($uploadResult) {
        Write-Host "  - Installation de l'application..."
        Install-PnPApp -Identity $uploadResult.Id -Wait
        
        Write-Host "✅ Package déployé avec succès" -ForegroundColor Green
    } else {
        Write-Error "❌ Erreur lors de l'upload du package"
        exit 1
    }
} catch {
    Write-Error "❌ Erreur lors du déploiement: $_"
    exit 1
}

# Étape 5: Installation sur le site cible
Write-Host ""
Write-Host "🎯 Étape 5: Installation sur le site cible..." -ForegroundColor Green

try {
    Write-Host "  - Reconnexion au site cible..."
    Connect-PnPOnline -Url $SiteUrl -Interactive
    
    Write-Host "  - Installation de l'application sur le site..."
    $apps = Get-PnPApp | Where-Object { $_.Title -like "*$SolutionName*" }
    
    if ($apps.Count -gt 0) {
        $app = $apps[0]
        Install-PnPApp -Identity $app.Id -Wait
        Write-Host "✅ Application installée sur le site" -ForegroundColor Green
    } else {
        Write-Error "❌ Application non trouvée dans l'App Catalog"
        exit 1
    }
} catch {
    Write-Error "❌ Erreur lors de l'installation: $_"
    exit 1
}

# Étape 6: Vérification des listes
Write-Host ""
Write-Host "📋 Étape 6: Vérification des listes SharePoint..." -ForegroundColor Green

$requiredLists = @("CompetenceQuestions", "CompetenceResults", "SondageResponses")
$createdLists = @()

foreach ($listName in $requiredLists) {
    try {
        $list = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
        if ($list) {
            Write-Host "  ✅ Liste '$listName' trouvée" -ForegroundColor Green
            $createdLists += $listName
        } else {
            Write-Host "  ⚠️ Liste '$listName' non trouvée - sera créée automatiquement" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ⚠️ Liste '$listName' non trouvée - sera créée automatiquement" -ForegroundColor Yellow
    }
}

# Étape 7: Chargement des données de test (optionnel)
if ($LoadTestData) {
    Write-Host ""
    Write-Host "🧪 Étape 7: Chargement des données de test..." -ForegroundColor Green
    
    # Questions par défaut
    $defaultQuestions = @(
        @{
            Title = "Question 1 - Définition"
            Question = "La démarche compétence c'est :"
            OptionA = "Un processus d'évaluation annuel des employés"
            OptionB = "Un système de gestion intégrée des compétences pour le développement personnel et organisationnel"
            OptionC = "Un programme de formation obligatoire"
            CorrectAnswer = "B"
            Category = "Definition"
            Points = 10
            QuizType = "Introduction"
        },
        @{
            Title = "Question 2 - Responsabilité"
            Question = "La démarche compétence est la responsabilité de :"
            OptionA = "Uniquement les Ressources Humaines"
            OptionB = "Seulement les managers"
            OptionC = "Tous les collaborateurs de l'organisation"
            CorrectAnswer = "C"
            Category = "Responsabilite"
            Points = 10
            QuizType = "Introduction"
        },
        @{
            Title = "Question 3 - Types de compétences"
            Question = "Les compétences sont essentiellement :"
            OptionA = "Uniquement techniques"
            OptionB = "Techniques, comportementales et fondamentales"
            OptionC = "Seulement liées à l'expérience"
            CorrectAnswer = "B"
            Category = "Competences"
            Points = 10
            QuizType = "Introduction"
        },
        @{
            Title = "Question 4 - Savoir-faire"
            Question = "Le savoir-faire c'est :"
            OptionA = "Les connaissances théoriques"
            OptionB = "La capacité à assurer des tâches techniques et/ou managériales"
            OptionC = "L'expérience professionnelle"
            CorrectAnswer = "B"
            Category = "Competences"
            Points = 10
            QuizType = "Introduction"
        },
        @{
            Title = "Question 5 - Savoir-être"
            Question = "Le savoir-être c'est :"
            OptionA = "Les capacités cognitives et relationnelles"
            OptionB = "Les diplômes obtenus"
            OptionC = "Les années d'expérience"
            CorrectAnswer = "A"
            Category = "Competences"
            Points = 10
            QuizType = "Introduction"
        },
        @{
            Title = "Question 6 - Étapes"
            Question = "Quelles sont les principales étapes de la démarche compétence :"
            OptionA = "Évaluation, Formation, Certification"
            OptionB = "Auto-évaluation, Identification des besoins, Plan de développement, Mise en œuvre, Évaluation et ajustement"
            OptionC = "Recrutement, Formation, Évaluation"
            CorrectAnswer = "B"
            Category = "Etapes"
            Points = 15
            QuizType = "Introduction"
        },
        @{
            Title = "Question 7 - Bénéfices"
            Question = "Le principal bénéfice de la démarche compétence est :"
            OptionA = "Réduction des coûts de formation"
            OptionB = "Amélioration continue des performances individuelles et organisationnelles"
            OptionC = "Simplification des processus RH"
            CorrectAnswer = "B"
            Category = "Definition"
            Points = 15
            QuizType = "Introduction"
        }
    )
    
    try {
        Write-Host "  - Ajout des questions par défaut..."
        foreach ($question in $defaultQuestions) {
            try {
                Add-PnPListItem -List "CompetenceQuestions" -Values $question
                Write-Host "    ✅ Question ajoutée: $($question.Title)" -ForegroundColor Green
            } catch {
                Write-Host "    ⚠️ Question déjà existante ou erreur: $($question.Title)" -ForegroundColor Yellow
            }
        }
        
        Write-Host "✅ Données de test chargées" -ForegroundColor Green
    } catch {
        Write-Warning "⚠️ Erreur lors du chargement des données de test: $_"
    }
}

# Récapitulatif final
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Site: $SiteUrl" -ForegroundColor White
Write-Host "📦 Package: $PackageName" -ForegroundColor White
Write-Host "📋 Listes créées: $($createdLists -join ', ')" -ForegroundColor White

if ($LoadTestData) {
    Write-Host "🧪 Données de test: Chargées" -ForegroundColor White
}

Write-Host ""
Write-Host "🌐 Accédez à votre site SharePoint pour utiliser la solution" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Documentation et support:" -ForegroundColor Cyan
Write-Host "   - Ajoutez le WebPart à une page SharePoint" -ForegroundColor Gray
Write-Host "   - Les listes sont disponibles dans 'Contenu du site'" -ForegroundColor Gray
Write-Host "   - Les permissions sont gérées automatiquement" -ForegroundColor Gray
Write-Host ""

# Script de désinstallation (commenté)
<#
# Pour désinstaller la solution, utilisez ces commandes:
Write-Host "Pour désinstaller la solution:" -ForegroundColor Red
Write-Host "Uninstall-PnPApp -Identity '$SolutionName'" -ForegroundColor Red
Write-Host "Remove-PnPApp -Identity '$SolutionName'" -ForegroundColor Red
#>

Write-Host "Déploiement terminé à $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
