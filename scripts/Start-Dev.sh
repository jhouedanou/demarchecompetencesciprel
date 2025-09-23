#!/bin/bash

# Script de lancement automatique de l'environnement de développement
# Démarche Compétence CIPREL - SPFx + React + Docker

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages avec couleur
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Bannière de démarrage
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                    🚀 DÉMARCHE COMPÉTENCE CIPREL 🚀                         ║"
echo "║                      Environnement de Développement                          ║"
echo "║                         SPFx + React + Docker                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Vérification des prérequis
log_step "Vérification des prérequis..."

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker n'est pas installé. Veuillez installer Docker Desktop."
    exit 1
fi

# Vérifier Docker Compose
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose n'est pas installé. Veuillez installer Docker Compose."
    exit 1
fi

# Vérifier que Docker est en cours d'exécution
if ! docker info &> /dev/null; then
    log_error "Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop."
    exit 1
fi

log_success "Prérequis validés ✓"

# Nettoyer les conteneurs existants
log_step "Nettoyage des conteneurs existants..."
docker-compose down --remove-orphans &> /dev/null || true
log_success "Conteneurs nettoyés ✓"

# Construire et démarrer les conteneurs
log_step "Construction et démarrage des conteneurs Docker..."
log_info "Ceci peut prendre quelques minutes lors du premier lancement..."

if docker-compose up -d --build; then
    log_success "Conteneurs démarrés avec succès ✓"
else
    log_error "Erreur lors du démarrage des conteneurs"
    exit 1
fi

# Attendre que les conteneurs soient prêts
log_step "Attente de la disponibilité des services..."

# Fonction pour attendre qu'un port soit disponible
wait_for_port() {
    local host=$1
    local port=$2
    local service=$3
    local timeout=60
    local count=0

    while ! nc -z $host $port &> /dev/null; do
        if [ $count -ge $timeout ]; then
            log_error "Timeout: $service n'est pas disponible après ${timeout}s"
            return 1
        fi
        sleep 1
        count=$((count + 1))
        if [ $((count % 10)) -eq 0 ]; then
            log_info "Attente de $service... (${count}s)"
        fi
    done
    
    log_success "$service est disponible ✓"
}

# Attendre le workbench nginx
wait_for_port localhost 8080 "Workbench (nginx)"

# Vérifier et installer les dépendances SPFx
log_step "Vérification et installation des dépendances SPFx..."
if docker-compose exec -T spfx-dev npm list gulp &> /dev/null; then
    log_success "Dépendances déjà installées ✓"
else
    log_info "Installation des dépendances manquantes..."
    if docker-compose exec -T spfx-dev npm install; then
        log_success "Dépendances installées ✓"
    else
        log_error "Erreur lors de l'installation des dépendances"
        exit 1
    fi
fi

# Générer le certificat de développement SPFx
log_step "Génération du certificat de développement SPFx..."
if docker-compose exec -T spfx-dev npx gulp trust-dev-cert &> /dev/null; then
    log_success "Certificat de développement généré ✓"
else
    log_warning "Le certificat pourrait déjà exister ou être généré automatiquement"
fi

# Effectuer un build initial pour s'assurer que tout compile
log_step "Build initial de l'application SPFx..."
log_info "Ceci peut prendre quelques minutes lors du premier build..."
if docker-compose exec -T spfx-dev npx gulp bundle --no-color; then
    log_success "Build initial réussi ✓"
else
    log_warning "Le build initial a échoué, mais le serveur de développement va essayer de corriger"
fi

# Attendre que SPFx soit prêt et vérifier qu'il fonctionne
log_step "Démarrage et vérification du serveur de développement SPFx..."
sleep 15  # Laisser le temps à SPFx de compiler

# Redémarrer le serveur de développement pour s'assurer qu'il utilise les derniers builds
log_step "Redémarrage du serveur de développement SPFx..."
docker-compose restart spfx-dev
sleep 10

# Vérifier que le serveur SPFx répond
log_info "Vérification que le serveur SPFx répond..."
for i in {1..12}; do
    if curl -s http://localhost:4321 &> /dev/null; then
        log_success "Serveur SPFx opérationnel ✓"
        break
    elif [ $i -eq 12 ]; then
        log_warning "Le serveur SPFx met du temps à démarrer, vérifiez les logs avec: docker-compose logs spfx-dev"
    else
        log_info "Attente du serveur SPFx... (tentative $i/12)"
        sleep 5
    fi
done

# Vérifier l'état des conteneurs
log_step "Vérification de l'état des services..."
if docker-compose ps | grep -q "Up"; then
    log_success "Tous les services sont opérationnels ✓"
else
    log_warning "Certains services pourraient encore démarrer"
fi

# Afficher les informations de connexion
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                           🎉 ENVIRONNEMENT PRÊT ! 🎉                        ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📋 Services disponibles :${NC}"
echo ""
echo -e "  🌐 ${YELLOW}Workbench Local${NC}     : http://localhost:8080"
echo -e "  🔧 ${YELLOW}Serveur SPFx${NC}        : http://localhost:4321"
echo -e "  📊 ${YELLOW}LiveReload${NC}          : http://localhost:35729"
echo ""

echo -e "${BLUE}🛠️  Commandes utiles :${NC}"
echo ""
echo -e "  📋 Voir les logs        : ${YELLOW}docker-compose logs -f${NC}"
echo -e "  📋 Logs SPFx seulement  : ${YELLOW}docker-compose logs -f spfx-dev${NC}"
echo -e "  🔄 Redémarrer SPFx      : ${YELLOW}docker-compose restart spfx-dev${NC}"
echo -e "  🔨 Build manuel         : ${YELLOW}docker-compose exec spfx-dev npx gulp bundle${NC}"
echo -e "  🚀 Serveur manuel       : ${YELLOW}docker-compose exec spfx-dev npx gulp serve${NC}"
echo -e "  🛑 Arrêter tout         : ${YELLOW}docker-compose down${NC}"
echo -e "  🧹 Nettoyer tout        : ${YELLOW}docker-compose down --volumes --remove-orphans${NC}"
echo ""

echo -e "${BLUE}🔗 Développement SharePoint :${NC}"
echo ""
echo -e "  Pour tester dans SharePoint, utilisez cette URL dans votre workbench :"
echo -e "  ${YELLOW}?debugManifestsFile=http://localhost:4321/temp/manifests.js${NC}"
echo ""

# Proposer d'ouvrir automatiquement les URLs
read -p "Voulez-vous ouvrir automatiquement le workbench dans votre navigateur ? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Ouverture du workbench..."
    
    # Détection de l'OS pour la commande d'ouverture
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open http://localhost:8080
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open http://localhost:8080 &> /dev/null &
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        start http://localhost:8080
    else
        log_info "Veuillez ouvrir manuellement : http://localhost:8080"
    fi
fi

# Afficher les logs en continu
echo ""
read -p "Voulez-vous suivre les logs en temps réel ? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    log_info "Affichage des logs en temps réel (Ctrl+C pour arrêter)..."
    echo ""
    docker-compose logs -f
fi

log_success "Script de lancement terminé !"
