# Hosting and domain

No approved hosting account, hostname, DNS zone, or deployment configuration was found in the repository evidence. `rakmyat.online` is the mailbox domain; it is not assumed to be the website hostname.

Two portable choices remain: managed containers with managed PostgreSQL, or Docker Compose on a dedicated Linux VPS. Managed services reduce routine database and host operations; the VPS keeps Compose portable but makes patching, TLS reachability, firewall, storage, backup, monitoring, and restore the owner's responsibility. Current vendor pricing is intentionally not stated or researched because provider selection is an owner decision.

`deployment/production.env.example` uses `approved-hostname-required.invalid` and no site URL as explicit placeholders. Production preflight rejects the placeholder. No DNS or public port was changed. After approval, the owner must provide the site hostname, deployment platform, and whether `www` should redirect; both canonical host and redirect must match that decision.
