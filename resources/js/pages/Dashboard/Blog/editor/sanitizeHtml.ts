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
  "controls",
  "allow",
  "allowfullscreen",
  "frameborder",
  "referrerpolicy",
  "type",
  "download",
]

export function sanitizeBlogHtml(html: string): string {
  return DOMPurify.sanitize(html || "", {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["allowfullscreen"],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|blob|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  })
}

/** Keep editor interactive HTML intact; only light-clean on every keystroke. */
export function sanitizeEditorHtml(html: string): string {
  return sanitizeBlogHtml(html)
}
