"use client";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./MediaLibrary.module.css";

export type MediaFile = { url: string; name: string; size: number; type: "image" | "video"; created_at?: string };
type Tab = "upload" | "library";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  /** "image" limits both the library listing and the upload picker to images (used by the cover and editor image pickers). */
  kind?: "image" | "all";
};

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
const errorMessages: Record<string, string> = {
  unauthorized: "Your session has expired. Sign in again. · انتهت الجلسة. سجّل الدخول مجددًا.",
  file_too_large: "The file is larger than 50 MB. · الملف أكبر من 50 ميغابايت.",
  unsupported_type: "This file type is not allowed. · نوع الملف غير مسموح.",
  content_mismatch: "The file content does not match its type. · محتوى الملف لا يطابق نوعه.",
  empty_file: "The file is empty. · الملف فارغ.",
  network: "Network error. Try again. · خطأ في الشبكة. حاول مرة أخرى.",
};

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function uploadWithProgress(file: File, onProgress: (percent: number) => void) {
  return new Promise<MediaFile>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/media");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      let payload: { url?: string; name?: string; size?: number; type?: "image" | "video"; error?: string } = {};
      try {
        payload = JSON.parse(xhr.responseText) as typeof payload;
      } catch {
        payload = {};
      }
      if (xhr.status >= 200 && xhr.status < 300 && payload.url && payload.name && payload.type) {
        resolve({ url: payload.url, name: payload.name, size: payload.size ?? file.size, type: payload.type });
      } else {
        reject(new Error(errorMessages[payload.error ?? ""] ?? "Upload failed. Try again. · فشل الرفع. حاول مرة أخرى."));
      }
    };
    xhr.onerror = () => reject(new Error(errorMessages.network));
    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  });
}

export function MediaLibrary({ isOpen, onClose, onSelect, kind = "all" }: Props) {
  const [tab, setTab] = useState<Tab>("library");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [notice, setNotice] = useState("");

  const visibleFiles = kind === "image" ? files.filter((file) => file.type === "image") : files;

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as { files?: MediaFile[]; error?: string };
      if (!response.ok || !payload.files) throw new Error(errorMessages[payload.error ?? ""] ?? "Unable to load the media library.");
      setFiles(payload.files);
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Unable to load the media library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setTab("library");
    setUploadError("");
    setNotice("");
    void loadFiles();
  }, [isOpen, loadFiles]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  async function handleUpload(file: File) {
    setUploadError("");
    setNotice("");
    setProgress(0);
    try {
      const uploaded = await uploadWithProgress(file, setProgress);
      setProgress(null);
      setNotice(`Uploaded ${uploaded.name}. · تم رفع الملف.`);
      setTab("library");
      await loadFiles();
    } catch (error) {
      setProgress(null);
      setUploadError(error instanceof Error ? error.message : errorMessages.network);
    }
  }

  const accept = kind === "image" ? IMAGE_ACCEPT : { ...IMAGE_ACCEPT, ...VIDEO_ACCEPT };
  const dropzone = useDropzone({
    accept,
    maxSize: MAX_BYTES,
    multiple: false,
    disabled: progress !== null,
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) {
        const reason = rejected[0].errors[0]?.code === "file-too-large" ? errorMessages.file_too_large : errorMessages.unsupported_type;
        setUploadError(reason);
        return;
      }
      if (accepted[0]) void handleUpload(accepted[0]);
    },
  });

  async function deleteFile(file: MediaFile) {
    if (!window.confirm(`Delete ${file.name}? Posts that use it will show a broken image. · حذف الملف؟`)) return;
    setListError("");
    try {
      const response = await fetch(`/api/admin/media?url=${encodeURIComponent(file.url)}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorMessages[payload.error ?? ""] ?? "Could not delete the file. · تعذر حذف الملف.");
      }
      setFiles((current) => current.filter((item) => item.url !== file.url));
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Could not delete the file.");
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="media-library-title">
        <header className={styles.header}>
          <h2 id="media-library-title">Media library · مكتبة الوسائط</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close media library">×</button>
        </header>

        <div className={styles.tabs} role="tablist">
          <button type="button" role="tab" aria-selected={tab === "upload"} className={`${styles.tab} ${tab === "upload" ? styles.tabActive : ""}`} onClick={() => setTab("upload")}>
            Upload · رفع
          </button>
          <button type="button" role="tab" aria-selected={tab === "library"} className={`${styles.tab} ${tab === "library" ? styles.tabActive : ""}`} onClick={() => setTab("library")}>
            Library · المكتبة
          </button>
        </div>

        {notice && <p role="status" className={styles.success}>{notice}</p>}

        {tab === "upload" && <section className={styles.uploadArea}>
          <div {...dropzone.getRootProps({ className: `${styles.dropzone} ${dropzone.isDragActive ? styles.dropzoneActive : ""}` })}>
            <input {...dropzone.getInputProps()} aria-label="Choose a file to upload" />
            <p><strong>Drop a file here</strong> or click to choose · اسحب الملف هنا أو اختره</p>
            <p className={styles.hint}>
              {kind === "image" ? "JPG, PNG, WebP, GIF, AVIF" : "JPG, PNG, WebP, GIF, AVIF, MP4, WebM"} · up to 50 MB
            </p>
          </div>
          {progress !== null && <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
            <small>{progress}%</small>
          </div>}
          {uploadError && <p role="alert" className={styles.error}>{uploadError}</p>}
        </section>}

        {tab === "library" && <section className={styles.libraryArea}>
          {listError && <p role="alert" className={styles.error}>{listError}</p>}
          {loading && <p className={styles.hint}>Loading… · جاري التحميل…</p>}
          {!loading && !listError && visibleFiles.length === 0 && <p className={styles.hint}>No files yet. Upload one to get started. · لا توجد ملفات بعد.</p>}
          <ul className={styles.grid}>
            {visibleFiles.map((file) => <li key={file.url} className={styles.card}>
              <button type="button" className={styles.thumb} onClick={() => onSelect(file.url)} aria-label={`Select ${file.name}`}>
                {file.type === "image"
                  ? <img src={file.url} alt="" loading="lazy" />
                  : <span className={styles.videoIcon} aria-hidden="true">▶</span>}
              </button>
              <div className={styles.meta}>
                <span className={styles.name} title={file.name}>{file.name}</span>
                <small>{formatSize(file.size)} · {file.type === "image" ? "Image" : "Video"}</small>
              </div>
              <button type="button" className={styles.delete} onClick={() => void deleteFile(file)} aria-label={`Delete ${file.name}`}>Delete</button>
            </li>)}
          </ul>
        </section>}
      </div>
    </div>
  );
}
