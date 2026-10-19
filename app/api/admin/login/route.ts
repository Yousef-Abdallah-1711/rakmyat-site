import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSession, consumeRateLimit, keyedDigest, requestAddressKey, verifyPassword, requireSameOrigin } from "@/lib/server/security";
import { getDatabase } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const bodySchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(200) });
const response = (body: unknown, status: number) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } });

export async function POST(request: Request) {
  if (!await requireSameOrigin(request)) return response({ error: "origin_rejected" }, 403);
  if (Number(request.headers.get("content-length") || 0) > 4096) return response({ error: "payload_too_large" }, 413);
  let raw: unknown;
  try { const text = await request.text(); if (new TextEncoder().encode(text).byteLength > 4096) return response({ error: "payload_too_large" }, 413); raw = JSON.parse(text); } catch { return response({ error: "invalid_request" }, 400); }
  const validated = bodySchema.safeParse(raw);
  if (!validated.success) return response({ error: "invalid_credentials" }, 401);
  try {
    const ip = requestAddressKey(request.headers); const account = keyedDigest(`admin:${validated.data.email.toLowerCase()}`);
    if (!await consumeRateLimit(`admin-login-ip:${ip}`, 10, 900) || !await consumeRateLimit(`admin-login-account:${account}`, 6, 900)) return response({ error: "rate_limited" }, 429);
    const sql = getDatabase();
    const rows = await sql`SELECT id, password_hash FROM admin_users WHERE lower(email)=lower(${validated.data.email}) AND disabled_at IS NULL LIMIT 1`;
    const accepted = !!rows[0] && await verifyPassword(validated.data.password, String(rows[0].password_hash));
    if (!accepted) return response({ error: "invalid_credentials" }, 401);
    await createAdminSession(String(rows[0].id));
    return response({ ok: true }, 200);
  } catch {
    console.error("admin_login_unavailable");
    return response({ error: "service_unavailable" }, 503);
  }
}
