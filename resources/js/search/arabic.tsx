import { Fragment } from "react"

export function normalizeArabic(value: string) {
  return value
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .toLowerCase()
}

export function highlightMatch(text: string, query: string) {
  const needle = normalizeArabic(query.trim())
  if (!needle) return text
  const chars = Array.from(text)
  let norm = ""
  const map: number[] = []
  chars.forEach((ch, index) => {
    for (const piece of normalizeArabic(ch)) {
      norm += piece
      map.push(index)
    }
  })
  const at = norm.indexOf(needle)
  if (at < 0) return text
  const start = map[at]
  const end = map[at + needle.length - 1] + 1
  return (
    <Fragment>
      {text.slice(0, start)}
      <mark className="search-hit">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </Fragment>
  )
}
