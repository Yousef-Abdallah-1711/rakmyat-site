# Final handoff

Local URLs: web `http://127.0.0.1:5212`; Mailpit `http://127.0.0.1:18025`. Start/stop/log commands are in README. Keep the isolated named volumes for evidence; stop without `-v`.

Phase 4.3 local staging is complete against synthetic data. The project is still not production-ready. To stop without deleting local data: `docker compose --env-file .env.docker.local -f docker-compose.phase-4.3.yml -p rakmyat-phase43-staging down`.

Hostinger delivery remains a separate gated test. Before starting it, the owner must explicitly approve sending one synthetic external message and provide a newly rotated mailbox password through a local secret store. No external email has been sent; no deployment occurred.
