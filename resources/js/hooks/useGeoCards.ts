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

    // Touch screens have no hover: the card crossing the middle of the screen takes the hover look.
    // Touch is detected from real input, not from the (hover) media query, which several
    // Android phones answer as if they had a mouse.
    const inBand = new Set<HTMLElement>()
    const applyFocus = () => {
      const on = root.dataset.geoTouch === "true"
      // IntersectionObserver owns the focus band. Do not measure or repaint every card on scroll.
      cards.forEach((_, card) => {
        const active = on && inBand.has(card)
        if (active && card.dataset.geoActive !== "true") card.dataset.geoActive = "true"
        else if (!active && card.dataset.geoActive) delete card.dataset.geoActive
      })
    }
    const setTouch = (value: boolean) => {
      if (root.dataset.geoTouch === String(value)) return
      root.dataset.geoTouch = String(value)
      applyFocus()
    }
    let focus: IntersectionObserver | undefined
    const observeFocus = () => {
      focus?.disconnect()
      inBand.clear()
      if (typeof IntersectionObserver === "function") {
        // Observer percentage margins use viewport width, so calculate the vertical band in pixels.
        const inset = Math.round(window.innerHeight * .4)
        focus = new IntersectionObserver(entries => {
          entries.forEach(entry => { if (entry.isIntersecting) inBand.add(entry.target as HTMLElement); else inBand.delete(entry.target as HTMLElement) })
          applyFocus()
        }, { rootMargin: `-${inset}px 0px -${inset}px 0px` })
        cards.forEach((_, card) => focus?.observe(card))
      }
      applyFocus()
    }
    observeFocus()
    window.addEventListener("resize", observeFocus, { passive: true })
    const onTouch = () => setTouch(true)

    const release = (card: HTMLElement, layer: HTMLElement) => {
      observer?.unobserve(card)
      focus?.unobserve(card)
      delete card.dataset.geoActive
      layer.remove()
      delete card.dataset.geoCard
      delete card.dataset.geoLive
      delete card.dataset.geoSize
      card.style.removeProperty("--gx")
      card.style.removeProperty("--gy")
    }

    const scan = () => {
      cards.forEach((layer, card) => {
        if (!root.contains(card)) { observer?.unobserve(card); focus?.unobserve(card); inBand.delete(card); cards.delete(card) }
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
        // Only cards that fit inside the focus band can be singled out.
        if (rect.height < window.innerHeight * .75) focus?.observe(card)
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
      // A real mouse hands the hover look back to :hover.
      if (event.pointerType === "mouse") setTouch(false)
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
    root.addEventListener("touchstart", onTouch, { passive: true })
    setTouch(navigator.maxTouchPoints > 0 && !!window.matchMedia?.("(any-pointer: coarse)").matches)
    scan()

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(pointerFrame)
      mutations.disconnect()
      observer?.disconnect()
      focus?.disconnect()
      window.removeEventListener("resize", observeFocus)
      root.removeEventListener("pointermove", pointer)
      root.removeEventListener("touchstart", onTouch)
      delete root.dataset.geoTouch
      inBand.clear()
      cards.forEach((layer, card) => release(card, layer))
      cards.clear()
    }
  }, [ref, route])
}
