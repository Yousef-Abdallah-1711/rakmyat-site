UPDATE inquiry_notifications SET status='pending' WHERE status='failed';
ALTER TABLE inquiry_notifications DROP CONSTRAINT IF EXISTS inquiry_notifications_attempts_check;
ALTER TABLE inquiry_notifications DROP CONSTRAINT IF EXISTS inquiry_notifications_status_check;
ALTER TABLE inquiry_notifications ADD CONSTRAINT inquiry_notifications_status_check CHECK (status IN ('pending','sending','sent'));
