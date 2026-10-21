#!/bin/sh
set -eu

APP_DB_PASSWORD="$(cat /run/secrets/app_db_password)"
MIGRATOR_DB_PASSWORD="$(cat /run/secrets/migrator_db_password)"
export APP_DB_PASSWORD MIGRATOR_DB_PASSWORD

# psql literal quoting protects arbitrary passwords from SQL/shell injection.
psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --set ON_ERROR_STOP=1 <<'SQL'
\getenv app_password APP_DB_PASSWORD
\getenv migrator_password MIGRATOR_DB_PASSWORD
SELECT format('CREATE ROLE rakmyat_app LOGIN PASSWORD %L', :'app_password') \gexec
SELECT format('CREATE ROLE rakmyat_migrator LOGIN PASSWORD %L', :'migrator_password') \gexec
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
SELECT format('GRANT CONNECT ON DATABASE %I TO rakmyat_app, rakmyat_migrator', current_database()) \gexec
GRANT USAGE ON SCHEMA public TO rakmyat_app;
GRANT USAGE, CREATE ON SCHEMA public TO rakmyat_migrator;
ALTER DEFAULT PRIVILEGES FOR ROLE rakmyat_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO rakmyat_app;
ALTER DEFAULT PRIVILEGES FOR ROLE rakmyat_migrator IN SCHEMA public
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO rakmyat_app;
SQL

unset APP_DB_PASSWORD MIGRATOR_DB_PASSWORD
