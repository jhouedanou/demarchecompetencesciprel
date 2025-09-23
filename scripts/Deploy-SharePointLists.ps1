# Deploy SharePoint Lists for Démarche Compétence CIPREL
# This script creates the required SharePoint lists for the competence management application

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$Username,
    
    [Parameter(Mandatory=$false)]
    [string]$Password
)

# Import required modules
if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
    Write-Host "Installing PnP.PowerShell module..." -ForegroundColor Yellow
    Install-Module -Name PnP.PowerShell -Force -AllowClobber
}

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

    # Create Quiz_Introduction List
    Write-Host "Creating Quiz_Introduction list..." -ForegroundColor Yellow
    
    $quizIntroList = Get-PnPList -Identity "Quiz_Introduction" -ErrorAction SilentlyContinue
    if (-not $quizIntroList) {
        New-PnPList -Title "Quiz_Introduction" -Template GenericList -Description "Liste des questions pour le quiz d'introduction à la démarche compétence"
        
        # Add fields to Quiz_Introduction
        Add-PnPField -List "Quiz_Introduction" -DisplayName "Question" -InternalName "Question" -Type Note -AddToDefaultView
        Add-PnPField -List "Quiz_Introduction" -DisplayName "Options" -InternalName "Options" -Type Note -AddToDefaultView
        Add-PnPField -List "Quiz_Introduction" -DisplayName "CorrectAnswer" -InternalName "CorrectAnswer" -Type Text -AddToDefaultView
        Add-PnPField -List "Quiz_Introduction" -DisplayName "Category" -InternalName "Category" -Type Choice -Choices @("Définition", "Responsabilité", "Compétences", "Étapes") -AddToDefaultView
        Add-PnPField -List "Quiz_Introduction" -DisplayName "Points" -InternalName "Points" -Type Number -AddToDefaultView
        Add-PnPField -List "Quiz_Introduction" -DisplayName "Order" -InternalName "Order" -Type Number -AddToDefaultView
        
        Write-Host "Quiz_Introduction list created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Quiz_Introduction list already exists, skipping..." -ForegroundColor Yellow
    }

    # Create Quiz_Sondage List
    Write-Host "Creating Quiz_Sondage list..." -ForegroundColor Yellow
    
    $quizSondageList = Get-PnPList -Identity "Quiz_Sondage" -ErrorAction SilentlyContinue
    if (-not $quizSondageList) {
        New-PnPList -Title "Quiz_Sondage" -Template GenericList -Description "Liste des questions pour le sondage de satisfaction"
        
        # Add fields to Quiz_Sondage
        Add-PnPField -List "Quiz_Sondage" -DisplayName "Question" -InternalName "Question" -Type Note -AddToDefaultView
        Add-PnPField -List "Quiz_Sondage" -DisplayName "QuestionType" -InternalName "QuestionType" -Type Choice -Choices @("Multiple Choice", "Text", "Rating") -AddToDefaultView
        Add-PnPField -List "Quiz_Sondage" -DisplayName "Options" -InternalName "Options" -Type Note -AddToDefaultView
        Add-PnPField -List "Quiz_Sondage" -DisplayName "Required" -InternalName "Required" -Type Boolean -AddToDefaultView
        Add-PnPField -List "Quiz_Sondage" -DisplayName "Order" -InternalName "Order" -Type Number -AddToDefaultView
        
        Write-Host "Quiz_Sondage list created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Quiz_Sondage list already exists, skipping..." -ForegroundColor Yellow
    }

    # Create Quiz_Results List
    Write-Host "Creating Quiz_Results list..." -ForegroundColor Yellow
    
    $quizResultsList = Get-PnPList -Identity "Quiz_Results" -ErrorAction SilentlyContinue
    if (-not $quizResultsList) {
        New-PnPList -Title "Quiz_Results" -Template GenericList -Description "Résultats des quiz et sondages"
        
        # Add fields to Quiz_Results
        Add-PnPField -List "Quiz_Results" -DisplayName "User" -InternalName "User" -Type User -AddToDefaultView
        Add-PnPField -List "Quiz_Results" -DisplayName "QuizType" -InternalName "QuizType" -Type Choice -Choices @("Introduction", "Sondage") -AddToDefaultView
        Add-PnPField -List "Quiz_Results" -DisplayName "Responses" -InternalName "Responses" -Type Note -AddToDefaultView
        Add-PnPField -List "Quiz_Results" -DisplayName "Score" -InternalName "Score" -Type Number -AddToDefaultView
        Add-PnPField -List "Quiz_Results" -DisplayName "CompletionDate" -InternalName "CompletionDate" -Type DateTime -AddToDefaultView
        Add-PnPField -List "Quiz_Results" -DisplayName "Duration" -InternalName "Duration" -Type Number -AddToDefaultView
        Add-PnPField -List "Quiz_Results" -DisplayName "Status" -InternalName "Status" -Type Choice -Choices @("Completed", "In Progress", "Abandoned") -AddToDefaultView
        
        Write-Host "Quiz_Results list created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Quiz_Results list already exists, skipping..." -ForegroundColor Yellow
    }

    # Create User_Progress List
    Write-Host "Creating User_Progress list..." -ForegroundColor Yellow
    
    $userProgressList = Get-PnPList -Identity "User_Progress" -ErrorAction SilentlyContinue
    if (-not $userProgressList) {
        New-PnPList -Title "User_Progress" -Template GenericList -Description "Suivi des progrès des utilisateurs dans la démarche compétence"
        
        # Add fields to User_Progress
        Add-PnPField -List "User_Progress" -DisplayName "User" -InternalName "User" -Type User -AddToDefaultView
        Add-PnPField -List "User_Progress" -DisplayName "CompetenceArea" -InternalName "CompetenceArea" -Type Choice -Choices @("Leadership", "Communication", "Technique", "Management", "Innovation", "Qualité") -AddToDefaultView
        Add-PnPField -List "User_Progress" -DisplayName "CurrentLevel" -InternalName "CurrentLevel" -Type Number -AddToDefaultView
        Add-PnPField -List "User_Progress" -DisplayName "TargetLevel" -InternalName "TargetLevel" -Type Number -AddToDefaultView
        Add-PnPField -List "User_Progress" -DisplayName "LastAssessment" -InternalName "LastAssessment" -Type DateTime -AddToDefaultView
        Add-PnPField -List "User_Progress" -DisplayName "NextAssessment" -InternalName "NextAssessment" -Type DateTime -AddToDefaultView
        Add-PnPField -List "User_Progress" -DisplayName "Progress" -InternalName "Progress" -Type Number -AddToDefaultView
        
        Write-Host "User_Progress list created successfully!" -ForegroundColor Green
    } else {
        Write-Host "User_Progress list already exists, skipping..." -ForegroundColor Yellow
    }

    Write-Host "`nAll SharePoint lists have been created successfully!" -ForegroundColor Green
    Write-Host "You can now deploy the SPFx solution to use these lists." -ForegroundColor Blue

} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
} finally {
    # Disconnect from SharePoint
    Disconnect-PnPOnline
}