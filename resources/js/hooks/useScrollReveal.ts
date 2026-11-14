import { useEffect, type RefObject } from "react"
import { GEO_CARD_SELECTOR } from "@/lib/motion/geoLayer"

const TEXT = "main h1, main h2, main h3, main :is(h1, h2) + p, main .eyebrow, main .da-kicker, main .reference-section-label, main .reference-section-heading > p, main .brand-page-header-art, main .da-filters, main .hero-actions, main .reference-platforms, main .quote-choice, main .reference-section-action, .site-footer .footer-grid > *, .site-footer .footer-bottom"
const SCENES = "main .product-scene, main .project-showcase, main .guarantee-art, main .contact-art"
export const REVEAL_SELECTOR = `${TEXT}, ${SCENES}, main [data-motion], ${GEO_CARD_SELECTOR}`
/** Composed scenes animate as one piece; their inner headings and panels do not get their own motion. */
const OWNERS = ".product-scene, .project-showcase, .guarantee-art, .contact-art"

export const supportsScrollTimeline = () => typeof CSS !== "undefined" && !!CSS.supports?.("animation-timeline: view()")

/**
 * One motion language for the whole public site: elements rise in as they enter the viewport and
 * rise out as they leave through the top, in step with the scroll position.
 *
 * Where the browser has scroll-driven animations the work is pure CSS on the compositor: this hook
 * only labels elements once (no scroll listeners, no animation frames). Elsewhere an
 * IntersectionObserver switches a state attribute and CSS transitions do the rest.
 */
export function useScrollReveal(ref: RefObject<HTMLDivElement | null>, route: string) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const timeline = supportsScrollTimeline()
    root.dataset.revealMode = timeline ? "timeline" : "observe"
    const seen = new Set<HTMLElement>()
    const observer = !timeline && typeof IntersectionObserver === "function"
      ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) el.dataset.revealState = "shown"
          else if (entry.boundingClientRect.top > 0) el.dataset.revealState = "below"
          else el.dataset.revealState = "above"
        })
      }, { rootMargin: "-9% 0px -6% 0px" })
      : undefined

    const scan = () => {
      seen.forEach(el => { if (!root.contains(el)) { observer?.unobserve(el); seen.delete(el) } })
      const fresh: HTMLElement[] = []
      root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(el => {
        if (seen.has(el) || el.classList.contains("geo-layer")) return
        const parent = el.parentElement
        // A card or scene moves as one piece.
        if (parent?.closest(OWNERS) || parent?.closest(GEO_CARD_SELECTOR) || parent?.closest("[data-reveal]")) return
        fresh.push(el)
      })
      if (!fresh.length) return
      const rects = new Map(fresh.map(el => [el, el.getBoundingClientRect()]))
      fresh.forEach(el => {
        const rect = rects.get(el)!
        if (!rect.width && !rect.height) return
        // Items on the same row follow each other in reading order; everything else starts at zero.
        const row = Array.from(el.parentElement?.children ?? []).filter(sibling => {
          const other = rects.get(sibling as HTMLElement)
          return other && Math.abs(other.top - rect.top) < 12
        }) as HTMLElement[]
        const rtl = getComputedStyle(el).direction === "rtl"
        const order = row.sort((a, b) => (rects.get(a)!.left - rects.get(b)!.left) * (rtl ? -1 : 1)).indexOf(el)
        el.style.setProperty("--ri", String(Math.max(0, Math.min(order, 4))))
        el.dataset.revealKind = el.matches(GEO_CARD_SELECTOR) || el.matches(SCENES) ? "block" : "text"
        // Already visible content must not jump or fade on mount, restored scroll, or navigation.
        el.dataset.reveal = rect.top < window.innerHeight && rect.bottom > 76 ? "initial" : "both"
        if (observer) el.dataset.revealState = rect.top >= window.innerHeight ? "below" : rect.bottom <= 76 ? "above" : "shown"
        seen.add(el)
        observer?.observe(el)
      })
    }

    let frame = 0
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(scan) }
    const mutations = new MutationObserver(records => {
      if (records.some(record => [...record.addedNodes].some(node => node.nodeType === 1 && !(node as Element).classList.contains("geo-layer")))) schedule()
    })
    mutations.observe(root, { childList: true, subtree: true })
    scan()

    return () => {
      cancelAnimationFrame(frame)
      mutations.disconnect()
      observer?.disconnect()
      seen.forEach(el => { delete el.dataset.reveal; delete el.dataset.revealKind; delete el.dataset.revealState; el.style.removeProperty("--ri") })
      seen.clear()
      delete root.dataset.revealMode
    }
  }, [ref, route])
}
