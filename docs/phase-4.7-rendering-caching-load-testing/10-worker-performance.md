# 10 — Email outbox worker

The standalone worker polls the internal outbox endpoint every 10 seconds by default, uses a 20-second HTTP timeout, and exposes only a local heartbeat file for its health check. The endpoint is protected by a bearer secret. Notification delivery uses a database outbox and bounded retries (maximum five attempts); claims use database row locking so separate worker processes do not claim the same pending item at once.

Production compose budgets the worker at 256 MiB, 0.5 CPU and 80 processes, separate from the 1.5 GiB / 2 CPU web container. The application pool is up to 8 connections per web process. This phase did not load SMTP, send mail, or benchmark queue drain throughput. Use Mailpit or a dedicated SMTP sink and a seeded disposable queue before measuring worker throughput. Keep provider rate limits, exponential retry delay, dead-letter visibility and queue age in monitoring.
