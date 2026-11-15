import type { Project } from "@/types/project"

/** Covers shipped with the site have a 600px variant next to them. */
export function coverSources(project: Project) {
  const src = project.cover_image
  if (!src) return undefined
  if (src.startsWith("/images/work/") && src.endsWith(".webp")) {
    return { src, srcSet: `${src.replace(/\.webp$/, "-600.webp")} 600w, ${src} 1200w`, illustrative: true }
  }
  return { src, srcSet: undefined, illustrative: false }
}

/** Store or site label for a project's public link. */
export function projectLinkLabel(url: string) {
  try {
    const host = new URL(url).hostname
    if (host === "apps.apple.com") return "حمّل من App Store"
    if (host === "play.google.com") return "حمّل من Google Play"
  } catch {
    // Fall through to the generic label.
  }
  return "زيارة الموقع"
}
