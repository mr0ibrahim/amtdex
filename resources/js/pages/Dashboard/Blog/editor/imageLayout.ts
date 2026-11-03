export type ImageAlign = "left" | "center" | "right"

export function normalizeAlign(value: unknown): ImageAlign {
  if (value === "left" || value === "right" || value === "center") return value
  return "center"
}

/** Persist a responsive percentage, or a pixel width copied from imported HTML. */
export function normalizeWidth(value: unknown): string {
  const raw = String(value ?? "").trim().toLowerCase()
  const pct = /^(\d{1,3}(?:\.\d+)?)%$/.exec(raw)
  if (pct) {
    const n = Math.round(Number(pct[1]))
    return `${Math.max(10, Math.min(100, n))}%`
  }
  const px = /^(\d{2,4})px$/.exec(raw)
  if (px) {
    const n = Math.round(Number(px[1]))
    return `${Math.max(40, Math.min(1600, n))}px`
  }
  if (/^\d{2,4}$/.test(raw)) {
    const n = Number(raw)
    if (n > 100) return `${Math.min(1600, n)}px`
    if (n >= 10) return `${n}%`
  }
  return "100%"
}

export function readWidthFromElement(element: HTMLElement): string {
  const style = element.getAttribute("style") || ""
  const fromStyle = /(?:^|;)\s*width\s*:\s*([^;]+)/i.exec(style)?.[1]?.trim()
  if (element.tagName === "FIGURE") return normalizeWidth(fromStyle || "100%")
  const img = element.tagName === "IMG" ? element : element.querySelector("img")
  const attr = img?.getAttribute("width") || element.getAttribute("width")
  return normalizeWidth(fromStyle || attr || "100%")
}

export function readAlignFromElement(element: HTMLElement): ImageAlign {
  const cls = `${element.getAttribute("class") || ""} ${element.querySelector("img")?.getAttribute("class") || ""}`
  if (/\balign-left\b/.test(cls)) return "left"
  if (/\balign-right\b/.test(cls)) return "right"
  if (/\balign-center\b/.test(cls)) return "center"
  const style = `${element.getAttribute("style") || ""} ${element.querySelector("img")?.getAttribute("style") || ""}`
  const align = /(?:^|;)\s*(?:text-align|float)\s*:\s*(left|right|center)/i.exec(style)?.[1]
  return normalizeAlign(align)
}

export function readCaption(element: HTMLElement): string {
  if (element.tagName !== "FIGURE") return ""
  return (element.querySelector("figcaption")?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 500)
}

export function imageElement(element: HTMLElement): HTMLImageElement | null {
  if (element.tagName === "IMG") return element as HTMLImageElement
  return element.querySelector("img")
}
