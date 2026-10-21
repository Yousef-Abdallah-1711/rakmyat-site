# Backup and restore

Store backups under ignored `.phase43-backups/`; never write credentials into reports. A local custom-format backup exists at `.phase43-backups/phase43-20261019.dump` (15,598 bytes); it contains synthetic staging records only.

Restore was tested in a disposable database inside the dedicated PostgreSQL container. Inquiry/outbox/admin counts matched `9:9:1`; only the temporary restore database was dropped. The primary `rakmyat_phase43` database and named volume were preserved. Do not restore over the primary database.
