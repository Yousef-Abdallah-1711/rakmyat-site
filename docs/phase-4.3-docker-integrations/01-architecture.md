# Architecture

The local stack contains a standalone Next.js runtime, PostgreSQL, Mailpit, Caddy loopback edge, one-shot migration service, and authenticated email-worker. App, PostgreSQL, Mailpit, and worker share a dedicated internal bridge network. Caddy is the only service also attached to a separate bridge network for Docker Desktop host port forwarding; only its loopback-bound ports (127.0.0.1:5212 and 127.0.0.1:18025) are published. PostgreSQL and SMTP remain private.

An inquiry and outbox row are committed atomically. The web process returns after commit. The worker calls a constant-time-secret authenticated internal endpoint; SQL row locks with SKIP LOCKED prevent concurrent claims. SMTP is at-least-once; stable Message-ID reduces duplicates but cannot guarantee exactly-once delivery.
