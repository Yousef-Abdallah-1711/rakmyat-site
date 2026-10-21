/** Escape JSON-LD for safe placement inside an HTML script element. */
export function escapeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
