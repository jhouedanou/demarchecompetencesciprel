# Script de lancement automatique de l'environnement de développement
# Démarche Compétence CIPREL - SPFx + React + Docker
# Version PowerShell pour Windows

param(
    [switch]$SkipBrowser,
    [switch]$SkipLogs
)

# Fonction pour afficher les messages avec couleur
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Log-Info($message) {
    Write-ColorOutput Cyan "[INFO] $message"
}

function Log-Success($message) {
    Write-ColorOutput Green "[SUCCESS] $message"
}

function Log-Warning($message) {
    Write-ColorOutput Yellow "[WARNING] $message"
}

function Log-Error($message) {
    Write-ColorOutput Red "[ERROR] $message"
}

function Log-Step($message) {
    Write-ColorOutput Magenta "[STEP] $message"
}

# Bannière de démarrage
Write-ColorOutput Blue @"
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🚀 DÉMARCHE COMPÉTENCE CIPREL 🚀                         ║
║                      Environnement de Développement                          ║
║                         SPFx + React + Docker                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"@

# Vérification des prérequis
Log-Step "Vérification des prérequis..."

# Vérifier Docker
try {
    docker --version | Out-Null
} catch {
    Log-Error "Docker n'est pas installé. Veuillez installer Docker Desktop."
    exit 1
}

# Vérifier Docker Compose
try {
    docker-compose --version | Out-Null
} catch {
    Log-Error "Docker Compose n'est pas installé. Veuillez installer Docker Compose."
    exit 1
}

# Vérifier que Docker est en cours d'exécution
try {
    docker info | Out-Null
} catch {
    Log-Error "Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop."
    exit 1
}

Log-Success "Prérequis validés ✓"

# Nettoyer les conteneurs existants
Log-Step "Nettoyage des conteneurs existants..."
try {
    docker-compose down --remove-orphans 2>$null | Out-Null
} catch {
    # Ignorer les erreurs si aucun conteneur n'existe
}
Log-Success "Conteneurs nettoyés ✓"

# Construire et démarrer les conteneurs
Log-Step "Construction et démarrage des conteneurs Docker..."
Log-Info "Ceci peut prendre quelques minutes lors du premier lancement..."

try {
    docker-compose up -d --build
    Log-Success "Conteneurs démarrés avec succès ✓"
} catch {
    Log-Error "Erreur lors du démarrage des conteneurs"
    exit 1
}

# Attendre que les conteneurs soient prêts
Log-Step "Attente de la disponibilité des services..."

# Fonction pour attendre qu'un port soit disponible
function Wait-ForPort($host, $port, $service, $timeout = 60) {
    $count = 0
    while ($count -lt $timeout) {
        try {
            $connection = New-Object System.Net.Sockets.TcpClient($host, $port)
            $connection.Close()
            Log-Success "$service est disponible ✓"
            return $true
        } catch {
            Start-Sleep 1
            $count++
            if ($count % 10 -eq 0) {
                Log-Info "Attente de $service... (${count}s)"
            }
        }
    }
    Log-Error "Timeout: $service n'est pas disponible après ${timeout}s"
    return $false
}

# Attendre le workbench nginx
Wait-ForPort "localhost" 8080 "Workbench (nginx)"

# Vérifier et installer les dépendances SPFx
Log-Step "Vérification et installation des dépendances SPFx..."
try {
    docker-compose exec -T spfx-dev npm list gulp 2>$null | Out-Null
    Log-Success "Dépendances déjà installées ✓"
} catch {
    Log-Info "Installation des dépendances manquantes..."
    try {
        docker-compose exec -T spfx-dev npm install
        Log-Success "Dépendances installées ✓"
    } catch {
        Log-Error "Erreur lors de l'installation des dépendances"
        exit 1
    }
}

# Générer le certificat de développement SPFx
Log-Step "Génération du certificat de développement SPFx..."
try {
    docker-compose exec -T spfx-dev npx gulp trust-dev-cert 2>$null | Out-Null
    Log-Success "Certificat de développement généré ✓"
} catch {
    Log-Warning "Le certificat pourrait déjà exister ou être généré automatiquement"
}

# Effectuer un build initial pour s'assurer que tout compile
Log-Step "Build initial de l'application SPFx..."
Log-Info "Ceci peut prendre quelques minutes lors du premier build..."
try {
    docker-compose exec -T spfx-dev npx gulp bundle --no-color
    Log-Success "Build initial réussi ✓"
} catch {
    Log-Warning "Le build initial a échoué, mais le serveur de développement va essayer de corriger"
}

# Redémarrer le serveur de développement
Log-Step "Redémarrage du serveur de développement SPFx..."
docker-compose restart spfx-dev
Start-Sleep 10

# Attendre que SPFx soit prêt et vérifier qu'il fonctionne
Log-Step "Vérification du serveur de développement SPFx..."
Log-Info "Vérification que le serveur SPFx répond..."
for ($i = 1; $i -le 12; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4321" -TimeoutSec 5 -UseBasicParsing 2>$null
        Log-Success "Serveur SPFx opérationnel ✓"
        break
    } catch {
        if ($i -eq 12) {
            Log-Warning "Le serveur SPFx met du temps à démarrer, vérifiez les logs avec: docker-compose logs spfx-dev"
        } else {
            Log-Info "Attente du serveur SPFx... (tentative $i/12)"
            Start-Sleep 5
        }
    }
}

# Vérifier l'état des conteneurs
Log-Step "Vérification de l'état des services..."
$containers = docker-compose ps
if ($containers -match "Up") {
    Log-Success "Tous les services sont opérationnels ✓"
} else {
    Log-Warning "Certains services pourraient encore démarrer"
}

# Afficher les informations de connexion
Write-Host ""
Write-ColorOutput Green @"
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🎉 ENVIRONNEMENT PRÊT ! 🎉                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

Write-ColorOutput Blue "📋 Services disponibles :"
Write-Host ""
Write-Host "  🌐 " -NoNewline; Write-ColorOutput Yellow "Workbench Local     : http://localhost:8080"
Write-Host "  🔧 " -NoNewline; Write-ColorOutput Yellow "Serveur SPFx        : http://localhost:4321"
Write-Host "  📊 " -NoNewline; Write-ColorOutput Yellow "LiveReload          : http://localhost:35729"
Write-Host ""

Write-ColorOutput Blue "🛠️  Commandes utiles :"
Write-Host ""
Write-Host "  📋 Voir les logs        : " -NoNewline; Write-ColorOutput Yellow "docker-compose logs -f"
Write-Host "  📋 Logs SPFx seulement  : " -NoNewline; Write-ColorOutput Yellow "docker-compose logs -f spfx-dev"
Write-Host "  🔄 Redémarrer SPFx      : " -NoNewline; Write-ColorOutput Yellow "docker-compose restart spfx-dev"
Write-Host "  🛑 Arrêter tout         : " -NoNewline; Write-ColorOutput Yellow "docker-compose down"
Write-Host "  🧹 Nettoyer tout        : " -NoNewline; Write-ColorOutput Yellow "docker-compose down --volumes --remove-orphans"
Write-Host ""

Write-ColorOutput Blue "🔗 Développement SharePoint :"
Write-Host ""
Write-Host "  Pour tester dans SharePoint, utilisez cette URL dans votre workbench :"
Write-Host "  " -NoNewline; Write-ColorOutput Yellow "?debugManifestsFile=http://localhost:4321/temp/manifests.js"
Write-Host ""

# Proposer d'ouvrir automatiquement les URLs
if (-not $SkipBrowser) {
    $response = Read-Host "Voulez-vous ouvrir automatiquement le workbench dans votre navigateur ? (y/n)"
    if ($response -match "^[Yy]") {
        Log-Info "Ouverture du workbench..."
        Start-Process "http://localhost:8080"
    }
}

# Afficher les logs en continu
if (-not $SkipLogs) {
    Write-Host ""
    $response = Read-Host "Voulez-vous suivre les logs en temps réel ? (y/n)"
    if ($response -match "^[Yy]") {
        Write-Host ""
        Log-Info "Affichage des logs en temps réel (Ctrl+C pour arrêter)..."
        Write-Host ""
        docker-compose logs -f
    }
}

Log-Success "Script de lancement terminé !"
