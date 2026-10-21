import { writeFile } from "node:fs/promises";

const endpoint = process.env.OUTBOX_WORKER_URL;
const secret = process.env.OUTBOX_WORKER_SECRET;
const interval = Math.max(2000, Number(process.env.OUTBOX_WORKER_INTERVAL_MS) || 10000);
if (!endpoint || !secret) throw new Error("Outbox worker configuration is incomplete.");
let stopping = false;
for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => { stopping = true; });
while (!stopping) {
  try {
    const response = await fetch(endpoint, { method: "POST", headers: { authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`cycle status ${response.status}`);
    await response.body?.cancel();
    await writeFile("/tmp/outbox-worker-heartbeat", String(Date.now()), { mode: 0o600 });
  } catch {
    console.error("outbox_worker_cycle_failed");
  }
  if (!stopping) await new Promise((resolve) => setTimeout(resolve, interval));
}
