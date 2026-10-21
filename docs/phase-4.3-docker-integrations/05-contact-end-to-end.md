# Contact end-to-end

Use `/en/contact` and `/ar/contact` at `http://127.0.0.1:5212`. Submit synthetic records only. A valid submission should return 201 and a persisted inquiry UUID; duplicate idempotency keys should not create a second inquiry. Run `npm.cmd run phase43:e2e` to execute the browser tests. Its fixture reset truncates only `rate_limit_buckets` in the exact local Phase 4.3 container so the suite can rerun without changing stored inquiries.

Verify client-side required/optional validation, persistence, locale, outbox row, failure retention, Arabic RTL, keyboard operation, and mobile layout against the live stack. Current browser/API evidence will be recorded in 14-test-results.md.
