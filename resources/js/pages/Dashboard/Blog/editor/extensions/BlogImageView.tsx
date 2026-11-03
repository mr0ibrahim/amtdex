import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import { sanitizeClassList, sanitizeInlineStyle } from "@/lib/blogCss"
import { normalizeAlign, normalizeWidth, type ImageAlign } from "../imageLayout"
import { isAllowedImage, uploadMediaFile } from "../mediaUpload"

function figureStyle(width: string, extra: string): CSSProperties {
  const style: CSSProperties & Record<string, string> = { width }
  for (const part of extra.split(";")) {
    const idx = part.indexOf(":")
    if (idx === -1) continue
    const prop = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (!prop || !value || prop === "width") continue
    const camel = prop.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
    style[camel] = value
  }
  return style
}

const PRESETS = ["25%", "50%", "75%", "100%"] as const
const ALIGNS: Array<{ id: ImageAlign; label: string }> = [
  { id: "right", label: "يمين" },
  { id: "center", label: "وسط" },
  { id: "left", label: "يسار" },
]

export function BlogImageView({ node, updateAttributes, selected, deleteNode }: ReactNodeViewProps) {
  const align = normalizeAlign(node.attrs.align)
  const width = normalizeWidth(node.attrs.width)
  const src = String(node.attrs.src || "")
  const alt = String(node.attrs.alt || "")
  const caption = String(node.attrs.caption || "")
  const extraStyle = sanitizeInlineStyle(String(node.attrs.style || ""))
  const extraClass = sanitizeClassList(String(node.attrs.class || ""))
    .split(/\s+/)
    .filter((token) => token && token !== "blog-figure" && token !== "blog-img" && !token.startsWith("align-"))
    .join(" ")
  const [hold, setHold] = useState(false)
  const [altDraft, setAltDraft] = useState(alt)
  const [captionDraft, setCaptionDraft] = useState(caption)
  const [status, setStatus] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const showPanel = selected || hold

  useEffect(() => {
    setAltDraft(alt)
  }, [alt])
  useEffect(() => {
    setCaptionDraft(caption)
  }, [caption])

  const onResizePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const figure = event.currentTarget.closest(".blog-image-block")
    const parent = figure?.parentElement
    if (!(figure instanceof HTMLElement) || !parent) return
    const parentWidth = parent.getBoundingClientRect().width || 1
    const startX = event.clientX
    const startWidth = figure.getBoundingClientRect().width
    const rtl = Boolean(figure.closest("[dir='rtl'], [dir=\"rtl\"]"))
    const direction = rtl ? -1 : 1
    const multiplier = align === "center" ? 2 : 1

    const move = (ev: PointerEvent) => {
      const delta = (ev.clientX - startX) * direction * multiplier
      const next = Math.round(((startWidth + delta) / parentWidth) * 100)
      updateAttributes({ width: `${Math.max(15, Math.min(100, next))}%` })
    }
    const up = () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
  }

  const replaceWith = async (file?: File | null) => {
    if (!file) return
    if (!isAllowedImage(file)) {
      setStatus("يُسمح بصور JPEG / PNG / WebP / GIF فقط.")
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setStatus("حجم الصورة يجب ألا يتجاوز 8MB.")
      return
    }
    const blobUrl = URL.createObjectURL(file)
    updateAttributes({ src: blobUrl })
    setStatus("جارٍ استبدال الصورة…")
    try {
      const finalUrl = await uploadMediaFile(file)
      updateAttributes({
        src: finalUrl,
        alt: altDraft || file.name.replace(/\.[^.]+$/, ""),
      })
      setStatus("تم استبدال الصورة.")
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "فشل استبدال الصورة")
    } finally {
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 15000)
    }
  }

  return (
    <NodeViewWrapper
      as="figure"
      className={`blog-figure blog-image-block align-${align}${extraClass ? ` ${extraClass}` : ""}${showPanel ? " is-selected" : ""}`}
      style={figureStyle(width, extraStyle)}
      onFocus={() => setHold(true)}
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        const next = event.relatedTarget
        if (next instanceof Node && event.currentTarget.contains(next)) return
        setHold(false)
      }}
    >
      <div className="blog-image-frame">
        <img src={src} alt={alt} className="blog-img" data-drag-handle draggable />
        {showPanel && (
          <button
            type="button"
            className="blog-image-resize"
            aria-label="تغيير عرض الصورة"
            title="اسحب لتغيير العرض"
            onPointerDown={onResizePointerDown}
          />
        )}
      </div>

      {!showPanel && caption ? <figcaption>{caption}</figcaption> : null}

      {showPanel && (
        <div
          className="blog-image-panel"
          role="group"
          aria-label="إعدادات الصورة"
          contentEditable={false}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="blog-image-actions">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`rte-tool${width === preset ? " is-active" : ""}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => updateAttributes({ width: preset })}
              >
                {preset}
              </button>
            ))}
            {ALIGNS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rte-tool${align === item.id ? " is-active" : ""}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => updateAttributes({ align: item.id })}
              >
                {item.label}
              </button>
            ))}
            <button type="button" className="rte-tool" onMouseDown={(event) => event.preventDefault()} onClick={() => fileRef.current?.click()}>
              استبدال
            </button>
            <button type="button" className="rte-tool" onMouseDown={(event) => event.preventDefault()} onClick={() => deleteNode()}>
              حذف
            </button>
          </div>
          <label className="blog-image-field">
            <span>النص البديل</span>
            <input
              value={altDraft}
              onChange={(event) => setAltDraft(event.target.value)}
              onBlur={() => updateAttributes({ alt: altDraft })}
              placeholder="وصف الصورة"
            />
          </label>
          <label className="blog-image-field">
            <span>التعليق</span>
            <input
              value={captionDraft}
              onChange={(event) => setCaptionDraft(event.target.value)}
              onBlur={() => updateAttributes({ caption: captionDraft })}
              placeholder="تعليق يظهر تحت الصورة"
            />
          </label>
          {status && <p className="blog-image-status">{status}</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ""
              void replaceWith(file)
            }}
          />
        </div>
      )}
    </NodeViewWrapper>
  )
}
