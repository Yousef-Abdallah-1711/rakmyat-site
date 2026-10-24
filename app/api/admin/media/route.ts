import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getAdminSession, requireSameOrigin } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MediaKind = "image" | "video";

const MAX_BYTES = 50 * 1024 * 1024;
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const DIRS: Record<MediaKind, string> = {
  image: path.join(UPLOAD_ROOT, "images"),
  video: path.join(UPLOAD_ROOT, "videos"),
};
const EXTENSIONS: Record<MediaKind, string[]> = {
  image: ["jpg", "png", "webp", "gif", "avif"],
  video: ["mp4", "webm"],
};
const MIME_TYPES: Record<string, { kind: MediaKind; ext: string }> = {
  "image/jpeg": { kind: "image", ext: "jpg" },
  "image/png": { kind: "image", ext: "png" },
  "image/webp": { kind: "image", ext: "webp" },
  "image/gif": { kind: "image", ext: "gif" },
  "image/avif": { kind: "image", ext: "avif" },
  "video/mp4": { kind: "video", ext: "mp4" },
  "video/webm": { kind: "video", ext: "webm" },
};
const DELETE_PATTERN = /^\/uploads\/(images|videos)\/([A-Za-z0-9][A-Za-z0-9._-]{0,200})$/;

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: noStore });
}

// The declared MIME type is client-supplied, so confirm the leading bytes match the format.
function matchesSignature(bytes: Uint8Array, mime: string) {
  const startsWith = (sig: number[], offset = 0) => sig.every((byte, index) => bytes[offset + index] === byte);
  const ascii = (text: string, offset = 0) => [...text].every((char, index) => bytes[offset + index] === char.charCodeAt(0));
  switch (mime) {
    case "image/jpeg": return startsWith([0xff, 0xd8, 0xff]);
    case "image/png": return startsWith([0x89, 0x50, 0x4e, 0x47]);
    case "image/gif": return ascii("GIF8");
    case "image/webp": return ascii("RIFF") && ascii("WEBP", 8);
    case "image/avif": return ascii("ftyp", 4) && (ascii("avif", 8) || ascii("avis", 8));
    case "video/mp4": return ascii("ftyp", 4);
    case "video/webm": return startsWith([0x1a, 0x45, 0xdf, 0xa3]);
    default: return false;
  }
}

export async function POST(request: Request) {
  if (!await getAdminSession()) return json({ error: "unauthorized" }, 401);
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BYTES + 1024 * 1024) return json({ error: "file_too_large" }, 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "invalid_form" }, 400);
  }
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "missing_file" }, 400);
  const spec = MIME_TYPES[file.type];
  if (!spec) return json({ error: "unsupported_type" }, 415);
  if (file.size === 0) return json({ error: "empty_file" }, 400);
  if (file.size > MAX_BYTES) return json({ error: "file_too_large" }, 413);

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matchesSignature(buffer.subarray(0, 16), file.type)) return json({ error: "content_mismatch" }, 415);

  // Static images become WebP, resized to fit 1920x1080 (never enlarged) with EXIF stripped.
  // GIFs keep their animation and videos are stored as-is. If sharp cannot decode the file, the original is kept.
  let outputBuffer = buffer;
  let outputExt = spec.ext;
  if (spec.kind === "image" && spec.ext !== "gif") {
    try {
      outputBuffer = await sharp(buffer)
        .rotate()
        .resize({ width: 1920, height: 1080, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
      outputExt = "webp";
    } catch {
      console.error("admin_media_optimize_failed");
    }
  }

  const name = `${Date.now()}-${randomBytes(3).toString("hex")}.${outputExt}`;
  const dir = DIRS[spec.kind];
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), outputBuffer, { flag: "wx" });
  } catch {
    return json({ error: "write_failed" }, 500);
  }
  return json({
    url: `/uploads/${spec.kind === "image" ? "images" : "videos"}/${name}`,
    name,
    size: outputBuffer.byteLength,
    type: spec.kind,
    originalSize: buffer.byteLength,
  }, 201);
}

async function listKind(kind: MediaKind) {
  let entries: string[];
  try {
    entries = await fs.readdir(DIRS[kind]);
  } catch {
    return [];
  }
  const files = await Promise.all(entries.map(async (name) => {
    const ext = path.extname(name).slice(1).toLowerCase();
    if (!EXTENSIONS[kind].includes(ext)) return null;
    try {
      const stat = await fs.stat(path.join(DIRS[kind], name));
      if (!stat.isFile()) return null;
      return {
        url: `/uploads/${kind === "image" ? "images" : "videos"}/${name}`,
        name,
        size: stat.size,
        type: kind,
        created_at: (stat.birthtime.getTime() > 0 ? stat.birthtime : stat.mtime).toISOString(),
      };
    } catch {
      return null;
    }
  }));
  return files.filter((file): file is NonNullable<typeof file> => file !== null);
}

export async function GET() {
  if (!await getAdminSession()) return json({ error: "unauthorized" }, 401);
  const [images, videos] = await Promise.all([listKind("image"), listKind("video")]);
  const files = [...images, ...videos].sort((a, b) => b.created_at.localeCompare(a.created_at));
  return json({ files });
}

export async function DELETE(request: Request) {
  if (!await getAdminSession()) return json({ error: "unauthorized" }, 401);
  if (!await requireSameOrigin(request)) return json({ error: "origin_rejected" }, 403);

  const url = new URL(request.url).searchParams.get("url") ?? "";
  const match = DELETE_PATTERN.exec(url);
  if (!match) return json({ error: "invalid_url" }, 400);
  const kind: MediaKind = match[1] === "images" ? "image" : "video";
  const name = match[2];
  if (!EXTENSIONS[kind].includes(path.extname(name).slice(1).toLowerCase())) return json({ error: "invalid_url" }, 400);

  const target = path.resolve(DIRS[kind], name);
  if (!target.startsWith(path.resolve(UPLOAD_ROOT) + path.sep)) return json({ error: "invalid_url" }, 400);
  try {
    await fs.unlink(target);
  } catch {
    return json({ error: "not_found" }, 404);
  }
  return json({ ok: true });
}
