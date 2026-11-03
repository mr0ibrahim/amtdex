import { mergeAttributes, Node } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    audio: {
      setAudio: (src: string) => ReturnType
    }
  }
}

export const AudioBlock = Node.create({
  name: "audio",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: "audio",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          const src = element.getAttribute("src") || element.querySelector("source")?.getAttribute("src")
          if (!src) return false
          return { src }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ["audio", mergeAttributes(HTMLAttributes, { controls: "true", src: String(node.attrs.src || "") })]
  },

  addCommands() {
    return {
      setAudio:
        (src) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src } }),
    }
  },
})
