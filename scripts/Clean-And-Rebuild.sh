#!/bin/bash

# Script de Nettoyage et Reconstruction - Démarche Compétence CIPREL
# Résout les problèmes de dépendances npm et Docker

echo "🧹 Nettoyage et Reconstruction - Démarche Compétence CIPREL"
echo "========================================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Fonction de nettoyage Docker
cleanup_docker() {
    print_status "Nettoyage Docker complet..."
    
    # Arrêt de tous les containers liés au projet
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.simple.yml down 2>/dev/null || true
    docker-compose -f docker-compose.fixed.yml down 2>/dev/null || true
    
    # Suppression des containers
    docker rm -f demarche-competence-spfx 2>/dev/null || true
    docker rm -f demarche-competence-spfx-simple 2>/dev/null || true
    docker rm -f demarche-competence-spfx-fixed 2>/dev/null || true
    
    # Suppression des images
    docker rmi demarche-competence-spfx 2>/dev/null || true
    docker rmi demarche-competence-spfx-simple 2>/dev/null || true
    docker rmi demarche-competence-spfx-fixed 2>/dev/null || true
    
    # Nettoyage des volumes
    docker volume rm demarchecompetencesciprel_node_modules 2>/dev/null || true
    
    print_success "Nettoyage Docker terminé"
}

# Fonction de nettoyage npm
cleanup_npm() {
    print_status "Nettoyage npm complet..."
    
    # Suppression des dossiers de cache et build
    rm -rf node_modules
    rm -rf lib
    rm -rf dist
    rm -rf temp
    rm -rf .temp
    rm -rf sharepoint/solution
    
    # Nettoyage du cache npm
    npm cache clean --force
    
    print_success "Nettoyage npm terminé"
}

# Fonction d'installation des dépendances
install_dependencies() {
    print_status "Installation des dépendances..."
    
    # Installation avec options de compatibilité
    if npm install --legacy-peer-deps --no-optional; then
        print_success "Dépendances installées avec succès"
        return 0
    else
        print_error "Échec de l'installation des dépendances"
        
        # Tentative avec npm ci
        print_status "Tentative avec npm ci..."
        if npm ci --legacy-peer-deps; then
            print_success "Dépendances installées avec npm ci"
            return 0
        else
            print_error "Échec avec npm ci également"
            return 1
        fi
    fi
}

# Fonction de test de build
test_build() {
    print_status "Test du build local..."
    
    if npm run build; then
        print_success "Build local réussi"
        return 0
    else
        print_error "Échec du build local"
        return 1
    fi
}

# Menu principal
echo "Choisissez une option de nettoyage :"
echo "1) Nettoyage complet (Docker + npm + rebuild)"
echo "2) Nettoyage npm uniquement"
echo "3) Nettoyage Docker uniquement"
echo "4) Test build sans nettoyage"
echo "5) Démarrage direct avec Dockerfile.fixed"

read -p "Votre choix (1-5): " choice

case $choice in
    1)
        print_status "=== NETTOYAGE COMPLET ==="
        cleanup_docker
        cleanup_npm
        
        if install_dependencies; then
            if test_build; then
                print_status "Démarrage avec Dockerfile.fixed..."
                docker-compose -f docker-compose.fixed.yml up --build
            else
                print_warning "Build échoué, démarrage en mode développement local"
                npm run serve
            fi
        else
            print_error "Installation des dépendances échouée"
            exit 1
        fi
        ;;
        
    2)
        print_status "=== NETTOYAGE NPM UNIQUEMENT ==="
        cleanup_npm
        install_dependencies
        test_build
        ;;
        
    3)
        print_status "=== NETTOYAGE DOCKER UNIQUEMENT ==="
        cleanup_docker
        print_status "Démarrage avec Dockerfile.fixed..."
        docker-compose -f docker-compose.fixed.yml up --build
        ;;
        
    4)
        print_status "=== TEST BUILD ==="
        test_build
        ;;
        
    5)
        print_status "=== DÉMARRAGE DOCKERFILE.FIXED ==="
        cleanup_docker
        docker-compose -f docker-compose.fixed.yml up --build
        ;;
        
    *)
        print_warning "Choix invalide, nettoyage complet par défaut"
        cleanup_docker
        cleanup_npm
        install_dependencies
        docker-compose -f docker-compose.fixed.yml up --build
        ;;
esac

print_status "Script terminé"

# Affichage des URLs d'accès
echo ""
print_success "=== URLS D'ACCÈS ==="
echo "🌐 Workbench local: http://localhost:4321/temp/workbench.html"
echo "🌐 SharePoint Workbench: https://ciprel.sharepoint.com/_layouts/15/workbench.aspx"
echo ""
print_success "=== COMMANDES UTILES ==="
echo "📋 Voir les logs: docker-compose -f docker-compose.fixed.yml logs -f"
echo "📋 Arrêter: docker-compose -f docker-compose.fixed.yml down"
echo "📋 Redémarrer: docker-compose -f docker-compose.fixed.yml restart"