# Admin security tests

The existing server-side session authorization and login throttling are retained. Validate invalid/nonexistent login, unauthenticated API/page access, logout invalidation, cookie flags, same-origin mutation checks, SQL injection-shaped search, and escaped user text.

Run only against synthetic Phase 4.3 records. Do not use or alter production credentials. Results are pending live stack execution.
