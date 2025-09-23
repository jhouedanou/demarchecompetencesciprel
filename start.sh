#!/bin/bash

# Script de lancement rapide - Démarche Compétence CIPREL
# Raccourci pour démarrer l'environnement de développement

set -e

echo "🚀 Lancement de l'environnement de développement via Docker..."
echo ""
echo "💡 Toutes les dépendances npm seront gérées à l'intérieur des conteneurs."

# Vérifier si le script principal existe
if [ -f "./scripts/Start-Dev.sh" ]; then
    # Rendre le script exécutable si nécessaire
    chmod +x ./scripts/Start-Dev.sh
    
    # Exécuter le script principal
    ./scripts/Start-Dev.sh "$@"
else
    echo "❌ Script principal non trouvé : ./scripts/Start-Dev.sh"
    echo "Veuillez vous assurer d'être dans le répertoire racine du projet."
    exit 1
fi
