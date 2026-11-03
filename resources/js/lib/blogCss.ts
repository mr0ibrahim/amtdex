/**
 * Safe CSS for blog posts.
 *
 * Inline styles and <style> blocks are kept. External stylesheets
 * (<link rel="stylesheet">) are not fetched: a remote file can track readers
 * or ship rules we cannot review. Paste those rules into the post's custom CSS.
 *
 * Stored CSS is unscoped. Callers prefix selectors with the post wrapper so a
 * rule cannot restyle the rest of the site or the dashboard.
 */

const MAX_CSS_LENGTH = 100_000
const MAX_VALUE_LENGTH = 800
const MAX_CLASS_TOKEN = 120

const EXACT_PROPS = new Set([
  "color",
  "background",
  "border",
  "outline",
  "font",
  "flex",
  "grid",
  "gap",
  "margin",
  "padding",
  "width",
  "height",
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "inset",
  "float",
  "clear",
  "overflow",
  "opacity",
  "visibility",
  "z-index",
  "direction",
  "cursor",
  "transform",
  "filter",
  "transition",
  "animation",
  "object-fit",
  "object-position",
  "vertical-align",
  "text-align",
  "text-decoration",
  "text-transform",
  "text-indent",
  "text-shadow",
  "white-space",
  "word-break",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "list-style",
  "list-style-type",
  "list-style-position",
  "list-style-image",
  "table-layout",
  "border-collapse",
  "border-spacing",
  "caption-side",
  "empty-cells",
  "box-sizing",
  "box-shadow",
  "border-radius",
  "aspect-ratio",
  "order",
  "columns",
  "column-count",
  "column-width",
  "column-gap",
  "column-span",
  "column-rule",
  "align-items",
  "align-content",
  "align-self",
  "justify-content",
  "justify-items",
  "justify-self",
  "place-items",
  "place-content",
  "place-self",
  "row-gap",
  "min-width",
  "max-width",
  "min-height",
  "max-height",
  "unicode-bidi",
  "isolation",
  "mix-blend-mode",
  "pointer-events",
  "user-select",
  "text-overflow",
  "hyphens",
  "break-inside",
  "clip-path",
  "backdrop-filter",
  "transform-origin",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "flex-direction",
  "flex-wrap",
  "flex-flow",
  "grid-template",
  "grid-template-columns",
  "grid-template-rows",
  "grid-template-areas",
  "grid-column",
  "grid-row",
  "grid-area",
  "grid-auto-flow",
  "grid-auto-columns",
  "grid-auto-rows",
  "src",
  "unicode-range",
  "font-display",
  "line-clamp",
  "-webkit-line-clamp",
  "-webkit-box-orient",
])

const PROP_PREFIXES = [
  "background-",
  "border-",
  "outline-",
  "font-",
  "margin-",
  "padding-",
  "text-",
  "flex-",
  "grid-",
  "align-",
  "justify-",
  "place-",
  "overflow-",
  "inset-",
  "column-",
  "animation-",
  "transition-",
  "mask-",
  "scroll-",
  "row-",
]

const POSITION_VALUES = new Set(["static", "relative", "absolute", "sticky"])

export function isAllowedCssProperty(prop: string): boolean {
  const name = prop.trim().toLowerCase()
  if (!name || name === "behavior" || name.includes("binding")) return false
  if (name.startsWith("--")) return /^--[a-z0-9_-]{1,64}$/i.test(name)
  if (EXACT_PROPS.has(name)) return true
  const bare = name.startsWith("-webkit-") ? name.slice(8) : name
  if (EXACT_PROPS.has(bare)) return true
  return PROP_PREFIXES.some((prefix) => name.startsWith(prefix) && /^[a-z0-9-]+$/i.test(name.slice(prefix.length)))
}

export function isSafeCssUrl(url: string): boolean {
  const value = url.trim()
  if (!value || value.length > 2000) return false
  if (/[\s\\<>{}]|javascript\s*:|vbscript\s*:|expression\s*\(/i.test(value)) return false
  if (/^data:/i.test(value)) {
    return /^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=\s]+$/i.test(value) && value.length <= 1_500_000
  }
  if (value.startsWith("//") || value.includes("..")) return false
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return /^https?:\/\//i.test(value)
  return true
}

function urlsAreSafe(value: string): boolean {
  const opens = value.match(/url\s*\(/gi)
  if (!opens) return true
  const matches = [...value.matchAll(/url\s*\(\s*(?:'([^']*)'|"([^"]*)"|([^)'"\s]+))\s*\)/gi)]
  if (matches.length !== opens.length) return false
  return matches.every((match) => isSafeCssUrl(match[1] ?? match[2] ?? match[3] ?? ""))
}

export function sanitizeCssValue(prop: string, raw: string): string | null {
  let value = raw.trim().replace(/\s+/g, " ")
  if (!value || value.length > MAX_VALUE_LENGTH) return null
  if (/expression\s*\(|javascript\s*:|vbscript\s*:|@import|behavior|-moz-binding|[<>{}\\]/i.test(value)) return null
  if (/url\s*\(/i.test(value) && !urlsAreSafe(value)) return null

  let important = false
  if (/!\s*important\s*$/i.test(value)) {
    important = true
    value = value.replace(/!\s*important\s*$/i, "").trim()
  }
  if (value.includes("!")) return null

  if (prop === "position") {
    value = value.replace(/\bfixed\b/gi, "absolute")
    if (!POSITION_VALUES.has(value.toLowerCase())) return null
  }
  if (prop === "z-index" && !/^-?\d{1,4}$/.test(value)) return null
  if (!value) return null
  return important ? `${value} !important` : value
}

export function sanitizeDeclaration(part: string): string | null {
  const idx = part.indexOf(":")
  if (idx <= 0) return null
  const prop = part.slice(0, idx).trim().toLowerCase()
  if (!isAllowedCssProperty(prop)) return null
  const value = sanitizeCssValue(prop, part.slice(idx + 1))
  if (!value) return null
  return `${prop}: ${value}`
}

function splitDeclarations(style: string): string[] {
  const parts: string[] = []
  let current = ""
  let quote: string | null = null
  let paren = 0
  for (let i = 0; i < style.length; i += 1) {
    const char = style[i]
    if (quote) {
      current += char
      if (char === "\\") {
        current += style[i + 1] ?? ""
        i += 1
        continue
      }
      if (char === quote) quote = null
      continue
    }
    if (char === "'" || char === '"') {
      quote = char
      current += char
      continue
    }
    if (char === "(") paren += 1
    else if (char === ")" && paren > 0) paren -= 1
    else if (char === ";" && paren === 0) {
      if (current.trim()) parts.push(current.trim())
      current = ""
      continue
    }
    current += char
  }
  if (current.trim()) parts.push(current.trim())
  return parts
}

export function sanitizeInlineStyle(style: string): string {
  const kept = splitDeclarations(style || "")
    .map((part) => sanitizeDeclaration(part))
    .filter((part): part is string => Boolean(part))
  return kept.join("; ")
}

export function sanitizeClassList(value: string): string {
  const kept: string[] = []
  const seen = new Set<string>()
  for (const token of (value || "").split(/\s+/)) {
    if (!token || token.length > MAX_CLASS_TOKEN || seen.has(token)) continue
    if (!/^[\p{L}_][\p{L}\p{N}_:\-\[\]%.#()/*,]*$/u.test(token)) continue
    if (/javascript|expression|url\s*\(|[<>{}"'\\]/i.test(token)) continue
    const bare = (token.split(":").pop() || token).replace(/^!/, "")
    if (/^(fixed|sticky)$/i.test(bare)) continue
    seen.add(token)
    kept.push(token)
  }
  return kept.join(" ")
}

export function sanitizeElementId(value: string): string {
  const id = (value || "").trim()
  if (!/^[\p{L}_][\p{L}\p{N}_-]{0,80}$/u.test(id)) return ""
  return id
}

function splitSelectors(input: string): string[] {
  const out: string[] = []
  let current = ""
  let paren = 0
  let bracket = 0
  let quote: string | null = null
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]
    if (quote) {
      current += char
      if (char === "\\") {
        current += input[i + 1] ?? ""
        i += 1
        continue
      }
      if (char === quote) quote = null
      continue
    }
    if (char === "'" || char === '"') {
      quote = char
      current += char
      continue
    }
    if (char === "(") paren += 1
    else if (char === ")") paren = Math.max(0, paren - 1)
    else if (char === "[") bracket += 1
    else if (char === "]") bracket = Math.max(0, bracket - 1)
    else if (char === "," && paren === 0 && bracket === 0) {
      if (current.trim()) out.push(current.trim())
      current = ""
      continue
    }
    current += char
  }
  if (current.trim()) out.push(current.trim())
  return out
}

function prefixSelector(selector: string, scope: string): string {
  let sel = selector.trim()
  if (!sel || /[<>]|javascript\s*:|expression\s*\(|-moz-binding|@import/i.test(sel)) return ""
  if (
    sel === scope ||
    sel.startsWith(`${scope} `) ||
    sel.startsWith(`${scope}.`) ||
    sel.startsWith(`${scope}#`) ||
    sel.startsWith(`${scope}:`) ||
    sel.startsWith(`${scope}[`)
  ) {
    return sel
  }
  sel = sel.replace(/:root|:host/gi, " ")
  sel = sel.replace(/\b(?:html|body)\b/gi, " ")
  sel = sel
    .replace(/\s+/g, " ")
    .replace(/\s*([>+~])\s*/g, " $1 ")
    .replace(/^[>+~\s]+|[>+~\s]+$/g, "")
    .trim()
  if (!sel) return scope
  return `${scope} ${sel}`
}

function stripImports(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--|-->/g, "").replace(/@import\b[^;{]*;?/gi, "")
}

function renderCss(css: string, scope: string | null, inKeyframes = false): string {
  const out: string[] = []
  let i = 0
  const n = css.length
  const skipWs = () => {
    while (i < n && /\s/.test(css[i] || "")) i += 1
  }

  while (i < n) {
    skipWs()
    if (i >= n) break
    if (css[i] === "}") {
      i += 1
      continue
    }
    const start = i
    let quote: string | null = null
    let paren = 0
    let found: "semi" | "brace" | "end" = "end"
    while (i < n) {
      const char = css[i]
      if (quote) {
        if (char === "\\") {
          i += 2
          continue
        }
        if (char === quote) quote = null
        i += 1
        continue
      }
      if (char === "'" || char === '"') {
        quote = char
        i += 1
        continue
      }
      if (char === "(") paren += 1
      else if (char === ")") paren = Math.max(0, paren - 1)
      else if (paren === 0 && (char === ";" || char === "{")) {
        found = char === ";" ? "semi" : "brace"
        break
      }
      i += 1
    }
    const prelude = css.slice(start, i).trim()
    if (found === "end") {
      if (!inKeyframes && prelude && !prelude.startsWith("@")) {
        const decl = sanitizeDeclaration(prelude)
        if (decl) out.push(`${decl};`)
      }
      break
    }
    i += 1
    if (found === "semi") {
      if (!prelude.startsWith("@") && !inKeyframes) {
        const decl = sanitizeDeclaration(prelude)
        if (decl) out.push(`${decl};`)
      }
      continue
    }

    const bodyStart = i
    let depth = 1
    quote = null
    while (i < n && depth > 0) {
      const char = css[i]
      if (quote) {
        if (char === "\\") {
          i += 2
          continue
        }
        if (char === quote) quote = null
        i += 1
        continue
      }
      if (char === "'" || char === '"') {
        quote = char
        i += 1
        continue
      }
      if (char === "{") depth += 1
      else if (char === "}") depth -= 1
      i += 1
    }
    const body = css.slice(bodyStart, Math.max(bodyStart, i - 1))
    if (!prelude || /[<>]|javascript\s*:|expression\s*\(|-moz-binding|@import/i.test(prelude)) continue

    if (prelude.startsWith("@")) {
      const name = /^@([\w-]+)/.exec(prelude)?.[1]?.toLowerCase() ?? ""
      if (name === "import" || name === "charset" || name === "namespace") continue
      if (name === "keyframes" || name === "-webkit-keyframes") {
        const inner = renderCss(body, null, true)
        if (inner) out.push(`${prelude}{${inner}}`)
        continue
      }
      if (name === "media" || name === "supports" || name === "container" || name === "layer" || name === "document") {
        const inner = renderCss(body, scope, false)
        if (inner) out.push(`${prelude}{${inner}}`)
        continue
      }
      if (name === "font-face" || name === "page") {
        const inner = renderCss(body, null, false)
        if (inner) out.push(`${prelude}{${inner}}`)
      }
      continue
    }

    if (inKeyframes) {
      const sel = splitSelectors(prelude)
        .filter((item) => /^(from|to|\d+(?:\.\d+)?%)$/i.test(item))
        .join(",")
      const inner = renderCss(body, null, false)
      if (sel && inner) out.push(`${sel}{${inner}}`)
      continue
    }

    const selectors = splitSelectors(prelude)
      .map((item) => (scope ? prefixSelector(item, scope) : item.trim()))
      .filter(Boolean)
    const inner = renderCss(body, null, false)
    if (selectors.length && inner) out.push(`${selectors.join(",")}{${inner}}`)
  }

  return out.join("")
}

function finishCss(css: string): string {
  return css.replace(/position\s*:\s*fixed/gi, "position: absolute").trim()
}

export function sanitizeStylesheet(css: string): string {
  const source = stripImports(css || "").slice(0, MAX_CSS_LENGTH)
  return finishCss(renderCss(source, null))
}

export function scopeStylesheet(css: string, scope: string): string {
  const safeScope = scope.trim()
  if (!/^\.[A-Za-z_][\w-]*(?:\.[A-Za-z_][\w-]*)*$/.test(safeScope)) return ""
  const source = stripImports(css || "").slice(0, MAX_CSS_LENGTH)
  return finishCss(renderCss(source, safeScope))
}

export function postScopeSelector(postId?: number | null): string {
  const base = ".blog-prose.blog-post-content"
  if (typeof postId === "number" && Number.isInteger(postId) && postId > 0) {
    return `${base}.post-content-${postId}`
  }
  return base
}

export function postContentClassName(postId?: number | null): string {
  const base = "blog-prose blog-post-content"
  if (typeof postId === "number" && Number.isInteger(postId) && postId > 0) {
    return `${base} post-content-${postId}`
  }
  return base
}

export function scopePostCss(css: string, postId?: number | null): string {
  const clean = sanitizeStylesheet(css)
  if (!clean) return ""
  return scopeStylesheet(clean, postScopeSelector(postId))
}

export function mergeCss(current: string, extra: string): string {
  const next = sanitizeStylesheet(extra)
  const prev = (current || "").trim()
  if (!next) return prev
  if (!prev) return next
  if (prev.includes(next)) return prev
  return `${prev}\n${next}`
}
