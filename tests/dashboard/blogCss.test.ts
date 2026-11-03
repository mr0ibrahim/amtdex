import { addHeadingAnchors } from "@/lib/blogContent"
import { sanitizeInlineStyle, sanitizeStylesheet, scopePostCss, scopeStylesheet } from "@/lib/blogCss"

describe("blog css", () => {
  it("scopes style blocks and strips dangerous rules", () => {
    const clean = sanitizeStylesheet(`
      @import url("https://evil.test/a.css");
      .card, .card p { color: red; position: fixed; width: expression(alert(1)); }
      body { margin: 0; background: url(javascript:alert(1)); }
      @media (max-width: 600px) { .card { padding: 8px; } }
      @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
      a { -moz-binding: url(https://evil.test/b.xml); color: blue; }
    `)
    expect(clean).not.toContain("@import")
    expect(clean).not.toContain("expression")
    expect(clean).not.toContain("javascript:")
    expect(clean).not.toContain("-moz-binding")
    expect(clean).toContain("position: absolute")
    expect(clean).toContain("color: blue")

    const scoped = scopeStylesheet(clean, ".blog-prose.blog-post-content.post-content-9")
    expect(scoped).toContain(".blog-prose.blog-post-content.post-content-9 .card")
    expect(scoped).toContain(".blog-prose.blog-post-content.post-content-9 .card p")
    expect(scoped).toContain("@media (max-width: 600px){.blog-prose.blog-post-content.post-content-9 .card{padding: 8px;}}")
    expect(scoped).toContain("@keyframes fade{from{opacity: 0;}to{opacity: 1;}}")
    expect(scoped).not.toContain(" body")
    expect(scopePostCss(clean, 9)).toBe(scoped)
    expect(sanitizeStylesheet(clean)).toBe(clean)
  })

  it("keeps safe inline style and rewrites fixed positioning", () => {
    expect(sanitizeInlineStyle("color: #16064F; font-size: 18px; margin: 12px; position: fixed !important; background: url(javascript:alert(1))")).toBe(
      "color: #16064F; font-size: 18px; margin: 12px; position: absolute !important",
    )
  })

  it("keeps heading classes when adding anchors", () => {
    const { html, headings } = addHeadingAnchors(
      '<h2 class="title" style="color: #16064F">عنوان القسم</h2><p class="lead">نص</p>',
    )
    expect(headings).toHaveLength(1)
    expect(html).toContain('class="scroll-mt-28 title"')
    expect(html).toContain('style="color: #16064F"')
    expect(html).toContain('class="lead"')
    expect(html).toContain(`id="${headings[0].id}"`)
  })
})