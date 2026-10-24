// Server-side sanitization for admin-authored rich-text HTML (TipTap output).
// Route handlers import this module, so it never ships to the browser. The `server-only`
// package is not installed in this repo, so the guard is by convention, not by import.
import DOMPurify from "isomorphic-dompurify";

// Only the tags the admin editor (components/admin/RichTextEditor.tsx) actually generates.
// <iframe> is kept for YouTube embeds only; the hook below removes every other iframe.
const ALLOWED_TAGS = [
  "p", "br", "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "em", "s", "u", "mark", "code", "pre", "blockquote",
  "ul", "ol", "li",
  "a", "img",
  "div", "span",
  "iframe",
  "hr",
  "table", "thead", "tbody", "tr", "th", "td",
];

const ALLOWED_ATTR = [
  // Global
  "class", "id", "dir", "lang", "style",
  // Links
  "href", "target", "rel",
  // Images
  "src", "alt", "width", "height", "loading", "decoding",
  // YouTube iframe (src validated below)
  "allowfullscreen", "frameborder", "allow",
  // Attributes TipTap writes on highlight marks and YouTube wrappers
  "data-type", "data-color", "data-youtube-video",
];

// `style` is kept only for the few properties TipTap sets (text alignment, text and highlight color).
// Any value that could load a resource or run script is dropped.
const SAFE_STYLE_PROPERTIES = new Set(["text-align", "color", "background-color"]);
const SAFE_STYLE_VALUE = /^[#a-z0-9%(),.\s-]+$/i;
const UNSAFE_STYLE_VALUE = /expression|url|image|@import/i;

function sanitizeStyle(value: string): string {
  const kept: string[] = [];
  for (const declaration of value.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon < 0) continue;
    const property = declaration.slice(0, colon).trim().toLowerCase();
    const cssValue = declaration.slice(colon + 1).trim();
    if (!SAFE_STYLE_PROPERTIES.has(property)) continue;
    if (!cssValue || !SAFE_STYLE_VALUE.test(cssValue) || UNSAFE_STYLE_VALUE.test(cssValue)) continue;
    kept.push(`${property}: ${cssValue}`);
  }
  return kept.join("; ");
}

// Allow only https:, http:, mailto: and site-relative URLs on href and src.
// DOMPurify already strips javascript: in most attributes; this also blocks data: and blob:.
function isSafeUrl(url: string): boolean {
  const normalized = url.trim().toLowerCase();
  if (!normalized) return false;
  // "//host" and "/\host" are protocol-relative to browsers, so they are not site-relative paths.
  if (normalized.startsWith("//") || normalized.startsWith("/\\")) return false;
  if (normalized.startsWith("/")) return true;
  return /^(https?:|mailto:)/.test(normalized);
}

function isYouTubeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.hostname === "www.youtube.com" || u.hostname === "youtube.com" ||
            u.hostname === "www.youtube-nocookie.com" || u.hostname === "youtube-nocookie.com") &&
           u.pathname.startsWith("/embed/");
  } catch {
    return false;
  }
}

// DOMPurify hook: validate URLs, filter inline styles, and restrict iframes to YouTube embeds.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.hasAttribute("style")) {
    const style = sanitizeStyle(node.getAttribute("style") ?? "");
    if (style) node.setAttribute("style", style);
    else node.removeAttribute("style");
  }

  if (node.tagName === "A") {
    const href = node.getAttribute("href");
    if (href && !isSafeUrl(href)) node.removeAttribute("href");
    // Keep any existing rel tokens and make sure noopener and noreferrer are present.
    const tokens = new Set((node.getAttribute("rel") ?? "").split(/\s+/).filter(Boolean));
    tokens.add("noopener");
    tokens.add("noreferrer");
    node.setAttribute("rel", [...tokens].join(" "));
  }

  if (node.tagName === "IMG") {
    const src = node.getAttribute("src");
    if (src && !isSafeUrl(src)) node.removeAttribute("src");
  }

  if (node.tagName === "IFRAME") {
    const src = node.getAttribute("src");
    if (!src || !isYouTubeUrl(src)) node.remove();
  }
});

/**
 * Sanitize rich-text HTML from TipTap before it is saved. Empty input returns "".
 */
export function sanitizeRichHtml(html: string): string {
  if (!html || !html.trim()) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    WHOLE_DOCUMENT: false,
    RETURN_DOM: false,
  });
}

/**
 * Sanitize a body that may be rich HTML or legacy plain text.
 * Plain text (no tags) is returned unchanged so legacy post bodies keep their exact content.
 */
export function sanitizeBody(body: string): string {
  if (!body || !body.trim()) return "";
  // Same test BlogPostSection uses to decide whether a body is rendered as HTML.
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(body);
  return isHtml ? sanitizeRichHtml(body) : body;
}
