import "server-only";
import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/server/db";
import { trustedClientIp } from "@/lib/inquiry-security-policy";

const scrypt = (password: string, salt: Buffer, length: number) => new Promise<Buffer>((resolve, reject) => {
  scryptCallback(password, salt, length, (error, key) => error ? reject(error) : resolve(key));
});
export const SESSION_COOKIE = "rakmyat_admin_session";
const SESSION_HOURS = 12;

export function digest(value: string) { return createHash("sha256").update(value).digest("hex"); }
function pepper() { const value = process.env.RATE_LIMIT_SECRET; if (!value || value.length < 32) throw new Error("RATE_LIMIT_SECRET must be at least 32 characters"); return value; }
export function keyedDigest(value: string) { return createHmac("sha256", pepper()).update(value).digest("hex"); }

export function requestAddressKey(requestHeaders: Headers) {
  const configured = process.env.TRUSTED_CLIENT_IP_HEADER?.trim().toLowerCase();
  if (!configured && process.env.NODE_ENV !== "production") return keyedDigest("development:127.0.0.1");
  const address = trustedClientIp(requestHeaders, configured);
  if (!address) throw new Error("Trusted client IP header is missing or invalid");
  return keyedDigest(address);
}

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };
export async function consumeRateLimitDetailed(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(windowSeconds) || windowSeconds < 1) throw new Error("Invalid rate limit policy");
  const sql = getDatabase();
  const bucketKey = keyedDigest(key);
  const rows = await sql`INSERT INTO rate_limit_buckets (bucket_key, window_started_at, hits)
    VALUES (${bucketKey}, now(), 1)
    ON CONFLICT (bucket_key) DO UPDATE SET
      hits = CASE WHEN rate_limit_buckets.window_started_at <= now() - (${windowSeconds} * interval '1 second') THEN 1 ELSE rate_limit_buckets.hits + 1 END,
      window_started_at = CASE WHEN rate_limit_buckets.window_started_at <= now() - (${windowSeconds} * interval '1 second') THEN now() ELSE rate_limit_buckets.window_started_at END
    RETURNING hits, GREATEST(1, CEIL(EXTRACT(EPOCH FROM (window_started_at + (${windowSeconds} * interval '1 second') - now())))::integer) AS retry_after`;
  await sql`DELETE FROM rate_limit_buckets WHERE window_started_at < now() - interval '2 days'`;
  const hits = Number(rows[0]?.hits ?? limit + 1);
  return { allowed: hits <= limit, retryAfterSeconds: Math.max(1, Number(rows[0]?.retry_after ?? windowSeconds)) };
}

export async function consumeRateLimit(key: string, limit: number, windowSeconds: number) {
  return (await consumeRateLimitDetailed(key, limit, windowSeconds)).allowed;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  return scrypt(password, salt, 64).then((key) => `scrypt$${salt.toString("hex")}$${key.toString("hex")}`);
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, saltHex, keyHex] = stored.split("$");
  if (algorithm !== "scrypt" || !saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function createAdminSession(adminId: string) {
  const sql = getDatabase();
  const token = randomBytes(32).toString("base64url");
  const expiry = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await sql`DELETE FROM admin_sessions WHERE expires_at < now()`;
  await sql`INSERT INTO admin_sessions (token_hash, admin_id, expires_at) VALUES (${digest(token)}, ${adminId}, ${expiry})`;
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_HOURS * 60 * 60 });
}

export async function getAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[A-Za-z0-9_-]{40,50}$/.test(token)) return null;
  const sql = getDatabase();
  const rows = await sql`SELECT a.id, a.email FROM admin_sessions s JOIN admin_users a ON a.id=s.admin_id WHERE s.token_hash=${digest(token)} AND s.expires_at > now() AND a.disabled_at IS NULL LIMIT 1`;
  return rows[0] ?? null;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) { const sql = getDatabase(); await sql`DELETE FROM admin_sessions WHERE token_hash=${digest(token)}`; }
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  let expectedOrigin = url.origin;
  if (process.env.TRUSTED_CLIENT_IP_HEADER === "x-real-ip" && forwardedHost && forwardedProto) {
    try { expectedOrigin = new URL(`${forwardedProto}://${forwardedHost}`).origin; } catch { return false; }
  }
  try { if (origin && new URL(origin).origin === expectedOrigin) return true; } catch { return false; }
  const referer = request.headers.get("referer");
  try { return !!referer && new URL(referer).origin === expectedOrigin; } catch { return false; }
}
