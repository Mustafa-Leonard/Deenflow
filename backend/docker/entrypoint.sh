#!/bin/sh
# =============================================================
#  DeenFlow — Container Entrypoint
#  Waits for the database to become ready, then runs migrations
#  and starts gunicorn.  Zero manual intervention required.
# =============================================================
set -e

echo "[entrypoint] DeenFlow backend starting…"

# ── 1. Wait for Postgres / PgBouncer to be reachable ─────────────────────
# We wait on PgBouncer, not Postgres directly, because PgBouncer is the
# only gateway the app container should ever be able to reach.
wait_for_db() {
    local host="${DB_HOST:-pgbouncer}"
    local port="${DB_PORT:-6432}"
    local retries=30
    local wait=2

    echo "[entrypoint] Waiting for database at ${host}:${port}…"
    until python -c "
import socket, sys
try:
    s = socket.create_connection(('${host}', ${port}), timeout=5)
    s.close()
    print('[entrypoint] Database reachable.')
    sys.exit(0)
except Exception as e:
    sys.exit(1)
" 2>/dev/null; do
        retries=$((retries - 1))
        if [ "$retries" -le 0 ]; then
            echo "[entrypoint] ERROR: database not reachable after multiple retries. Aborting."
            exit 1
        fi
        echo "[entrypoint] Not ready yet. Retrying in ${wait}s… (${retries} retries left)"
        sleep "$wait"
    done
}

wait_for_db

# ── 2. Collect static files ───────────────────────────────────────────────
echo "[entrypoint] Collecting static files…"
python manage.py collectstatic --noinput --clear

# ── 3. Run database migrations (primary only — replicas get them via WAL) ─
echo "[entrypoint] Running migrations…"
python manage.py migrate --noinput

# ── 4. Start the application ──────────────────────────────────────────────
echo "[entrypoint] Starting Gunicorn…"
exec "$@"
