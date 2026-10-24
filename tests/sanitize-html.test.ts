import { sanitizeBody, sanitizeRichHtml } from "../lib/sanitize-html";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Dangerous payloads: none of the active markup or URLs may survive.
const xssPayloads = [
  { input: '<script>alert("xss")</script>', desc: "script tag", forbidden: ["<script", "alert("] },
  { input: '<img src="x" onerror="alert(1)">', desc: "onerror attribute", forbidden: ["onerror"] },
  { input: '<a href="javascript:alert(1)">click</a>', desc: "javascript: URL", forbidden: ["javascript:"] },
  { input: '<iframe src="https://evil.com/malware"></iframe>', desc: "non-YouTube iframe", forbidden: ["<iframe", "evil.com"] },
  { input: '<svg onload="alert(1)"><circle /></svg>', desc: "SVG onload", forbidden: ["<svg", "onload"] },
  { input: '<img src="data:text/html,<script>alert(1)</script>">', desc: "data: URI", forbidden: ["data:", "<script"] },
  { input: '<div style="background: url(javascript:alert(1))">x</div>', desc: "style with JS URL", forbidden: ["javascript", "url(", "style="] },
  { input: '<p style="color: expression(alert(1))">x</p>', desc: "style expression()", forbidden: ["expression", "alert("] },
  { input: '<a href="/\\evil.com">x</a>', desc: "backslash protocol-relative link", forbidden: ["evil.com"] },
  { input: '<a href="//evil.com">x</a>', desc: "protocol-relative link", forbidden: ["evil.com"] },
  { input: '<iframe src="https://www.youtube.com.evil.com/embed/abc"></iframe>', desc: "YouTube lookalike host", forbidden: ["<iframe", "evil.com"] },
];

// Legitimate TipTap content that must survive sanitization.
const safeContent = [
  { input: "<p><strong>Hello</strong></p>", expected: "<p><strong>Hello</strong></p>", desc: "bold paragraph" },
  { input: "<h2>Section Title</h2>", expected: "<h2>Section Title</h2>", desc: "heading" },
  { input: "<ul><li>Item 1</li><li>Item 2</li></ul>", expected: "<ul><li>Item 1</li><li>Item 2</li></ul>", desc: "list" },
  { input: '<p style="text-align: center">Centered</p>', expected: '<p style="text-align: center">Centered</p>', desc: "TipTap text alignment" },
  { input: '<p><span style="color: #ff0000">Red</span></p>', expected: '<p><span style="color: #ff0000">Red</span></p>', desc: "TipTap text color" },
  { input: '<p><mark data-color="#ffff00" style="background-color: #ffff00; color: inherit">Marked</mark></p>', expected: '<p><mark data-color="#ffff00" style="background-color: #ffff00; color: inherit">Marked</mark></p>', desc: "TipTap highlight" },
  { input: "<pre><code class=\"language-js\">const a = 1;</code></pre>", expected: "<pre><code class=\"language-js\">const a = 1;</code></pre>", desc: "code block" },
  { input: '<img src="/uploads/images/photo.webp" alt="Photo">', containsSrc: "/uploads/images/photo.webp", desc: "local image" },
  { input: '<a href="https://example.com">Link</a>', containsHref: "https://example.com", desc: "safe link" },
  { input: '<iframe src="https://www.youtube.com/embed/abc123" allowfullscreen></iframe>', containsSrc: "youtube.com/embed/abc123", desc: "YouTube embed" },
  { input: '<iframe src="https://www.youtube-nocookie.com/embed/abc123" frameborder="0"></iframe>', containsSrc: "youtube-nocookie.com/embed/abc123", desc: "YouTube nocookie embed" },
];

describe("sanitizeRichHtml", () => {
  for (const { input, desc, forbidden } of xssPayloads) {
    it(`strips ${desc}`, () => {
      const output = sanitizeRichHtml(input);
      for (const fragment of forbidden) {
        assert.ok(!output.toLowerCase().includes(fragment.toLowerCase()), `output should not contain ${JSON.stringify(fragment)}: ${output}`);
      }
    });
  }

  for (const { input, desc, expected, containsHref, containsSrc } of safeContent) {
    it(`keeps ${desc}`, () => {
      const output = sanitizeRichHtml(input);
      if (expected !== undefined) assert.equal(output, expected);
      if (containsHref !== undefined) {
        assert.ok(output.includes(`href="${containsHref}"`), output);
        assert.ok(/rel="[^"]*noopener[^"]*"/.test(output), `rel should include noopener: ${output}`);
      }
      if (containsSrc !== undefined) assert.ok(output.includes(containsSrc), output);
    });
  }

  it("returns an empty string for empty or whitespace input", () => {
    assert.equal(sanitizeRichHtml(""), "");
    assert.equal(sanitizeRichHtml("   "), "");
  });
});

describe("sanitizeBody", () => {
  it("returns legacy plain-text bodies unchanged", () => {
    const plain = "Plain text with a & symbol and no tags.";
    assert.equal(sanitizeBody(plain), plain);
  });

  it("sanitizes bodies that contain HTML", () => {
    assert.equal(sanitizeBody('<p>Safe</p><script>alert(1)</script>'), "<p>Safe</p>");
  });

  it("returns empty string for empty input", () => {
    assert.equal(sanitizeBody(""), "");
  });
});
