import { sanitizeBlogHtml } from "./sanitizeHtml"

const BLOCK_TAGS = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "div",
  "dl",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "li",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "ul",
  "audio",
  "video",
  "iframe",
])

type StyleFlags = {
  bold: boolean
  italic: boolean
  underline: boolean
  strike: boolean
  color: string | null
  background: string | null
  align: string | null
}

function readFlags(style: string): StyleFlags {
  return {
    bold: /font-weight\s*:\s*(bold|bolder|[6-9]00)/i.test(style),
    italic: /font-style\s*:\s*italic/i.test(style),
    underline: /text-decoration[^;]*underline/i.test(style),
    strike: /text-decoration[^;]*line-through/i.test(style),
    color: /(?:^|;)\s*color\s*:\s*([^;]+)/i.exec(style)?.[1]?.trim() || null,
    background: /(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/i.exec(style)?.[1]?.trim() || null,
    align: /(?:^|;)\s*text-align\s*:\s*(left|right|center|justify)/i.exec(style)?.[1]?.toLowerCase() || null,
  }
}

function hasBlockChild(el: HTMLElement): boolean {
  return Array.from(el.children).some((child) => BLOCK_TAGS.has(child.tagName.toLowerCase()))
}

function unwrap(el: HTMLElement) {
  const parent = el.parentNode
  if (!parent) return
  while (el.firstChild) parent.insertBefore(el.firstChild, el)
  el.remove()
}

function wrapChildren(el: HTMLElement, tag: string) {
  const wrapper = el.ownerDocument.createElement(tag)
  while (el.firstChild) wrapper.appendChild(el.firstChild)
  el.appendChild(wrapper)
}

function headingLevel(className: string): number | null {
  const match = /(?:MsoHeading|Heading)\s*([1-6])/i.exec(className) || /MsoTitle/i.exec(className)
  if (!match) return null
  if (/MsoTitle/i.test(className) && !match[1]) return 1
  const level = Number(match[1])
  return level >= 1 && level <= 6 ? level : null
}

function replaceWithHeading(el: HTMLElement, level: number) {
  const heading = el.ownerDocument.createElement(`h${level}`)
  const align = readFlags(el.getAttribute("style") || "").align
  if (align) heading.setAttribute("style", `text-align: ${align}`)
  while (el.firstChild) heading.appendChild(el.firstChild)
  el.replaceWith(heading)
}

function isWordList(el: HTMLElement): boolean {
  const tag = el.tagName.toLowerCase()
  if (tag !== "p" && tag !== "div") return false
  const cls = el.getAttribute("class") || ""
  const style = el.getAttribute("style") || ""
  return /MsoList/i.test(cls) || /mso-list\s*:/i.test(style)
}

function listKind(el: HTMLElement): "ol" | "ul" {
  const ignore = Array.from(el.querySelectorAll("span")).find((span) =>
    /mso-list\s*:\s*Ignore/i.test(span.getAttribute("style") || ""),
  )
  const marker = (ignore?.textContent || "").trim()
  return /^\d+[.)]/.test(marker) ? "ol" : "ul"
}

function transformElement(el: HTMLElement) {
  const tag = el.tagName.toLowerCase()
  const style = el.getAttribute("style") || ""

  if ((tag === "b" || tag === "strong") && /font-weight\s*:\s*normal/i.test(style)) {
    unwrap(el)
    return
  }
  if ((tag === "i" || tag === "em") && /font-style\s*:\s*normal/i.test(style)) {
    unwrap(el)
    return
  }

  if (tag === "font") {
    const span = el.ownerDocument.createElement("span")
    const color = el.getAttribute("color") || ""
    if (color && /^[#a-z0-9(),.\s%]+$/i.test(color)) span.setAttribute("style", `color: ${color}`)
    while (el.firstChild) span.appendChild(el.firstChild)
    el.replaceWith(span)
    return
  }

  if (tag === "center") {
    const alignTarget = el.ownerDocument.createElement(hasBlockChild(el) ? "div" : "p")
    alignTarget.setAttribute("style", "text-align: center")
    while (el.firstChild) alignTarget.appendChild(el.firstChild)
    el.replaceWith(alignTarget)
    if (alignTarget.tagName === "DIV") {
      const align = "center"
      if (hasBlockChild(alignTarget)) {
        for (const child of Array.from(alignTarget.children)) {
          if (!(child instanceof HTMLElement)) continue
          if (!/(?:^|;)\s*text-align\s*:/i.test(child.getAttribute("style") || "")) {
            const prev = child.getAttribute("style")
            child.setAttribute("style", `${prev ? `${prev}; ` : ""}text-align: ${align}`)
          }
        }
        unwrap(alignTarget)
      }
    }
    return
  }

  const level = headingLevel(el.getAttribute("class") || "")
  if (level && (tag === "p" || tag === "div") && !hasBlockChild(el)) {
    replaceWithHeading(el, level)
    return
  }

  if (tag === "span") {
    const flags = readFlags(style)
    if (flags.strike) wrapChildren(el, "s")
    if (flags.underline) wrapChildren(el, "u")
    if (flags.italic) wrapChildren(el, "em")
    if (flags.bold) wrapChildren(el, "strong")
    const kept: string[] = []
    if (flags.color && !/url\s*\(/i.test(flags.color)) kept.push(`color: ${flags.color}`)
    if (flags.background && !/url\s*\(/i.test(flags.background)) kept.push(`background-color: ${flags.background}`)
    if (kept.length) el.setAttribute("style", kept.join("; "))
    else unwrap(el)
    return
  }

  if (tag === "div") {
    const cls = el.getAttribute("class") || ""
    if (cls.split(/\s+/).includes("blog-content-banner")) return
    const align = readFlags(style).align
    if (hasBlockChild(el)) {
      if (align) {
        for (const child of Array.from(el.children)) {
          if (!(child instanceof HTMLElement) || !BLOCK_TAGS.has(child.tagName.toLowerCase())) continue
          if (!/(?:^|;)\s*text-align\s*:/i.test(child.getAttribute("style") || "")) {
            const prev = child.getAttribute("style")
            child.setAttribute("style", `${prev ? `${prev}; ` : ""}text-align: ${align}`)
          }
        }
      }
      unwrap(el)
      return
    }
    const paragraph = el.ownerDocument.createElement("p")
    if (align) paragraph.setAttribute("style", `text-align: ${align}`)
    while (el.firstChild) paragraph.appendChild(el.firstChild)
    el.replaceWith(paragraph)
  }
}

function walk(el: HTMLElement) {
  for (const child of Array.from(el.children)) {
    if (child instanceof HTMLElement) walk(child)
  }
  transformElement(el)
}

function groupWordLists(root: HTMLElement) {
  for (const child of Array.from(root.children)) {
    if (child instanceof HTMLElement) groupWordLists(child)
  }
  let list: HTMLElement | null = null
  for (const child of Array.from(root.children)) {
    if (!(child instanceof HTMLElement) || !isWordList(child)) {
      list = null
      continue
    }
    const kind = listKind(child)
    if (!list || list.tagName.toLowerCase() !== kind) {
      list = root.ownerDocument.createElement(kind)
      child.before(list)
    }
    const item = root.ownerDocument.createElement("li")
    child.querySelectorAll("span").forEach((span) => {
      if (/mso-list\s*:\s*Ignore/i.test(span.getAttribute("style") || "")) span.remove()
    })
    while (child.firstChild) item.appendChild(child.firstChild)
    list.appendChild(item)
    child.remove()
  }
}

function stripDangerousWrappers(html: string): string {
  return html
    .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "")
    .replace(/<!\[if[\s\S]*?endif\]>/gi, "")
    .replace(/<xml[\s\S]*?<\/xml>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?(?:o|w|m):[^>]*>/gi, "")
}

export function looksLikeHtml(text: string): boolean {
  return /<\/?[a-z][a-z0-9]*\b[^>]*>/i.test(text.trim().slice(0, 8000))
}

export function decodeEscapedHtml(text: string): string {
  if (!/&lt;\/?[a-z]/i.test(text)) return text
  const holder = document.createElement("textarea")
  holder.innerHTML = text
  return holder.value
}

/**
 * Turn pasted or typed HTML (Word, Google Docs, a web page, or raw tags)
 * into semantic markup the article editor can format.
 */
export function normalizeImportedHtml(html: string): string {
  const prepared = stripDangerousWrappers(html || "")
  if (!prepared.trim()) return ""
  const doc = new DOMParser().parseFromString(prepared, "text/html")
  doc.querySelectorAll("script, style, meta, link, title, noscript, object, embed").forEach((node) => node.remove())
  for (const child of Array.from(doc.body.children)) {
    if (child instanceof HTMLElement) walk(child)
  }
  groupWordLists(doc.body)
  return sanitizeBlogHtml(doc.body.innerHTML)
}
