export interface HeadingAnchor {
  id: string
  text: string
  level: number
}

/** Give h2/h3 anchors for the table of contents without dropping class or style. */
export function addHeadingAnchors(html: string): { html: string; headings: HeadingAnchor[] } {
  const headings: HeadingAnchor[] = []
  let counter = 0
  const next = (html || "").replace(
    /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (_match, level: string, attrs: string | undefined, text: string) => {
      counter += 1
      const cleanText = text.replace(/<[^>]+>/g, "").trim()
      const id = `heading-${counter}-${cleanText
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
        .replace(/^-|-$/g, "")}`
      headings.push({ id, text: cleanText, level: Number(level) })
      let rest = attrs || ""
      rest = rest.replace(/\sid\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      const classMatch = rest.match(/\sclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
      const existing = (classMatch?.[1] ?? classMatch?.[2] ?? classMatch?.[3] ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .filter((token) => token !== "scroll-mt-28")
      rest = rest.replace(/\sclass\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      const className = ["scroll-mt-28", ...existing].join(" ")
      return `<h${level}${rest} id="${id}" class="${className}">${text}</h${level}>`
    },
  )
  return { html: next, headings }
}
