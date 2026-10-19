import { z } from "zod";

export const serviceTypes = ["website", "mobile-app", "business-system", "ai-automation", "integration", "other"] as const;
export const budgetTypes = ["not-set", "estimate", "range-ready", "prefer-not-to-say"] as const;
export const timelineTypes = ["exploring", "one-to-three-months", "three-to-six-months", "flexible"] as const;
export const inquiryStatuses = ["new", "in-review", "contacted", "closed"] as const;

const optionalText = (max: number) => z.string().trim().max(max).optional().transform((value) => value || null);
// eslint-disable-next-line no-control-regex
const safeText = (max: number) => z.string().trim().min(2).max(max).refine((value) => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value));

export const inquiryInputSchema = z.object({
  fullName: safeText(120),
  phone: z.string().trim().min(7).max(32).regex(/^[+\d().\s-]+$/),
  email: z.union([z.string().trim().email().max(254), z.literal("")]).optional().transform((value) => value || null),
  company: optionalText(160),
  serviceType: z.enum(serviceTypes).nullable().optional(),
  budget: z.enum(budgetTypes).nullable().optional(),
  timeline: z.enum(timelineTypes).nullable().optional(),
  description: optionalText(5000),
  referenceUrl: z.union([z.string().trim().url().max(2048).refine((value) => /^https?:\/\//i.test(value)), z.literal("")]).optional().transform((value) => value || null),
  website: z.string().max(0).optional(),
  idempotencyKey: z.string().uuid(),
});

export type InquiryInput = z.infer<typeof inquiryInputSchema>;
