import { useEffect, type RefObject } from "react"

/** Animate decorative loops only while their section is visible. */
export function useAmbientMotion(ref: RefObject<HTMLDivElement | null>, route: string) {
  useEffect(() => {
    const root = ref.current
    if (!root || typeof IntersectionObserver === "undefined") return
    const observed = new Set<Element>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.setAttribute("data-loop-visible", String(entry.isIntersecting)))
    }, { rootMargin: "40px" })
    const scan = () => {
      observed.forEach(element => { if (!root.contains(element)) { observer.unobserve(element); observed.delete(element) } })
      root.querySelectorAll(".site-header-bar, .da-kicker, .da-hero h1, .brand-page-header h1, .contact-page-hero h1, .quote-page h1, .blog-hero h1, .reference-floating, .reference-ribbon, .contact-eyebrow, .blog-follow-eyebrow").forEach(element => {
        if (observed.has(element)) return
        observed.add(element)
        observer.observe(element)
      })
    }
    let frame = 0
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(scan) }
    const mutations = new MutationObserver(schedule)
    mutations.observe(root, { childList: true, subtree: true })
    const visibility = () => { root.dataset.documentHidden = String(document.hidden) }
    document.addEventListener("visibilitychange", visibility)
    visibility()
    scan()
    return () => {
      observer.disconnect()
      mutations.disconnect()
      cancelAnimationFrame(frame)
      document.removeEventListener("visibilitychange", visibility)
      observed.forEach(element => element.removeAttribute("data-loop-visible"))
      delete root.dataset.documentHidden
    }
  }, [ref, route])
}
