import dotenv from "dotenv";
import { closeDatabase } from "../lib/server/db";
import { processPendingInquiryNotifications } from "../lib/server/notifications";

dotenv.config({ path: ".env.local" });
if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL before processing inquiry notifications.");
try {
  const result = await processPendingInquiryNotifications(20);
  console.log(`Processed ${result.processed}; sent ${result.sent}; pending ${result.pending}; failed ${result.failed}.`);
} finally {
  await closeDatabase();
}
