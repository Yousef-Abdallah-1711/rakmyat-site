import { isIP } from "node:net";

function originOf(value: string | null | undefined) {
  if (!value) return null;
  try { const url = new URL(value); return url.origin === value ? url.origin : null; } catch { return null; }
}

export function isAllowedInquiryOrigin(originHeader: string | null, requestOrigin: string, configuredOrigins: string | undefined, production: boolean) {
  const origin = originOf(originHeader);
  if (!origin) return false;
  const configured = configuredOrigins?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
  if (configured.length) return configured.some((item) => originOf(item) === origin);
  if (production) return false;
  const target = originOf(requestOrigin);
  if (!target) return false;
  const originUrl = new URL(origin);
  const targetUrl = new URL(target);
  const loopback = (hostname: string) => hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  return originUrl.protocol === targetUrl.protocol && originUrl.port === targetUrl.port && loopback(originUrl.hostname) && loopback(targetUrl.hostname);
}

export function trustedClientIp(headers: Headers, configuredHeader: string | undefined) {
  const header = configuredHeader?.trim().toLowerCase();
  if (!header || !/^[a-z0-9-]+$/.test(header)) return null;
  const address = headers.get(header)?.trim();
  return address && !address.includes(",") && isIP(address) !== 0 ? address : null;
}

export function parsePositiveLimit(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > 10000) return null;
  return parsed;
}

export function retryAfterForLimits(...limits: { allowed: boolean; retryAfterSeconds: number }[]) {
  const blocked = limits.filter((limit) => !limit.allowed);
  return blocked.length ? Math.max(...blocked.map((limit) => Math.max(1, limit.retryAfterSeconds))) : null;
}
