# DeenFlow — Production Database Architecture
## Complete Security, Reliability & Scalability Blueprint

> **Status:** Production-ready design  
> **Stack:** Django 4.2 · PostgreSQL 16 · PgBouncer · Redis 7 · Docker  
> **Author:** Platform Architecture Team  
> **Applies to:** All environments from Staging onwards

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Section A — Database Security](#a-database-security)
3. [Section B — Reliability & Data Safety](#b-reliability--data-safety)
4. [Section C — High Availability](#c-high-availability)
5. [Section D — Massive Scalability](#d-massive-scalability)
6. [Section E — Performance & Query Optimization](#e-performance--query-optimization)
7. [Section F — Docker & Deployment](#f-docker--deployment)
8. [Operations Runbook](#operations-runbook)

---

## 1. Architecture Overview

```
                        ┌─────────────────────────────┐
                        │          INTERNET             │
                        └──────────────┬───────────────┘
                                       │ HTTPS only
                        ┌──────────────▼───────────────┐
                        │   Nginx (Reverse Proxy)       │
                        │   Port 80/443 — PUBLIC        │
                        │   TLS termination here        │
                        └──────────┬────────────────────┘
                                   │  HTTP (internal only)
              ─────────── frontend_net ───────────────────
                                   │
              ┌────────────────────▼─────────────────────┐
              │   Django / Gunicorn  ×3 replicas         │
              │   Port 8000 (internal, not published)     │
              │   Connected to: frontend_net + backend_net│
              └────┬──────────────────────────┬──────────┘
                   │ backend_net              │ backend_net
            ┌──────▼──────┐          ┌───────▼──────────┐
            │   Redis 7   │          │  PgBouncer        │
            │  Cache +    │          │  Primary :6432    │
            │  Sessions   │          │  (Write pool)     │
            └─────────────┘          └───────┬──────────┘
                                             │         ┌──────────────────┐
                                             │         │  PgBouncer       │
                                             │         │  Replica  :6432  │
                                             │         │  (Read pool)     │
                                             │         └──────▲───────────┘
                              ─── db_net (INTERNAL: TRUE) ─────────────────
                                             │                │
                                    ┌────────▼──────┐  ┌──────▼──────────┐
                                    │  Postgres     │  │  Postgres       │
                                    │  PRIMARY      │══│  REPLICA        │
                                    │  :5432        │  │  :5432          │
                                    │  (Writes +WAL)│  │ (Reads, PITR)  │
                                    └───────────────┘  └─────────────────┘
                                            │
                              ┌─────────────▼────────────┐
                              │  S3 — WAL Archive +       │
                              │  Encrypted Daily Backups  │
                              └───────────────────────────┘
```

**Critical Network Rule**: `db_net` is declared `internal: true` in Docker Compose.  
This means **no container on db_net can initiate outbound connections**, and no  
container outside `db_net` can reach Postgres. The database is physically unreachable  
from the internet, from Django directly, or from any compromised non-db-net container.

---

## A. DATABASE SECURITY

### A1. Network Isolation

```yaml
# docker-compose.prod.yml (excerpt)
networks:
  frontend_net:  { driver: bridge }           # Nginx ↔ Django
  backend_net:   { driver: bridge }           # Django ↔ PgBouncer, Django ↔ Redis
  db_net:
    driver: bridge
    internal: true   # ← THE KEY: no external routing. DB is unreachable from internet.
```

**How it works:**
- Postgres is only attached to `db_net`
- `db_net` has `internal: true` — Docker adds no default gateway, no internet
- PgBouncer bridges `backend_net` and `db_net` — it is the **only** gateway
- Django talks to PgBouncer, never directly to Postgres
- No `ports:` are published for Postgres or PgBouncer — no host port binding

### A2. Role Separation

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| `deenflow_app` | SELECT, INSERT, UPDATE, DELETE on app tables | CREATE, DROP, TRUNCATE, superuser ops |
| `deenflow_readonly` | SELECT only | Write anything |
| `deenflow_replicator` | Streaming replication | Connect to app tables |
| `postgres_monitor` | Read `pg_stat_*` views | See app data |
| `deenflow_admin` | Full DDL on app DB | Server-level superuser ops |

```sql
-- Only app tables, no DDL, no privilege escalation
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO deenflow_app;
-- Reads only — analytics, Django replica reads
GRANT SELECT ON ALL TABLES IN SCHEMA public TO deenflow_readonly;
-- Revoke dangerous defaults
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE deenflow_prod FROM PUBLIC;
```

### A3. TLS Enforcement

All connections are `hostssl` in `pg_hba.conf`:

```conf
# ONLY encrypted connections. Plain TCP connections are rejected.
hostssl deenflow_prod  deenflow_app       172.20.0.0/16  scram-sha-256
hostssl replication    deenflow_replicator 172.20.0.0/16 scram-sha-256
# Everything else:
host    all            all                all            reject
```

Django enforces TLS from its side:
```python
# settings.py
cfg['OPTIONS']['sslmode'] = 'require'          # Verify server uses TLS
cfg['OPTIONS']['sslrootcert'] = '/run/secrets/postgres_ca.crt'  # Pin CA cert
```

### A4. Secrets Management

```
NEVER in:
  ✗ settings.py
  ✗ docker-compose.yml environment: blocks
  ✗ Git history
  ✗ Docker image layers

ALWAYS from:
  ✓ Docker Secrets (file: ./secrets/xxx.txt)
  ✓ AWS Secrets Manager / GCP Secret Manager / HashiCorp Vault
  ✓ Kubernetes Secrets (base64 encoded, ideally sealed with Sealed Secrets)
  ✓ Doppler (SaaS secrets manager)
```

```bash
# How to create a Docker Secret (one-time setup per deployment):
echo "$(openssl rand -base64 40)" > ./secrets/postgres_password.txt
echo "$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")" \
    > ./secrets/django_secret_key.txt
chmod 600 ./secrets/*.txt
echo "secrets/" >> .gitignore
```

### A5. SQL Injection Protection

Django's ORM uses **parameterised queries by default** — the SQL injection surface is zero  
when you write idiomatic Django code:

```python
# SAFE — ORM always parameterises
User.objects.filter(email=request.data['email'])

# SAFE — use params= for raw SQL
User.objects.raw("SELECT * FROM accounts_user WHERE email = %s", [email])

# DANGEROUS — NEVER do this
User.objects.raw(f"SELECT * FROM accounts_user WHERE email = '{email}'")
```

Additional defence:
- `deenflow_app` role cannot `DROP`, `TRUNCATE`, or `ALTER` tables — damage from a  
  compromised query is limited to DML on existing rows.
- Row-Level Security policies can further scope visible rows to the authenticated user  
  (see `01_roles.sql`).

---

## B. RELIABILITY & DATA SAFETY

### B1. Backup Strategy

| Type | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| **Full pg_dump** | Daily 02:00 UTC | 30 days | S3 Standard-IA (encrypted) |
| **WAL Archive** | Continuous (every 5 min) | 30 days | S3 Glacier |
| **Weekly dump** | Sunday 02:00 UTC | 12 weeks | S3 Standard-IA |
| **Monthly dump** | 1st of month | 12 months | S3 Glacier |

The backup script (`postgres/scripts/backup.sh`) pipes `pg_dump` through GPG and  
straight to S3. **No plain-text dump ever touches disk.**

### B2. Point-in-Time Recovery (PITR)

```
Daily snapshot (base backup)
   │
   │  +  WAL archives (continuous, every 5 min)
   │                                           │
   ▼                                           ▼
[02:00 UTC snapshot]  ─────→  Any second up to NOW  ← recoverable
```

How to recover to an exact moment:
```bash
# Example: recover to 5 minutes before the accidental DELETE
export RECOVERY_TARGET="2026-02-19 14:25:00 UTC"
bash postgres/scripts/restore.sh
```

The restore script:
1. Downloads and decrypts the closest base backup from S3
2. Restores it to a **new, separate** database (never overwrites production!)
3. Applies WAL segments up to `RECOVERY_TARGET`
4. Runs row-count verification
5. Gives you a staging database to inspect before promoting

### B3. Health Checks

Every service in Docker Compose has a `healthcheck:` block:

```bash
# Postgres: can it accept connections?
pg_isready -U postgres -d deenflow_prod

# Django: HTTP endpoint
curl -f http://localhost:8000/health/

# Redis: responds to PING
redis-cli -a $REDIS_PASSWORD ping
```

Monitoring metrics to track (via pg_prometheus exporter + Grafana):

| Metric | Alert Threshold |
|--------|-----------------|
| Active connections | > 80% of max_connections |
| Replication lag | > 30 seconds |
| Disk usage | > 75% |
| Slow queries (>300ms) | > 10/min |
| Dead tuple bloat | > 20% |
| Backup age | > 26 hours |

### B4. Zero-Downtime Schema Migrations

Rule: **every Django migration must be backwards-compatible with the previous code version**.  
This allows deploying the new code version before running the migration.

**Safe migration patterns:**

```python
# ✅ SAFE: Add a nullable column (old code ignores it, new code uses it)
class Migration(migrations.Migration):
    operations = [
        migrations.AddField(
            model_name='user',
            name='timezone',
            field=models.CharField(max_length=64, null=True, blank=True, default=None),
        ),
    ]

# ✅ SAFE: Add an index (use RunSQL with CONCURRENTLY — no table lock)
class Migration(migrations.Migration):
    atomic = False  # Required for CONCURRENT index
    operations = [
        migrations.RunSQL(
            sql="CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_email ON accounts_user(email)",
            reverse_sql="DROP INDEX CONCURRENTLY IF EXISTS idx_user_email",
        ),
    ]

# ❌ UNSAFE: Rename a column locks the table and breaks old code
# Use a 3-step rename: add new → backfill → drop old
```

---

## C. HIGH AVAILABILITY

### C1. Primary + Replica Setup

```
Django worker 1 ──write──→ PgBouncer Primary ──→ Postgres Primary
Django worker 2 ──write──→ PgBouncer Primary ──┘
Django worker 1 ──read───→ PgBouncer Replica ──→ Postgres Replica
Django worker 3 ──read───→ PgBouncer Replica ──┘
```

### C2. Django Database Router

The router in `config/db_router.py` implements this automatically:

```python
def db_for_read(self, model, **hints):
    return 'replica'   # or 'default' if no replica configured

def db_for_write(self, model, **hints):
    return 'default'   # always primary

def allow_migrate(self, db, app_label, **hints):
    return db == 'default'   # migrations only on primary
```

### C3. Failover Strategy

**Automatic failover using Patroni (recommended for production):**

```
Patroni (each Postgres node runs a Patroni sidecar)
    │
    ├── Watches: is primary alive? (Consul / etcd / ZooKeeper as DCS)
    ├── On primary death: elects best replica as new primary within 30s
    ├── Updates: HAProxy / Consul DNS to point to new primary
    └── Old primary: fenced (pg_ctl stop) to prevent split-brain
```

**Minimal failover without Patroni:**

```bash
# Manual promotion (when primary fails and replica has latest WAL):
# On replica container:
pg_ctl promote -D /var/lib/postgresql/data

# Update Django env to point to old-replica (new-primary):
DATABASE_URL=postgresql://deenflow_app:PASS@postgres_replica:5432/deenflow_prod
docker-compose up -d django   # restart with new DB URL
```

**RTO (Recovery Time Objective):** < 60 seconds with Patroni, < 5 minutes with manual.  
**RPO (Recovery Point Objective):** < 5 seconds (WAL replication lag threshold).

---

## D. MASSIVE SCALABILITY

### D1. Why One Big Server Cannot Scale Infinitely

```
One 128-core, 1TB-RAM server:
  - Costs $50,000+/month on cloud
  - Still has one failure domain (all eggs in one basket)
  - Vertical scaling hits hardware limits
  - Single-point-of-failure for ALL users

Horizontal scaling (this architecture):
  - Add another $200/month replica → 2× read capacity
  - Add another $200/month Django container → 2× API capacity
  - Cost grows linearly, capacity grows linearly
  - No theoretical limit
```

### D2. Read Scaling

```
Users: 10,000 → 1 Replica handles reads comfortably (80/20 rule: 80% reads, 20% writes)
Users: 100,000 → Add replica_2, replica_3. Update DATABASE_REPLICA_URL to use a
                   HAProxy that load-balances across all replicas.
Users: 1,000,000 → Add Redis cache in front of replicas. 95%+ reads served from cache.
                    Only cache misses hit Postgres at all.
```

Router supports multiple replicas with random distribution:

```python
# config/db_router.py
_REPLICA_ALIASES = ['replica', 'replica_2', 'replica_3']  # just add more
```

### D3. Connection Pooling Architecture

```
1,000 Django workers × 1 connection each = 1,000 connections to PgBouncer
PgBouncer (transaction mode)             = 25 real connections to Postgres
Postgres max_connections                 = 100 (25 per database × 4 databases)

Why transaction pooling?
  - Django holds a connection open for the duration of a REQUEST (not a transaction)
  - Transaction mode: connection released back to pool after each SQL transaction
  - Session mode:     connection held until client disconnects (can't multiplex well)
  - For Django's request/response model, transaction pooling is optimal
```

### D4. Sharding Strategy (For 10M+ Users)

When a single Postgres primary can no longer handle writes (typically >500 writes/sec  
sustained), implement **user-level horizontal sharding**:

```
Shard Key: user_id % N_SHARDS
N_SHARDS: start at 4, double as you grow (4 → 8 → 16 → 32...)

User 1234567 → 1234567 % 4 = 3 → SHARD_3 database
User 8901234 → 8901234 % 4 = 2 → SHARD_2 database
```

**Django settings for 4 shards:**

```python
DATABASES = {
    'default':  db_config('DATABASE_URL'),            # primary + migrations
    'shard_0':  db_config('DATABASE_SHARD_0_URL'),
    'shard_1':  db_config('DATABASE_SHARD_1_URL'),
    'shard_2':  db_config('DATABASE_SHARD_2_URL'),
    'shard_3':  db_config('DATABASE_SHARD_3_URL'),
}
```

**Shard router:**

```python
# config/shard_router.py
SHARDABLE_APPS = {'guidance', 'notifications', 'learning', 'community', 'analytics'}
N_SHARDS = int(os.getenv('N_SHARDS', '4'))

class ShardRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label in SHARDABLE_APPS and 'instance' in hints:
            user_id = getattr(hints['instance'], 'user_id', None)
            if user_id:
                return f'shard_{user_id % N_SHARDS}'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label in SHARDABLE_APPS and 'instance' in hints:
            user_id = getattr(hints['instance'], 'user_id', None)
            if user_id:
                return f'shard_{user_id % N_SHARDS}'
        return 'default'
```

**Non-sharded tables** (stay on default / primary):
- `accounts_user` — user lookup is by PK, always fast
- `quran_*` — read-only reference data, cached in Redis
- `learning_path`, `learning_lesson` — shared content, not per-user

**Cross-shard queries** (avoid these — design your models to not need them):
- If you must, fetch from each shard in parallel using `async` tasks, merge in Python

**Adding a new shard (zero-downtime):**
1. Start a new Postgres instance
2. Use `pg_dump --table` to copy the relevant shard's subset of data
3. Update `N_SHARDS` environment variable from 4 → 8
4. Old users keep their correct shard because `user_id % 4` maps correctly into `user_id % 8`  
   (only even-numbered shards receive old data; odd shards receive new users)
5. Background task redistributes existing users gradually

---

## E. PERFORMANCE & QUERY OPTIMIZATION

### E1. Index Strategy (see `postgres/init/02_schema.sql`)

| Index Type | When to Use | Example |
|------------|-------------|---------|
| B-tree | Equality, range, ORDER BY | `user_id`, `created_at` |
| Composite | Multi-column WHERE/ORDER BY | `(user_id, created_at DESC)` |
| Partial | Subset of rows that are hot | `WHERE is_read = FALSE` |
| GIN | Full-text search, JSONB | `to_tsvector(arabic_text)` |
| Hash | Equality only | `email` (lower cardinality lookups) |

**Never index:**
- Columns with very low cardinality (boolean fields — use partial indexes instead)
- Columns never in WHERE or JOIN conditions

### E2. Django ORM Optimization

```python
# ✅ Use select_related for FK joins (1 SQL instead of N+1)
sessions = GuidanceSession.objects.select_related('user', 'category').filter(...)

# ✅ Use prefetch_related for M2M
paths = LearningPath.objects.prefetch_related('lessons').all()

# ✅ Only fetch the columns you need
User.objects.values('id', 'email', 'full_name').filter(is_active=True)

# ✅ Use exists() for existence checks (no full row load)
if GuidanceSession.objects.filter(user=user, status='pending').exists():
    ...

# ✅ Bulk operations — 1 SQL instead of N
GuidanceSession.objects.bulk_create([...])
GuidanceSession.objects.filter(status='old').update(status='archived')

# ❌ The classic N+1 problem
for session in GuidanceSession.objects.all():
    print(session.user.email)   # NEW query for every row!
```

### E3. Redis Caching Integration

```python
# views.py — cache expensive reads, bypass for writes
from django.core.cache import cache

# Cache the Quran surah list (rarely changes, read millions of times)
def get_surah_list(request):
    cache_key = 'quran:surah_list:v1'
    data = cache.get(cache_key)
    if data is None:
        data = list(Surah.objects.values('number', 'name_arabic', 'name_transliteration'))
        cache.set(cache_key, data, timeout=86400)  # 24 hours
    return Response(data)

# User-specific caches (invalidate on profile update)
def get_user_profile(user_id):
    cache_key = f'user:profile:{user_id}'
    return cache.get_or_set(
        cache_key,
        lambda: UserSerializer(User.objects.get(pk=user_id)).data,
        timeout=300  # 5 minutes
    )

# Per-view caching with decorator
from django.views.decorators.cache import cache_page
@cache_page(60 * 5)  # 5 minutes
def public_learning_paths(request):
    ...
```

**Cache invalidation strategy:**
```python
# signals.py — clear cache when model changes
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.cache import cache

@receiver(post_save, sender=User)
def clear_user_cache(sender, instance, **kwargs):
    cache.delete(f'user:profile:{instance.pk}')
    cache.delete_pattern('quran:*')  # if user changed their language preference
```

---

## F. DOCKER & DEPLOYMENT

### F1. Directory Structure

```
DeenFlow/
├── backend/
│   ├── config/
│   │   ├── settings.py          ← Production settings (env-driven)
│   │   ├── db_router.py         ← Read/write router
│   │   └── urls.py
│   ├── docker/
│   │   └── entrypoint.sh        ← DB-wait + migrate + start
│   └── Dockerfile               ← Multi-stage, non-root
├── postgres/
│   ├── primary/
│   │   ├── postgresql.conf      ← WAL, replication, TLS, slow-query log
│   │   └── pg_hba.conf          ← TLS-only, role-based auth
│   ├── init/
│   │   ├── 01_roles.sql         ← Role creation + privilege separation
│   │   └── 02_schema.sql        ← Performance indexes
│   └── scripts/
│       ├── backup.sh            ← Encrypted S3 backup
│       └── restore.sh           ← PITR restore procedure
├── secrets/                     ← *** In .gitignore — NEVER committed ***
│   ├── django.env
│   ├── postgres_password.txt
│   └── django_secret_key.txt
└── docker-compose.prod.yml      ← Full production topology
```

### F2. Deployment Checklist

```bash
# 1. Generate all secrets (first-time setup)
mkdir -p secrets
openssl rand -base64 40 > secrets/postgres_password.txt
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" \
    > secrets/django_secret_key.txt
echo "secrets/" >> .gitignore

# 2. Configure TLS certificates for Postgres
mkdir -p postgres/primary/ssl
# Generate self-signed (dev) or use Let's Encrypt / AWS ACM certs (prod)
openssl req -new -x509 -days 365 -nodes \
    -out postgres/primary/ssl/server.crt \
    -keyout postgres/primary/ssl/server.key

# 3. Copy .env.example and fill in your secrets/django.env
cp backend/.env.example secrets/django.env
# Edit secrets/django.env with real values (NOT committed to Git)

# 4. Deploy
docker-compose -f docker-compose.prod.yml up -d --build

# 5. Verify all services healthy
docker-compose -f docker-compose.prod.yml ps

# 6. Zero-downtime code deploy
docker-compose -f docker-compose.prod.yml up -d --no-deps --build django
```

---

## Operations Runbook

### Check Replication Lag
```sql
-- Run on primary
SELECT client_addr, state, sent_lsn, write_lsn, replay_lsn,
       pg_size_pretty(sent_lsn - replay_lsn) AS lag
FROM   pg_stat_replication;
```

### Identify Slow Queries
```sql
-- Top 10 slowest (requires pg_stat_statements extension)
SELECT LEFT(query, 80) AS query,
       calls,
       round(mean_exec_time::numeric, 2) AS avg_ms,
       round(total_exec_time::numeric, 2) AS total_ms
FROM   pg_stat_statements
ORDER  BY mean_exec_time DESC
LIMIT  10;
```

### Check Connection Usage
```sql
-- Are we approaching max_connections?
SELECT count(*) AS active,
       max_conn,
       round(100.0 * count(*) / max_conn, 1) AS pct_used
FROM   pg_stat_activity,
       (SELECT setting::int AS max_conn FROM pg_settings WHERE name = 'max_connections') s
GROUP  BY max_conn;
```

### Manual Backup Trigger
```bash
docker-compose -f docker-compose.prod.yml exec postgres_primary \
    bash /scripts/backup.sh
```

### Rolling Django Deploy (Zero Downtime)
```bash
# Build new image
docker-compose -f docker-compose.prod.yml build django

# Roll 1 replica at a time (Nginx keeps routing to the healthy ones)
docker-compose -f docker-compose.prod.yml up -d --no-deps --scale django=4 django
# Wait for health check to pass on the new replica(s)
sleep 30
docker-compose -f docker-compose.prod.yml up -d --no-deps --scale django=3 django
```

---

## Why This Architecture Achieves "Infinite" Users

```
Bottleneck          Solution                    Scales to
──────────────────────────────────────────────────────────
Read queries        → Add replicas              Linear read scale
Write bottleneck   → Sharding by user_id       10M+ write users
Connection count   → PgBouncer transaction pool No connection limit
Django throughput  → Horizontal container scale Add $$/containers
Cache misses       → Redis tiered cache         95%+ cache hit rate
Single-node DB     → Sharding + replication     Zero single point
Storage             → S3/SAN volumes            Petabytes
```

Each layer scales **independently**. You never need to redesign the architecture —  
only add more instances of whichever tier becomes the bottleneck.
