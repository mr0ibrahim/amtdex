import { useEffect, useRef, useState } from "react"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import Youtube from "@tiptap/extension-youtube"
import { sanitizeEditorHtml } from "./sanitizeHtml"
import { API } from "@/lib/api"

type Props = {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
}

function ToolBtn({
  title,
  active,
  onClick,
  children,
}: {
  title: string
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={!!active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rte-tool${active ? " is-active" : ""}`}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span className="rte-sep" aria-hidden />
}

function resolveMediaUrl(url: string): string {
  if (!url) return url
  if (/^(https?:|blob:|data:)/i.test(url)) return url
  if (url.startsWith("//")) return `${window.location.protocol}${url}`
  if (url.startsWith("/")) return `${window.location.origin}${url}`
  return url
}

async function uploadFile(file: File): Promise<string> {
  const res = await API.media.upload(file)
  const url = res?.url || (res as { data?: { url?: string } })?.data?.url
  if (!url) throw new Error("لم يُرجع الخادم رابط الملف.")
  return resolveMediaUrl(url)
}

function insertOptimisticImage(editor: Editor, file: File) {
  const blobUrl = URL.createObjectURL(file)
  const alt = file.name.replace(/\.[^.]+$/, "") || "صورة"
  editor.chain().focus().setImage({ src: blobUrl, alt }).run()
  return blobUrl
}

function replaceImageSrc(editor: Editor, from: string, to: string) {
  const { state, view } = editor
  let tr = state.tr
  let changed = false
  state.doc.descendants((node, pos) => {
    if (node.type.name === "image" && node.attrs.src === from) {
      tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: to || null })
      changed = true
    }
  })
  if (changed) view.dispatch(tr)
}

export function RichTextEditor({ value, onChange, disabled }: Props) {
  const [busy, setBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const syncingFromProps = useRef(false)
  const onChangeRef = useRef(onChange)
  const uploadImageRef = useRef<(file: File) => Promise<void>>(async () => {})

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: false,
        underline: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["right", "center", "left", "justify"],
        defaultAlignment: "right",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: "blog-editor-image" },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 640,
        height: 360,
        HTMLAttributes: { class: "blog-editor-video" },
      }),
      Placeholder.configure({
        placeholder: "ابدأ كتابة محتوى المقال هنا…",
      }),
    ],
    content: sanitizeEditorHtml(value || ""),
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "blog-rich-editor",
        dir: "rtl",
        lang: "ar",
      },
      handleDrop(_view, event) {
        const files = event.dataTransfer?.files
        if (!files?.length) return false
        const images = Array.from(files).filter((f) => f.type.startsWith("image/"))
        if (!images.length) return false
        event.preventDefault()
        void (async () => {
          for (const file of images) await uploadImageRef.current(file)
        })()
        return true
      },
      handlePaste(_view, event) {
        const files = event.clipboardData?.files
        if (!files?.length) return false
        const image = Array.from(files).find((f) => f.type.startsWith("image/"))
        if (!image) return false
        event.preventDefault()
        void uploadImageRef.current(image)
        return true
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (syncingFromProps.current) return
      onChangeRef.current(ed.getHTML())
    },
  })

  useEffect(() => {
    uploadImageRef.current = async (file: File) => {
      if (!editor) return
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        setMsg("يُسمح بصور JPEG / PNG / WebP / GIF فقط.")
        return
      }
      if (file.size > 8 * 1024 * 1024) {
        setMsg("حجم الصورة يجب ألا يتجاوز 8MB.")
        return
      }
      setMsg(null)
      setBusy("جارٍ رفع الصورة وعرضها فوراً…")
      const blobUrl = insertOptimisticImage(editor, file)
      try {
        const finalUrl = await uploadFile(file)
        replaceImageSrc(editor, blobUrl, finalUrl)
        onChangeRef.current(editor.getHTML())
        setMsg("تم رفع الصورة وعرضها داخل المقال.")
      } catch (err) {
        // keep blob preview if upload fails so user still sees what they selected
        setMsg(err instanceof Error ? `${err.message} (المعاينة المحلية ما زالت ظاهرة)` : "فشل الرفع")
      } finally {
        setBusy(null)
        // revoke later so the preview stays until src is swapped
        window.setTimeout(() => URL.revokeObjectURL(blobUrl), 15000)
      }
    }
  }, [editor])

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = sanitizeEditorHtml(value || "")
    if (current === next || sanitizeEditorHtml(current) === next) return
    syncingFromProps.current = true
    editor.commands.setContent(next, { emitUpdate: false })
    syncingFromProps.current = false
  }, [value, editor])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [disabled, editor])

  if (!editor) {
    return (
      <div className="rte-shell">
        <div className="p-8 text-center text-xs text-[var(--color-text-muted)]">جارٍ تحميل المحرر…</div>
      </div>
    )
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("أدخل الرابط:", prev || "https://")
    if (url === null) return
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const insertVideo = () => {
    const url = window.prompt("الصق رابط يوتيوب:")
    if (!url) return
    editor.commands.setYoutubeVideo({ src: url })
  }

  const insertBanner = () => {
    editor
      .chain()
      .focus()
      .insertContent(`<div class="blog-content-banner"><p>عنوان بارز داخل المقال</p></div><p></p>`)
      .run()
  }

  const onAudio = async (file?: File | null) => {
    if (!file || !editor) return
    setBusy("جارٍ رفع الملف الصوتي…")
    try {
      const url = await uploadFile(file)
      editor.chain().focus().insertContent(`<p><audio controls src="${url}"></audio></p><p></p>`).run()
      setMsg("تم إدراج الملف الصوتي.")
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "فشل رفع الصوت")
    } finally {
      setBusy(null)
    }
  }

  const onAttach = async (file?: File | null) => {
    if (!file || !editor) return
    setBusy("جارٍ رفع المرفق…")
    try {
      const url = await uploadFile(file)
      editor.chain().focus().insertContent(`<p><a href="${url}" download rel="noopener">${file.name}</a></p>`).run()
      setMsg("تم إدراج المرفق.")
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "فشل رفع الملف")
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className={`rte-shell${disabled ? " is-disabled" : ""}`}>
      <div className="rte-toolbar" role="toolbar" aria-label="أدوات تحرير المحتوى">
        <select
          className="rte-select"
          title="نمط الفقرة"
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
                ? "h2"
                : editor.isActive("heading", { level: 3 })
                  ? "h3"
                  : editor.isActive("heading", { level: 4 })
                    ? "h4"
                    : "p"
          }
          onChange={(e) => {
            const v = e.target.value
            const chain = editor.chain().focus()
            if (v === "p") chain.setParagraph().run()
            else chain.toggleHeading({ level: Number(v.slice(1)) as 1 | 2 | 3 | 4 }).run()
          }}
        >
          <option value="p">فقرة</option>
          <option value="h1">عنوان 1</option>
          <option value="h2">عنوان 2</option>
          <option value="h3">عنوان 3</option>
          <option value="h4">عنوان 4</option>
        </select>

        <Sep />

        <ToolBtn title="عريض" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn title="مائل" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolBtn>
        <ToolBtn title="تحته خط" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </ToolBtn>
        <ToolBtn title="يتوسطه خط" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </ToolBtn>
        <ToolBtn title="تمييز" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}>
          ✏
        </ToolBtn>
        <label className="rte-tool" title="لون النص">
          <input
            type="color"
            className="rte-color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            defaultValue="#16064F"
          />
        </label>

        <Sep />

        <ToolBtn title="محاذاة لليمين" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          ⇒
        </ToolBtn>
        <ToolBtn title="توسيط" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          ≡
        </ToolBtn>
        <ToolBtn title="محاذاة لليسار" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          ⇐
        </ToolBtn>
        <ToolBtn title="ضبط" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          ☰
        </ToolBtn>

        <Sep />

        <ToolBtn title="قائمة نقطية" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          ••
        </ToolBtn>
        <ToolBtn title="قائمة مرقمة" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.
        </ToolBtn>
        <ToolBtn title="اقتباس" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </ToolBtn>
        <ToolBtn title="كتلة كود" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </ToolBtn>
        <ToolBtn title="خط أفقي" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ―
        </ToolBtn>
        <ToolBtn title="بانر مميز" onClick={insertBanner}>
          ▣
        </ToolBtn>

        <Sep />

        <ToolBtn title="جدول" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          ▦
        </ToolBtn>
        <ToolBtn title="رابط" active={editor.isActive("link")} onClick={setLink}>
          🔗
        </ToolBtn>
        <ToolBtn title="إزالة الرابط" onClick={() => editor.chain().focus().unsetLink().run()}>
          ∅
        </ToolBtn>
        <ToolBtn title="إدراج صورة" onClick={() => imageInputRef.current?.click()}>
          🖼
        </ToolBtn>
        <ToolBtn title="فيديو يوتيوب" onClick={insertVideo}>
          ▶
        </ToolBtn>
        <ToolBtn title="ملف صوتي" onClick={() => audioInputRef.current?.click()}>
          ♪
        </ToolBtn>
        <ToolBtn title="مرفق ملف" onClick={() => fileInputRef.current?.click()}>
          📎
        </ToolBtn>

        <Sep />

        <ToolBtn title="تراجع" onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </ToolBtn>
        <ToolBtn title="إعادة" onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </ToolBtn>
      </div>

      <div className="rte-canvas">
        <EditorContent editor={editor} />
      </div>

      {(busy || msg) && (
        <div className="rte-status" role="status">
          {busy || msg}
        </div>
      )}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = ""
          if (f) void uploadImageRef.current(f)
        }}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = ""
          void onAudio(f)
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = ""
          void onAttach(f)
        }}
      />
    </div>
  )
}
