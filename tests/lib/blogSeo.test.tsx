import { cleanup, render, waitFor } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { afterEach, expect, it } from "vitest"
import { Seo } from "@/components/Seo"
import { getAvatarUrl } from "@/lib/avatar"

afterEach(cleanup)
it("resolves relative canonical paths against the current host", async () => {
  render(<HelmetProvider><Seo title="المدونة" canonical="/category/engineering" /></HelmetProvider>)
  await waitFor(() => expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(`${window.location.origin}/category/engineering`))
  expect(document.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe(`${window.location.origin}/category/engineering`)
})
it("preserves explicit cross-subdomain canonical URLs", async () => {
  render(<HelmetProvider><Seo title="المدونة" canonical="https://blog.amtdex.com/" /></HelmetProvider>)
  await waitFor(() => expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://blog.amtdex.com/"))
})
it("uses a thumbnail for owned screenshot avatars without rewriting other media", () => {
  expect(getAvatarUrl("https://amtdex.com/images/screens/crm-480.webp")).toMatch(/^\/images\/optimized\/crm-avatar-.*\.webp$/)
  expect(getAvatarUrl("https://other.example/images/screens/crm-480.webp")).toBe("https://other.example/images/screens/crm-480.webp")
  expect(getAvatarUrl("/uploads/media/avatar.webp")).toBe("/uploads/media/avatar.webp")
})
