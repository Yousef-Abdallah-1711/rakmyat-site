param(
  [string]$ComposeFile = "docker-compose.production.yml",
  [string]$EnvFile = "deployment/production.env",
  [string]$SecretsDirectory = ".production-secrets"
)
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $ComposeFile)) { throw "Missing production Compose file." }
if (-not (Test-Path -LiteralPath $EnvFile)) { throw "Missing local production environment file: $EnvFile" }
$values = @{}
Get-Content -LiteralPath $EnvFile | ForEach-Object {
  if ($_ -match '^\s*([A-Z0-9_]+)=(.*)$') { $values[$Matches[1]] = $Matches[2].Trim().Trim('"') }
}
if (-not $values.PRODUCTION_HOSTNAME -or $values.PRODUCTION_HOSTNAME -match 'approved-hostname-required|example\.|\.invalid$|localhost') { throw "Set an owner-approved public hostname before production preflight." }
if ($values.ROBOTS_INDEXING_ENABLED -notin @("false", "true")) { throw "ROBOTS_INDEXING_ENABLED must be explicitly true or false." }
if ($values.ROBOTS_INDEXING_ENABLED -eq "true" -and $values.INDEXING_APPROVED -ne "true") { throw "Indexing requires a separate explicit INDEXING_APPROVED=true owner authorization." }
if ($values.TRUSTED_CLIENT_IP_HEADER -ne "x-real-ip") { throw "The production proxy must overwrite x-real-ip; configure CDN trust before changing this value." }
if ($values.SMTP_HOST -ne "smtp.hostinger.com" -or $values.SMTP_PORT -ne "465" -or $values.SMTP_SECURE -ne "true") { throw "SMTP must use the approved Hostinger implicit-TLS endpoint on port 465." }
if ($values.SMTP_USER -ne "info@rakmyat.online" -or $values.SMTP_FROM -ne "info@rakmyat.online") { throw "SMTP authentication and sender must use the configured Rakmyat mailbox." }
if ($values.INQUIRY_NOTIFICATION_TO -notmatch '^[^\s@]+@[^\s@]+\.[^\s@]+$') { throw "Set a valid owner-approved inquiry notification recipient." }
if ($values.ACTIVE_SLOT -notin @("blue", "green")) { throw "ACTIVE_SLOT must be blue or green." }
$imageNames = @("RAKMYAT_IMAGE_BLUE", "RAKMYAT_IMAGE_GREEN", "RAKMYAT_IMAGE_MIGRATION", "RAKMYAT_IMAGE_WORKER", "RAKMYAT_IMAGE_ADMIN")
foreach ($name in $imageNames) {
  if ($values[$name] -notmatch '^ghcr\.io/yousef-abdallah-1711/rakmyat-site:[a-f0-9]{40}$') { throw "$name must be the immutable GHCR image tag for a full commit SHA." }
}
if (-not $values.NEXT_PUBLIC_SITE_URL) { throw "Set the HTTPS site origin after the hostname is approved." }
try { $origin = [Uri]$values.NEXT_PUBLIC_SITE_URL } catch { throw "NEXT_PUBLIC_SITE_URL must be a valid HTTPS origin." }
if ($origin.Scheme -ne "https" -or $origin.Host -ne $values.PRODUCTION_HOSTNAME -or $origin.AbsolutePath -ne "/") { throw "Site origin must be HTTPS and match PRODUCTION_HOSTNAME exactly." }
$secretNames = @("postgres_bootstrap_password", "app_db_password", "migrator_db_password", "app_database_url", "migration_database_url", "rate_limit_secret", "smtp_password", "outbox_worker_secret")
$secretValues = @{}
foreach ($name in $secretNames) {
  $path = Join-Path $SecretsDirectory $name
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { throw "Missing local secret file: $path" }
  $value = [IO.File]::ReadAllText((Resolve-Path -LiteralPath $path)).TrimEnd("`r", "`n")
  if (-not $value) { throw "Empty local secret file: $path" }
  $secretValues[$name] = $value
}
foreach ($name in @("postgres_bootstrap_password", "app_db_password", "migrator_db_password")) {
  if ($secretValues[$name].Length -lt 24) { throw "Database passwords must be at least 24 characters." }
}
foreach ($name in @("rate_limit_secret", "outbox_worker_secret")) {
  if ($secretValues[$name].Length -lt 32) { throw "Application and worker secrets must be at least 32 characters." }
}
foreach ($pair in @(@("app_database_url", "rakmyat_app"), @("migration_database_url", "rakmyat_migrator"))) {
  try { $dbUri = [Uri]$secretValues[$pair[0]] } catch { throw "A database URL secret is malformed." }
  $credentials = [Uri]::UnescapeDataString($dbUri.UserInfo).Split(':', 2)
  if ($dbUri.Scheme -notin @("postgres", "postgresql") -or $dbUri.Host -ne "postgres" -or $dbUri.Port -ne 5432 -or $dbUri.AbsolutePath.TrimStart('/') -ne $values.POSTGRES_DB -or $credentials.Count -ne 2 -or $credentials[0] -ne $pair[1]) { throw "A database URL does not match the expected private production role/database." }
  $passwordFile = if ($pair[1] -eq "rakmyat_app") { "app_db_password" } else { "migrator_db_password" }
  if ($credentials[1] -ne $secretValues[$passwordFile]) { throw "Database URL and role password files do not match." }
}
if ($values.DATABASE_SSL -notin @("false", "true")) { throw "DATABASE_SSL must be explicitly true or false." }
Write-Output "Preflight inputs exist. Values and secrets were not printed. No production connection or mutation was attempted."
