"use client";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Youtube, isValidYoutubeUrl } from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MediaLibrary } from "./MediaLibrary";
import styles from "./RichTextEditor.module.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
  dir?: "ltr" | "rtl";
  placeholder?: string;
};

const TEXT_COLOR_DEFAULT = "#20242a";
const HIGHLIGHT_DEFAULT = "#fef08a";
const SAFE_LINK_PATTERN = /^(https?:\/\/|mailto:|\/)/i;

const extensions = [
  StarterKit.configure({ link: false }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  Link.configure({ openOnClick: false, autolink: true }),
  Image,
  Youtube.configure({ nocookie: true, width: 640, height: 360 }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
];

function isRichHtml(body: string) {
  return /<\/?[a-z][\s\S]*>/i.test(body);
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Legacy plain-text bodies (blank-line separated) become paragraphs so the editor shows them the way the public page does.
function toEditorHtml(value: string) {
  if (!value.trim()) return "";
  if (isRichHtml(value)) return value;
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function serialize(editor: Editor) {
  return editor.isEmpty ? "" : editor.getHTML();
}

function AlignIcon({ kind }: { kind: "left" | "center" | "right" }) {
  const lines = kind === "left"
    ? "M3 6h18M3 10h12M3 14h18M3 18h12"
    : kind === "center"
      ? "M3 6h18M6 10h12M3 14h18M6 18h12"
      : "M3 6h18M9 10h12M3 14h18M9 18h12";
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={lines} /></svg>;
}

function ToolButton({ label, active = false, disabled = false, onClick, children }: {
  label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${active ? styles.active : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, dir = "ltr", placeholder = "Write the post body…" }: Props) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [message, setMessage] = useState("");
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    // Re-render on every transaction so toolbar active/disabled states stay current.
    shouldRerenderOnTransaction: true,
    extensions: [...extensions, Placeholder.configure({ placeholder })],
    content: toEditorHtml(value),
    editorProps: {
      attributes: { class: styles.prose, "aria-label": placeholder },
    },
    onUpdate: ({ editor: updated }) => {
      onChangeRef.current(serialize(updated));
    },
  });

  // Push external value changes (switching posts, loading a saved draft) into the editor.
  // Values produced by this editor match serialize(), so typing never resets the document.
  useEffect(() => {
    if (!editor) return;
    if (value !== serialize(editor)) editor.commands.setContent(toEditorHtml(value), { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return <div className={styles.loading} aria-hidden="true" />;

  function setLink() {
    const previous = (editor?.getAttributes("link").href as string | undefined) ?? "";
    const input = window.prompt("Link URL (https://, mailto:, or /path) · رابط الوصلة", previous);
    if (input === null) return;
    const url = input.trim();
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    if (!SAFE_LINK_PATTERN.test(url)) {
      setMessage("Links must start with https://, mailto:, or /. · يجب أن يبدأ الرابط بـ https:// أو mailto: أو /.");
      return;
    }
    setMessage("");
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function addYoutube() {
    const input = window.prompt("YouTube video URL · رابط فيديو يوتيوب");
    if (input === null) return;
    const url = input.trim();
    if (!isValidYoutubeUrl(url)) {
      setMessage("That does not look like a YouTube video URL. · الرابط ليس رابط فيديو يوتيوب صالحًا.");
      return;
    }
    setMessage("");
    editor?.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  function insertImage(url: string) {
    setMediaOpen(false);
    editor?.chain().focus().setImage({ src: url, alt: "" }).run();
  }

  const textColor = (editor.getAttributes("textStyle").color as string | undefined) ?? TEXT_COLOR_DEFAULT;
  const highlightColor = (editor.getAttributes("highlight").color as string | undefined) ?? HIGHLIGHT_DEFAULT;

  return (
    <div className={`${styles.wrap} ${dir === "rtl" ? styles.rtl : ""}`} dir={dir} lang={dir === "rtl" ? "ar" : "en"}>
      <div className={styles.toolbar} role="toolbar" aria-label="Formatting">
        <ToolButton label="Undo · تراجع" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>↶</ToolButton>
        <ToolButton label="Redo · إعادة" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>↷</ToolButton>
        <span className={styles.divider} aria-hidden="true" />
        <ToolButton label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolButton>
        <ToolButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolButton>
        <ToolButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolButton>
        <span className={styles.divider} aria-hidden="true" />
        <ToolButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolButton>
        <ToolButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolButton>
        <ToolButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></ToolButton>
        <span className={styles.divider} aria-hidden="true" />
        <ToolButton label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignIcon kind="left" /></ToolButton>
        <ToolButton label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignIcon kind="center" /></ToolButton>
        <ToolButton label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignIcon kind="right" /></ToolButton>
        <span className={styles.divider} aria-hidden="true" />
        <label className={styles.colorField} title="Text color · لون النص">
          <span aria-hidden="true">A</span>
          <input type="color" aria-label="Text color" value={textColor} onChange={(event) => editor.chain().focus().setColor(event.target.value).run()} />
        </label>
        <label className={styles.colorField} title="Highlight color · لون التظليل">
          <span aria-hidden="true" className={styles.highlightSample}>▮</span>
          <input type="color" aria-label="Highlight color" value={highlightColor} onChange={(event) => editor.chain().focus().setHighlight({ color: event.target.value }).run()} />
        </label>
        <span className={styles.divider} aria-hidden="true" />
        <ToolButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>•≡</ToolButton>
        <ToolButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolButton>
        <ToolButton label="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</ToolButton>
        <ToolButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"</>"}</ToolButton>
        <span className={styles.divider} aria-hidden="true" />
        <ToolButton label="Link" active={editor.isActive("link")} onClick={setLink}>🔗</ToolButton>
        <ToolButton label="Insert image from media library" onClick={() => setMediaOpen(true)}>Image</ToolButton>
        <ToolButton label="Insert YouTube video" onClick={addYoutube}>YouTube</ToolButton>
        <ToolButton label="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Tx</ToolButton>
      </div>
      {message && <p role="alert" className={styles.message}>{message}</p>}
      <EditorContent editor={editor} />
      <MediaLibrary isOpen={mediaOpen} onClose={() => setMediaOpen(false)} onSelect={insertImage} kind="image" />
    </div>
  );
}
