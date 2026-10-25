import path from "node:path";

const mediaNamePattern = /^[A-Za-z0-9][A-Za-z0-9._-]{0,200}$/;
const mediaTypes: Record<string, string> = {
  jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif",
  mp4: "video/mp4", webm: "video/webm",
};

export function mediaRoot() {
  return process.env.MEDIA_ROOT || path.join(process.cwd(), "public", "uploads");
}

export function resolveMediaPath(root: string, kind: string, name: string) {
  if (!(["images", "videos"] as string[]).includes(kind) || !mediaNamePattern.test(name)) return null;
  const ext = path.extname(name).slice(1).toLowerCase();
  if (!mediaTypes[ext] || (kind === "images" && !ext.match(/^(jpg|png|webp|gif|avif)$/)) || (kind === "videos" && !ext.match(/^(mp4|webm)$/))) return null;
  const base = path.resolve(root, kind);
  const target = path.resolve(base, name);
  if (!target.startsWith(`${base}${path.sep}`)) return null;
  return { path: target, type: mediaTypes[ext] };
}

export async function readRequestBodyBounded(request: Request, maxBytes: number): Promise<Uint8Array | null> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > maxBytes) return null;
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel("request body limit exceeded").catch(() => undefined);
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.byteLength; }
  return result;
}
