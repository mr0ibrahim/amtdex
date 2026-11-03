import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { Table } from "@tiptap/extension-table"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableRow } from "@tiptap/extension-table-row"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import Youtube from "@tiptap/extension-youtube"
import StarterKit from "@tiptap/starter-kit"
import { isSafeLinkHref } from "./sanitizeHtml"
import { AudioBlock } from "./extensions/AudioBlock"
import { BlogImage } from "./extensions/BlogImage"
import { ContentBanner } from "./extensions/ContentBanner"
import { Subscript, Superscript } from "./extensions/SubSuper"
import { ArticleDirection } from "./extensions/TextDirection"

export function createBlogEditorExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      link: false,
      underline: false,
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Subscript,
    Superscript,
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["right", "center", "left", "justify"],
      defaultAlignment: null,
    }),
    ArticleDirection,
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      enableClickSelection: true,
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      isAllowedUri: (url, { defaultValidate }) => {
        if (!isSafeLinkHref(url)) return false
        if (url.startsWith("/") || /^(mailto:|tel:)/i.test(url)) return true
        return defaultValidate(url)
      },
    }),
    BlogImage.configure({ allowBase64: true }),
    ContentBanner,
    AudioBlock,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Youtube.configure({
      controls: true,
      nocookie: true,
      width: 640,
      height: 360,
      HTMLAttributes: { class: "blog-editor-video" },
    }),
    Placeholder.configure({
      placeholder: "ابدأ كتابة محتوى المقال هنا…",
    }),
  ]
}
