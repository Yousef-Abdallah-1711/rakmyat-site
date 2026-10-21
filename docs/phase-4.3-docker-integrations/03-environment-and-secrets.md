# Environment and secrets

`.env.docker.local` is ignored and contains only local ports/origins. `.phase43-secrets/` is ignored and holds random database, rate-limit, Mailpit, and worker secrets. Compose mounts them as secrets and the entrypoint exports only what the app needs. Never copy these files into reports or source control. `.env.example` contains placeholders only.

SMTP points to the local `mailpit` service. No Hostinger credentials are configured. Staging indexing is disabled and the staging database uses only the named Phase 4.3 volume.
