-- =============================================================
--  DeenFlow — Performance Indexes
--  Applied AFTER Django migrations have created the base tables.
--  Run with: python manage.py dbshell < postgres/init/02_schema.sql
--
--  Design principles:
--   - Every FK has an index (Django does NOT add these automatically)
--   - Composite indexes match the most common WHERE + ORDER BY patterns
--   - Partial indexes for hot filtered subsets (active, published, etc.)
--   - All CREATE INDEX use CONCURRENTLY — no table locks, zero downtime
-- =============================================================
-- ─── accounts_user ───────────────────────────────────────────────────────
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_email_lower ON accounts_user (LOWER(email));
-- case-insensitive login
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_is_active ON accounts_user (is_active)
WHERE is_active = TRUE;
-- partial: only active users
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_created_at ON accounts_user (date_joined DESC);
-- ─── guidance_guidancesession ────────────────────────────────────────────
-- Most queried table: user's question history, AI answers, flagged content
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_guidance_user_created ON guidance_guidancesession (user_id, created_at DESC);
-- "my questions" page
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_guidance_status ON guidance_guidancesession (status)
WHERE status IN ('pending_review', 'flagged');
-- admin flagged queue
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_guidance_category ON guidance_guidancesession (category_id, created_at DESC);
-- ─── quran_surah / quran_ayah ────────────────────────────────────────────
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ayah_surah_number ON quran_ayah (surah_id, number);
-- surah page loads
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ayah_juz ON quran_ayah (juz_number, surah_id, number);
-- juz navigation
-- Full-text search on Arabic text and translation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ayah_arabic_fts ON quran_ayah USING GIN (to_tsvector('arabic', arabic_text))
WHERE arabic_text IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ayah_translation_fts ON quran_ayah USING GIN (to_tsvector('english', translation_text))
WHERE translation_text IS NOT NULL;
-- ─── learning_* ──────────────────────────────────────────────────────────
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_enrollment_user ON learning_enrollment (user_id, enrolled_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_progress ON learning_progress (enrollment_id, lesson_id);
-- ─── notifications ───────────────────────────────────────────────────────
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notification_user_unread ON notifications_notification (user_id, created_at DESC)
WHERE is_read = FALSE;
-- unread badge count (hot path)
-- ─── analytics ───────────────────────────────────────────────────────────
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_event_user_ts ON analytics_event (user_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_event_type ON analytics_event (event_type, created_at DESC);
-- ─── community ───────────────────────────────────────────────────────────
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_post_created ON community_post (created_at DESC)
WHERE is_published = TRUE;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_post_author ON community_post (author_id, created_at DESC);
-- =============================================================
--  Query Analysis Cheatsheet (run periodically by DBAs)
-- =============================================================
--  Top 20 slowest queries:
--  SELECT query, calls, mean_exec_time, total_exec_time, rows
--  FROM   pg_stat_statements
--  ORDER  BY mean_exec_time DESC
--  LIMIT  20;
--  Missing indexes (sequential scans on large tables):
--  SELECT schemaname, tablename, seq_scan, seq_tup_read, n_live_tup
--  FROM   pg_stat_user_tables
--  WHERE  seq_scan > 100
--  ORDER  BY seq_tup_read DESC;
--  Bloated tables needing VACUUM:
--  SELECT tablename, n_dead_tup, n_live_tup,
--         round(100 * n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_pct
--  FROM   pg_stat_user_tables
--  ORDER  BY n_dead_tup DESC
--  LIMIT  20;
--  Replication lag (run on primary):
--  SELECT client_addr, state, sent_lsn, write_lsn, replay_lsn,
--         (sent_lsn - replay_lsn) AS lag_bytes
--  FROM   pg_stat_replication;