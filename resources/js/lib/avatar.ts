const thumbnails: Record<string, string> = {
  "crm": "/images/optimized/crm-avatar-ed45928f.webp",
  "shop": "/images/optimized/shop-avatar-80b547c9.webp",
  "health": "/images/optimized/health-avatar-dcd6c17f.webp",
  "projects": "/images/optimized/projects-avatar-f15d323c.webp"
}

export function getAvatarUrl(src: string): string {
  try {
    const url = new URL(src, "https://amtdex.com")
    if (!["amtdex.com", "blog.amtdex.com"].includes(url.hostname)) return src
    const match = url.pathname.match(/^\/images\/screens\/(crm|shop|health|projects)(?:-480)?\.webp$/)
    return match ? thumbnails[match[1]] : src
  } catch {
    return src
  }
}
