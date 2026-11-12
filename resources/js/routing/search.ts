import { useEffect, useMemo, useState } from "react"

export function useDebouncedValue<T>(value: T, delay = 180): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])
  return debounced
}

/** Build a lowercase haystack once, then filter without walking fields again. */
export function createSearchIndex<T>(items: readonly T[], textOf: (item: T) => string) {
  const rows = items.map((item) => ({ item, hay: textOf(item).toLowerCase() }))
  return (query: string) => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items as T[]
    return rows.filter((row) => row.hay.includes(needle)).map((row) => row.item)
  }
}

export function useIndexedFilter<T>(items: readonly T[], query: string, textOf: (item: T) => string) {
  const search = useMemo(() => createSearchIndex(items, textOf), [items, textOf])
  return search(query)
}
