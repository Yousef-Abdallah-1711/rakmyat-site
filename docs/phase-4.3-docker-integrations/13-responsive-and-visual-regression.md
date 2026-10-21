# Responsive and visual regression

The Docker layer does not change the contact form fields or styling. The Playwright suite checked localized home, contact, portfolio, How We Work, and the private admin API at 390, 900, and 1440 px, including horizontal overflow. Manual Chromium browser submission also confirmed EN/AR form status and RTL. Screenshots: [English contact, 390 px](evidence/contact-en-390.png), [Arabic contact, 390 px](evidence/contact-ar-390.png), [admin login, 390 px](evidence/admin-login-390.png).

The existing Phase 4.2 route/viewport matrix is documented in `../phase-4.2-performance/README.md`. The Phase 4.3 screenshots show the unchanged contact UI served from the Docker production image.
