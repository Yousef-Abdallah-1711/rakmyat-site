import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimitReadOnly, consumeRateLimitDetailed, createAdminSession, isAdminIpAllowlisted, keyedDigest, requestAddressKey, verifyPassword, requireSameOrigin, type RateLimitResult } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const bodySchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(200) });
const response = (body: unknown, status: number) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } });
const IP_LIMIT = 10;
const ACCOUNT_LIMIT = 6;
const WINDOW_SECONDS = 900;

function rateLimited(results: RateLimitResult[]) {
  const retryAfter = Math.max(0, ...results.map((result) => (result.allowed ? 0 : result.retryAfterSeconds)));
  return NextResponse.json(
    { error: "rate_limited" },
    { status: 429, headers: { "Cache-Control": "no-store, max-age=0", "Retry-After": String(retryAfter) } }
  );
}

export async function POST(request: Request) {
  if (!await requireSameOrigin(request)) return response({ error: "origin_rejected" }, 403);
  if (Number(request.headers.get("content-length") || 0) > 4096) return response({ error: "payload_too_large" }, 413);
  let raw: unknown;
  try { const text = await request.text(); if (new TextEncoder().encode(text).byteLength > 4096) return response({ error: "payload_too_large" }, 413); raw = JSON.parse(text); } catch { return response({ error: "invalid_request" }, 400); }
  const validated = bodySchema.safeParse(raw);
  if (!validated.success) return response({ error: "invalid_credentials" }, 401);
  const allowlisted = isAdminIpAllowlisted(request.headers);
  try {
    const ip = requestAddressKey(request.headers); const account = keyedDigest(`admin:${validated.data.email.toLowerCase()}`);
    const ipKey = `admin-login-ip:${ip}`;
    const accountKey = `admin-login-account:${account}`;
    // 1. Read-only check: refuse early when a bucket is already over its limit. Nothing is incremented here,
    //    so a successful login never consumes a token.
    if (!allowlisted) {
      const [ipState, accountState] = await Promise.all([
        checkRateLimitReadOnly(ipKey, IP_LIMIT, WINDOW_SECONDS),
        checkRateLimitReadOnly(accountKey, ACCOUNT_LIMIT, WINDOW_SECONDS),
      ]);
      if (!ipState.allowed || !accountState.allowed) return rateLimited([ipState, accountState]);
    }
    // 2. Verify the password.
    const sql = getDatabase();
    const rows = await sql`SELECT id, password_hash FROM admin_users WHERE lower(email)=lower(${validated.data.email}) AND disabled_at IS NULL LIMIT 1`;
    const accepted = !!rows[0] && await verifyPassword(validated.data.password, String(rows[0].password_hash));
    // 3. Success: create the session without touching the rate-limit buckets.
    if (accepted) {
      await createAdminSession(String(rows[0].id));
      return response({ ok: true }, 200);
    }
    // 4. Wrong password: only now consume a token for each bucket and report 429 if either is exhausted.
    if (!allowlisted) {
      const ipResult = await consumeRateLimitDetailed(ipKey, IP_LIMIT, WINDOW_SECONDS);
      const accountResult = await consumeRateLimitDetailed(accountKey, ACCOUNT_LIMIT, WINDOW_SECONDS);
      if (!ipResult.allowed || !accountResult.allowed) return rateLimited([ipResult, accountResult]);
    }
    return response({ error: "invalid_credentials" }, 401);
  } catch {
    console.error("admin_login_unavailable");
    return response({ error: "service_unavailable" }, 503);
  }
}
