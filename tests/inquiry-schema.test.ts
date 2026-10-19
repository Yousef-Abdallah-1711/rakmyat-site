import test from "node:test";
import assert from "node:assert/strict";
import { budgetTypes, inquiryInputSchema, parseInquiryPhone, serviceTypes, timelineTypes } from "../lib/inquiry-schema";

const valid = { fullName: "Test Client", phone: "+1 213 373 4253", idempotencyKey: "d6d78945-53c8-432e-8fe5-ed99b067cb44", website: "" };

test("accepts required contact details with optional project fields omitted", () => {
  const parsed = inquiryInputSchema.safeParse(valid);
  assert.equal(parsed.success, true);
  if (parsed.success) { assert.equal(parsed.data.email, null); assert.equal(parsed.data.phone, "+12133734253"); }
  assert.equal(inquiryInputSchema.safeParse({ ...valid, fullName: "  " }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, phone: "" }).success, false);
});

test("accepts English, Arabic, combining-mark, and ordinary punctuated names; rejects malformed values", () => {
  for (const fullName of ["Test Client", "O'Neil", "Robert O’Neil", "رقميات للتقنية", "مُحَمَّد", "Anne-Marie"]) assert.equal(inquiryInputSchema.safeParse({ ...valid, fullName }).success, true, fullName);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, fullName: "A\u0000B" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, fullName: "😀😀" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, fullName: "x".repeat(121) }).success, false);
});

test("normalizes valid Egyptian and international phone numbers to E.164", () => {
  const examples = [
    ["01012345678", "+201012345678"], ["+20 101 234 5678", "+201012345678"],
    ["٠١٠١٢٣٤٥٦٧٨", "+201012345678"], ["۰۱۰۱۲۳۴۵۶۷۸", "+201012345678"],
    ["+1 213 373 4253", "+12133734253"],
  ];
  for (const [phone, expected] of examples) assert.equal(parseInquiryPhone(phone), expected, phone);
});

test("rejects letters, invalid lengths, invalid calling codes, and invalid Egyptian mobile patterns", () => {
  for (const phone of ["call me 01012345678", "12345", "+999 123456789", "00000000000", "010123456789999999999", "<script>alert(1)</script>", "' OR '1'='1"]) {
    assert.equal(parseInquiryPhone(phone), null, phone);
    assert.equal(inquiryInputSchema.safeParse({ ...valid, phone }).success, false, phone);
  }
});

test("validates optional fields only when supplied and allowlists option identifiers", () => {
  assert.equal(inquiryInputSchema.safeParse(valid).success, true);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, email: "bad-email" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, email: "person@example.com" }).success, true);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, serviceType: "unknown" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, budget: "100000" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, timeline: "tomorrow" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, description: "x".repeat(5001) }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, referenceUrl: "javascript:alert(1)" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, referenceUrl: "data:text/html,evil" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, referenceUrl: "https://example.com" }).success, true);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, extra: "unexpected" }).success, false);
  assert.equal(inquiryInputSchema.safeParse({ ...valid, website: "bot" }).success, false);
});

test("keeps SQL-looking and markup-like description text as inert validated data", () => {
  for (const description of ["' OR '1'='1", "Robert'); DROP TABLE inquiries;--", "<img src=x onerror=alert(1)>"]) {
    const parsed = inquiryInputSchema.safeParse({ ...valid, description });
    assert.equal(parsed.success, true);
    if (parsed.success) assert.equal(parsed.data.description, description);
  }
});

test("published form option keys remain stable across localization", () => {
  assert.deepEqual(serviceTypes, ["website", "mobile-app", "business-system", "ai-automation", "integration", "other"]);
  assert.deepEqual(budgetTypes, ["not-set", "estimate", "range-ready", "prefer-not-to-say"]);
  assert.deepEqual(timelineTypes, ["exploring", "one-to-three-months", "three-to-six-months", "flexible"]);
});
