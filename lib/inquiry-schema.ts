import { parsePhoneNumber } from "libphonenumber-js/max";
import { z } from "zod";

export const serviceTypes = ["website", "mobile-app", "business-system", "ai-automation", "integration", "other"] as const;
export const budgetTypes = ["not-set", "estimate", "range-ready", "prefer-not-to-say"] as const;
export const timelineTypes = ["exploring", "one-to-three-months", "three-to-six-months", "flexible"] as const;
export const inquiryStatuses = ["new", "in-review", "contacted", "closed"] as const;

const digitMap: Record<string, string> = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };
export function normalizePhoneDigits(value: string) { return value.replace(/[٠-٩۰-۹]/g, (digit) => digitMap[digit] ?? digit); }

const isWellFormed = (value: string) => typeof value.isWellFormed !== "function" || value.isWellFormed();
const noControls = (value: string) => !/\p{Cc}/u.test(value) && isWellFormed(value);
export const fullNameSchema = z.string().trim().min(2).max(120).refine(noControls).refine((value) => /\p{L}/u.test(value)).refine((value) => /^[\p{L}\p{M} .’'‘-]+$/u.test(value));

export function parseInquiryPhone(value: string) {
  const normalized = normalizePhoneDigits(value.trim());
  if (normalized.length > 32 || !/^[+\d().\s-]+$/.test(normalized) || !/\d/.test(normalized)) return null;
  try {
    const parsed = parsePhoneNumber(normalized, { defaultCountry: "EG", extract: false }) as unknown as { isValid(): boolean; country?: string; getType(): string; number: string } | undefined;
    if (!parsed?.isValid()) return null;
    if (parsed.country === "EG" && parsed.getType() !== "MOBILE") return null;
    return parsed.number;
  } catch { return null; }
}
export const phoneSchema = z.string().trim().min(1).max(32).transform((value, context) => {
  const parsed = parseInquiryPhone(value);
  if (!parsed) { context.addIssue({ code: "custom", message: "invalid_phone" }); return z.NEVER; }
  return parsed;
});

export const emailValueSchema = z.string().trim().max(254).email();
export const companyValueSchema = z.string().trim().max(160).refine(noControls);
export const descriptionValueSchema = z.string().trim().max(5000).refine(noControls);
const optionalFreeText = (max: number) => z.string().trim().max(max).refine(noControls).optional().transform((value) => value || null);
const optionalEmail = emailValueSchema.optional().transform((value) => value || null);
export const referenceUrlValueSchema = z.string().trim().max(2048).transform((value, context) => {
  if (!value) return null;
  try { const url = new URL(value); if ((url.protocol === "http:" || url.protocol === "https:") && url.hostname) return url.href; } catch { /* invalid URL */ }
  context.addIssue({ code: "custom", message: "invalid_url" });
  return z.NEVER;
});

export const inquiryInputSchema = z.object({
  fullName: fullNameSchema,
  phone: phoneSchema,
  email: z.union([optionalEmail, z.literal("").transform(() => null)]).optional().transform((value) => value ?? null),
  company: optionalFreeText(160),
  serviceType: z.enum(serviceTypes).nullable().optional(),
  budget: z.enum(budgetTypes).nullable().optional(),
  timeline: z.enum(timelineTypes).nullable().optional(),
  description: optionalFreeText(5000),
  referenceUrl: z.union([referenceUrlValueSchema.optional(), z.literal("").transform(() => null)]).optional().transform((value) => value ?? null),
  website: z.string().max(0).optional(),
  idempotencyKey: z.string().uuid(),
}).strict();

export type InquiryInput = z.infer<typeof inquiryInputSchema>;
