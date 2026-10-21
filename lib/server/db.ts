import "server-only";
import postgres from "postgres";

let client: ReturnType<typeof postgres> | undefined;

export function getDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const ssl = process.env.DATABASE_SSL === "false" || /localhost|127\.0\.0\.1|@postgres[:/]/.test(url) ? false : "require";
  client ??= postgres(url, { max: 8, idle_timeout: 20, connect_timeout: 10, prepare: false, ssl });
  return client;
}

export async function closeDatabase() {
  if (!client) return;
  const current = client;
  client = undefined;
  await current.end({ timeout: 5 });
}
