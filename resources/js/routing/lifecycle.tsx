import { useEffect, useState } from "react"
import { useLocation, useNavigationType } from "react-router-dom"
import { applyVisibility, pageIsListed } from "@/cms/visibility"

const scrollKey = (path: string) => `amtdex-scroll:${path}`

/** Drop in-flight GETs from the page we just left. */
let navigationController = new AbortController()

export function navigationSignal(): AbortSignal {
  return navigationController.signal
}

export function beginNavigation() {
  navigationController.abort()
  navigationController = new AbortController()
}

const preloads: Record<string, () => Promise<unknown>> = {
  "/": () => import("@/pages/Home/HomePage"),
  "/services": () => import("@/pages/Services/ServicesPage"),
  "/portfolio": () => import("@/pages/Portfolio/PortfolioPage"),
  "/pricing": () => import("@/pages/Pricing/PricingPage"),
  "/about": () => import("@/pages/About/AboutPage"),
  "/contact": () => import("@/pages/Contact/ContactPage"),
  "/quote": () => import("@/pages/Quote/QuotePage"),
  "/blog": () => import("@/pages/Blog/BlogHomePage"),
  "/login": () => import("@/pages/Auth/LoginPage"),
  "/dashboard": () => import("@/pages/Dashboard/Overview"),
}

export function prefetchRoute(path: string) {
  const key = path.split("?")[0].split("#")[0]
  if (key === "/login" || key === "/dashboard" || key.startsWith("/dashboard/")) return
  if (!pageIsListed(applyVisibility().pages, key, false)) return
  const exact = preloads[key]
  if (exact) {
    void exact()
    return
  }
  if (key.startsWith("/services/")) void import("@/pages/Services/ServiceDetailPage")
  else if (key.startsWith("/portfolio/")) void import("@/pages/Portfolio/PortfolioDetailPage")
  else if (key.startsWith("/blog")) void import("@/pages/Blog/BlogPostPage")
  else if (key.startsWith("/dashboard/blog")) void import("@/pages/Dashboard/Blog/DashboardBlogPage")
  else if (key.startsWith("/dashboard")) void import("@/pages/Dashboard/Overview")
}

export function RouteProgress() {
  const { pathname } = useLocation()
  const [on, setOn] = useState(false)

  useEffect(() => {
    setOn(true)
    const done = window.setTimeout(() => setOn(false), 450)
    return () => window.clearTimeout(done)
  }, [pathname])

  return <div className={`route-progress${on ? " is-on" : ""}`} aria-hidden />
}

/** Scroll restoration, focus move, and cancellation when the route changes. */
export function useRouteLifecycle() {
  const location = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    beginNavigation()
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1))
      target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
    } else if (navigationType === "POP") {
      const saved = Number(sessionStorage.getItem(scrollKey(location.key)) || 0)
      window.scrollTo({ top: Number.isFinite(saved) ? saved : 0, behavior: "auto" })
    } else {
      window.scrollTo({ top: 0, behavior: "auto" })
    }

    const active = document.activeElement
    const typing = active instanceof HTMLElement && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)
    if (!typing) document.getElementById("main-content")?.focus({ preventScroll: true })

    const onScroll = () => {
      sessionStorage.setItem(scrollKey(location.key), String(window.scrollY))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [location.pathname, location.hash])
}
