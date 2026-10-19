CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key uuid NOT NULL UNIQUE,
  full_name varchar(120) NOT NULL,
  phone varchar(32) NOT NULL,
  email varchar(254),
  company varchar(160),
  service_type varchar(32),
  budget varchar(32),
  timeline varchar(32),
  description text,
  reference_url varchar(2048),
  locale char(2) NOT NULL CHECK (locale IN ('en','ar')),
  status varchar(16) NOT NULL DEFAULT 'new' CHECK (status IN ('new','in-review','contacted','closed')),
  private_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_created_at_idx ON inquiries(status, created_at DESC);

CREATE TABLE IF NOT EXISTS inquiry_notifications (
  id bigserial PRIMARY KEY,
  inquiry_id uuid NOT NULL UNIQUE REFERENCES inquiries(id) ON DELETE CASCADE,
  status varchar(16) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','sent')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_attempt_at timestamptz,
  sent_at timestamptz,
  last_error varchar(500)
);
CREATE INDEX IF NOT EXISTS inquiry_notifications_retry_idx ON inquiry_notifications(status, next_attempt_at);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(254) NOT NULL UNIQUE,
  password_hash varchar(200) NOT NULL,
  disabled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash char(64) PRIMARY KEY,
  admin_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  bucket_key char(64) PRIMARY KEY,
  window_started_at timestamptz NOT NULL,
  hits integer NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_limit_buckets_window_started_at_idx ON rate_limit_buckets(window_started_at);
