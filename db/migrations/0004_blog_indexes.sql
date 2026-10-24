-- 0004_blog_indexes.sql
-- Performance indexes for blog search and filtering.
-- Safe to re-run: all statements use IF NOT EXISTS or CREATE EXTENSION IF NOT EXISTS.

-- Enable trigram extension for ILIKE-compatible GIN indexes.
-- pg_trgm is available in PG17 and supports ILIKE/LIKE pattern matching.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN trigram indexes for ILIKE search on title and excerpt fields.
-- These allow the public and admin search queries to use an index instead of a full table scan.
-- The search queries use ILIKE '%term%' on these columns.
CREATE INDEX IF NOT EXISTS blog_posts_title_en_trgm_idx
  ON blog_posts USING gin (title_en gin_trgm_ops);

CREATE INDEX IF NOT EXISTS blog_posts_title_ar_trgm_idx
  ON blog_posts USING gin (title_ar gin_trgm_ops);

CREATE INDEX IF NOT EXISTS blog_posts_excerpt_en_trgm_idx
  ON blog_posts USING gin (excerpt_en gin_trgm_ops);

CREATE INDEX IF NOT EXISTS blog_posts_excerpt_ar_trgm_idx
  ON blog_posts USING gin (excerpt_ar gin_trgm_ops);

-- Author name index (public filter: author_name = $author, exact match).
CREATE INDEX IF NOT EXISTS blog_posts_author_name_idx
  ON blog_posts (author_name);

-- Composite index for the status + category filter with published-date ordering.
-- No partial predicate: status is already constrained to draft/published/archived by a CHECK,
-- so a WHERE status IN (...) clause would not narrow the index.
CREATE INDEX IF NOT EXISTS blog_posts_status_category_published_idx
  ON blog_posts (status, category_id, published_at DESC NULLS LAST);
