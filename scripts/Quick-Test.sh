#!/bin/bash

# Script de Test Rapide - Démarche Compétence CIPREL
# Solutions multiples pour démarrer l'application rapidement

echo "🚀 Test Rapide - Démarche Compétence CIPREL"
echo "============================================"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Fonction de test local direct (sans Docker)
test_local() {
    print_status "=== TEST LOCAL DIRECT (SANS DOCKER) ==="
    
    # Nettoyage rapide
    rm -rf node_modules lib temp dist 2>/dev/null
    
    # Installation rapide avec le package.json actuel
    print_status "Installation des dépendances..."
    if npm install --legacy-peer-deps --no-optional; then
        print_success "Dépendances installées"
        
        # Test de build
        print_status "Test du build..."
        if npm run build; then
            print_success "Build réussi"
            
            # Démarrage du serveur
            print_success "Démarrage du serveur de développement..."
            echo ""
            print_success "🌐 L'application sera disponible sur:"
            echo "   http://localhost:4321/temp/workbench.html"
            echo ""
            print_warning "Appuyez sur Ctrl+C pour arrêter"
            npm run serve
        else
            print_error "Échec du build"
            return 1
        fi
    else
        print_error "Échec de l'installation des dépendances"
        return 1
    fi
}

# Fonction de test avec package minimal
test_minimal() {
    print_status "=== TEST AVEC PACKAGE MINIMAL ==="
    
    # Sauvegarde du package.json actuel
    cp package.json package.json.backup
    
    # Utilisation du package minimal
    cp package.minimal.json package.json
    
    # Nettoyage
    rm -rf node_modules lib temp dist 2>/dev/null
    
    print_status "Installation avec package minimal..."
    if npm install --legacy-peer-deps; then
        print_success "Installation réussie avec package minimal"
        
        # Test de build
        if npm run build; then
            print_success "Build minimal réussi"
            
            print_success "🌐 Démarrage avec configuration minimale..."
            npm run serve
        else
            print_error "Échec du build minimal"
            # Restauration du package.json
            cp package.json.backup package.json
            return 1
        fi
    else
        print_error "Échec avec package minimal"
        # Restauration du package.json
        cp package.json.backup package.json
        return 1
    fi
}

# Fonction de test Docker minimal
test_docker_minimal() {
    print_status "=== TEST DOCKER MINIMAL ==="
    
    # Nettoyage Docker
    docker-compose -f docker-compose.minimal.yml down 2>/dev/null
    docker rmi spfx-minimal-test 2>/dev/null
    
    print_status "Build Docker minimal..."
    if docker-compose -f docker-compose.minimal.yml build; then
        print_success "Image Docker minimale créée"
        
        print_status "Démarrage du container minimal..."
        docker-compose -f docker-compose.minimal.yml up
    else
        print_error "Échec du build Docker minimal"
        return 1
    fi
}

# Fonction de test SharePoint Workbench en ligne
test_online_workbench() {
    print_status "=== TEST SHAREPOINT WORKBENCH EN LIGNE ==="
    
    print_status "Démarrage du serveur local pour SharePoint Online..."
    
    # Installation rapide si nécessaire
    if [ ! -d "node_modules" ]; then
        npm install --legacy-peer-deps --no-optional
    fi
    
    print_success "🌐 Instructions pour test en ligne:"
    echo "1. Le serveur local va démarrer"
    echo "2. Ouvrez votre navigateur sur:"
    echo "   https://ciprel.sharepoint.com/_layouts/15/workbench.aspx"
    echo "3. Ajoutez la WebPart 'Démarche Compétence'"
    echo ""
    print_warning "Appuyez sur Ctrl+C pour arrêter"
    
    npm run serve
}

# Menu principal
echo ""
echo "Choisissez la méthode de test :"
echo "1) Test local direct (RECOMMANDÉ - sans Docker)"
echo "2) Test avec package minimal (si erreurs de dépendances)"
echo "3) Test Docker minimal (version allégée)"
echo "4) Test SharePoint Workbench en ligne"
echo "5) Diagnostic des problèmes"

read -p "Votre choix (1-5): " choice

case $choice in
    1)
        test_local
        ;;
    2)
        test_minimal
        ;;
    3)
        test_docker_minimal
        ;;
    4)
        test_online_workbench
        ;;
    5)
        print_status "=== DIAGNOSTIC ==="
        echo "Node.js version: $(node --version)"
        echo "npm version: $(npm --version)"
        echo "Docker version: $(docker --version 2>/dev/null || echo 'Docker non installé')"
        echo ""
        echo "Espace disque disponible:"
        df -h . | head -2
        echo ""
        echo "Permissions du répertoire:"
        ls -la package.json
        ;;
    *)
        print_warning "Choix invalide, test local direct par défaut"
        test_local
        ;;
esac

print_status "Script de test terminé"