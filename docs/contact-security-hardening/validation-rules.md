# Validation rules

The client and API import the same rules from `lib/inquiry-schema.ts`. Browser validation is for usability; the API always parses the full payload independently.

| Field | Rule |
|---|---|
| Full name | Required; outer whitespace trimmed; 2–120 characters; Unicode letters/marks, spaces, apostrophes, and hyphens; control and malformed Unicode rejected. No Western name split is required. |
| Phone | Required; only digits, `+`, whitespace, parentheses, dots, and hyphens; Arabic-Indic and Eastern Arabic-Indic numerals normalize to ASCII. Parses as a valid numbering-plan number, default country Egypt; Egyptian numbers must classify as mobile. Stored as E.164. |
| Email | Optional; trim, max 254, valid email syntax when nonempty. |
| Company | Optional; trim, max 160, control characters rejected. |
| Project description | Optional; trim, max 5,000, control characters rejected. Markup and SQL-like text are data; it is neither interpreted nor removed. |
| Reference URL | Optional; max 2,048; parseable URL with only HTTP or HTTPS scheme. It is not fetched server-side. |
| Service, budget, timeline | Optional; exact existing server-side enum values only. |
| Honeypot | Must remain empty. |
| Payload keys | Strict object; unexpected fields are rejected. |

The phone parser rejects prose, unsupported punctuation, impossible country calling codes, invalid lengths/patterns, and invalid Egyptian mobile numbers. It does not apply an Egyptian length rule to other countries. The UI keeps the user's entry while server storage receives normalized E.164.

The form validates on blur, revalidates after touch or first submit, exposes field errors through `aria-invalid` and `aria-describedby`, presents an alert summary after invalid submission, and focuses the first invalid field. Only full name and phone are marked required. Values remain when an API error or 429 occurs.
