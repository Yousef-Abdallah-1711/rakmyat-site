import "server-only";
import nodemailer from "nodemailer";
import { getDatabase } from "@/lib/server/db";

const DEFAULT_TO = "yoseabdallah866@gmail.com";
const MAX_ATTEMPTS = Math.max(1, Math.min(10, Number(process.env.OUTBOX_MAX_ATTEMPTS) || 5));
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

function mailTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !pass || !from) return null;
  if ((process.env.INQUIRY_NOTIFICATION_TO || DEFAULT_TO).toLowerCase() !== DEFAULT_TO) throw new Error("Notification recipient must match the owner-configured address");
  return { transport: nodemailer.createTransport({ host, port, secure: process.env.SMTP_SECURE === "true" || port === 465, auth: { user, pass }, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000 }), from };
}

/** Claims rows with SKIP LOCKED so concurrent workers cannot process the same notification. */
export async function processPendingInquiryNotifications(batchSize = 5) {
  const sql = getDatabase();
  const mail = mailTransport();
  if (!mail) return { processed: 0, sent: 0, pending: 0, failed: 0 };
  await sql`UPDATE inquiry_notifications
    SET status='failed', last_error=coalesce(last_error, 'Delivery attempt limit reached after worker interruption')
    WHERE attempts >= ${MAX_ATTEMPTS}
      AND ((status='pending' AND next_attempt_at <= now()) OR (status='sending' AND last_attempt_at < now()-interval '5 minutes'))`;
  const claimed = await sql.begin(async (tx) => tx`
    WITH candidates AS (
      SELECT n.inquiry_id
      FROM inquiry_notifications n
      WHERE n.attempts < ${MAX_ATTEMPTS}
        AND ((n.status = 'pending' AND n.next_attempt_at <= now())
         OR (n.status = 'sending' AND n.last_attempt_at < now() - interval '5 minutes'))
      ORDER BY n.next_attempt_at, n.id
      FOR UPDATE SKIP LOCKED
      LIMIT ${Math.max(1, Math.min(20, batchSize))}
    )
    UPDATE inquiry_notifications n
    SET status='sending', attempts=n.attempts+1, last_attempt_at=now()
    FROM candidates c
    WHERE n.inquiry_id=c.inquiry_id
    RETURNING n.inquiry_id, n.attempts
  `);
  const result = { processed: 0, sent: 0, pending: 0, failed: 0 };
  for (const row of claimed) {
    result.processed++;
    const inquiryId = String(row.inquiry_id);
    try {
      const [inquiry] = await sql`SELECT * FROM inquiries WHERE id=${inquiryId} LIMIT 1`;
      if (!inquiry) throw new Error("Inquiry record unavailable");
      const fields = ([
        ["Name", inquiry.full_name], ["Phone", inquiry.phone], ["Email", inquiry.email], ["Company", inquiry.company],
        ["Service", inquiry.service_type], ["Budget", inquiry.budget], ["Timeline", inquiry.timeline],
        ["Description", inquiry.description], ["Reference URL", inquiry.reference_url], ["Locale", inquiry.locale],
      ] as [string, unknown][]).filter(([, value]) => Boolean(value));
      await mail.transport.sendMail({
        from: mail.from,
        to: DEFAULT_TO,
        messageId: `<inquiry-${inquiryId}@rakmyat.local>`,
        subject: `New software inquiry: ${String(inquiry.full_name).slice(0, 80)}`,
        ...(inquiry.email ? { replyTo: String(inquiry.email) } : {}),
        text: fields.map(([key, value]) => `${key}: ${value}`).join("\n"),
        html: `<h1>New software inquiry</h1><dl>${fields.map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(String(value))}</dd>`).join("")}</dl>`,
      });
      await sql`UPDATE inquiry_notifications SET status='sent', sent_at=now(), last_error=NULL WHERE inquiry_id=${inquiryId}`;
      result.sent++;
    } catch (error) {
      const attempts = Number(row.attempts);
      const message = error instanceof Error ? error.message.replace(/(pass|password|auth|secret)[^ ]*/gi, "[redacted]").slice(0, 300) : "Email delivery failed";
      if (attempts >= MAX_ATTEMPTS) {
        await sql`UPDATE inquiry_notifications SET status='failed', last_error=${message} WHERE inquiry_id=${inquiryId}`;
        result.failed++;
      } else {
        const delayMinutes = Math.min(60, 2 ** Math.min(attempts, 6));
        await sql`UPDATE inquiry_notifications SET status='pending', next_attempt_at=now()+(${delayMinutes} * interval '1 minute'), last_error=${message} WHERE inquiry_id=${inquiryId}`;
        result.pending++;
      }
      console.error("inquiry_notification_delivery_failed", { attempt: attempts, final: attempts >= MAX_ATTEMPTS });
    }
  }
  return result;
}
