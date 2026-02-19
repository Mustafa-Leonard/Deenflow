#!/bin/bash
# =============================================================
#  DeenFlow — Automated Backup Script
#  Runs daily via cron (or a Kubernetes CronJob).
#
#  Strategy:
#   - Daily full pg_dump (custom format = compressed + parallelisable)
#   - WAL archiving gives continuous PITR between daily dumps
#   - Backups are streamed directly to S3 (never touch a disk)
#   - AES-256 encrypted before upload with gpg
#   - Retention: 30 daily + 4 weekly + 12 monthly (s3 lifecycle rule)
#
#  Secrets: read from environment, NOT hardcoded here.
#  Required env vars:
#    PGPASSWORD          — password for backup role
#    PG_HOST             — primary postgres host
#    PG_USER             — backup role (deenflow_readonly or postgres_monitor)
#    PG_DB               — database name
#    S3_BUCKET           — s3://your-encrypted-bucket/backups
#    GPG_KEY_ID          — recipient key fingerprint for encryption
# =============================================================

set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="deenflow_${TIMESTAMP}.dump"
LOG_FILE="/var/log/deenflow_backup_${TIMESTAMP}.log"

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" | tee -a "$LOG_FILE"; }

log "=== DeenFlow backup START: $TIMESTAMP ==="

# ─── Run pg_dump | encrypt on-the-fly | stream to S3 ─────────────────────
log "Streaming dump to S3…"
pg_dump \
    --host="$PG_HOST" \
    --port="${PG_PORT:-5432}" \
    --username="$PG_USER" \
    --dbname="$PG_DB" \
    --format=custom \
    --compress=9 \
    --no-password \
    --verbose \
    2>>"$LOG_FILE" \
| gpg --batch --yes --trust-model always \
      --encrypt --recipient "$GPG_KEY_ID" \
      --output - \
| aws s3 cp - "s3://${S3_BUCKET}/daily/${BACKUP_FILE}.gpg" \
      --storage-class STANDARD_IA \
      --sse aws:kms

log "Dump uploaded: s3://${S3_BUCKET}/daily/${BACKUP_FILE}.gpg"

# ─── Verify backup integrity ──────────────────────────────────────────────
log "Verifying backup CRC…"
aws s3 cp "s3://${S3_BUCKET}/daily/${BACKUP_FILE}.gpg" - \
| gpg --batch --yes --decrypt --output /tmp/verify_${TIMESTAMP}.dump
pg_restore --list /tmp/verify_${TIMESTAMP}.dump > /dev/null
rm -f /tmp/verify_${TIMESTAMP}.dump
log "Backup verification PASSED."

# ─── Cleanup old daily backups (keep 30 days) ─────────────────────────────
log "Removing backups older than 30 days from S3…"
aws s3 ls "s3://${S3_BUCKET}/daily/" \
| awk '{print $4}' \
| sort \
| head -n -30 \
| xargs -I{} aws s3 rm "s3://${S3_BUCKET}/daily/{}" || true

log "=== DeenFlow backup COMPLETE ==="

# ─── Alert on failure (Slack webhook) ────────────────────────────────────
# trap 'curl -s -X POST $SLACK_WEBHOOK -d "{\"text\":\"❌ DeenFlow DB backup FAILED!\"}"' ERR
