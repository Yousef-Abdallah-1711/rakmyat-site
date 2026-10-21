import test from "node:test";
import assert from "node:assert/strict";
import { isAllowedInquiryOrigin, parsePositiveLimit, retryAfterForLimits, trustedClientIp } from "../lib/inquiry-security-policy";

test("origin policy requires exact configured origins in production", () => {
  assert.equal(isAllowedInquiryOrigin("https://site.example", "https://site.example", "https://site.example, https://www.site.example", true), true);
  assert.equal(isAllowedInquiryOrigin("https://www.site.example", "https://site.example", "https://site.example, https://www.site.example", true), false);
  assert.equal(isAllowedInquiryOrigin("https://evil.example", "https://site.example", "https://site.example", true), false);
  assert.equal(isAllowedInquiryOrigin("https://site.example.attacker.test", "https://site.example", "https://site.example", true), false);
  assert.equal(isAllowedInquiryOrigin("null", "https://site.example", "https://site.example", true), false);
  assert.equal(isAllowedInquiryOrigin(null, "https://site.example", "https://site.example", true), false);
  assert.equal(isAllowedInquiryOrigin("http://127.0.0.1:5210", "http://127.0.0.1:5210", undefined, false), true);
  assert.equal(isAllowedInquiryOrigin("https://localhost:5175", "https://localhost:5175", undefined, true), false);
});

test("only a configured single validated IP header is accepted", () => {
  const headers = new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1", "x-trusted-client-ip": "2001:db8::1" });
  assert.equal(trustedClientIp(headers, "x-trusted-client-ip"), "2001:db8::1");
  assert.equal(trustedClientIp(headers, undefined), null);
  assert.equal(trustedClientIp(headers, "x-forwarded-for"), null);
  assert.equal(trustedClientIp(new Headers({ "x-trusted-client-ip": "not-an-ip" }), "x-trusted-client-ip"), null);
});

test("configured limit parsing rejects invalid values and uses explicit defaults", () => {
  assert.equal(parsePositiveLimit(undefined, 3), 3);
  assert.equal(parsePositiveLimit("10", 3), 10);
  for (const invalid of ["0", "-1", "1.5", "NaN", "10001"]) assert.equal(parsePositiveLimit(invalid, 3), null);
});

test("retry-after selects the longest active blocked window", () => {
  assert.equal(retryAfterForLimits({ allowed: true, retryAfterSeconds: 900 }, { allowed: true, retryAfterSeconds: 86400 }), null);
  assert.equal(retryAfterForLimits({ allowed: false, retryAfterSeconds: 26 }, { allowed: true, retryAfterSeconds: 86400 }), 26);
  assert.equal(retryAfterForLimits({ allowed: false, retryAfterSeconds: 26 }, { allowed: false, retryAfterSeconds: 700 }), 700);
});
