import postgres from "postgres";
import dotenv from "dotenv";
import { readFile } from "node:fs/promises";

dotenv.config({ path: ".env.local" });
if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL before running migrations.");
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: process.env.DATABASE_URL.includes("localhost") ? false : "require" });
try {
  await sql.unsafe(await readFile(new URL("../db/migrations/0001_contact_admin.sql", import.meta.url), "utf8"));
  console.log("Applied migration 0001_contact_admin.sql");
} finally { await sql.end(); }
