import { Editor } from "@tiptap/core"
import { createBlogEditorExtensions } from "@/pages/Dashboard/Blog/editor/editorExtensions"
import { importHtmlDocument, normalizeImportedHtml } from "@/pages/Dashboard/Blog/editor/htmlImport"
import { sanitizeBlogHtml } from "@/pages/Dashboard/Blog/editor/sanitizeHtml"

function mountEditor(content = "<p>مرحبا</p>") {
  const element = document.createElement("div")
  document.body.appendChild(element)
  const editor = new Editor({
    element,
    extensions: createBlogEditorExtensions(),
    content,
  })
  return {
    editor,
    destroy() {
      editor.destroy()
      element.remove()
    },
  }
}

function selectInside(editor: Editor) {
  const end = Math.max(1, editor.state.doc.content.size - 1)
  editor.commands.setTextSelection({ from: 1, to: end })
}

describe("blog editor commands", () => {
  it("applies the core marks, blocks, alignment, direction, and history", () => {
    const { editor, destroy } = mountEditor("<p>نص المقال التجريبي</p>")
    selectInside(editor)

    editor.chain().focus().toggleBold().run()
    expect(editor.getHTML()).toMatch(/<strong>/)
    editor.chain().focus().toggleBold().toggleItalic().run()
    expect(editor.getHTML()).toMatch(/<em>/)
    editor.chain().focus().toggleUnderline().run()
    expect(editor.getHTML()).toMatch(/<u>/)
    editor.chain().focus().toggleStrike().run()
    expect(editor.getHTML()).toMatch(/<s>/)

    editor.chain().focus().setHeading({ level: 2 }).run()
    expect(editor.getHTML()).toContain("<h2")
    editor.chain().focus().toggleBulletList().run()
    expect(editor.getHTML()).toContain("<ul>")
    editor.chain().focus().toggleBulletList().toggleOrderedList().run()
    expect(editor.getHTML()).toContain("<ol>")
    editor.chain().focus().toggleOrderedList().toggleBlockquote().run()
    expect(editor.getHTML()).toContain("<blockquote>")
    editor.chain().focus().toggleBlockquote().toggleCode().run()
    expect(editor.getHTML()).toMatch(/<code>/)

    editor.commands.setContent("<p>نص المقال التجريبي</p>")
    selectInside(editor)
    editor.chain().focus().setTextAlign("center").run()
    expect(editor.getHTML()).toContain("text-align: center")
    editor.chain().focus().setTextAlign("left").run()
    expect(editor.getHTML()).toContain("text-align: left")
    editor.chain().focus().setTextDirection("ltr").run()
    expect(editor.getHTML()).toContain('dir="ltr"')
    editor.chain().focus().setTextDirection("rtl").run()
    expect(editor.getHTML()).toContain('dir="rtl"')

    editor.commands.unsetAllMarks()
    editor.chain().focus().setLink({ href: "https://amtdex.com" }).run()
    expect(editor.getHTML()).toContain('href="https://amtdex.com"')

    const beforeUndo = editor.getHTML()
    editor.chain().focus().toggleBold().run()
    editor.commands.undo()
    expect(editor.getHTML()).toBe(beforeUndo)
    editor.commands.redo()
    expect(editor.getHTML()).not.toBe(beforeUndo)

    destroy()
  })

  it("inserts a table and can add a row", () => {
    const { editor, destroy } = mountEditor("<p>جدول</p>")
    editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()
    expect(editor.getHTML()).toContain("<table")
    expect(editor.getHTML()).toContain("<th")
    editor.chain().focus().addRowAfter().run()
    expect(editor.getHTML().match(/<tr/g)?.length).toBeGreaterThan(2)
    destroy()
  })

  it("round-trips image width, alignment, alt text, and caption", () => {
    const { editor, destroy } = mountEditor("<p></p>")
    editor.commands.setContent({
      type: "doc",
      content: [
        {
          type: "image",
          attrs: {
            src: "/uploads/media/photo.png",
            alt: "وصف الصورة",
            width: "50%",
            align: "left",
            caption: "تعليق أسفل الصورة",
          },
        },
      ],
    })

    const html = editor.getHTML()
    expect(html).toContain("/uploads/media/photo.png")
    expect(html).toContain("align-left")
    expect(html).toContain("width: 50%")
    expect(html).toContain("وصف الصورة")
    expect(html).toContain("تعليق أسفل الصورة")
    expect(html).toContain("<figure")

    const safe = sanitizeBlogHtml(html)
    expect(safe).toContain("align-left")
    expect(safe).toContain("width: 50%")
    expect(safe).not.toContain("<script")

    const again = mountEditor(safe)
    let attrs: Record<string, unknown> | null = null
    again.editor.state.doc.descendants((node) => {
      if (node.type.name === "image") attrs = node.attrs
    })
    expect(attrs).toMatchObject({
      src: "/uploads/media/photo.png",
      alt: "وصف الصورة",
      width: "50%",
      align: "left",
      caption: "تعليق أسفل الصورة",
    })
    again.destroy()
    destroy()
  })

  it("imports raw html, docs-style markup, and a table into formatted nodes", () => {
    const imported = normalizeImportedHtml(`
      <b style="font-weight:normal">
        <h2>عنوان المستند</h2>
        <div>فقرة فيها <span style="font-weight:700">كلمة مهمة</span> و<a href="https://amtdex.com">رابط</a></div>
        <ul><li>البند الأول</li><li>البند الثاني</li></ul>
        <table><tr><th>عمود</th></tr><tr><td>قيمة</td></tr></table>
        <img src="/uploads/media/inline.png" alt="لقطة">
        <script>alert(1)</script>
      </b>
    `)
    expect(imported).toContain("<h2>")
    expect(imported).toContain("<strong>")
    expect(imported).toContain("<ul>")
    expect(imported).toContain("<table")
    expect(imported).toContain("/uploads/media/inline.png")
    expect(imported).not.toContain("<script")
    expect(imported).not.toContain("font-weight:normal")

    const word = normalizeImportedHtml(
      '<p class="MsoHeading2">عنوان وورد</p><p class="MsoListParagraph" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">· </span>عنصر</p>',
    )
    expect(word).toContain("<h2>")
    expect(word).toContain("<ul>")
    expect(word).toContain("<li>")
    expect(word).not.toContain("Mso")

    const { editor, destroy } = mountEditor("<p></p>")
    editor.commands.setContent(imported)
    const html = editor.getHTML()
    expect(html).toContain("<h2")
    expect(html).toContain("<ul>")
    expect(html).toContain("<table")
    expect(html).toContain("<strong>")
    destroy()
  })

  it("keeps a youtube embed and drops an unsafe iframe", () => {
    const { editor, destroy } = mountEditor("<p>فيديو</p>")
    expect(editor.commands.setYoutubeVideo({ src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" })).toBe(true)
    const safe = sanitizeBlogHtml(editor.getHTML())
    expect(safe).toContain("youtube-nocookie.com/embed/")
    expect(safe).toContain("data-youtube-video")

    const reloaded = mountEditor(safe)
    let found = false
    reloaded.editor.state.doc.descendants((node) => {
      if (node.type.name === "youtube") found = true
    })
    expect(found).toBe(true)
    reloaded.destroy()

    expect(sanitizeBlogHtml('<iframe src="https://evil.example/embed/abcdef"></iframe>')).not.toContain("iframe")
    destroy()
  })

  it("inserts a banner and an audio block instead of dropping them", () => {
    const { editor, destroy } = mountEditor("<p>مقال</p>")
    editor.chain().focus().insertContentBanner().run()
    expect(editor.getHTML()).toContain("blog-content-banner")
    editor.commands.setAudio("/uploads/media/voice.mp3")
    expect(editor.getHTML()).toContain("<audio")
    expect(editor.getHTML()).toContain("/uploads/media/voice.mp3")
    const safe = sanitizeBlogHtml(editor.getHTML())
    expect(safe).toContain("blog-content-banner")
    expect(safe).toContain("<audio")
    destroy()
  })

  it("keeps inline styles, classes, and style blocks when importing html", () => {
    const imported = importHtmlDocument(`
      <html>
        <head>
          <style>
            .hero { background-color: #16064F; color: #fff; padding: 16px; }
            h1 { font-size: 32px; }
            @import url("https://evil.test/x.css");
          </style>
          <link rel="stylesheet" href="https://cdn.example.com/site.css">
        </head>
        <body>
          <section class="hero fixed" style="display: flex; gap: 12px; text-align: center; position: fixed; background: url(javascript:alert(1))">
            <h1 class="title" style="color: #FFBF08; font-size: 28px">عنوان</h1>
            <p class="lead" style="margin: 0; font-size: 18px">فقرة <span class="em" style="font-weight: 700">مهمة</span></p>
            <a class="btn" style="color: #fff" href="https://amtdex.com">رابط</a>
            <table><tr><td class="cell" style="background-color: #f4f0e6; padding: 6px">خلية</td></tr></table>
          </section>
        </body>
      </html>
    `)

    expect(imported.html).toContain("<section")
    expect(imported.html).toContain('class="hero"')
    expect(imported.html).not.toContain("fixed")
    expect(imported.html).toContain("display: flex")
    expect(imported.html).toContain("gap: 12px")
    expect(imported.html).toContain('class="lead"')
    expect(imported.html).toContain("font-size: 18px")
    expect(imported.html).toContain('class="em"')
    expect(imported.html).toContain('class="btn"')
    expect(imported.html).toContain("position: absolute")
    expect(imported.html).not.toContain("javascript:")
    expect(imported.html).not.toContain("<style")
    expect(imported.html).not.toContain("<link")
    expect(imported.css).toContain(".hero")
    expect(imported.css).toContain("background-color: #16064F")
    expect(imported.css).toContain("font-size: 32px")
    expect(imported.css).not.toContain("@import")
    expect(imported.ignoredStylesheets).toEqual(["https://cdn.example.com/site.css"])

    const { editor, destroy } = mountEditor("<p></p>")
    editor.commands.setContent(imported.html)
    const html = editor.getHTML()
    expect(html).toContain("<section")
    expect(html).toContain("hero")
    expect(html).toContain("display: flex")
    expect(html).toContain("font-size: 28px")
    expect(html).toContain("font-size: 18px")
    expect(html).toContain("lead")
    expect(html).toContain('href="https://amtdex.com"')
    expect(html).toMatch(/background-color:\s*(?:#f4f0e6|rgb\(244,\s*240,\s*230\))/i)
    expect(html).toContain("padding: 6px")
    expect(html).toContain("cell")

    const again = mountEditor(sanitizeBlogHtml(html))
    const roundTrip = again.editor.getHTML()
    expect(roundTrip).toContain("display: flex")
    expect(roundTrip).toContain("font-size: 18px")
    expect(roundTrip).toContain("hero")
    again.destroy()
    destroy()
  })
})
