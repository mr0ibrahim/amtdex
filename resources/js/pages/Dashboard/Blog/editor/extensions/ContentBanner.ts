import { mergeAttributes, Node } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    contentBanner: {
      insertContentBanner: () => ReturnType
    }
  }
}

export const ContentBanner = Node.create({
  name: "contentBanner",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [{ tag: "div.blog-content-banner" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { class: "blog-content-banner" }), 0]
  },

  addCommands() {
    return {
      insertContentBanner:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "عنوان بارز داخل المقال" }],
              },
            ],
          })
        },
    }
  },
})
