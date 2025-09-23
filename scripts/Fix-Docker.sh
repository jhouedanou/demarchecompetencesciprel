#!/bin/bash

# Script de réparation Docker pour Démarche Compétence CIPREL
# Résout les problèmes de permissions et de build Docker

echo "🔧 Script de Réparation Docker - Démarche Compétence CIPREL"
echo "========================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage coloré
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Étape 1: Nettoyage Docker
print_status "Étape 1: Nettoyage des containers et images existants..."

# Arrêt et suppression des containers existants
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

# Suppression des images existantes
docker rmi demarche-competence-spfx 2>/dev/null || true
docker rmi demarche-competence-spfx-simple 2>/dev/null || true

# Nettoyage des volumes
docker volume prune -f

print_success "Nettoyage Docker terminé"

# Étape 2: Vérification des prérequis
print_status "Étape 2: Vérification des prérequis..."

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé"
    exit 1
fi

# Vérifier Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose n'est pas installé"
    exit 1
fi

# Vérifier que Docker fonctionne
if ! docker info &> /dev/null; then
    print_error "Docker daemon n'est pas démarré"
    exit 1
fi

print_success "Prérequis validés"

# Étape 3: Choix de la configuration Docker
print_status "Étape 3: Sélection de la configuration Docker..."

echo "Choisissez la configuration Docker :"
echo "1) Configuration standard (Dockerfile)"
echo "2) Configuration simple (Dockerfile.simple) - Recommandé si erreurs"
echo "3) Configuration manuelle"

read -p "Votre choix (1-3): " choice

case $choice in
    1)
        DOCKERFILE="Dockerfile"
        COMPOSE_FILE="docker-compose.yml"
        print_status "Configuration standard sélectionnée"
        ;;
    2)
        DOCKERFILE="Dockerfile.simple"
        COMPOSE_FILE="docker-compose.simple.yml"
        print_status "Configuration simple sélectionnée"
        ;;
    3)
        print_status "Configuration manuelle - construction sans Docker"
        npm install
        npm run serve
        exit 0
        ;;
    *)
        print_warning "Choix invalide, utilisation de la configuration simple"
        DOCKERFILE="Dockerfile.simple"
        COMPOSE_FILE="docker-compose.simple.yml"
        ;;
esac

# Étape 4: Construction de l'image Docker
print_status "Étape 4: Construction de l'image Docker..."

# Build avec gestion d'erreurs
if docker-compose -f $COMPOSE_FILE build --no-cache; then
    print_success "Image Docker construite avec succès"
else
    print_error "Échec de la construction Docker"
    
    # Tentative de diagnostic
    print_status "Diagnostic des erreurs..."
    
    # Vérifier l'espace disque
    df_output=$(df -h /)
    print_status "Espace disque disponible:"
    echo "$df_output"
    
    # Vérifier les permissions
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Système macOS détecté"
        print_warning "Vérifiez que Docker Desktop a accès au répertoire du projet"
    fi
    
    # Proposer des solutions
    echo ""
    print_warning "Solutions possibles :"
    echo "1. Redémarrer Docker Desktop"
    echo "2. Libérer de l'espace disque"
    echo "3. Vérifier les permissions du répertoire"
    echo "4. Utiliser la configuration manuelle (option 3)"
    
    exit 1
fi

# Étape 5: Démarrage des services
print_status "Étape 5: Démarrage des services Docker..."

if docker-compose -f $COMPOSE_FILE up -d; then
    print_success "Services Docker démarrés avec succès"
    
    # Attendre que les services soient prêts
    print_status "Attente du démarrage des services..."
    sleep 10
    
    # Vérifier l'état des containers
    if docker-compose -f $COMPOSE_FILE ps | grep -q "Up"; then
        print_success "Application disponible !"
        echo ""
        echo "🌐 URLs d'accès :"
        echo "   - Workbench local: http://localhost:4321/temp/workbench.html"
        echo "   - SharePoint Workbench: https://YOUR-TENANT.sharepoint.com/_layouts/15/workbench.aspx"
        echo ""
        echo "📋 Commandes utiles :"
        echo "   - Voir les logs: docker-compose -f $COMPOSE_FILE logs -f"
        echo "   - Arrêter: docker-compose -f $COMPOSE_FILE down"
        echo "   - Redémarrer: docker-compose -f $COMPOSE_FILE restart"
        echo ""
        
        # Ouvrir automatiquement le navigateur (optionnel)
        read -p "Ouvrir automatiquement le navigateur ? (y/n): " open_browser
        if [[ $open_browser =~ ^[Yy]$ ]]; then
            if command -v open &> /dev/null; then
                open "http://localhost:4321/temp/workbench.html"
            elif command -v xdg-open &> /dev/null; then
                xdg-open "http://localhost:4321/temp/workbench.html"
            else
                print_warning "Impossible d'ouvrir automatiquement le navigateur"
            fi
        fi
        
    else
        print_error "Les services n'ont pas démarré correctement"
        docker-compose -f $COMPOSE_FILE logs
        exit 1
    fi
    
else
    print_error "Échec du démarrage des services Docker"
    exit 1
fi

print_success "Démarrage Docker terminé avec succès !"

# Étape 6: Monitoring (optionnel)
read -p "Afficher les logs en temps réel ? (y/n): " show_logs
if [[ $show_logs =~ ^[Yy]$ ]]; then
    print_status "Affichage des logs (Ctrl+C pour arrêter)..."
    docker-compose -f $COMPOSE_FILE logs -f
fi