import "server-only";
import nodemailer from "nodemailer";
import { getDatabase } from "@/lib/server/db";

const NOTIFICATION_TO = "yoseabdallah866@gmail.com";
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

function mailTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !pass || !from) return null;
  if (process.env.INQUIRY_NOTIFICATION_TO && process.env.INQUIRY_NOTIFICATION_TO.toLowerCase() !== NOTIFICATION_TO) throw new Error("INQUIRY_NOTIFICATION_TO must remain the owner-configured recipient");
  return { transport: nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass }, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000 }), from };
}

export async function deliverInquiryNotification(inquiryId: string) {
  const mail = mailTransport();
  if (!mail) return "pending" as const;
  const sql = getDatabase();
  const claim = await sql`UPDATE inquiry_notifications SET status='sending', attempts=attempts+1, last_attempt_at=now()
    WHERE inquiry_id=${inquiryId} AND status='pending' AND next_attempt_at <= now() RETURNING attempts`;
  if (!claim.length) return "pending" as const;
  const rows = await sql`SELECT * FROM inquiries WHERE id=${inquiryId} LIMIT 1`;
  const inquiry = rows[0];
  try {
    if (!inquiry) throw new Error("Inquiry record unavailable");
    const fields = [
      ["Name", inquiry.full_name], ["Phone", inquiry.phone], ["Email", inquiry.email], ["Company", inquiry.company],
      ["Service", inquiry.service_type], ["Budget", inquiry.budget], ["Timeline", inquiry.timeline],
      ["Description", inquiry.description], ["Reference URL", inquiry.reference_url], ["Locale", inquiry.locale],
    ].filter(([, value]) => Boolean(value));
    await mail.transport.sendMail({
      from: mail.from,
      to: NOTIFICATION_TO,
      subject: `New software inquiry: ${String(inquiry.full_name).slice(0, 80)}`,
      ...(inquiry.email ? { replyTo: String(inquiry.email) } : {}),
      text: fields.map(([key, value]) => `${key}: ${value}`).join("\n"),
      html: `<h1>New software inquiry</h1><dl>${fields.map(([key, value]) => `<dt>${escapeHtml(String(key))}</dt><dd>${escapeHtml(String(value))}</dd>`).join("")}</dl>`,
    });
    await sql`UPDATE inquiry_notifications SET status='sent', sent_at=now(), last_error=NULL WHERE inquiry_id=${inquiryId}`;
    return "sent" as const;
  } catch (error) {
    const attempts = Number(claim[0].attempts);
    const delayMinutes = Math.min(60, 2 ** Math.min(attempts, 6));
    const message = error instanceof Error ? error.message.replace(/(pass|password|auth|secret)[^ ]*/gi, "[redacted]").slice(0, 500) : "Email delivery failed";
    await sql`UPDATE inquiry_notifications SET status='pending', next_attempt_at=now()+(${delayMinutes} * interval '1 minute'), last_error=${message} WHERE inquiry_id=${inquiryId}`;
    return "pending" as const;
  }
}
