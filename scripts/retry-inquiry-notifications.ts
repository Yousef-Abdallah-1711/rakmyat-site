import postgres from "postgres";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

const recipient = "yoseabdallah866@gmail.com";
const safe = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
dotenv.config({ path: ".env.local" });
if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL before retrying inquiry notifications.");
if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM) throw new Error("Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM before retrying.");
if (process.env.INQUIRY_NOTIFICATION_TO && process.env.INQUIRY_NOTIFICATION_TO.toLowerCase() !== recipient) throw new Error("INQUIRY_NOTIFICATION_TO must remain the owner-configured recipient.");
const port = Number(process.env.SMTP_PORT);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("SMTP_PORT must be a valid port number.");
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: process.env.DATABASE_URL.includes("localhost") ? false : "require" });
const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000 });
try {
  await sql`UPDATE inquiry_notifications SET status='pending', next_attempt_at=now() WHERE status='sending' AND last_attempt_at < now()-interval '10 minutes'`;
  const items = await sql`SELECT n.inquiry_id, n.attempts, i.* FROM inquiry_notifications n JOIN inquiries i ON i.id=n.inquiry_id WHERE n.status='pending' AND n.next_attempt_at<=now() ORDER BY n.next_attempt_at LIMIT 100`;
  let sent = 0;
  for (const item of items) {
    const claimed = await sql`UPDATE inquiry_notifications SET status='sending', attempts=attempts+1,last_attempt_at=now() WHERE inquiry_id=${item.inquiry_id} AND status='pending' AND next_attempt_at<=now() RETURNING attempts`;
    if (!claimed.length) continue;
    const fields = [["Name",item.full_name],["Phone",item.phone],["Email",item.email],["Company",item.company],["Service",item.service_type],["Budget",item.budget],["Timeline",item.timeline],["Description",item.description],["Reference URL",item.reference_url],["Locale",item.locale]].filter(([,value])=>Boolean(value));
    try {
      await transport.sendMail({ from:process.env.SMTP_FROM, to:recipient, subject:`New software inquiry: ${String(item.full_name).slice(0,80)}`, ...(item.email?{replyTo:String(item.email)}:{}), text:fields.map(([key,value])=>`${key}: ${value}`).join("\n"), html:`<h1>New software inquiry</h1><dl>${fields.map(([key,value])=>`<dt>${safe(String(key))}</dt><dd>${safe(String(value))}</dd>`).join("")}</dl>` });
      await sql`UPDATE inquiry_notifications SET status='sent',sent_at=now(),last_error=NULL WHERE inquiry_id=${item.inquiry_id}`; sent++;
    } catch(error) {
      const attempts=Number(claimed[0].attempts); const delay=Math.min(60,2**Math.min(attempts,6));
      const message=error instanceof Error?error.message.replace(/(pass|password|auth|secret)[^ ]*/gi,"[redacted]").slice(0,500):"Email delivery failed";
      await sql`UPDATE inquiry_notifications SET status='pending',next_attempt_at=now()+(${delay}*interval '1 minute'),last_error=${message} WHERE inquiry_id=${item.inquiry_id}`;
    }
  }
  console.log(`Retried ${items.length} pending notifications; delivered ${sent}.`);
} finally { transport.close(); await sql.end(); }
