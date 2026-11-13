import { render } from "@testing-library/react"
import { expect, it } from "vitest"
import { BrandArtwork, type ArtworkKind } from "@/components/ui/BrandArtwork"

it("keeps gradient references unique and local when vector families repeat", () => {
  const kinds: ArtworkKind[] = ["web", "systems", "shield", "contact", "plan", "launch", "shield"]
  const { container } = render(<div>{kinds.map((kind, i) => <BrandArtwork key={i} kind={kind} />)}</div>)
  const ids = [...container.querySelectorAll("[id]")].map(node => node.id)
  expect(new Set(ids).size).toBe(ids.length)
  expect(container.querySelectorAll("svg")).toHaveLength(kinds.length)
  container.querySelectorAll("svg").forEach(svg => {
    expect(svg.getAttribute("aria-hidden")).toBe("true")
    expect(svg.getAttribute("viewBox")).toBe("0 0 320 240")
    svg.querySelectorAll("[fill]").forEach(node => {
      const match = node.getAttribute("fill")?.match(/^url\(#(.+)\)$/)
      if (match) expect([...svg.querySelectorAll("[id]")].some(local => local.id === match[1])).toBe(true)
    })
  })
})
