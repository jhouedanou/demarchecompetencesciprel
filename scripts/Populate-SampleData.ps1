# Populate SharePoint Lists with Sample Data for Démarche Compétence CIPREL

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$Username,
    
    [Parameter(Mandatory=$false)]
    [string]$Password
)

Import-Module PnP.PowerShell

try {
    # Connect to SharePoint
    if ($Username -and $Password) {
        $securePassword = ConvertTo-SecureString $Password -AsPlainText -Force
        $credential = New-Object System.Management.Automation.PSCredential($Username, $securePassword)
        Connect-PnPOnline -Url $SiteUrl -Credentials $credential
    } else {
        Connect-PnPOnline -Url $SiteUrl -Interactive
    }

    Write-Host "Connected to SharePoint site: $SiteUrl" -ForegroundColor Green

    # Sample data for Quiz_Introduction
    Write-Host "Adding sample data to Quiz_Introduction..." -ForegroundColor Yellow
    
    $introQuestions = @(
        @{
            Title = "Question 1"
            Question = "Qu'est-ce que la démarche compétence ?"
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
        },
        @{
            Title = "Question 4"
            Question = "Une compétence se compose de :"
            Options = '["Savoir uniquement", "Savoir-faire uniquement", "Savoir, Savoir-faire, Savoir-être", "Formation académique"]'
            CorrectAnswer = "Savoir, Savoir-faire, Savoir-être"
            Category = "Compétences"
            Points = 2
            Order = 4
        },
        @{
            Title = "Question 5"
            Question = "L'objectif principal de la démarche compétence est :"
            Options = '["Réduire les salaires", "Améliorer la performance et l\'évolution professionnelle", "Identifier les faiblesses", "Contrôler les employés"]'
            CorrectAnswer = "Améliorer la performance et l'évolution professionnelle"
            Category = "Définition"
            Points = 2
            Order = 5
        }
    )

    foreach ($question in $introQuestions) {
        $existingItem = Get-PnPListItem -List "Quiz_Introduction" -Query "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>$($question.Title)</Value></Eq></Where></Query></View>" -ErrorAction SilentlyContinue
        if (-not $existingItem) {
            Add-PnPListItem -List "Quiz_Introduction" -Values $question
            Write-Host "Added: $($question.Title)" -ForegroundColor Green
        }
    }

    # Sample data for Quiz_Sondage
    Write-Host "Adding sample data to Quiz_Sondage..." -ForegroundColor Yellow
    
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
        },
        @{
            Title = "Satisfaction 3"
            Question = "Quels aspects aimeriez-vous voir améliorés ?"
            QuestionType = "Text"
            Options = '[]'
            Required = $false
            Order = 3
        },
        @{
            Title = "Satisfaction 4"
            Question = "Recommanderiez-vous cette démarche à un collègue ?"
            QuestionType = "Multiple Choice"
            Options = '["Certainement", "Probablement", "Probablement pas", "Certainement pas"]'
            Required = $true
            Order = 4
        }
    )

    foreach ($question in $sondageQuestions) {
        $existingItem = Get-PnPListItem -List "Quiz_Sondage" -Query "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>$($question.Title)</Value></Eq></Where></Query></View>" -ErrorAction SilentlyContinue
        if (-not $existingItem) {
            Add-PnPListItem -List "Quiz_Sondage" -Values $question
            Write-Host "Added: $($question.Title)" -ForegroundColor Green
        }
    }

    Write-Host "`nSample data has been added successfully!" -ForegroundColor Green

} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
} finally {
    Disconnect-PnPOnline
}