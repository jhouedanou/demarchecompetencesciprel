#!/usr/bin/env bash
# =============================================================================
#  CIPREL Compétences — Installation de Supabase SELF-HOSTED (Docker) sur Debian
#
#  Usage (en root, depuis le dossier décompressé de l'archive) :
#     bash deploy/supabase/setup-supabase.sh
#  ou sans interaction :
#     SUPABASE_DOMAIN=supabase.ciprel.ci APP_DOMAIN=competences.ciprel.ci \
#     ADMIN_EMAIL=admin@ciprel.ci EMAIL=informatique@ciprel.ci \
#     bash deploy/supabase/setup-supabase.sh
#
#  Le script :
#   1. installe Docker + Compose et la stack Supabase officielle (setup.sh de
#      Supabase, version épinglée SUPABASE_REF) dans /opt/supabase
#   2. génère tous les secrets et clés API (outils officiels utils/*.sh)
#   3. applique la surcouche CIPREL : ports Docker liés à 127.0.0.1 uniquement
#   4. configure les URLs, l'auth (auto-confirmation e-mail), le SMTP (optionnel)
#   5. démarre la stack, importe le schéma (schema.sql) et les données de
#      référence (seed-data.sql : questions, ateliers, métiers)
#   6. crée le premier compte administrateur de l'application
#   7. configure Nginx (hôte) + Let's Encrypt pour https://SUPABASE_DOMAIN
#   8. écrit les clés dans le .env.production de l'application et la rebuild
#      si elle est déjà installée (/var/www/ciprel-competences)
#   9. installe la sauvegarde quotidienne (/etc/cron.daily/supabase-backup)
#
#  Ré-exécutable : chaque étape est idempotente.
# =============================================================================
set -euo pipefail

SUPABASE_DIR="${SUPABASE_DIR:-/opt/supabase}"
SUPABASE_REF="${SUPABASE_REF:-self-hosted/v0.8.1}"   # version testée avec ce pack
APP_DIR="${APP_DIR:-/var/www/ciprel-competences}"
APP_USER="${APP_USER:-deploy}"
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HERE="${SRC_DIR}/deploy/supabase"
SKIP_CERTBOT="${SKIP_CERTBOT:-0}"

C_OK='\033[1;32m'; C_WARN='\033[1;33m'; C_ERR='\033[1;31m'; C_INFO='\033[1;36m'; C_END='\033[0m'
ok()   { echo -e "${C_OK}[OK]${C_END}   $*"; }
info() { echo -e "${C_INFO}[..]${C_END}   $*"; }
warn() { echo -e "${C_WARN}[!!]${C_END}   $*"; }
die()  { echo -e "${C_ERR}[ERREUR]${C_END} $*" >&2; exit 1; }

read_env() { grep "^$1=" "${SUPABASE_DIR}/.env" 2>/dev/null | head -n1 | cut -d= -f2- | tr -d '\r'; }
set_env()  { # set_env FICHIER CLE VALEUR  (remplace ou ajoute)
  local f="$1" k="$2" v="$3"
  if grep -q "^${k}=" "$f"; then
    python3 - "$f" "$k" "$v" <<'PY'
import sys,re
f,k,v=sys.argv[1:4]
s=open(f).read()
s=re.sub(r'(?m)^'+re.escape(k)+r'=.*$', lambda m: f'{k}={v}', s, count=1)
open(f,'w').write(s)
PY
  else
    printf '%s=%s\n' "$k" "$v" >> "$f"
  fi
}

# -----------------------------------------------------------------------------
# 0. Pré-vérifications et paramètres
# -----------------------------------------------------------------------------
[ "$(id -u)" -eq 0 ] || die "Exécuter en root : sudo bash deploy/supabase/setup-supabase.sh"
command -v apt-get >/dev/null || die "Ce script cible Debian/Ubuntu."
[ -f "${HERE}/schema.sql" ] || die "schema.sql introuvable dans ${HERE}"
[ -f "${HERE}/seed-data.sql" ] || die "seed-data.sql introuvable dans ${HERE}"

echo
echo "=============================================================="
echo "  Installation Supabase self-hosted — CIPREL Compétences"
echo "  Dossier Supabase : ${SUPABASE_DIR}   (version ${SUPABASE_REF})"
echo "=============================================================="
echo

[ -n "${SUPABASE_DOMAIN:-}" ] || read -r -p "Sous-domaine public de Supabase (ex. supabase.ciprel.ci) : " SUPABASE_DOMAIN
[ -n "${SUPABASE_DOMAIN}" ] || die "SUPABASE_DOMAIN requis."
[ -n "${APP_DOMAIN:-}" ]      || read -r -p "Domaine public de l'application (ex. competences.ciprel.ci) : " APP_DOMAIN
[ -n "${APP_DOMAIN}" ] || die "APP_DOMAIN requis."
[ -n "${ADMIN_EMAIL:-}" ]     || read -r -p "E-mail du premier administrateur de l'application [admin@ciprel.ci] : " ADMIN_EMAIL
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@ciprel.ci}"
[ -n "${EMAIL:-}" ]           || read -r -p "E-mail pour Let's Encrypt [informatique@ciprel.ci] : " EMAIL
EMAIL="${EMAIL:-informatique@ciprel.ci}"

SUPABASE_URL="https://${SUPABASE_DOMAIN}"
APP_URL="https://${APP_DOMAIN}"

# -----------------------------------------------------------------------------
# 1. Paquets + Docker + stack Supabase officielle
# -----------------------------------------------------------------------------
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl git openssl jq ca-certificates gnupg lsb-release python3 nginx certbot python3-certbot-nginx >/dev/null
ok "Paquets de base"

if [ -f "${SUPABASE_DIR}/.env" ] && [ -f "${SUPABASE_DIR}/docker-compose.yml" ]; then
  ok "Stack Supabase déjà présente dans ${SUPABASE_DIR} (ré-exécution)"
else
  info "Téléchargement du setup.sh officiel Supabase (${SUPABASE_REF})"
  TMP=$(mktemp -d)
  curl -fsSL "https://raw.githubusercontent.com/supabase/supabase/${SUPABASE_REF}/docker/setup.sh" -o "${TMP}/setup.sh" \
    || curl -fsSL "https://raw.githubusercontent.com/supabase/supabase/master/docker/setup.sh" -o "${TMP}/setup.sh" \
    || die "Impossible de télécharger setup.sh (accès Internet sortant requis vers github.com)"
  info "Installation Docker + clonage de la stack + génération des clés (plusieurs minutes)"
  mkdir -p "$(dirname "${SUPABASE_DIR}")"
  ( cd "$(dirname "${SUPABASE_DIR}")" && sh "${TMP}/setup.sh" -y --ref "${SUPABASE_REF}" --project-dir "$(basename "${SUPABASE_DIR}")" )
  rm -rf "${TMP}"
  [ -f "${SUPABASE_DIR}/.env" ] || die "Le setup officiel n'a pas produit ${SUPABASE_DIR}/.env"
fi
ok "Docker $(docker --version | cut -d' ' -f3 | tr -d ',') / stack dans ${SUPABASE_DIR}"

# -----------------------------------------------------------------------------
# 2. Surcouche CIPREL (ports localhost) + configuration .env
# -----------------------------------------------------------------------------
cd "${SUPABASE_DIR}"
cp "${HERE}/docker-compose.ciprel.yml" ./docker-compose.ciprel.yml
grep -q 'docker-compose.ciprel.yml' .env || sh run.sh config add ciprel >/dev/null
chmod 600 .env

set_env .env SUPABASE_PUBLIC_URL        "${SUPABASE_URL}"
set_env .env API_EXTERNAL_URL           "${SUPABASE_URL}/auth/v1"
set_env .env SITE_URL                   "${APP_URL}"
set_env .env ADDITIONAL_REDIRECT_URLS   "${APP_URL}/**,${APP_URL}/reset-password"
set_env .env PROXY_DOMAIN               "${SUPABASE_DOMAIN}"
set_env .env CERTBOT_EMAIL              "${EMAIL}"
set_env .env API_GW_HTTP_PORT           "8000"
set_env .env STUDIO_DEFAULT_ORGANIZATION "CIPREL"
set_env .env STUDIO_DEFAULT_PROJECT     "Demarche Competences"
set_env .env POOLER_TENANT_ID           "ciprel"
set_env .env ENABLE_EMAIL_SIGNUP        "true"
set_env .env ENABLE_PHONE_SIGNUP        "false"
set_env .env ENABLE_ANONYMOUS_USERS     "false"
# Sans serveur SMTP configuré, les comptes sont confirmés automatiquement
# (même comportement que le projet cloud). Voir guide §5 pour activer le SMTP.
if [ -n "${SMTP_HOST:-}" ]; then
  set_env .env SMTP_HOST "${SMTP_HOST}"; set_env .env SMTP_PORT "${SMTP_PORT:-587}"
  set_env .env SMTP_USER "${SMTP_USER:-}"; set_env .env SMTP_PASS "${SMTP_PASS:-}"
  set_env .env SMTP_ADMIN_EMAIL "${SMTP_ADMIN_EMAIL:-${EMAIL}}"; set_env .env SMTP_SENDER_NAME "${SMTP_SENDER_NAME:-CIPREL Competences}"
  set_env .env ENABLE_EMAIL_AUTOCONFIRM "${ENABLE_EMAIL_AUTOCONFIRM:-false}"
  ok "SMTP configuré (${SMTP_HOST})"
else
  set_env .env ENABLE_EMAIL_AUTOCONFIRM "true"
  warn "Pas de SMTP : confirmation e-mail automatique, réinitialisation de mot de passe par e-mail indisponible (guide §5)"
fi
ok ".env Supabase configuré (URL publique ${SUPABASE_URL})"

ANON_KEY=$(read_env ANON_KEY); SERVICE_ROLE_KEY=$(read_env SERVICE_ROLE_KEY)
POSTGRES_PASSWORD=$(read_env POSTGRES_PASSWORD); DASHBOARD_USERNAME=$(read_env DASHBOARD_USERNAME); DASHBOARD_PASSWORD=$(read_env DASHBOARD_PASSWORD)
[ -n "${ANON_KEY}" ] && [ -n "${SERVICE_ROLE_KEY}" ] || die "Clés ANON_KEY / SERVICE_ROLE_KEY absentes du .env"

# -----------------------------------------------------------------------------
# 3. Démarrage de la stack
# -----------------------------------------------------------------------------
info "Téléchargement des images et démarrage (5-15 min la première fois)"
docker compose --progress quiet pull
docker compose up -d --wait --quiet-pull
ok "Stack démarrée : $(docker compose ps --status running --format '{{.Service}}' | wc -l) services"

psql_db()   { docker exec supabase-db psql -v ON_ERROR_STOP=1 -U postgres -d postgres "$@" </dev/null; }
psql_file() { docker exec -i supabase-db psql -v ON_ERROR_STOP=1 -q -U postgres -d postgres < "$1"; }
for i in $(seq 1 30); do psql_db -c 'select 1' >/dev/null 2>&1 && break; sleep 2; done
psql_db -c 'select 1' >/dev/null || die "Postgres injoignable dans supabase-db"

# -----------------------------------------------------------------------------
# 4. Schéma + données de référence
# -----------------------------------------------------------------------------
info "Import du schéma (schema.sql)"
psql_file "${HERE}/schema.sql"
ok "Schéma : $(psql_db -tAc "select count(*) from information_schema.tables where table_schema='public'") tables"
info "Import des données de référence (seed-data.sql)"
psql_file "${HERE}/seed-data.sql"
ok "Données : $(psql_db -tAc 'select count(*) from public.questions') questions, $(psql_db -tAc 'select count(*) from public.workshops_metiers') ateliers métiers"
# PostgREST recharge son cache de schéma
docker compose restart rest >/dev/null 2>&1 || true

# -----------------------------------------------------------------------------
# 5. Premier administrateur de l'application
# -----------------------------------------------------------------------------
API_LOCAL="http://127.0.0.1:8000"
for i in $(seq 1 30); do curl -fsS -o /dev/null -H "apikey: ${ANON_KEY}" "${API_LOCAL}/auth/v1/health" && break; sleep 2; done
EXISTING=$(psql_db -tAc "select count(*) from auth.users where email='${ADMIN_EMAIL}'")
if [ "${EXISTING}" = "0" ]; then
  ADMIN_PASSWORD="${ADMIN_PASSWORD:-$(openssl rand -base64 12 | tr -d '/+=' | cut -c1-14)}"
  info "Création du compte administrateur ${ADMIN_EMAIL}"
  RESP=$(curl -sS -X POST "${API_LOCAL}/auth/v1/admin/users" \
    -H "apikey: ${SERVICE_ROLE_KEY}" -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" -H "Content-Type: application/json" \
    -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\",\"email_confirm\":true,\"user_metadata\":{\"name\":\"Administrateur CIPREL\"}}")
  echo "${RESP}" | jq -e '.id' >/dev/null 2>&1 || die "Création admin échouée : ${RESP}"
  psql_db -qc "update public.profiles set role='ADMIN', name='Administrateur CIPREL' where email='${ADMIN_EMAIL}';"
  ok "Administrateur créé (rôle ADMIN)"
  ADMIN_CREATED=1
else
  psql_db -qc "update public.profiles set role='ADMIN' where email='${ADMIN_EMAIL}';"
  ok "Administrateur ${ADMIN_EMAIL} déjà existant (rôle ADMIN confirmé)"
  ADMIN_CREATED=0
fi

# -----------------------------------------------------------------------------
# 6. Nginx (hôte) + HTTPS
# -----------------------------------------------------------------------------
info "Configuration Nginx pour ${SUPABASE_DOMAIN}"
sed "s/supabase\.ciprel\.ci/${SUPABASE_DOMAIN}/g" "${HERE}/nginx-supabase.conf" > /etc/nginx/sites-available/supabase
ln -sf /etc/nginx/sites-available/supabase /etc/nginx/sites-enabled/supabase
rm -f /etc/nginx/sites-enabled/default
nginx -t >/dev/null && systemctl enable --now nginx >/dev/null && systemctl reload nginx
ok "Nginx : ${SUPABASE_DOMAIN} -> 127.0.0.1:8000"

if [ "${SKIP_CERTBOT}" = "1" ]; then
  warn "Certbot ignoré (SKIP_CERTBOT=1) : installer un certificat pour ${SUPABASE_DOMAIN} (guide §8.4 du guide serveur)"
else
  PUBLIC_IP=$(curl -fsS -4 https://ifconfig.me 2>/dev/null || true)
  DNS_IP=$(getent ahostsv4 "${SUPABASE_DOMAIN}" 2>/dev/null | awk 'NR==1{print $1}' || true)
  if [ -n "${DNS_IP}" ] && { [ -z "${PUBLIC_IP}" ] || [ "${DNS_IP}" = "${PUBLIC_IP}" ]; }; then
    if certbot --nginx -d "${SUPABASE_DOMAIN}" --redirect --agree-tos --no-eff-email -m "${EMAIL}" -n; then
      ok "HTTPS actif : ${SUPABASE_URL}"
    else
      warn "Certbot a échoué. Relancer : certbot --nginx -d ${SUPABASE_DOMAIN} --redirect -m ${EMAIL} --agree-tos --no-eff-email"
    fi
  else
    warn "DNS de ${SUPABASE_DOMAIN} (${DNS_IP:-non résolu}) ne pointe pas vers ce serveur (${PUBLIC_IP:-?}). Certificat à installer ensuite."
  fi
fi

# -----------------------------------------------------------------------------
# 7. Pare-feu (Docker contourne UFW : les ports sont déjà liés à 127.0.0.1)
# -----------------------------------------------------------------------------
if command -v ufw >/dev/null; then
  ufw allow 80/tcp >/dev/null; ufw allow 443/tcp >/dev/null; ufw allow 22/tcp >/dev/null
  ufw --force enable >/dev/null
fi
LEAK=$(docker ps --format '{{.Ports}}' | tr ',' '\n' | grep -E '^0\.0\.0\.0:|^\[::\]:|^:::' || true)
[ -z "${LEAK}" ] && ok "Aucun port Docker exposé publiquement" || warn "Ports Docker exposés publiquement : ${LEAK}"

# -----------------------------------------------------------------------------
# 8. Application : clés dans .env.production + rebuild si installée
# -----------------------------------------------------------------------------
patch_app_env() {
  local f="$1"
  set_env "$f" NEXT_PUBLIC_SUPABASE_URL      "${SUPABASE_URL}"
  set_env "$f" NEXT_PUBLIC_SUPABASE_ANON_KEY "${ANON_KEY}"
  set_env "$f" SUPABASE_SERVICE_ROLE_KEY     "${SERVICE_ROLE_KEY}"
  set_env "$f" NEXT_PUBLIC_APP_URL           "${APP_URL}"
  chmod 600 "$f"
}
if [ -f "${SRC_DIR}/.env.production" ]; then
  patch_app_env "${SRC_DIR}/.env.production"; ok "Clés écrites dans ${SRC_DIR}/.env.production"
fi
if [ -f "${APP_DIR}/.env.production" ] && [ "$(readlink -f "${APP_DIR}")" != "$(readlink -f "${SRC_DIR}")" ]; then
  patch_app_env "${APP_DIR}/.env.production"; chown "${APP_USER}:${APP_USER}" "${APP_DIR}/.env.production"
  ok "Clés écrites dans ${APP_DIR}/.env.production"
  if [ -d "${APP_DIR}/node_modules" ]; then
    info "Rebuild de l'application (les clés NEXT_PUBLIC_* sont figées au build)"
    su - "${APP_USER}" -c "cd '${APP_DIR}' && NODE_OPTIONS='--max-old-space-size=2048' npm run build >/dev/null && pm2 reload ecosystem.config.js --update-env >/dev/null 2>&1 || true"
    ok "Application rebuildée et rechargée"
  fi
fi

# -----------------------------------------------------------------------------
# 9. Sauvegarde quotidienne
# -----------------------------------------------------------------------------
install -m 755 "${HERE}/backup-supabase.sh" /usr/local/bin/supabase-backup
cat > /etc/cron.daily/supabase-backup <<EOF
#!/bin/sh
SUPABASE_DIR=${SUPABASE_DIR} /usr/local/bin/supabase-backup >> /var/log/supabase-backup.log 2>&1
EOF
chmod +x /etc/cron.daily/supabase-backup
ok "Sauvegarde quotidienne : /var/backups/supabase (30 jours)"

# -----------------------------------------------------------------------------
# Résumé
# -----------------------------------------------------------------------------
echo
echo "=============================================================="
echo -e "  ${C_OK}Supabase self-hosted installé${C_END}"
echo "=============================================================="
echo "  API / Auth / Realtime : ${SUPABASE_URL}"
echo "  Studio (tableau de bord) : ${SUPABASE_URL}/   (utilisateur : ${DASHBOARD_USERNAME})"
echo "  Dossier                  : ${SUPABASE_DIR}   (secrets : ${SUPABASE_DIR}/.env, chmod 600)"
echo "  Afficher les secrets     : cd ${SUPABASE_DIR} && sh run.sh secrets"
echo "  Postgres (local only)    : psql postgres://postgres:***@127.0.0.1:5432/postgres"
echo
if [ "${ADMIN_CREATED}" = "1" ]; then
echo -e "  ${C_WARN}Compte administrateur de l'application (à noter, affiché une seule fois) :${C_END}"
echo "     e-mail        : ${ADMIN_EMAIL}"
echo "     mot de passe  : ${ADMIN_PASSWORD}"
echo "     -> changer le mot de passe dès la première connexion (${APP_URL}/profile)"
echo
fi
echo "  Étape suivante si l'application n'est pas encore installée :"
echo "     bash ${SRC_DIR}/deploy/install.sh     (les clés Supabase sont déjà dans .env.production)"
echo
echo "  Commandes utiles :"
echo "     cd ${SUPABASE_DIR} && sh run.sh status | logs [service] | restart | stop | start"
echo "     supabase-backup                        # sauvegarde immédiate"
echo
