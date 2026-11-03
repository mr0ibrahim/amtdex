import { Extension } from "@tiptap/core"
import { sanitizeClassList, sanitizeElementId, sanitizeInlineStyle } from "@/lib/blogCss"

const TYPES = [
  "paragraph",
  "heading",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
  "bulletList",
  "orderedList",
  "listItem",
  "table",
  "tableRow",
  "tableCell",
  "tableHeader",
  "image",
  "youtube",
  "audio",
  "contentBanner",
  "htmlBlock",
  "textStyle",
]

function kept(name: "class" | "style" | "id", clean: (value: string) => string) {
  return {
    default: null as string | null,
    parseHTML: (element: HTMLElement) => clean(element.getAttribute(name) || "") || null,
    renderHTML: (attributes: Record<string, unknown>) => {
      const value = clean(String(attributes[name] ?? ""))
      return value ? { [name]: value } : {}
    },
  }
}

/** Preserve class, id, and safe inline style on article nodes and text spans. */
export const Presentation = Extension.create({
  name: "presentation",

  addGlobalAttributes() {
    return [
      {
        types: TYPES,
        attributes: {
          class: kept("class", sanitizeClassList),
          style: kept("style", sanitizeInlineStyle),
          id: kept("id", sanitizeElementId),
        },
      },
    ]
  },
})
