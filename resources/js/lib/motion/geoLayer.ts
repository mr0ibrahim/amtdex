/**
 * Geometric card layers: orbits, sine waves, polygons, Lissajous curves and grids.
 * The markup is decorative only (aria-hidden, pointer-events: none) and is drawn
 * with currentColor so each card tone can recolor it from CSS.
 */

export const GEO_VARIANTS = ["orbit", "wave", "poly", "curve", "grid"] as const
export type GeoVariant = (typeof GEO_VARIANTS)[number]

/** Every public surface that should read as a card. Dashboard and auth are outside <main> of the marketing layout. */
export const GEO_CARD_SELECTOR = [
  ".geo-card",
  ".ui-card",
  ".reference-service-card",
  ".service-card",
  ".service-bento-card",
  ".da-card",
  ".process-card",
  ".guarantee-card",
  ".testimonial-panel",
  ".reference-stats-inner",
  ".blog-article-card",
  ".blog-follow-card",
  ".da-blog-empty",
  ".newsletter-panel",
  ".contact-form-card",
  ".contact-whatsapp-card",
  ".contact-details-card",
  ".contact-next-card",
  ".contact-hours",
  ".contact-only-card",
  ".quote-form",
  ".about-values-card",
  ".da-works > a",
  // Tailwind-authored panels on detail pages.
  ":is(div, section, article, aside)[class*=\"border-[var(--color-border)]\"]:is([class*=\"rounded-2xl\"], [class*=\"rounded-[28px]\"], [class*=\"rounded-[24px]\"]):not([class*=\"aspect-\"])",
].map(selector => `main ${selector}`).join(", ")

const round = (value: number) => Math.round(value * 100) / 100

/** y = a·sin(2πx / λ + φ), sampled wide enough to loop by translating one wavelength. */
export function sinePath(amplitude: number, wavelength: number, baseline: number, phase = 0, width = 600) {
  let d = ""
  for (let x = -wavelength; x <= width + wavelength; x += 6) {
    const y = baseline + amplitude * Math.sin((2 * Math.PI * x) / wavelength + phase)
    d += `${d ? "L" : "M"}${round(x)} ${round(y)}`
  }
  return d
}

/** x = sin(a·t + δ), y = sin(b·t) — a closed Lissajous figure when a/b is rational. */
export function lissajousPath(a: number, b: number, delta: number, radius = 82, center = 100) {
  let d = ""
  for (let i = 0; i <= 360; i++) {
    const t = (i / 360) * 2 * Math.PI
    d += `${i ? "L" : "M"}${round(center + radius * Math.sin(a * t + delta))} ${round(center + radius * Math.sin(b * t))}`
  }
  return `${d}Z`
}

/** r = cos(k·θ) — rose curve with k (odd) or 2k (even) petals. */
export function rosePath(k: number, radius = 84, center = 100) {
  let d = ""
  for (let i = 0; i <= 360; i++) {
    const theta = (i / 360) * 2 * Math.PI
    const r = radius * Math.cos(k * theta)
    d += `${i ? "L" : "M"}${round(center + r * Math.cos(theta))} ${round(center + r * Math.sin(theta))}`
  }
  return `${d}Z`
}

export function polygonPoints(sides: number, radius: number, center = 100, rotation = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, i) => {
    const angle = rotation + (i / sides) * 2 * Math.PI
    return `${round(center + radius * Math.cos(angle))},${round(center + radius * Math.sin(angle))}`
  }).join(" ")
}

const svg = (viewBox: string, body: string, extra = "") =>
  `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" focusable="false" ${extra}>${body}</svg>`

/**
 * Each figure is two static SVGs. Only their HTML wrappers move (rotate or drift), so the
 * motion runs on the compositor and never repaints the card.
 */
const builders: Record<GeoVariant, () => [back: string, front: string]> = {
  orbit: () => [
    svg("0 0 200 200", `<circle cx="100" cy="100" r="92" opacity=".35" stroke-dasharray="2 7"/>
      <ellipse cx="100" cy="100" rx="88" ry="38" transform="rotate(60 100 100)" opacity=".45"/><circle class="geo-node" cx="56" cy="23.8" r="2.8"/>
      <ellipse cx="100" cy="100" rx="88" ry="38" transform="rotate(120 100 100)" opacity=".4"/><circle class="geo-node" cx="144" cy="23.8" r="2.4"/>`),
    svg("0 0 200 200", `<ellipse cx="100" cy="100" rx="88" ry="38" opacity=".55"/><circle class="geo-node" cx="188" cy="100" r="3.6"/><circle class="geo-node" cx="100" cy="100" r="5"/>`),
  ],
  wave: () => [
    svg("0 0 600 120", `<path d="${sinePath(24, 200, 62, Math.PI / 2)}" opacity=".38"/><path d="${sinePath(9, 100, 62, Math.PI)}" opacity=".3" stroke-dasharray="1 6"/>`, "preserveAspectRatio=\"none\""),
    svg("0 0 600 120", `<path d="${sinePath(16, 200, 62)}" opacity=".6"/>`, "preserveAspectRatio=\"none\""),
  ],
  poly: () => [
    svg("0 0 200 200", `<polygon points="${polygonPoints(6, 90)}" opacity=".4"/>${polygonPoints(6, 90).split(" ").map(point => { const [x, y] = point.split(","); return `<circle class="geo-node" cx="${x}" cy="${y}" r="2.2"/>` }).join("")}
      <circle cx="100" cy="100" r="90" opacity=".22" stroke-dasharray="1 6"/>`),
    svg("0 0 200 200", `<polygon points="${polygonPoints(3, 68)}" opacity=".55"/><polygon points="${polygonPoints(3, 68, 100, Math.PI / 2)}" opacity=".3"/><polygon points="${polygonPoints(4, 36)}" opacity=".6"/>`),
  ],
  curve: () => [
    svg("0 0 200 200", `<path d="${rosePath(4)}" opacity=".26"/>`),
    svg("0 0 200 200", `<path d="${lissajousPath(3, 2, Math.PI / 2)}" opacity=".7"/>`),
  ],
  grid: () => [
    svg("0 0 200 200", `<g opacity=".3">${Array.from({ length: 9 }, (_, i) => `<line x1="${20 + i * 20}" y1="10" x2="${20 + i * 20}" y2="190"/><line x1="10" y1="${20 + i * 20}" x2="190" y2="${20 + i * 20}"/>`).join("")}</g>
      <path d="M20 160 C60 160 60 100 100 100 S140 40 180 40" opacity=".8" stroke-width="1.4"/>${[[20, 160], [100, 100], [180, 40]].map(([x, y]) => `<circle class="geo-node" cx="${x}" cy="${y}" r="3.2"/>`).join("")}`),
    svg("0 0 200 200", `<rect x="72" y="72" width="56" height="56" opacity=".45" transform="rotate(45 100 100)"/><rect x="58" y="58" width="84" height="84" opacity=".25"/>`),
  ],
}

const cache = new Map<GeoVariant, string>()

export function geoMarkup(variant: GeoVariant) {
  let markup = cache.get(variant)
  if (!markup) {
    const [back, front] = builders[variant]()
    markup = `<span class="geo-turn geo-turn--back">${back}</span><span class="geo-turn">${front}</span>`
    cache.set(variant, markup)
  }
  return markup
}

export function createGeoLayer(variant: GeoVariant, ownerDocument: Document = document) {
  const layer = ownerDocument.createElement("span")
  layer.className = "geo-layer"
  layer.dataset.geo = variant
  layer.setAttribute("aria-hidden", "true")
  layer.innerHTML = `<span class="geo-line"></span><span class="geo-figure">${geoMarkup(variant)}</span><span class="geo-sheen"></span>`
  return layer
}

/** Dark surfaces get light strokes. Transparent backgrounds are treated as light. */
export function toneOf(color: string): "light" | "dark" {
  const parts = color.match(/[\d.]+/g)?.map(Number)
  if (!parts || parts.length < 3 || (parts.length > 3 && parts[3] < 0.5)) return "light"
  const [r, g, b] = parts
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.42 ? "dark" : "light"
}
