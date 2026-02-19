-- =============================================================
--  DeenFlow — PostgreSQL Role & Security Bootstrap
--  Run ONCE on the primary when the cluster is first created.
--  Executed by Docker as /docker-entrypoint-initdb.d/01_roles.sql
-- =============================================================
-- ─── 1. Remove the public schema's public grants ────────────────────────
-- By default Postgres grants CREATE on public schema to all users.
-- We lock this down immediately.
REVOKE CREATE ON SCHEMA public
FROM PUBLIC;
REVOKE ALL ON DATABASE deenflow_prod
FROM PUBLIC;
-- ─── 2. Application Role (read + write on app tables) ───────────────────
CREATE ROLE deenflow_app WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT CONNECTION
LIMIT 50 PASSWORD 'REPLACED_BY_SECRET';
-- overwritten by secrets at runtime
-- Grant only the minimum required privileges
GRANT CONNECT ON DATABASE deenflow_prod TO deenflow_app;
GRANT USAGE ON SCHEMA public TO deenflow_app;
-- Allow app to use all current + future tables/sequences in public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT,
    INSERT,
    UPDATE,
    DELETE ON TABLES TO deenflow_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE,
    SELECT ON SEQUENCES TO deenflow_app;
-- ─── 3. Read-Only Role (analytics, reporting, replicas) ─────────────────
CREATE ROLE deenflow_readonly WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT CONNECTION
LIMIT 20 PASSWORD 'REPLACED_BY_SECRET';
GRANT CONNECT ON DATABASE deenflow_prod TO deenflow_readonly;
GRANT USAGE ON SCHEMA public TO deenflow_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO deenflow_readonly;
-- ─── 4. Replication Role (streaming replication only) ───────────────────
CREATE ROLE deenflow_replicator WITH LOGIN REPLICATION NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD 'REPLACED_BY_SECRET';
-- ─── 5. Monitoring Role (read pg_stat_* views, no app data access) ──────
CREATE ROLE postgres_monitor WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD 'REPLACED_BY_SECRET';
GRANT CONNECT ON DATABASE deenflow_prod TO postgres_monitor;
GRANT USAGE ON SCHEMA public TO postgres_monitor;
GRANT pg_monitor TO postgres_monitor;
-- ─── 6. Admin Role (humans only, not used by application code) ──────────
-- Admins connect via psql with MFA-protected credentials, not from app containers.
CREATE ROLE deenflow_admin WITH LOGIN NOSUPERUSER CREATEDB CREATEROLE PASSWORD 'REPLACED_BY_SECRET';
GRANT ALL PRIVILEGES ON DATABASE deenflow_prod TO deenflow_admin;
-- ─── 7. Row-Level Security (example for multi-tenant isolation) ──────────
-- Enable RLS on user-data tables so even a compromised app role
-- cannot see data belonging to other users without the correct policy.
-- Uncomment and adapt per model:
-- ALTER TABLE guidance_guidancesession ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY user_isolation ON guidance_guidancesession
--     USING (user_id = current_setting('app.current_user_id')::integer);
-- ─── 8. Extension Setup ─────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
-- slow query tracking
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- server-side hashing if needed
-- ─── 9. Audit Log Table ─────────────────────────────────────────────────
-- Tracks DDL changes by admin users
CREATE TABLE IF NOT EXISTS _audit_log (
    id BIGSERIAL PRIMARY KEY,
    ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor TEXT NOT NULL DEFAULT current_user,
    action TEXT NOT NULL,
    object_name TEXT,
    details JSONB
);
REVOKE ALL ON _audit_log
FROM PUBLIC;
GRANT INSERT ON _audit_log TO deenflow_admin;