import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { resolveMediaPath, mediaRoot } from "@/lib/media-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const immutable = "public, max-age=31536000, immutable";

export async function GET(_request: Request, { params }: { params: Promise<{ media: string[] }> }) {
  const { media } = await params;
  if (media.length !== 2) return new Response(null, { status: 404 });
  const resolved = resolveMediaPath(mediaRoot(), media[0], media[1]);
  if (!resolved) return new Response(null, { status: 404 });
  try {
    const metadata = await stat(resolved.path);
    if (!metadata.isFile()) return new Response(null, { status: 404 });
    const stream = Readable.toWeb(createReadStream(resolved.path)) as ReadableStream;
    return new Response(stream, {
      headers: {
        "Content-Type": resolved.type,
        "Content-Length": String(metadata.size),
        "Cache-Control": immutable,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
}
