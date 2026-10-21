import postgres from "postgres";
import dotenv from "dotenv";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

dotenv.config({ path: ".env.local" });
const databaseUrl = process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Set MIGRATION_DATABASE_URL (or DATABASE_URL) before running migrations.");
const ssl = process.env.DATABASE_SSL === "false" || /localhost|127\.0\.0\.1|@postgres[:/]/.test(databaseUrl) ? false : "require";
const sql = postgres(databaseUrl, { max: 1, prepare: false, ssl });
try {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (version varchar(120) PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
  const directory = resolve(process.cwd(), "db/migrations");
  const migrations = (await readdir(directory)).filter((name) => /^\d{4}_[a-z0-9_]+\.sql$/i.test(name)).sort();
  for (const name of migrations) {
    const applied = await sql`SELECT 1 FROM schema_migrations WHERE version=${name} LIMIT 1`;
    if (applied.length) continue;
    const body = await readFile(resolve(directory, name), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(body);
      await tx`INSERT INTO schema_migrations (version) VALUES (${name})`;
    });
    console.log(`Applied ${name}`);
  }
} finally {
  await sql.end({ timeout: 5 });
}
