import Image from "@tiptap/extension-image"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { sanitizeClassList, sanitizeInlineStyle } from "@/lib/blogCss"
import { imageElement, normalizeAlign, normalizeWidth, readAlignFromElement, readCaption, readWidthFromElement } from "../imageLayout"
import { isSafeMediaSrc } from "../sanitizeHtml"
import { BlogImageView } from "./BlogImageView"

function mediaSrc(element: HTMLElement): string | null {
  return imageElement(element)?.getAttribute("src") || null
}

export const BlogImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => mediaSrc(element),
      },
      alt: {
        default: "",
        parseHTML: (element) => imageElement(element)?.getAttribute("alt") || "",
      },
      title: {
        default: null,
        parseHTML: (element) => imageElement(element)?.getAttribute("title") || null,
      },
      width: {
        default: "100%",
        parseHTML: (element) => readWidthFromElement(element),
        renderHTML: () => ({}),
      },
      height: {
        default: null,
        parseHTML: () => null,
        renderHTML: () => ({}),
      },
      align: {
        default: "center",
        parseHTML: (element) => readAlignFromElement(element),
        renderHTML: () => ({}),
      },
      caption: {
        default: "",
        parseHTML: (element) => readCaption(element),
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        priority: 60,
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          const src = mediaSrc(element)
          if (!src || !isSafeMediaSrc(src, true)) return false
          return null
        },
      },
      {
        tag: "img[src]",
        priority: 50,
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          const src = element.getAttribute("src")
          if (!src || !isSafeMediaSrc(src, true)) return false
          if (!this.options.allowBase64 && src.startsWith("data:")) return false
          return null
        },
      },
    ]
  },

  renderHTML({ node }) {
    const align = normalizeAlign(node.attrs.align)
    const width = normalizeWidth(node.attrs.width)
    const extraClass = sanitizeClassList(String(node.attrs.class || ""))
      .split(/\s+/)
      .filter((token) => token && token !== "blog-figure" && token !== "blog-img" && !/^align-(?:left|center|right)$/.test(token))
    const extraStyle = sanitizeInlineStyle(String(node.attrs.style || ""))
      .split(";")
      .map((part) => part.trim())
      .filter((part) => part && !/^width\s*:/i.test(part))
      .join("; ")
    const imgAttrs: Record<string, string> = {
      src: String(node.attrs.src || ""),
      alt: String(node.attrs.alt || ""),
      class: "blog-img",
      loading: "lazy",
    }
    if (node.attrs.title) imgAttrs.title = String(node.attrs.title)
    const figure: Array<string | Record<string, string> | (string | Record<string, string>)[]> = [
      "figure",
      {
        class: [`blog-figure`, `align-${align}`, ...extraClass].join(" "),
        style: [`width: ${width}`, extraStyle].filter(Boolean).join("; "),
      },
      ["img", imgAttrs],
    ]
    const caption = String(node.attrs.caption || "").trim()
    if (caption) figure.push(["figcaption", {}, caption])
    return figure as ["figure", Record<string, string>, ...unknown[]]
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlogImageView)
  },
})
