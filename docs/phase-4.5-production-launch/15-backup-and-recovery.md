# Backup and recovery

`scripts/production-backup.sh` streams a custom-format `pg_dump` directly into GPG encryption and verifies the archive by streaming decryption into `pg_restore --list`; plaintext is not written to disk. Set a public GPG recipient and a protected off-host backup destination. Restrict destination permissions and configure retention/immutability with the selected provider.

`scripts/production-restore-drill.sh` requires a pre-created disposable target and refuses the production/default database names. It will not drop or create a database. Review and rehearse this script against a separate disposable PostgreSQL instance before using a production backup.

These scripts have not been run against production and no off-host key, destination, retention policy, or schedule exists. A local Phase 4.3 synthetic restore is documented in that phase's evidence. Provisional targets for owner discussion: RPO 24 hours and RTO 4 hours; select stricter values if inquiry volume or business needs require them. Keep encryption private-key recovery separate and tested.
