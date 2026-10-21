# Admin functional tests

Admin routes remain `/admin/login` and `/admin/inquiries`. The Compose tools profile ran the existing no-echo provisioning script with a random synthetic credential (minimum 14 characters); the temporary test account and local plaintext test secret were removed after lifecycle verification. No default or owner account is seeded. The owner can provision a real staging admin with the documented command.

Test login, protected listing, search/status/detail flows supported by the current app, logout, session cookie, and direct unauthenticated requests. The dashboard currently caps results at 100; pagination is a documented gap.
