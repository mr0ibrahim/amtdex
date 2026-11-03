import { type Editor } from "@tiptap/react"
import { EditorContent, useEditor } from "@tiptap/react"
import { useEffect, useRef, useState } from "react"
import { createBlogEditorExtensions } from "./editorExtensions"
import { decodeEscapedHtml, looksLikeHtml, normalizeImportedHtml } from "./htmlImport"
import { isAllowedImage, uploadMediaFile } from "./mediaUpload"
import { isSafeLinkHref, sanitizeEditorHtml } from "./sanitizeHtml"

type Props = {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
}

function ToolBtn({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active ? true : undefined}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
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

function blockAlign(editor: Editor): string {
  const type = editor.isActive("heading") ? "heading" : "paragraph"
  const align = editor.getAttributes(type).textAlign as string | null
  return align || "right"
}

function blockDir(editor: Editor): "rtl" | "ltr" {
  const names = ["paragraph", "heading", "blockquote", "bulletList", "orderedList"]
  for (const name of names) {
    if (!editor.isActive(name)) continue
    const dir = editor.getAttributes(name).dir
    if (dir === "ltr" || dir === "rtl") return dir
  }
  return "rtl"
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
  const [sourceOpen, setSourceOpen] = useState(false)
  const [sourceDraft, setSourceDraft] = useState("")
  const imageInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const syncingFromProps = useRef(false)
  const onChangeRef = useRef(onChange)
  const editorRef = useRef<Editor | null>(null)
  const uploadImageRef = useRef<(file: File) => Promise<void>>(async () => {})

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: createBlogEditorExtensions(),
    content: sanitizeEditorHtml(value || ""),
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "blog-rich-editor blog-prose",
        dir: "rtl",
        lang: "ar",
      },
      transformPastedHTML(html) {
        return normalizeImportedHtml(html)
      },
      handleDrop(_view, event) {
        const files = event.dataTransfer?.files
        if (!files?.length) return false
        const images = Array.from(files).filter((file) => file.type.startsWith("image/"))
        if (!images.length) return false
        event.preventDefault()
        void (async () => {
          for (const file of images) await uploadImageRef.current(file)
        })()
        return true
      },
      handlePaste(_view, event) {
        const ed = editorRef.current
        const files = event.clipboardData?.files
        if (files?.length) {
          const image = Array.from(files).find((file) => file.type.startsWith("image/"))
          if (image) {
            event.preventDefault()
            void uploadImageRef.current(image)
            return true
          }
        }
        const html = event.clipboardData?.getData("text/html") || ""
        const text = event.clipboardData?.getData("text/plain") || ""
        if (!html && ed) {
          const decoded = decodeEscapedHtml(text)
          if (looksLikeHtml(decoded)) {
            event.preventDefault()
            ed.chain().focus().insertContent(normalizeImportedHtml(decoded)).run()
            return true
          }
        }
        return false
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (syncingFromProps.current) return
      onChangeRef.current(ed.getHTML())
    },
  })

  editorRef.current = editor

  useEffect(() => {
    uploadImageRef.current = async (file: File) => {
      if (!editor) return
      if (!isAllowedImage(file)) {
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
        const finalUrl = await uploadMediaFile(file)
        replaceImageSrc(editor, blobUrl, finalUrl)
        onChangeRef.current(editor.getHTML())
        setMsg("تم رفع الصورة وعرضها داخل المقال.")
      } catch (err) {
        setMsg(err instanceof Error ? `${err.message} (المعاينة المحلية ما زالت ظاهرة)` : "فشل الرفع")
      } finally {
        setBusy(null)
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

  const headingValue = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : editor.isActive("heading", { level: 4 })
          ? "h4"
          : editor.isActive("heading", { level: 5 })
            ? "h5"
            : editor.isActive("heading", { level: 6 })
              ? "h6"
              : "p"
  const align = blockAlign(editor)
  const dir = blockDir(editor)
  const inTable = editor.isActive("table")

  const setLink = () => {
    const prev = (editor.getAttributes("link").href as string | undefined) || "https://"
    const url = window.prompt("أدخل الرابط:", prev)
    if (url === null) return
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    if (!isSafeLinkHref(url.trim())) {
      setMsg("الرابط غير مسموح. استخدم http أو https أو مساراً داخل الموقع.")
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run()
  }

  const insertVideo = () => {
    const url = window.prompt("الصق رابط يوتيوب:")
    if (!url) return
    const ok = editor.commands.setYoutubeVideo({ src: url })
    setMsg(ok ? "تم إدراج فيديو يوتيوب." : "تعذر قراءة رابط يوتيوب.")
  }

  const onAudio = async (file?: File | null) => {
    if (!file) return
    setBusy("جارٍ رفع الملف الصوتي…")
    try {
      const url = await uploadMediaFile(file)
      editor.chain().focus().setAudio(url).run()
      setMsg("تم إدراج الملف الصوتي.")
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "فشل رفع الصوت")
    } finally {
      setBusy(null)
    }
  }

  const onAttach = async (file?: File | null) => {
    if (!file) return
    setBusy("جارٍ رفع المرفق…")
    try {
      const url = await uploadMediaFile(file)
      const safeName = file.name.replace(/[<>"]/g, "")
      editor
        .chain()
        .focus()
        .insertContent(`<p><a href="${url}" download="${safeName}" rel="noopener noreferrer">${safeName}</a></p>`)
        .run()
      setMsg("تم إدراج المرفق.")
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "فشل رفع الملف")
    } finally {
      setBusy(null)
    }
  }

  const applySource = (mode: "replace" | "insert") => {
    const clean = normalizeImportedHtml(sourceDraft)
    if (mode === "replace") {
      editor.commands.setContent(clean || "<p></p>")
    } else {
      editor.chain().focus().insertContent(clean).run()
    }
    setSourceOpen(false)
    onChangeRef.current(editor.getHTML())
    setMsg("تم تحويل HTML إلى محتوى منسق داخل المقال.")
  }

  const openSource = () => {
    setSourceDraft(editor.getHTML())
    setSourceOpen(true)
  }

  return (
    <div className={`rte-shell${disabled ? " is-disabled" : ""}`}>
      {!sourceOpen && (
        <div className="rte-toolbar" role="toolbar" aria-label="أدوات تحرير المحتوى">
          <select
            className="rte-select"
            title="نمط الفقرة"
            aria-label="نمط الفقرة"
            value={headingValue}
            onChange={(event) => {
              const next = event.target.value
              const chain = editor.chain().focus()
              if (next === "p") chain.setParagraph().run()
              else chain.setHeading({ level: Number(next.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6 }).run()
            }}
          >
            <option value="p">فقرة</option>
            <option value="h1">عنوان 1</option>
            <option value="h2">عنوان 2</option>
            <option value="h3">عنوان 3</option>
            <option value="h4">عنوان 4</option>
            <option value="h5">عنوان 5</option>
            <option value="h6">عنوان 6</option>
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
          <ToolBtn title="كود داخل السطر" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            {"</>"}
          </ToolBtn>
          <ToolBtn title="منخفض" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>
            x₂
          </ToolBtn>
          <ToolBtn title="مرتفع" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
            x²
          </ToolBtn>
          <ToolBtn title="تمييز" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}>
            ✏
          </ToolBtn>
          <label className="rte-tool" title="لون النص">
            <input
              type="color"
              aria-label="لون النص"
              className="rte-color"
              onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
              defaultValue="#16064F"
            />
          </label>
          <ToolBtn title="مسح التنسيق" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
            Tx
          </ToolBtn>

          <Sep />

          <ToolBtn title="محاذاة لليمين" active={align === "right"} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
            ⇒
          </ToolBtn>
          <ToolBtn title="توسيط" active={align === "center"} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
            ≡
          </ToolBtn>
          <ToolBtn title="محاذاة لليسار" active={align === "left"} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
            ⇐
          </ToolBtn>
          <ToolBtn title="ضبط" active={align === "justify"} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
            ☰
          </ToolBtn>
          <ToolBtn title="اتجاه من اليمين لليسار" active={dir === "rtl"} onClick={() => editor.chain().focus().setTextDirection("rtl").run()}>
            RTL
          </ToolBtn>
          <ToolBtn title="اتجاه من اليسار لليمين" active={dir === "ltr"} onClick={() => editor.chain().focus().setTextDirection("ltr").run()}>
            LTR
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
            {"{ }"}
          </ToolBtn>
          <ToolBtn title="خط أفقي" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            ―
          </ToolBtn>
          <ToolBtn title="بانر مميز" onClick={() => editor.chain().focus().insertContentBanner().run()}>
            ▣
          </ToolBtn>

          <Sep />

          <ToolBtn title="جدول" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            ▦
          </ToolBtn>
          <ToolBtn title="صف بعد" disabled={!inTable} onClick={() => editor.chain().focus().addRowAfter().run()}>
            +صف
          </ToolBtn>
          <ToolBtn title="حذف الصف" disabled={!inTable} onClick={() => editor.chain().focus().deleteRow().run()}>
            −صف
          </ToolBtn>
          <ToolBtn title="عمود بعد" disabled={!inTable} onClick={() => editor.chain().focus().addColumnAfter().run()}>
            +عم
          </ToolBtn>
          <ToolBtn title="حذف العمود" disabled={!inTable} onClick={() => editor.chain().focus().deleteColumn().run()}>
            −عم
          </ToolBtn>
          <ToolBtn title="صف رأس" disabled={!inTable} onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
            رأس
          </ToolBtn>
          <ToolBtn title="دمج الخلايا" disabled={!inTable} onClick={() => editor.chain().focus().mergeCells().run()}>
            دمج
          </ToolBtn>
          <ToolBtn title="فصل الخلايا" disabled={!inTable} onClick={() => editor.chain().focus().splitCell().run()}>
            فصل
          </ToolBtn>
          <ToolBtn title="حذف الجدول" disabled={!inTable} onClick={() => editor.chain().focus().deleteTable().run()}>
            حذف
          </ToolBtn>

          <Sep />

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
          <ToolBtn title="مصدر HTML" onClick={openSource}>
            HTML
          </ToolBtn>

          <Sep />

          <ToolBtn title="تراجع" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            ↶
          </ToolBtn>
          <ToolBtn title="إعادة" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            ↷
          </ToolBtn>
        </div>
      )}

      {sourceOpen ? (
        <div className="rte-source">
          <p className="rte-source-help">
            الصق HTML من وورد أو مستندات جوجل أو صفحة ويب، أو اكتب الوسوم مباشرة. التحويل يبني مقالاً منسقاً ويزيل الأكواد غير الآمنة.
          </p>
          <textarea
            aria-label="مصدر HTML"
            value={sourceDraft}
            spellCheck={false}
            onChange={(event) => setSourceDraft(event.target.value)}
          />
          <div className="rte-source-actions">
            <button type="button" className="rte-source-btn is-primary" onClick={() => applySource("replace")}>
              تحويل المقال
            </button>
            <button type="button" className="rte-source-btn" onClick={() => applySource("insert")}>
              إدراج عند المؤشر
            </button>
            <button type="button" className="rte-source-btn" onClick={() => setSourceOpen(false)}>
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <div className="rte-canvas">
          <EditorContent editor={editor} />
        </div>
      )}

      {(busy || msg) && (
        <div className="rte-status" role="status">
          {busy || msg}
        </div>
      )}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-label="اختيار صورة للمقال"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (file) void uploadImageRef.current(file)
        }}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        aria-label="اختيار ملف صوتي"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          void onAudio(file)
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        aria-label="اختيار مرفق"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          void onAttach(file)
        }}
      />
    </div>
  )
}
