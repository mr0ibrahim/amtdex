import { useEffect } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import { sanitizeBlogHtml } from "./sanitizeHtml"
import { API } from "@/lib/api"

type Props = {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
        active
          ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
          : "bg-white text-[var(--color-ink)] border-[var(--color-border)] hover:bg-[var(--color-card-soft)]"
      }`}
    >
      {children}
    </button>
  )
}

export function RichTextEditor({ value, onChange, disabled }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        codeBlock: { HTMLAttributes: { class: "blog-code-block" } },
        // Avoid duplicate names if a parent kit already ships these marks.
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-2xl max-w-full h-auto mx-auto border shadow-sm", loading: "lazy" },
      }),
      Placeholder.configure({
        placeholder: "اكتب محتوى المقال هنا... يمكنك استخدام شريط الأدوات للتنسيق.",
      }),
    ],
    content: sanitizeBlogHtml(value || ""),
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "blog-rich-editor prose prose-sm max-w-none focus:outline-none min-h-[240px] px-4 py-3 text-[13px] leading-7 text-[var(--color-ink)]",
        dir: "rtl",
        lang: "ar",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(sanitizeBlogHtml(ed.getHTML()))
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = sanitizeBlogHtml(editor.getHTML())
    const next = sanitizeBlogHtml(value || "")
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }, [value, editor])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [disabled, editor])

  if (!editor) return null

  const insertLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("أدخل الرابط:", prev || "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const insertImage = async (file?: File | null) => {
    if (!file) return
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      window.alert("يُسمح بصور JPEG / PNG / WebP / GIF فقط.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert("حجم الصورة يجب ألا يتجاوز 5MB.")
      return
    }
    try {
      const res = await API.media.upload(file)
      const url = res?.url || (res as { data?: { url?: string } })?.data?.url
      if (url) {
        editor.chain().focus().setImage({ src: url, alt: file.name.split(".")[0] }).run()
      }
    } catch (err: unknown) {
      window.alert(err instanceof Error ? err.message : "فشل رفع الصورة")
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden bg-white">
      <div className="flex flex-wrap gap-1.5 p-2 border-b border-[var(--color-border)] bg-[var(--color-card-soft)]">
        <ToolbarButton title="عنوان 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          ع2
        </ToolbarButton>
        <ToolbarButton title="عنوان 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          ع3
        </ToolbarButton>
        <ToolbarButton title="عريض" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          عريض
        </ToolbarButton>
        <ToolbarButton title="مائل" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          مائل
        </ToolbarButton>
        <ToolbarButton title="تحته خط" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          خط
        </ToolbarButton>
        <ToolbarButton title="قائمة نقطية" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • قائمة
        </ToolbarButton>
        <ToolbarButton title="قائمة مرقمة" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. قائمة
        </ToolbarButton>
        <ToolbarButton title="اقتباس" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          اقتباس
        </ToolbarButton>
        <ToolbarButton title="كتلة كود" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </ToolbarButton>
        <ToolbarButton title="رابط" active={editor.isActive("link")} onClick={insertLink}>
          رابط
        </ToolbarButton>
        <label className="px-2 py-1.5 rounded-lg text-[11px] font-bold border border-[var(--color-border)] bg-white cursor-pointer hover:bg-[var(--color-lavender)]">
          صورة
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              void insertImage(e.target.files?.[0])
              e.target.value = ""
            }}
          />
        </label>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
