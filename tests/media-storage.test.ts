import test from "node:test";
import assert from "node:assert/strict";
import { readRequestBodyBounded, resolveMediaPath } from "../lib/media-storage";

function chunkedRequest(chunks: Uint8Array[]) {
  const body = new ReadableStream<Uint8Array>({
    start(controller) { for (const chunk of chunks) controller.enqueue(chunk); controller.close(); },
  });
  return new Request("http://localhost/api/admin/media", {
    method: "POST",
    headers: { "content-type": "application/octet-stream" },
    body,
    // This intentionally models a body with no Content-Length header.
    duplex: "half",
  } as RequestInit);
}

test("bounded reader accepts a 12 MiB chunked body without Content-Length", async () => {
  const bytes = new Uint8Array(12 * 1024 * 1024);
  const body = await readRequestBodyBounded(chunkedRequest([bytes.subarray(0, 5_000_000), bytes.subarray(5_000_000)]), 51 * 1024 * 1024);
  assert.equal(body?.byteLength, bytes.byteLength);
});

test("bounded reader rejects an oversized chunked body", async () => {
  const body = await readRequestBodyBounded(chunkedRequest([new Uint8Array(700_000), new Uint8Array(400_000)]), 1_000_000);
  assert.equal(body, null);
});

test("media paths accept only supported filenames under the selected media directory", () => {
  assert.deepEqual(resolveMediaPath("/data/uploads", "videos", "12-demo.mp4"), {
    path: "/data/uploads/videos/12-demo.mp4", type: "video/mp4",
  });
  assert.equal(resolveMediaPath("/data/uploads", "videos", "../secret.mp4"), null);
  assert.equal(resolveMediaPath("/data/uploads", "other", "image.jpg"), null);
  assert.equal(resolveMediaPath("/data/uploads", "images", "image.svg"), null);
});
