import { useSyncExternalStore } from "react"

/**
 * One count of "something the visitor is waiting for" that is not a data query:
 * a page chunk still downloading, a form being sent. Queries are counted by React Query itself.
 */
let pending = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach(listener => listener())

/** Mark work as started; call the returned function exactly once when it ends. */
export function beginLoading() {
  pending += 1
  emit()
  let ended = false
  return () => {
    if (ended) return
    ended = true
    pending = Math.max(0, pending - 1)
    emit()
  }
}

export function usePendingCount() {
  return useSyncExternalStore(
    listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    () => pending,
    () => 0,
  )
}
