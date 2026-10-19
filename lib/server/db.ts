import "server-only";
import postgres from "postgres";

let client: ReturnType<typeof postgres> | undefined;

export function getDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  client ??= postgres(url, { max: 8, idle_timeout: 20, connect_timeout: 10, prepare: false, ssl: url.includes("localhost") ? false : "require" });
  return client;
}
