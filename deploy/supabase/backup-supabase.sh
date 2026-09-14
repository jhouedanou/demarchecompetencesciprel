#!/usr/bin/env bash
# =============================================================================
# Sauvegarde quotidienne Supabase self-hosted (base Postgres + fichiers Storage)
# Installé par setup-supabase.sh dans /etc/cron.daily/supabase-backup
# Restauration : voir GUIDE_SUPABASE_SELF_HOSTED.md §7
# =============================================================================
set -euo pipefail

SUPABASE_DIR="${SUPABASE_DIR:-/opt/supabase}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/supabase}"
KEEP_DAYS="${KEEP_DAYS:-30}"
DATE=$(date +%F_%H%M)

mkdir -p "${BACKUP_DIR}"
chmod 700 "${BACKUP_DIR}"

# 1. Base de données complète (tous schémas : public, auth, storage...)
docker exec supabase-db pg_dumpall -U postgres --clean --if-exists \
  | gzip -9 > "${BACKUP_DIR}/db-${DATE}.sql.gz"

# 2. Fichiers Storage (buckets) + configuration (.env contient les secrets !)
tar czf "${BACKUP_DIR}/files-${DATE}.tgz" \
  -C "${SUPABASE_DIR}" .env volumes/storage 2>/dev/null || true
chmod 600 "${BACKUP_DIR}"/*

# 3. Rotation
find "${BACKUP_DIR}" -type f -mtime +"${KEEP_DAYS}" -delete

echo "Sauvegarde OK : ${BACKUP_DIR}/db-${DATE}.sql.gz ($(du -h "${BACKUP_DIR}/db-${DATE}.sql.gz" | cut -f1))"
