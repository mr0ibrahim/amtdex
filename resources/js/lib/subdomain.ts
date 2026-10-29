/**
 * Amtdex Subdomain & Routing Utility
 * Handles seamless cross-subdomain links and detection between main site and blog subdomain.
 */

export function isBlogSubdomain(): boolean {
  if (typeof window === "undefined") return false
  if (window.__AMTDEX_CONFIG__?.isBlogSubdomain !== undefined) {
    return Boolean(window.__AMTDEX_CONFIG__.isBlogSubdomain)
  }
  const host = window.location.hostname
  return host.startsWith("blog.")
}

export function getBlogUrl(path = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  if (typeof window === "undefined") return cleanPath

  // If already on the blog subdomain, return relative path for client-side routing
  if (isBlogSubdomain()) {
    return cleanPath || "/"
  }

  // Cross-subdomain: navigate to the blog subdomain
  const configuredSubdomain = window.__AMTDEX_CONFIG__?.blogSubdomain
  const scheme = window.location.protocol
  const host = window.location.hostname
  const port = window.location.port ? `:${window.location.port}` : ""

  if (host === "localhost" || host === "127.0.0.1") {
    return `${scheme}//blog.localhost${port}${cleanPath}`
  }

  const targetHost = configuredSubdomain || `blog.${host.replace(/^www\./, "")}`
  return `${scheme}//${targetHost}${port}${cleanPath}`
}

export function getMainUrl(path = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  if (typeof window === "undefined") return cleanPath

  // If on main domain, return relative path
  if (!isBlogSubdomain()) {
    return cleanPath || "/"
  }

  const scheme = window.location.protocol
  const host = window.location.hostname
  const port = window.location.port ? `:${window.location.port}` : ""

  if (host.includes("localhost")) {
    return `${scheme}//localhost${port}${cleanPath}`
  }

  const mainHost = host.replace(/^blog\./, "")
  return `${scheme}//${mainHost}${port}${cleanPath}`
}
