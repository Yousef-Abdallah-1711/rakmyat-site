import test from "node:test";
import assert from "node:assert/strict";
import { budgetTypes, inquiryInputSchema, serviceTypes, timelineTypes } from "../lib/inquiry-schema";

const valid = { fullName: "Test Client", phone: "+1 212 555 0101", idempotencyKey: "d6d78945-53c8-432e-8fe5-ed99b067cb44", website: "" };

test("accepts required contact details with optional project fields omitted", () => {
  const parsed = inquiryInputSchema.safeParse(valid);
  assert.equal(parsed.success, true);
  if (parsed.success) assert.equal(parsed.data.email, null);
});

test("rejects missing name, malformed phone, invalid email, and non-http reference URLs", () => {
  assert.equal(inquiryInputSchema.safeParse({ ...valid, fullName: " " }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, phone: "call me maybe" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, email: "bad-email" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, referenceUrl: "javascript:alert(1)" }).success, false);
});

test("rejects honeypot content, oversize fields, and unrecognized option keys", () => {
  assert.equal(inquiryInputSchema.safeParse({ ...valid, website: "bot" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, description: "x".repeat(5001) }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, serviceType: "unknown" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, budget: "100000" }).success, false);
});

test("published form option keys remain stable across localization", () => {
  assert.deepEqual(serviceTypes, ["website", "mobile-app", "business-system", "ai-automation", "integration", "other"]);
  assert.deepEqual(budgetTypes, ["not-set", "estimate", "range-ready", "prefer-not-to-say"]);
  assert.deepEqual(timelineTypes, ["exploring", "one-to-three-months", "three-to-six-months", "flexible"]);
});
