# ============================================================================
# Script de démarrage rapide - Démarche Compétences CIPREL
# ============================================================================

param(
    [Parameter(Mandatory=$true, HelpMessage="URL du site SharePoint (ex: https://contoso.sharepoint.com/sites/monsite)")]
    [string]$SiteUrl
)

Write-Host ""
Write-Host "🚀 DÉMARRAGE RAPIDE - DÉMARCHE COMPÉTENCES CIPREL" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifications préalables
Write-Host "🔍 Vérifications préalables..." -ForegroundColor Yellow

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Error "❌ Node.js n'est pas installé. Téléchargez-le depuis https://nodejs.org"
    exit 1
}

# Vérifier npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Error "❌ npm n'est pas disponible"
    exit 1
}

# Vérifier gulp
try {
    $gulpVersion = gulp --version 2>$null
    if ($gulpVersion) {
        Write-Host "✅ gulp: installé" -ForegroundColor Green
    } else {
        Write-Host "⚠️ gulp non installé globalement - installation..." -ForegroundColor Yellow
        npm install -g gulp-cli
    }
} catch {
    Write-Host "⚠️ gulp non installé globalement - installation..." -ForegroundColor Yellow
    npm install -g gulp-cli
}

# Vérifier PnP PowerShell
try {
    $pnpVersion = Get-Module -Name PnP.PowerShell -ListAvailable | Select-Object -First 1
    if ($pnpVersion) {
        Write-Host "✅ PnP PowerShell: v$($pnpVersion.Version)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ PnP PowerShell non installé - installation..." -ForegroundColor Yellow
        Install-Module -Name PnP.PowerShell -Force -Scope CurrentUser
    }
} catch {
    Write-Host "⚠️ PnP PowerShell non installé - installation..." -ForegroundColor Yellow
    Install-Module -Name PnP.PowerShell -Force -Scope CurrentUser
}

Write-Host ""
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🔨 Build et déploiement..." -ForegroundColor Yellow

# Exécuter le script de déploiement complet
$deployScript = Join-Path $PSScriptRoot "deploy.ps1"

if (Test-Path $deployScript) {
    & $deployScript -SiteUrl $SiteUrl -LoadTestData
} else {
    Write-Error "❌ Script de déploiement non trouvé: $deployScript"
    exit 1
}

Write-Host ""
Write-Host "🎉 INSTALLATION TERMINÉE!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Accédez à votre site SharePoint: $SiteUrl" -ForegroundColor White
Write-Host "2. Créez une nouvelle page ou modifiez une page existante" -ForegroundColor White
Write-Host "3. Ajoutez le WebPart 'Démarche Compétences'" -ForegroundColor White
Write-Host "4. Configurez les permissions si nécessaire" -ForegroundColor White
Write-Host ""
Write-Host "💡 Conseils:" -ForegroundColor Yellow
Write-Host "- Les listes SharePoint sont créées automatiquement" -ForegroundColor Gray
Write-Host "- Les questions par défaut sont pré-chargées" -ForegroundColor Gray
Write-Host "- Le tableau de bord est accessible aux managers" -ForegroundColor Gray
Write-Host ""

Write-Host "Merci d'utiliser la solution Démarche Compétences CIPREL! 🙏" -ForegroundColor Green
