import { NextResponse } from "next/server";
import { inquiryInputSchema } from "@/lib/inquiry-schema";
import { getDatabase } from "@/lib/server/db";
import { consumeRateLimit, requestAddressKey } from "@/lib/server/security";
import { deliverInquiryNotification } from "@/lib/server/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (body: unknown, status: number) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } });

async function readBoundedJson(request: Request, maxBytes = 16 * 1024) {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new Error("too_large");
  if (!request.body) throw new Error("invalid_json");
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > maxBytes) { await reader.cancel(); throw new Error("too_large"); } chunks.push(value); }
  const all = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { all.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(all)); } catch { throw new Error("invalid_json"); }
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return json({ error: "invalid_content_type" }, 415);
  let raw: unknown;
  try { raw = await readBoundedJson(request); } catch (error) { return json({ error: error instanceof Error && error.message === "too_large" ? "payload_too_large" : "invalid_json" }, error instanceof Error && error.message === "too_large" ? 413 : 400); }
  const parsed = inquiryInputSchema.safeParse(raw);
  if (!parsed.success) return json({ error: "invalid_fields", fields: parsed.error.flatten().fieldErrors }, 422);
  if (parsed.data.website) return json({ error: "invalid_fields" }, 422);
  const locale = request.headers.get("x-rakmyat-locale") === "ar" ? "ar" : "en";
  try {
    const address = await requestAddressKey();
    if (!await consumeRateLimit(`inquiry:${address}`, 5, 900)) return json({ error: "rate_limited" }, 429);
    const sql = getDatabase();
    const record = await sql.begin(async (tx) => {
      const inserted = await tx`INSERT INTO inquiries (idempotency_key,full_name,phone,email,company,service_type,budget,timeline,description,reference_url,locale)
        VALUES (${parsed.data.idempotencyKey},${parsed.data.fullName},${parsed.data.phone},${parsed.data.email},${parsed.data.company},${parsed.data.serviceType ?? null},${parsed.data.budget ?? null},${parsed.data.timeline ?? null},${parsed.data.description},${parsed.data.referenceUrl},${locale})
        ON CONFLICT (idempotency_key) DO NOTHING RETURNING id`;
      if (inserted.length) {
        await tx`INSERT INTO inquiry_notifications (inquiry_id) VALUES (${inserted[0].id}) ON CONFLICT (inquiry_id) DO NOTHING`;
        return { id: String(inserted[0].id), created: true };
      }
      const duplicate = await tx`SELECT id FROM inquiries WHERE idempotency_key=${parsed.data.idempotencyKey} LIMIT 1`;
      return { id: String(duplicate[0].id), created: false };
    });
    const notification = record.created ? await deliverInquiryNotification(record.id) : "pending";
    return json({ ok: true, id: record.id, notification }, record.created ? 201 : 200);
  } catch {
    console.error("inquiry_persist_failed");
    return json({ error: "service_unavailable" }, 503);
  }
}
