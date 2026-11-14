import { useEffect, type RefObject } from "react"
import { GEO_CARD_SELECTOR, GEO_VARIANTS, createGeoLayer, toneOf, type GeoVariant } from "@/lib/motion/geoLayer"

const MIN_WIDTH = 150
const MIN_HEIGHT = 84

/**
 * Give every public card the shared violet skin and a geometric layer.
 * The layer animates only while its card is on screen; a pointer spotlight follows fine pointers.
 * Cards stay fully readable if this hook never runs.
 */
export function useGeoCards(ref: RefObject<HTMLDivElement | null>, route: string) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const cards = new Map<HTMLElement, HTMLElement>()
    const observer = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(entries => {
        entries.forEach(entry => (entry.target as HTMLElement).dataset.geoLive = String(entry.isIntersecting))
      }, { rootMargin: "60px" })
      : undefined

    const release = (card: HTMLElement, layer: HTMLElement) => {
      observer?.unobserve(card)
      layer.remove()
      delete card.dataset.geoCard
      delete card.dataset.geoLive
      delete card.dataset.geoSize
      card.style.removeProperty("--gx")
      card.style.removeProperty("--gy")
    }

    const scan = () => {
      cards.forEach((layer, card) => {
        if (!root.contains(card)) { observer?.unobserve(card); cards.delete(card) }
        // React may replace a card's children (text updates); restore the layer.
        else if (layer.parentElement !== card) card.append(layer)
      })
      let index = cards.size
      root.querySelectorAll<HTMLElement>(GEO_CARD_SELECTOR).forEach(card => {
        if (cards.has(card)) return
        const rect = card.getBoundingClientRect()
        // Explicit .geo-card elements are always cards; inferred ones must be large enough to read as one.
        if (!card.classList.contains("geo-card") && (rect.width < MIN_WIDTH || rect.height < MIN_HEIGHT)) return
        // A frame that only holds media is a picture, not a card.
        if (card.children.length === 1 && /^(IMG|VIDEO|PICTURE|IFRAME)$/.test(card.children[0].tagName)) return
        const requested = card.dataset.geo as GeoVariant | undefined
        const variant = requested && GEO_VARIANTS.includes(requested) ? requested : GEO_VARIANTS[index++ % GEO_VARIANTS.length]
        card.dataset.geoCard = toneOf(getComputedStyle(card).backgroundColor)
        // Containers and forms keep their place on hover.
        if (rect.width > 640 || rect.height > 600) card.dataset.geoSize = "lg"
        const layer = createGeoLayer(variant)
        card.append(layer)
        cards.set(card, layer)
        if (observer) observer.observe(card); else card.dataset.geoLive = "true"
      })
    }

    let frame = 0
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(scan) }
    const mutations = new MutationObserver(records => {
      const relevant = records.some(record => [...record.addedNodes, ...record.removedNodes].some(node =>
        node.nodeType === 1 && !(node as Element).classList.contains("geo-layer")))
      if (relevant) schedule()
    })
    mutations.observe(root, { childList: true, subtree: true })

    const fine = window.matchMedia?.("(hover: hover) and (pointer: fine)")
    let pointerFrame = 0
    const pointer = (event: PointerEvent) => {
      if (!fine?.matches) return
      const card = (event.target as Element | null)?.closest?.<HTMLElement>("[data-geo-card]")
      if (!card) return
      cancelAnimationFrame(pointerFrame)
      pointerFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty("--gx", `${Math.round(event.clientX - rect.left)}px`)
        card.style.setProperty("--gy", `${Math.round(event.clientY - rect.top)}px`)
      })
    }
    root.addEventListener("pointermove", pointer, { passive: true })
    scan()

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(pointerFrame)
      mutations.disconnect()
      observer?.disconnect()
      root.removeEventListener("pointermove", pointer)
      cards.forEach((layer, card) => release(card, layer))
      cards.clear()
    }
  }, [ref, route])
}
