# Mailpit and outbox

Mailpit captures all staging email; SMTP is internal on port 1025 and its UI is loopback-only. The worker uses `FOR UPDATE SKIP LOCKED`, stale `sending` recovery, bounded exponential retry delays, and a `failed` state after the configured limit.

Inspect subject, sender, configured notification recipient, text/HTML, and Arabic encoding at `http://127.0.0.1:18025`. Mailpit capture proves local SMTP handoff only.
