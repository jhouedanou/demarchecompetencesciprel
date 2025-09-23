# Script de Déploiement Rapide pour Démonstration Client
# Démarche Compétence CIPREL

param(
    [Parameter(Mandatory=$true)]
    [string]$TenantUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$SiteName = "demo-competences",
    
    [Parameter(Mandatory=$false)]
    [string]$AdminEmail,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipSiteCreation
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Déploiement Rapide - Démarche Compétence CIPREL" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Variables
$siteUrl = "$TenantUrl/sites/$SiteName"
$appCatalogUrl = "$TenantUrl-admin.sharepoint.com/sites/appcatalog"
$packagePath = ".\sharepoint\solution\demarche-competence-ciprel.sppkg"

try {
    # Vérification des prérequis
    Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Yellow
    
    if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
        Write-Host "Installation du module PnP.PowerShell..." -ForegroundColor Yellow
        Install-Module -Name PnP.PowerShell -Force -AllowClobber
    }
    
    if (-not (Test-Path $packagePath)) {
        Write-Host "❌ Package SPFx non trouvé. Exécution du build..." -ForegroundColor Red
        
        # Build du package
        Write-Host "🔨 Build du package SPFx..." -ForegroundColor Yellow
        npm run clean
        npm run package-solution
        
        if (-not (Test-Path $packagePath)) {
            throw "Échec du build du package SPFx"
        }
    }

    # Étape 1: Création du site de démonstration
    if (-not $SkipSiteCreation) {
        Write-Host "🏗️ Étape 1/6: Création du site de démonstration..." -ForegroundColor Cyan
        
        Connect-PnPOnline -Url $TenantUrl -Interactive
        
        $existingSite = Get-PnPTenantSite -Url $siteUrl -ErrorAction SilentlyContinue
        if (-not $existingSite) {
            Write-Host "Création du site: $siteUrl" -ForegroundColor Yellow
            New-PnPSite -Type TeamSite -Title "Démo Démarche Compétence CIPREL" -Alias $SiteName -Description "Site de démonstration pour l'application de démarche compétence"
            
            # Attendre que le site soit prêt
            do {
                Start-Sleep -Seconds 5
                $siteReady = Get-PnPTenantSite -Url $siteUrl -ErrorAction SilentlyContinue
                Write-Host "Attente de la création du site..." -ForegroundColor Yellow
            } while (-not $siteReady)
        } else {
            Write-Host "Site existant trouvé: $siteUrl" -ForegroundColor Green
        }
    }

    # Étape 2: Connexion au site et création des listes
    Write-Host "📋 Étape 2/6: Création des listes SharePoint..." -ForegroundColor Cyan
    
    Connect-PnPOnline -Url $siteUrl -Interactive
    
    # Listes à créer
    $lists = @(
        @{
            Name = "Quiz_Introduction"
            Description = "Questions du quiz d'introduction à la démarche compétence"
            Fields = @(
                @{Name="Question"; Type="Note"; DisplayName="Question"},
                @{Name="Options"; Type="Note"; DisplayName="Options"},
                @{Name="CorrectAnswer"; Type="Text"; DisplayName="Bonne Réponse"},
                @{Name="Category"; Type="Choice"; DisplayName="Catégorie"; Choices=@("Définition", "Responsabilité", "Compétences", "Étapes")},
                @{Name="Points"; Type="Number"; DisplayName="Points"},
                @{Name="Order"; Type="Number"; DisplayName="Ordre"}
            )
        },
        @{
            Name = "Quiz_Sondage"
            Description = "Questions du sondage de satisfaction"
            Fields = @(
                @{Name="Question"; Type="Note"; DisplayName="Question"},
                @{Name="QuestionType"; Type="Choice"; DisplayName="Type de Question"; Choices=@("Multiple Choice", "Text", "Rating")},
                @{Name="Options"; Type="Note"; DisplayName="Options"},
                @{Name="Required"; Type="Boolean"; DisplayName="Obligatoire"},
                @{Name="Order"; Type="Number"; DisplayName="Ordre"}
            )
        },
        @{
            Name = "Quiz_Results"
            Description = "Résultats des quiz et sondages"
            Fields = @(
                @{Name="User"; Type="User"; DisplayName="Utilisateur"},
                @{Name="QuizType"; Type="Choice"; DisplayName="Type de Quiz"; Choices=@("Introduction", "Sondage")},
                @{Name="Responses"; Type="Note"; DisplayName="Réponses"},
                @{Name="Score"; Type="Number"; DisplayName="Score"},
                @{Name="CompletionDate"; Type="DateTime"; DisplayName="Date de Completion"},
                @{Name="Duration"; Type="Number"; DisplayName="Durée"},
                @{Name="Status"; Type="Choice"; DisplayName="Statut"; Choices=@("Completed", "In Progress", "Abandoned")}
            )
        },
        @{
            Name = "User_Progress"
            Description = "Suivi des progrès des utilisateurs"
            Fields = @(
                @{Name="User"; Type="User"; DisplayName="Utilisateur"},
                @{Name="CompetenceArea"; Type="Choice"; DisplayName="Domaine de Compétence"; Choices=@("Leadership", "Communication", "Technique", "Management", "Innovation", "Qualité")},
                @{Name="CurrentLevel"; Type="Number"; DisplayName="Niveau Actuel"},
                @{Name="TargetLevel"; Type="Number"; DisplayName="Niveau Cible"},
                @{Name="LastAssessment"; Type="DateTime"; DisplayName="Dernière Évaluation"},
                @{Name="NextAssessment"; Type="DateTime"; DisplayName="Prochaine Évaluation"},
                @{Name="Progress"; Type="Number"; DisplayName="Progrès"}
            )
        }
    )

    foreach ($listConfig in $lists) {
        $existingList = Get-PnPList -Identity $listConfig.Name -ErrorAction SilentlyContinue
        if (-not $existingList) {
            Write-Host "Création de la liste: $($listConfig.Name)" -ForegroundColor Yellow
            $list = New-PnPList -Title $listConfig.Name -Template GenericList -Description $listConfig.Description
            
            # Ajouter les champs
            foreach ($field in $listConfig.Fields) {
                try {
                    switch ($field.Type) {
                        "Note" { Add-PnPField -List $listConfig.Name -DisplayName $field.DisplayName -InternalName $field.Name -Type $field.Type -AddToDefaultView }
                        "Text" { Add-PnPField -List $listConfig.Name -DisplayName $field.DisplayName -InternalName $field.Name -Type $field.Type -AddToDefaultView }
                        "Number" { Add-PnPField -List $listConfig.Name -DisplayName $field.DisplayName -InternalName $field.Name -Type $field.Type -AddToDefaultView }
                        "Boolean" { Add-PnPField -List $listConfig.Name -DisplayName $field.DisplayName -InternalName $field.Name -Type $field.Type -AddToDefaultView }
                        "DateTime" { Add-PnPField -List $listConfig.Name -DisplayName $field.DisplayName -InternalName $field.Name -Type $field.Type -AddToDefaultView }
                        "User" { Add-PnPField -List $listConfig.Name -DisplayName $field.DisplayName -InternalName $field.Name -Type $field.Type -AddToDefaultView }
                        "Choice" { 
                            $choicesXml = "<Field Type='Choice' DisplayName='$($field.DisplayName)' Name='$($field.Name)'><CHOICES>"
                            foreach ($choice in $field.Choices) {
                                $choicesXml += "<CHOICE>$choice</CHOICE>"
                            }
                            $choicesXml += "</CHOICES></Field>"
                            Add-PnPFieldFromXml -List $listConfig.Name -FieldXml $choicesXml -AddToDefaultView
                        }
                    }
                } catch {
                    Write-Warning "Champ $($field.Name) déjà existant ou erreur: $_"
                }
            }
        } else {
            Write-Host "Liste existante: $($listConfig.Name)" -ForegroundColor Green
        }
    }

    # Étape 3: Données de démonstration
    Write-Host "💾 Étape 3/6: Ajout des données de démonstration..." -ForegroundColor Cyan
    
    # Questions quiz introduction
    $introQuestions = @(
        @{
            Title = "Question 1"
            Question = "Qu'est-ce que la démarche compétence chez CIPREL ?"
            Options = '["Un moyen de retenir les talents", "Un outil de sanction", "Un processus de licenciement", "Une méthode de recrutement"]'
            CorrectAnswer = "Un moyen de retenir les talents"
            Category = "Définition"
            Points = 1
            Order = 1
        },
        @{
            Title = "Question 2"
            Question = "Qui est responsable de la mise en œuvre de la démarche compétence ?"
            Options = '["Les RH uniquement", "Le manager et l\'employé", "La direction générale", "Les syndicats"]'
            CorrectAnswer = "Le manager et l'employé"
            Category = "Responsabilité"
            Points = 1
            Order = 2
        },
        @{
            Title = "Question 3"
            Question = "Quelles sont les étapes principales de la démarche compétence ?"
            Options = '["Évaluation, Formation, Sanction", "Identification, Évaluation, Développement, Validation", "Recrutement, Formation, Promotion", "Observation, Notation, Mutation"]'
            CorrectAnswer = "Identification, Évaluation, Développement, Validation"
            Category = "Étapes"
            Points = 2
            Order = 3
        }
    )

    foreach ($question in $introQuestions) {
        $existingItem = Get-PnPListItem -List "Quiz_Introduction" -Query "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>$($question.Title)</Value></Eq></Where></Query></View>" -ErrorAction SilentlyContinue
        if (-not $existingItem) {
            Add-PnPListItem -List "Quiz_Introduction" -Values $question | Out-Null
            Write-Host "Question ajoutée: $($question.Title)" -ForegroundColor Green
        }
    }

    # Questions sondage
    $sondageQuestions = @(
        @{
            Title = "Satisfaction 1"
            Question = "Comment évaluez-vous la clarté des informations présentées ?"
            QuestionType = "Rating"
            Options = '["1", "2", "3", "4", "5"]'
            Required = $true
            Order = 1
        },
        @{
            Title = "Satisfaction 2"
            Question = "Cette formation répond-elle à vos attentes ?"
            QuestionType = "Multiple Choice"
            Options = '["Complètement", "Partiellement", "Pas du tout", "Je ne sais pas"]'
            Required = $true
            Order = 2
        }
    )

    foreach ($question in $sondageQuestions) {
        $existingItem = Get-PnPListItem -List "Quiz_Sondage" -Query "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>$($question.Title)</Value></Eq></Where></Query></View>" -ErrorAction SilentlyContinue
        if (-not $existingItem) {
            Add-PnPListItem -List "Quiz_Sondage" -Values $question | Out-Null
            Write-Host "Question sondage ajoutée: $($question.Title)" -ForegroundColor Green
        }
    }

    # Étape 4: Déploiement de l'application
    Write-Host "📦 Étape 4/6: Déploiement de l'application SPFx..." -ForegroundColor Cyan
    
    # Connexion à l'App Catalog
    Connect-PnPOnline -Url $appCatalogUrl -Interactive
    
    # Upload du package
    Write-Host "Upload du package vers l'App Catalog..." -ForegroundColor Yellow
    $app = Add-PnPApp -Path $packagePath -Overwrite
    
    # Déploiement tenant-wide
    Write-Host "Déploiement tenant-wide..." -ForegroundColor Yellow
    Publish-PnPApp -Identity $app.Id -SkipFeatureDeployment
    
    # Retour au site de démo pour installation
    Connect-PnPOnline -Url $siteUrl -Interactive
    
    # Installation de l'app
    Write-Host "Installation de l'app sur le site de démo..." -ForegroundColor Yellow
    Install-PnPApp -Identity "demarche-competence-ciprel"

    # Étape 5: Création de la page de démonstration
    Write-Host "📄 Étape 5/6: Création de la page de démonstration..." -ForegroundColor Cyan
    
    $pageName = "Demo-Competences"
    $existingPage = Get-PnPClientSidePage -Identity $pageName -ErrorAction SilentlyContinue
    if (-not $existingPage) {
        Write-Host "Création de la page de démo..." -ForegroundColor Yellow
        $page = Add-PnPClientSidePage -Name $pageName -LayoutType Article -Title "Démonstration Démarche Compétence CIPREL"
        
        # Ajout du WebPart
        Add-PnPClientSideWebPart -Page $page -DefaultWebPartType "DemarcheCompetence" -Section 1 -Column 1
        
        # Publication de la page
        Set-PnPClientSidePage -Identity $page -Publish
        
        Write-Host "Page de démo créée et publiée" -ForegroundColor Green
    } else {
        Write-Host "Page de démo existante trouvée" -ForegroundColor Green
    }

    # Étape 6: Configuration des permissions
    Write-Host "🔒 Étape 6/6: Configuration des permissions..." -ForegroundColor Cyan
    
    $lists = @("Quiz_Introduction", "Quiz_Sondage", "Quiz_Results", "User_Progress")
    foreach ($listName in $lists) {
        try {
            # Permissions lecture pour tous les membres du site
            Set-PnPListPermission -Identity $listName -Group "Membres" -AddRole "Lecture" -ErrorAction SilentlyContinue
            
            # Permissions contribution pour Quiz_Results et User_Progress
            if ($listName -in @("Quiz_Results", "User_Progress")) {
                Set-PnPListPermission -Identity $listName -Group "Membres" -AddRole "Contribution" -ErrorAction SilentlyContinue
            }
            
            Write-Host "Permissions configurées pour: $listName" -ForegroundColor Green
        } catch {
            Write-Warning "Erreur de configuration des permissions pour $listName : $_"
        }
    }

    # Résultats du déploiement
    Write-Host ""
    Write-Host "✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Site de démonstration: $siteUrl" -ForegroundColor Cyan
    Write-Host "📄 Page de démo: $siteUrl/SitePages/$pageName.aspx" -ForegroundColor Cyan
    Write-Host "⚙️ Workbench: $siteUrl/_layouts/15/workbench.aspx" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Listes créées:" -ForegroundColor Yellow
    Write-Host "   - Quiz_Introduction (avec 3 questions de démo)" -ForegroundColor White
    Write-Host "   - Quiz_Sondage (avec 2 questions de démo)" -ForegroundColor White
    Write-Host "   - Quiz_Results (vide, prêt pour les résultats)" -ForegroundColor White
    Write-Host "   - User_Progress (vide, prêt pour le suivi)" -ForegroundColor White
    Write-Host ""
    Write-Host "🎨 Thème CIPREL appliqué avec palette de couleurs:" -ForegroundColor Yellow
    Write-Host "   - Tangerine (#ED7E05) - Couleur primaire" -ForegroundColor White
    Write-Host "   - Forest Green (#0D9330) - Couleur secondaire" -ForegroundColor White
    Write-Host "   - Isabelline (#F3EEE7) - Arrière-plans" -ForegroundColor White
    Write-Host "   - Seasalt (#F6F7F8) - Surfaces" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 L'application est prête pour la démonstration !" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "❌ ERREUR LORS DU DÉPLOIEMENT" -ForegroundColor Red
    Write-Host "=============================" -ForegroundColor Red
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Solutions possibles:" -ForegroundColor Yellow
    Write-Host "1. Vérifiez vos permissions d'administrateur SharePoint" -ForegroundColor White
    Write-Host "2. Assurez-vous que l'App Catalog est accessible" -ForegroundColor White
    Write-Host "3. Relancez le script avec des paramètres différents" -ForegroundColor White
    Write-Host "4. Contactez le support: support@ciprel.ci" -ForegroundColor White
    
    exit 1
}

Write-Host "Fin du script de déploiement rapide" -ForegroundColor Gray