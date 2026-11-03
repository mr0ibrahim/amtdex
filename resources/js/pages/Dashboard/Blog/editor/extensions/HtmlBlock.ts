import { Node } from "@tiptap/core"

const TAGS = ["div", "section", "article", "aside", "header", "footer", "main", "nav"]

/**
 * Generic block container so imported layouts (div/section/article/…) survive
 * instead of being flattened into paragraphs.
 */
export const HtmlBlock = Node.create({
  name: "htmlBlock",
  group: "block",
  content: "block*",
  defining: true,

  addAttributes() {
    return {
      tag: {
        default: "div",
        parseHTML: (element) => {
          const tag = element.tagName.toLowerCase()
          return TAGS.includes(tag) ? tag : "div"
        },
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return TAGS.map((tag) => ({
      tag,
      priority: 20,
      getAttrs: (element: HTMLElement) => {
        if (!(element instanceof HTMLElement)) return false
        if (element.matches("div.blog-content-banner, div[data-youtube-video]")) return false
        return null
      },
    }))
  },

  renderHTML({ node, HTMLAttributes }) {
    const raw = String(node.attrs.tag || "div")
    const tag = TAGS.includes(raw) ? raw : "div"
    return [tag, HTMLAttributes, 0]
  },
})
