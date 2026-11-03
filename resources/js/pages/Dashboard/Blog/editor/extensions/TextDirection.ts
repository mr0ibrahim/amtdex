import { Extension } from "@tiptap/core"

const BLOCKS = [
  "paragraph",
  "heading",
  "blockquote",
  "bulletList",
  "orderedList",
  "listItem",
  "htmlBlock",
  "tableCell",
  "tableHeader",
]

/**
 * Stores an explicit dir on blocks. The editor command itself comes from TipTap core;
 * this only registers the attribute so RTL/LTR survives in the saved HTML.
 * The page default is RTL, so the attribute is omitted until the writer chooses one.
 */
export const ArticleDirection = Extension.create({
  name: "articleDirection",

  addGlobalAttributes() {
    return [
      {
        types: BLOCKS,
        attributes: {
          dir: {
            default: null,
            parseHTML: (element) => {
              const dir = element.getAttribute("dir")
              return dir === "ltr" || dir === "rtl" ? dir : null
            },
            renderHTML: (attributes) => {
              if (attributes.dir !== "ltr" && attributes.dir !== "rtl") return {}
              return { dir: attributes.dir as string }
            },
          },
        },
      },
    ]
  },
})
