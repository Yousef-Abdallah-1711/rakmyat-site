import postgres from "postgres";
import dotenv from "dotenv";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
const scrypt = (password: string, salt: Buffer, length: number) => new Promise<Buffer>((resolve, reject) => {
  scryptCallback(password, salt, length, (error, key) => error ? reject(error) : resolve(key));
});

dotenv.config({ path: ".env.local" });
async function hiddenPrompt(label: string) {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) throw new Error("Run this command in an interactive terminal so the password is not echoed.");
  process.stdout.write(label); process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding("utf8");
  return new Promise<string>((resolve, reject) => {
    let value = "";
    const finish = (error?: Error) => { process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.removeListener("data", onData); process.stdout.write("\n"); error ? reject(error) : resolve(value); };
    const onData = (chunk: string) => { for (const char of chunk) { if (char === "\u0003") return finish(new Error("Cancelled")); if (char === "\r" || char === "\n") return finish(); if (char === "\u007f" || char === "\b") value = value.slice(0, -1); else if (char >= " ") value += char; } };
    process.stdin.on("data", onData);
  });
}

if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL before provisioning an admin.");
const email = (await hiddenPrompt("Admin email: ")).trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error("Enter a valid email address.");
const password = await hiddenPrompt("New password (minimum 14 characters): ");
const confirmation = await hiddenPrompt("Confirm password: ");
if (password.length < 14 || password !== confirmation) throw new Error("Passwords must match and contain at least 14 characters.");
const salt = randomBytes(16); const hash = (await scrypt(password, salt, 64)).toString("hex"); const encoded = `scrypt$${salt.toString("hex")}$${hash}`;
const ssl = process.env.DATABASE_SSL === "false" || /localhost|127\.0\.0\.1|@postgres[:/]/.test(process.env.DATABASE_URL) ? false : "require";
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl });
try {
  const rows = await sql`INSERT INTO admin_users (email,password_hash) VALUES (${email},${encoded}) ON CONFLICT (email) DO NOTHING RETURNING id`;
  if (!rows.length) throw new Error("An admin with that email already exists; use a separate controlled credential rotation process.");
  console.log(`Provisioned admin account ${email}. The password was not displayed or stored in project files.`);
} finally { await sql.end(); }
