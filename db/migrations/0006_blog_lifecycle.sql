-- Blog lifecycle, optimistic concurrency, and optional admin create idempotency.
-- Slugs remain reserved while posts are in the trash because the unique constraint
-- on blog_posts.slug is intentionally unchanged.
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS revision bigint NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS blog_posts_deleted_at_idx
  ON blog_posts (deleted_at, updated_at DESC)
  WHERE deleted_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS blog_post_idempotency (
  key_hash char(64) PRIMARY KEY,
  request_hash char(64) NOT NULL,
  post_id uuid REFERENCES blog_posts(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_post_idempotency_created_at_idx
  ON blog_post_idempotency (created_at);
