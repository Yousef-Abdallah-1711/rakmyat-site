"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type MediaFile = { url: string; name: string; size: number; type: "image" | "video"; created_at: string };
type SortKey = "date" | "name" | "size";

const MAX_BYTES = 50 * 1024 * 1024;
const IMAGE_ACCEPT: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/avif": [".avif"],
};
const VIDEO_ACCEPT: Record<string, string[]> = {
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
};
const ALL_ACCEPT_MIME = [...Object.keys(IMAGE_ACCEPT), ...Object.keys(VIDEO_ACCEPT)].join(",");
const errorMessages: Record<string, string> = {
  unauthorized: "Session expired. Sign in again.",
  file_too_large: "File is larger than 50 MB.",
  unsupported_type: "File type not allowed.",
  content_mismatch: "File content does not match its type.",
  empty_file: "File is empty.",
  network: "Network error. Try again.",
  not_found: "File not found — it may have already been deleted.",
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
}

function uploadWithProgress(file: File, onProgress: (pct: number) => void): Promise<MediaFile> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/media");
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      let payload: { url?: string; name?: string; size?: number; type?: "image" | "video"; error?: string } = {};
      try { payload = JSON.parse(xhr.responseText) as typeof payload; } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && payload.url && payload.name && payload.type) {
        resolve({ url: payload.url, name: payload.name, size: payload.size ?? file.size, type: payload.type, created_at: new Date().toISOString() });
      } else {
        reject(new Error(errorMessages[payload.error ?? ""] ?? "Upload failed. Try again."));
      }
    };
    xhr.onerror = () => reject(new Error(errorMessages.network));
    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  });
}

export function AdminMediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showNotice(msg: string) {
    setNotice(msg);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 4000);
  }

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as { files?: MediaFile[]; error?: string };
      if (!res.ok || !data.files) throw new Error(errorMessages[data.error ?? ""] ?? "Unable to load media.");
      setFiles(data.files);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load media.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadFiles(); }, [loadFiles]);

  const sorted = [...files]
    .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "size") return b.size - a.size;
      return b.created_at.localeCompare(a.created_at);
    });

  function toggleSelect(url: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url); else next.add(url);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === sorted.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sorted.map((f) => f.url)));
    }
  }

  async function deleteSingle(file: MediaFile) {
    if (!window.confirm(`Delete "${file.name}"?\n\nPosts using this file will show a broken image.`)) return;
    try {
      const res = await fetch(`/api/admin/media?url=${encodeURIComponent(file.url)}`, { method: "DELETE" });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorMessages[d.error ?? ""] ?? "Delete failed.");
      }
      setFiles((prev) => prev.filter((f) => f.url !== file.url));
      setSelected((prev) => { const next = new Set(prev); next.delete(file.url); return next; });
      showNotice(`Deleted "${file.name}".`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  async function bulkDelete() {
    if (selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} file(s)? This cannot be undone.`)) return;
    setBulkDeleting(true);
    const toDelete = [...selected];
    const failures: string[] = [];
    for (const url of toDelete) {
      try {
        const res = await fetch(`/api/admin/media?url=${encodeURIComponent(url)}`, { method: "DELETE" });
        if (!res.ok) { const d = (await res.json().catch(() => ({}))) as { error?: string }; throw new Error(d.error ?? "delete_failed"); }
        setFiles((prev) => prev.filter((f) => f.url !== url));
        setSelected((prev) => { const next = new Set(prev); next.delete(url); return next; });
      } catch {
        failures.push(url);
      }
    }
    setBulkDeleting(false);
    if (failures.length > 0) {
      setError(`${failures.length} file(s) could not be deleted. They may already be gone.`);
    } else {
      showNotice(`Deleted ${toDelete.length} file(s).`);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    if (!file) return;
    setUploadError("");
    setProgress(0);
    try {
      const uploaded = await uploadWithProgress(file, setProgress);
      setProgress(null);
      setFiles((prev) => [uploaded, ...prev]);
      showNotice(`Uploaded "${uploaded.name}".`);
    } catch (err) {
      setProgress(null);
      setUploadError(err instanceof Error ? err.message : errorMessages.network);
    }
  }

  return (
    <section className="admin-dashboard">
      <div className="admin-main">
        {/* Header */}
        <div className="admin-heading">
          <div>
            <p>Private workspace</p>
            <h1>Media library · مكتبة الوسائط</h1>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <button
              type="button"
              onClick={() => void loadFiles()}
              disabled={loading}
              className="px-3 py-1.5 text-sm rounded-md border border-[#dfe4ea] bg-white hover:bg-[#f0eff5] disabled:opacity-50 transition-colors"
            >
              Refresh
            </button>
            <label className="px-3 py-1.5 text-sm rounded-md bg-[#1763bf] text-white hover:bg-[#0d55ad] cursor-pointer transition-colors">
              Upload file · رفع ملف
              <input
                ref={fileInputRef}
                type="file"
                accept={ALL_ACCEPT_MIME}
                className="sr-only"
                onChange={handleFileChange}
                disabled={progress !== null}
              />
            </label>
          </div>
        </div>

        {/* Upload progress */}
        {progress !== null && (
          <div className="mb-4 rounded-md bg-[#f0eff5] p-3">
            <div className="flex items-center justify-between mb-1 text-sm text-[#20242a]">
              <span>Uploading…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#dfe4ea] overflow-hidden">
              <div
                className="h-2 rounded-full bg-[#1763bf] transition-all"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              />
            </div>
          </div>
        )}

        {/* Notices */}
        {notice && (
          <p role="status" className="mb-4 rounded-md bg-green-50 border border-green-200 text-green-800 px-3 py-2 text-sm flex items-center justify-between">
            {notice}
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice" className="ml-2 text-green-600 hover:text-green-800">✕</button>
          </p>
        )}
        {uploadError && (
          <p role="alert" className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-800 px-3 py-2 text-sm flex items-center justify-between">
            {uploadError}
            <button type="button" onClick={() => setUploadError("")} aria-label="Dismiss error" className="ml-2 text-red-600 hover:text-red-800">✕</button>
          </p>
        )}
        {error && (
          <p role="alert" className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-800 px-3 py-2 text-sm flex items-center justify-between">
            {error}
            <button type="button" onClick={() => setError("")} aria-label="Dismiss error" className="ml-2 text-red-600 hover:text-red-800">✕</button>
          </p>
        )}

        {/* Filters + sort */}
        <div className="flex flex-wrap gap-3 mb-4 items-end">
          <label className="flex flex-col gap-1 text-sm text-[#20242a] font-medium min-w-[200px]">
            Search · بحث
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filename…"
              className="px-3 py-1.5 rounded-md border border-[#dfe4ea] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1763bf]/30 focus:border-[#1763bf]"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[#20242a] font-medium">
            Sort · ترتيب
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-3 py-1.5 rounded-md border border-[#dfe4ea] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1763bf]/30 focus:border-[#1763bf]"
            >
              <option value="date">Newest first</option>
              <option value="name">Name A–Z</option>
              <option value="size">Largest first</option>
            </select>
          </label>
          {sorted.length > 0 && (
            <div className="flex gap-2 ml-auto items-end">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="px-3 py-1.5 text-sm rounded-md border border-[#dfe4ea] bg-white hover:bg-[#f0eff5] transition-colors"
              >
                {selected.size === sorted.length ? "Deselect all" : `Select all (${sorted.length})`}
              </button>
              {selected.size > 0 && (
                <button
                  type="button"
                  onClick={() => void bulkDelete()}
                  disabled={bulkDeleting}
                  className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {bulkDeleting ? "Deleting…" : `Delete selected (${selected.size})`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* States */}
        {loading && <p className="text-[#666] text-sm py-8 text-center">Loading media… · جاري التحميل…</p>}
        {!loading && !error && sorted.length === 0 && (
          <div className="py-16 text-center text-[#666]">
            <p className="text-lg font-medium mb-1">No files yet · لا توجد ملفات</p>
            <p className="text-sm">{search ? "No files match your search." : "Upload a file to get started."}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && sorted.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 list-none p-0 m-0">
            {sorted.map((file) => {
              const isSelected = selected.has(file.url);
              return (
                <li
                  key={file.url}
                  className={`relative rounded-lg border bg-white overflow-hidden transition-all ${isSelected ? "border-[#1763bf] ring-2 ring-[#1763bf]/30" : "border-[#dfe4ea] hover:border-[#1763bf]/40"}`}
                >
                  {/* Checkbox */}
                  <label className="absolute top-2 left-2 z-10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(file.url)}
                      className="w-4 h-4 accent-[#1763bf]"
                      aria-label={`Select ${file.name}`}
                    />
                  </label>

                  {/* Thumbnail */}
                  <div className="aspect-square bg-[#f0eff5] flex items-center justify-center overflow-hidden">
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-[#666]" aria-hidden="true">▶</span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="p-2">
                    <p className="text-xs font-medium text-[#20242a] truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-[#666] mt-0.5">{formatSize(file.size)} · {formatDate(file.created_at)}</p>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => void deleteSingle(file)}
                    aria-label={`Delete ${file.name}`}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm text-red-600 hover:bg-red-600 hover:text-white text-xs font-bold transition-colors flex items-center justify-center border border-[#dfe4ea]"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* File count summary */}
        {!loading && files.length > 0 && (
          <p className="mt-4 text-xs text-[#666]">
            {sorted.length === files.length
              ? `${files.length} file${files.length !== 1 ? "s" : ""} total`
              : `${sorted.length} of ${files.length} files shown`}
          </p>
        )}
      </div>
    </section>
  );
}
