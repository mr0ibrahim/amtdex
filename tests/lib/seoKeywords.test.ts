import { describe, expect, it } from "vitest"
import {
  editorKeywords,
  mergeKeywords,
  parseKeywordList,
  publicKeywords,
  shareImageUrl,
  toAbsoluteUrl,
} from "@/lib/seoKeywords"

describe("seo keyword parsing", () => {
  it("keeps spaces inside a phrase and splits on latin comma, arabic comma, and newlines", () => {
    expect(parseKeywordList("تطوير المواقع، Laravel, SEO\nأمن سيبراني")).toEqual([
      "تطوير المواقع",
      "Laravel",
      "SEO",
      "أمن سيبراني",
    ])
  })

  it("ignores duplicates and extra whitespace", () => {
    expect(mergeKeywords(["SEO"], [" seo ", "SEO", "web development", "تطوير المواقع"])).toEqual([
      "SEO",
      "web development",
      "تطوير المواقع",
    ])
  })

  it("reloads saved keywords and falls back to a legacy focus keyword", () => {
    expect(editorKeywords({ seo_keywords: ["عبارة عربية", "Open Graph"] })).toEqual([
      "عبارة عربية",
      "Open Graph",
    ])
    expect(editorKeywords({ seo_keywords: [], focus_keyword: "تطوير المواقع، SEO" })).toEqual([
      "تطوير المواقع",
      "SEO",
    ])
    expect(editorKeywords({ tags: [{ name: "وسم" }] })).toEqual([])
  })

  it("uses tags for public meta keywords only when no seo keywords exist", () => {
    expect(
      publicKeywords({
        seo_keywords: ["الكلمة"],
        tags: [{ name: "وسم" }],
      }),
    ).toEqual(["الكلمة"])
    expect(publicKeywords({ tags: [{ name: "هندسة البرمجيات" }] })).toEqual(["هندسة البرمجيات"])
  })

  it("turns a stored media path into an absolute share image and falls back to the cover", () => {
    expect(toAbsoluteUrl("/uploads/media/share.png")).toBe(`${window.location.origin}/uploads/media/share.png`)
    expect(toAbsoluteUrl("https://cdn.example/og.jpg")).toBe("https://cdn.example/og.jpg")
    expect(shareImageUrl("", "/uploads/media/cover.png")).toBe(
      `${window.location.origin}/uploads/media/cover.png`,
    )
    expect(shareImageUrl(null, null)).toBeUndefined()
  })
})
