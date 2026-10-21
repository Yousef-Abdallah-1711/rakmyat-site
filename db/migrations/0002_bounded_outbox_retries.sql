ALTER TABLE inquiry_notifications
  DROP CONSTRAINT IF EXISTS inquiry_notifications_status_check;
ALTER TABLE inquiry_notifications
  ADD CONSTRAINT inquiry_notifications_status_check
  CHECK (status IN ('pending','sending','sent','failed'));
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'inquiry_notifications_attempts_check'
      AND conrelid = 'inquiry_notifications'::regclass
  ) THEN
    ALTER TABLE inquiry_notifications
      ADD CONSTRAINT inquiry_notifications_attempts_check
      CHECK (attempts >= 0 AND attempts <= 10);
  END IF;
END
$$;
