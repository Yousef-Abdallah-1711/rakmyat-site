# Contact and email

Phase 4.3 evidence verifies synthetic English and Arabic submissions against local PostgreSQL and Mailpit, including outbox delivery/retry and restart behavior. It does not prove external SMTP delivery or production credentials.

Production Compose uses Hostinger's configured hostname, implicit TLS port 465, the existing fixed notification recipient, runtime file secret loading, and the existing authenticated outbox endpoint. The new rotated SMTP password is absent; no external email was sent. The worker remains private. The SMTP implementation sends from the web process after the authenticated internal worker trigger; web therefore needs outbound SMTP egress.

After the owner separately authorizes exactly one synthetic external test, record SMTP acceptance separately from owner-confirmed inbox receipt and outbox state. Do not read the mailbox through IMAP without separate authorization. A permanent failure must retain the inquiry and outbox state.
