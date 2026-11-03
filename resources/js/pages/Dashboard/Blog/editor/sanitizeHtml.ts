import DOMPurify from "isomorphic-dompurify"

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "sub",
  "sup",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "img",
  "figure",
  "figcaption",
  "hr",
  "span",
  "div",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "colgroup",
  "col",
  "iframe",
  "video",
  "audio",
  "source",
  "mark",
]

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
  "class",
  "loading",
  "style",
  "width",
  "height",
  "colspan",
  "rowspan",
  "colwidth",
  "controls",
  "allow",
  "allowfullscreen",
  "frameborder",
  "referrerpolicy",
  "type",
  "download",
  "dir",
  "data-youtube-video",
]

const STYLE_PROPS = new Set([
  "color",
  "background-color",
  "text-align",
  "text-decoration",
  "width",
  "height",
  "font-weight",
  "font-style",
  "font-size",
  "vertical-align",
])

const SAFE_CLASS =
  /^(?:blog-figure|blog-img|blog-content-banner|blog-editor-image|blog-editor-video|align-(?:left|center|right)|language-[a-z0-9_+-]+)$/

export function isYouTubeEmbed(url: string): boolean {
  return /^https:\/\/(?:www\.)?(?:youtube\.com|youtube-nocookie\.com)\/embed\/[A-Za-z0-9_-]{6,64}(?:[?#].*)?$/i.test(
    url.trim(),
  )
}

function hasControlChar(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i)
    if (code <= 31 || code === 127) return true
  }
  return false
}

export function isSafeLinkHref(url: string): boolean {
  const value = url.trim()
  if (!value || hasControlChar(value)) return false
  if (/^(javascript|vbscript|data):/i.test(value)) return false
  if (value.startsWith("//") || value.includes("\\") || value.includes("..")) return false
  if (value.startsWith("/")) return true
  if (/^(https?:|mailto:|tel:)/i.test(value)) return true
  return !/^[a-z][a-z0-9+.-]*:/i.test(value)
}

export function isSafeMediaSrc(url: string, allowBlob = true): boolean {
  const value = url.trim()
  if (!value || hasControlChar(value)) return false
  if (/^(javascript|vbscript):/i.test(value)) return false
  if (/^data:/i.test(value)) {
    return /^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=\s]+$/i.test(value) && value.length <= 1_500_000
  }
  if (/^blob:/i.test(value)) return allowBlob
  if (value.startsWith("//") || value.includes("\\") || value.includes("..")) return false
  if (value.startsWith("/")) return true
  if (/^https?:/i.test(value)) return true
  return !/^[a-z][a-z0-9+.-]*:/i.test(value)
}

export function sanitizeInlineStyle(style: string): string {
  const kept: string[] = []
  for (const part of style.split(";")) {
    const idx = part.indexOf(":")
    if (idx === -1) continue
    const prop = part.slice(0, idx).trim().toLowerCase()
    const value = part.slice(idx + 1).trim()
    if (!STYLE_PROPS.has(prop)) continue
    if (/expression|javascript|vbscript|url\s*\(|@import|behavior|-moz-binding/i.test(value)) continue
    if (!/^[#a-z0-9(),.%\s'"/+-]+$/i.test(value)) continue
    if (prop === "text-align" && !/^(left|right|center|justify|start|end)$/i.test(value)) continue
    kept.push(`${prop}: ${value}`)
  }
  return kept.join("; ")
}

function keepClassList(value: string): string {
  return value
    .split(/\s+/)
    .filter((token) => SAFE_CLASS.test(token))
    .join(" ")
}

let hooksInstalled = false

function installHooks() {
  if (hooksInstalled) return
  hooksInstalled = true

  DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
    if (data.attrName === "class") {
      data.attrValue = keepClassList(data.attrValue)
      if (!data.attrValue) data.keepAttr = false
    }
    if (data.attrName === "style") {
      data.attrValue = sanitizeInlineStyle(data.attrValue)
      if (!data.attrValue) data.keepAttr = false
    }
    if (data.attrName === "href") {
      if (!isSafeLinkHref(data.attrValue)) data.keepAttr = false
    }
    if (data.attrName === "src") {
      const tag = node.nodeName.toLowerCase()
      if (tag === "iframe") {
        if (!isYouTubeEmbed(data.attrValue)) data.keepAttr = false
      } else if (!isSafeMediaSrc(data.attrValue, true)) {
        data.keepAttr = false
      }
    }
    if (data.attrName === "dir" && !/^(ltr|rtl|auto)$/i.test(data.attrValue)) {
      data.keepAttr = false
    }
  })

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (!(node instanceof Element)) return
    const tag = node.tagName.toLowerCase()
    if (tag === "iframe" && !isYouTubeEmbed(node.getAttribute("src") || "")) {
      node.remove()
      return
    }
    if ((tag === "img" || tag === "source") && !node.getAttribute("src")) {
      node.remove()
      return
    }
    if (tag === "a" && node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer")
    }
  })
}

function stripLeftoverEmbeds(html: string): string {
  if (!html.includes("<iframe") && !html.includes("<img") && !html.includes("<source")) return html
  const doc = new DOMParser().parseFromString(html, "text/html")
  doc.querySelectorAll("iframe").forEach((frame) => {
    if (!isYouTubeEmbed(frame.getAttribute("src") || "")) frame.remove()
  })
  doc.querySelectorAll("img, source").forEach((el) => {
    if (!isSafeMediaSrc(el.getAttribute("src") || "", true)) el.remove()
  })
  return doc.body.innerHTML
}

export function sanitizeBlogHtml(html: string): string {
  installHooks()
  const clean = DOMPurify.sanitize(html || "", {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["allowfullscreen", "data-youtube-video"],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|blob|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,
  })
  return stripLeftoverEmbeds(clean)
}

/** Editor keystrokes keep temporary blob previews; persistence is sanitized again on the server. */
export function sanitizeEditorHtml(html: string): string {
  return sanitizeBlogHtml(html)
}
