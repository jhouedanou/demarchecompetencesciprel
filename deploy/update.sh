#!/usr/bin/env bash
# =============================================================================
# Mise à jour de l'application CIPREL Compétences (après une première install)
# Usage : bash deploy/update.sh   (depuis /var/www/ciprel-competences)
# =============================================================================
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/ciprel-competences}"
cd "$APP_DIR"

echo "==> Récupération des sources"
if [ -d .git ]; then
  git pull --ff-only
else
  echo "    (pas de dépôt git : décompressez la nouvelle archive par-dessus le dossier, puis relancez ce script)"
fi

echo "==> Installation des dépendances"
# NB : ne pas utiliser --omit=dev, le build a besoin de typescript/tailwind/postcss
npm ci --no-audit --no-fund
npm install sharp --no-audit --no-fund --no-save

echo "==> Build Next.js"
NODE_OPTIONS="--max-old-space-size=2048" npm run build

echo "==> Redémarrage PM2"
pm2 reload ecosystem.config.js --update-env
pm2 save

echo "==> Terminé. Vérification :"
sleep 3
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:3000/
