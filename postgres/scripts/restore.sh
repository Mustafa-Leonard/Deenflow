#!/bin/bash
# =============================================================
#  DeenFlow — Disaster Recovery: Point-in-Time Restore
#
#  USE CASE: Accidental DELETE, data corruption, or catastrophic failure.
#
#  Procedure:
#   1. Restore the most recent daily pg_dump (or any chosen base backup)
#   2. Apply WAL archives up to the desired recovery_target_time
#
#  IMPORTANT: Run this on a SEPARATE server, not in-place.
#  Validate data BEFORE switching production traffic.
#
#  Required env vars:
#    S3_BUCKET          — same bucket used during backup
#    GPG_KEY_ID         — GPG private key must be available on restoring machine
#    PGPASSWORD         — admin password for restore target
#    RECOVERY_TARGET    — ISO8601 timestamp e.g. "2026-02-18 14:30:00 UTC"
# =============================================================

set -euo pipefail

RESTORE_DB="${RESTORE_DB:-deenflow_restore_$(date +%Y%m%d_%H%M%S)}"
RESTORE_PORT="${RESTORE_PORT:-5433}"   # Use a different port to keep primary up
WAL_RESTORE_DIR="/var/lib/postgresql/wal_restore"

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

log "=== DeenFlow PITR Restore START ==="
log "Target DB    : $RESTORE_DB"
log "Recovery time: ${RECOVERY_TARGET:-LATEST}"

# ─── Step 1: Find the latest base backup before the target time ───────────
log "Step 1: Listing available base backups…"
aws s3 ls "s3://${S3_BUCKET}/daily/" | sort -k1,2 | tail -20

# Set BACKUP_FILE to the dump you want to restore from:
BACKUP_FILE="${BACKUP_FILE:-$(
    aws s3 ls "s3://${S3_BUCKET}/daily/" \
    | awk '{print $4}' \
    | sort \
    | tail -1
)}"
log "Using base backup: $BACKUP_FILE"

# ─── Step 2: Download and decrypt the base backup ────────────────────────
log "Step 2: Downloading and decrypting backup…"
mkdir -p /tmp/deenflow_restore
aws s3 cp "s3://${S3_BUCKET}/daily/${BACKUP_FILE}" - \
| gpg --batch --yes --decrypt --output /tmp/deenflow_restore/base.dump

# ─── Step 3: Create restore target database ───────────────────────────────
log "Step 3: Creating restore database: $RESTORE_DB"
createdb --host=localhost --port="$RESTORE_PORT" --username=postgres "$RESTORE_DB"

# ─── Step 4: Restore the base backup ─────────────────────────────────────
log "Step 4: Restoring base backup (this may take a while)…"
pg_restore \
    --host=localhost \
    --port="$RESTORE_PORT" \
    --username=postgres \
    --dbname="$RESTORE_DB" \
    --jobs=4 \
    --verbose \
    /tmp/deenflow_restore/base.dump

log "Base restore complete."

# ─── Step 5: Apply WAL files for PITR ───────────────────────────────────
# (Only needed if you want to recover to a point after the base backup)
if [ -n "${RECOVERY_TARGET:-}" ]; then
    log "Step 5: Configuring PITR to: $RECOVERY_TARGET"
    mkdir -p "$WAL_RESTORE_DIR"

    # Download WAL files from S3
    aws s3 sync "s3://${S3_BUCKET}/wal/" "$WAL_RESTORE_DIR/" \
        --exclude='*' \
        --include='*.gz'

    # Create recovery.conf (Postgres < 12) / postgresql.auto.conf (Postgres 12+)
    cat > /var/lib/postgresql/data/postgresql.auto.conf << EOF
restore_command = 'cp ${WAL_RESTORE_DIR}/%f %p'
recovery_target_time = '${RECOVERY_TARGET}'
recovery_target_action = 'promote'
EOF

    touch /var/lib/postgresql/data/recovery.signal
    log "WAL replay will advance to: $RECOVERY_TARGET"
else
    log "Step 5: Skipped (no RECOVERY_TARGET set, base backup is the endpoint)"
fi

# ─── Step 6: Verification ────────────────────────────────────────────────
log "Step 6: Verifying restored data…"
psql \
    --host=localhost \
    --port="$RESTORE_PORT" \
    --username=postgres \
    --dbname="$RESTORE_DB" \
    --command="
        SELECT COUNT(*) AS users           FROM accounts_user;
        SELECT COUNT(*) AS guidance_sessions FROM guidance_guidancesession;
        SELECT MAX(date_joined) AS latest_user FROM accounts_user;
    "

log ""
log "=== Restore COMPLETE ==="
log "Restored DB: $RESTORE_DB on port $RESTORE_PORT"
log "Verify data, then promote to production by updating DATABASE_URL."
log ""
log "To promote:"
log "  1. Put application in maintenance mode"
log "  2. Update DATABASE_URL env var to point to restore server"
log "  3. Restart Django containers"
log "  4. Remove maintenance mode"

# ─── Cleanup ─────────────────────────────────────────────────────────────
rm -rf /tmp/deenflow_restore
