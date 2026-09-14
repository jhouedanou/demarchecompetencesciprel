#!/usr/bin/env bash
# =============================================================================
#  CIPREL Compétences — Installation automatisée sur Debian 12 / Ubuntu 22.04+
#
#  Usage (en root, depuis le dossier décompressé de l'archive) :
#     bash deploy/install.sh
#  ou, sans interaction :
#     DOMAIN=competences.ciprel.ci EMAIL=informatique@ciprel.ci bash deploy/install.sh
#
#  Le script :
#   1. installe Node.js 20, PM2, Nginx, Certbot, UFW, Fail2ban
#   2. crée l'utilisateur "deploy" et copie l'application dans /var/www/ciprel-competences
#   3. renseigne NEXT_PUBLIC_APP_URL dans .env.production (déjà pré-rempli)
#   4. npm ci + sharp + build de production
#   5. démarre l'application avec PM2 (redémarrage automatique au boot)
#   6. configure Nginx (reverse proxy port 3000), UFW (22/80/443), Fail2ban (SSH)
#   7. obtient un certificat Let's Encrypt (si le DNS pointe déjà vers ce serveur)
#
#  Ré-exécutable : chaque étape est idempotente.
# =============================================================================
set -euo pipefail

APP_NAME="ciprel-competences"
APP_DIR="/var/www/${APP_NAME}"
APP_USER="deploy"
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_MAJOR=20

C_OK='\033[1;32m'; C_WARN='\033[1;33m'; C_ERR='\033[1;31m'; C_INFO='\033[1;36m'; C_END='\033[0m'
ok()   { echo -e "${C_OK}[OK]${C_END}   $*"; }
info() { echo -e "${C_INFO}[..]${C_END}   $*"; }
warn() { echo -e "${C_WARN}[!!]${C_END}   $*"; }
die()  { echo -e "${C_ERR}[ERREUR]${C_END} $*" >&2; exit 1; }

# -----------------------------------------------------------------------------
# 0. Pré-vérifications
# -----------------------------------------------------------------------------
[ "$(id -u)" -eq 0 ] || die "Exécuter en root : sudo bash deploy/install.sh"
[ -f "${SRC_DIR}/package.json" ] || die "package.json introuvable dans ${SRC_DIR}. Lancer le script depuis l'archive décompressée."
[ -f "${SRC_DIR}/.env.production" ] || die ".env.production manquant dans ${SRC_DIR} (il est fourni pré-rempli dans l'archive)."
command -v apt-get >/dev/null || die "Ce script cible Debian/Ubuntu (apt)."

echo
echo "=============================================================="
echo "  Installation CIPREL Compétences"
echo "  Source : ${SRC_DIR}"
echo "  Cible  : ${APP_DIR}  (utilisateur ${APP_USER})"
echo "=============================================================="
echo

if [ -z "${DOMAIN:-}" ]; then
  read -r -p "Nom de domaine public de l'application (ex. competences.ciprel.ci) : " DOMAIN
fi
[ -n "${DOMAIN}" ] || die "Nom de domaine requis."
if [ -z "${EMAIL:-}" ]; then
  read -r -p "E-mail pour Let's Encrypt (alertes d'expiration) [informatique@ciprel.ci] : " EMAIL
  EMAIL="${EMAIL:-informatique@ciprel.ci}"
fi
SKIP_CERTBOT="${SKIP_CERTBOT:-0}"

# -----------------------------------------------------------------------------
# 1. Paquets système
# -----------------------------------------------------------------------------
info "Mise à jour APT et paquets de base"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl wget git unzip ca-certificates gnupg ufw fail2ban \
  build-essential python3 nginx certbot python3-certbot-nginx rsync >/dev/null
ok "Paquets système installés"

# Swap si RAM < 3 Go et pas de swap
MEM_MB=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
if [ "${MEM_MB}" -lt 3000 ] && [ "$(swapon --show --noheadings | wc -l)" -eq 0 ]; then
  info "RAM ${MEM_MB} Mo sans swap : création d'un swap de 2 Go (nécessaire pour le build)"
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  ok "Swap activé"
fi

# -----------------------------------------------------------------------------
# 2. Node.js 20 LTS (NodeSource)
# -----------------------------------------------------------------------------
if ! command -v node >/dev/null || [ "$(node -v | sed 's/v\([0-9]*\).*/\1/')" -lt "${NODE_MAJOR}" ]; then
  info "Installation de Node.js ${NODE_MAJOR}.x"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
ok "Node $(node -v) / npm $(npm -v)"

command -v pm2 >/dev/null || { info "Installation de PM2"; npm install -g pm2 >/dev/null 2>&1; }
ok "PM2 $(pm2 -v)"

# -----------------------------------------------------------------------------
# 3. Utilisateur applicatif + copie des sources
# -----------------------------------------------------------------------------
id "${APP_USER}" >/dev/null 2>&1 || adduser --disabled-password --gecos "CIPREL App" "${APP_USER}" >/dev/null
mkdir -p "${APP_DIR}" /var/log/pm2

if [ "$(readlink -f "${SRC_DIR}")" != "$(readlink -f "${APP_DIR}")" ]; then
  info "Copie des sources vers ${APP_DIR}"
  rsync -a --delete \
    --exclude node_modules --exclude .next --exclude .git \
    --exclude 'data/*.db*' \
    "${SRC_DIR}/" "${APP_DIR}/"
fi
mkdir -p "${APP_DIR}/data"
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}" /var/log/pm2
chmod 750 "${APP_DIR}/data"
chmod 600 "${APP_DIR}/.env.production"
ok "Sources en place, droits appliqués"

# -----------------------------------------------------------------------------
# 4. Variables d'environnement : URL publique
# -----------------------------------------------------------------------------
sed -i "s#^NEXT_PUBLIC_APP_URL=.*#NEXT_PUBLIC_APP_URL=https://${DOMAIN}#" "${APP_DIR}/.env.production"
grep -q '^NEXT_PUBLIC_SUPABASE_URL=https://' "${APP_DIR}/.env.production" || die "NEXT_PUBLIC_SUPABASE_URL absent de .env.production"
grep -q '^SUPABASE_SERVICE_ROLE_KEY=.\+' "${APP_DIR}/.env.production" || die "SUPABASE_SERVICE_ROLE_KEY vide dans .env.production"
ok ".env.production : NEXT_PUBLIC_APP_URL=https://${DOMAIN}"

# -----------------------------------------------------------------------------
# 5. Dépendances + build (en tant que deploy)
# -----------------------------------------------------------------------------
info "npm ci (2-5 min)"
su - "${APP_USER}" -c "cd '${APP_DIR}' && npm ci --no-audit --no-fund --loglevel=error"
info "Installation de sharp (optimisation d'images)"
su - "${APP_USER}" -c "cd '${APP_DIR}' && npm install sharp --no-save --no-audit --no-fund --loglevel=error"
info "Build Next.js (2-6 min)"
su - "${APP_USER}" -c "cd '${APP_DIR}' && NODE_OPTIONS='--max-old-space-size=2048' npm run build"
ok "Build terminé"

# -----------------------------------------------------------------------------
# 6. PM2
# -----------------------------------------------------------------------------
info "Démarrage PM2"
su - "${APP_USER}" -c "cd '${APP_DIR}' && (pm2 describe ${APP_NAME} >/dev/null 2>&1 && pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js) && pm2 save" >/dev/null
env PATH="$PATH:/usr/bin" pm2 startup systemd -u "${APP_USER}" --hp "/home/${APP_USER}" >/dev/null 2>&1 || true
systemctl enable "pm2-${APP_USER}" >/dev/null 2>&1 || true
sleep 4
if curl -fsS -o /dev/null http://127.0.0.1:3000/; then
  ok "Application répond sur http://127.0.0.1:3000"
else
  warn "L'application ne répond pas encore sur le port 3000. Voir : su - ${APP_USER} -c 'pm2 logs ${APP_NAME}'"
fi

# -----------------------------------------------------------------------------
# 7. Nginx
# -----------------------------------------------------------------------------
info "Configuration Nginx"
sed "s/competences\.ciprel\.ci/${DOMAIN}/g" "${APP_DIR}/deploy/nginx-ciprel-competences.conf" \
  > "/etc/nginx/sites-available/${APP_NAME}"
ln -sf "/etc/nginx/sites-available/${APP_NAME}" "/etc/nginx/sites-enabled/${APP_NAME}"
rm -f /etc/nginx/sites-enabled/default
nginx -t >/dev/null && systemctl enable --now nginx >/dev/null && systemctl reload nginx
ok "Nginx : reverse proxy ${DOMAIN} -> 127.0.0.1:3000"

# -----------------------------------------------------------------------------
# 8. Pare-feu + Fail2ban
# -----------------------------------------------------------------------------
info "UFW (22, 80, 443) et Fail2ban (SSH)"
ufw default deny incoming >/dev/null
ufw default allow outgoing >/dev/null
ufw allow 22/tcp >/dev/null; ufw allow 80/tcp >/dev/null; ufw allow 443/tcp >/dev/null
ufw --force enable >/dev/null
cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
EOF
systemctl enable --now fail2ban >/dev/null
systemctl restart fail2ban
ok "UFW actif, Fail2ban actif"

# -----------------------------------------------------------------------------
# 9. HTTPS Let's Encrypt
# -----------------------------------------------------------------------------
if [ "${SKIP_CERTBOT}" = "1" ]; then
  warn "Certbot ignoré (SKIP_CERTBOT=1). Lancer plus tard : certbot --nginx -d ${DOMAIN} --redirect -m ${EMAIL} --agree-tos --no-eff-email"
else
  PUBLIC_IP=$(curl -fsS -4 https://ifconfig.me 2>/dev/null || true)
  DNS_IP=$(getent ahostsv4 "${DOMAIN}" 2>/dev/null | awk 'NR==1{print $1}' || true)
  if [ -n "${DNS_IP}" ] && { [ -z "${PUBLIC_IP}" ] || [ "${DNS_IP}" = "${PUBLIC_IP}" ]; }; then
    info "Obtention du certificat Let's Encrypt pour ${DOMAIN}"
    if certbot --nginx -d "${DOMAIN}" --redirect --agree-tos --no-eff-email -m "${EMAIL}" -n; then
      ok "HTTPS actif : https://${DOMAIN}"
    else
      warn "Certbot a échoué. Vérifier DNS/port 80 puis relancer : certbot --nginx -d ${DOMAIN} --redirect -m ${EMAIL} --agree-tos --no-eff-email"
    fi
  else
    warn "DNS de ${DOMAIN} (${DNS_IP:-non résolu}) ne pointe pas vers ce serveur (${PUBLIC_IP:-IP inconnue})."
    warn "Quand le DNS sera propagé : certbot --nginx -d ${DOMAIN} --redirect -m ${EMAIL} --agree-tos --no-eff-email"
    warn "Serveur interne sans accès Internet entrant : installer un certificat d'entreprise dans Nginx (voir guide §8.4)."
  fi
fi

# -----------------------------------------------------------------------------
# Résumé
# -----------------------------------------------------------------------------
echo
echo "=============================================================="
echo -e "  ${C_OK}Installation terminée${C_END}"
echo "=============================================================="
echo "  URL            : https://${DOMAIN}"
echo "  Dossier        : ${APP_DIR}"
echo "  Variables      : ${APP_DIR}/.env.production"
echo "  Base SQLite    : ${APP_DIR}/data/ciprel.db"
echo "  Processus      : su - ${APP_USER} -c 'pm2 status'"
echo "  Logs           : su - ${APP_USER} -c 'pm2 logs ${APP_NAME}'"
echo "  Mise à jour    : su - ${APP_USER} -c 'bash ${APP_DIR}/deploy/update.sh'"
echo
echo "  Vérification en-têtes (aucune ligne X-Frame-Options attendue) :"
echo "    curl -sI https://${DOMAIN} | grep -i -E 'content-security-policy|x-frame-options'"
echo
