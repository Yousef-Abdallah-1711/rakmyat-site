# Rate limits and origin security

Inquiry origin checks require a valid Origin exactly equal to the request URL origin and, when configured, present in the explicit allowlist. Caddy overwrites the trusted client IP headers from the socket peer; application rate limits use PostgreSQL buckets and do not trust arbitrary client forwarding headers.

Staging allows only `http://127.0.0.1:5212` and `http://localhost:5212`. Exercise authorized, unauthorized, missing, malformed, mismatched Host, and bounded rate-limit cases. Production still fails closed without origin configuration.
