/**
 * Amtdex — Authentication & Authorization Layer
 *
 * Integrated with Laravel Sanctum (SPA cookie session + /api/v1/me)
 *
 * ⚠️ IMPORTANT SECURITY NOTE:
 * All client-side role checks (canAccess, hasRole) are strictly for UI presentation
 * (showing/hiding buttons and navigation items). Real authorization and security
 * boundaries MUST be enforced on the Laravel backend via Policies, Gates,
 * and FormRequest::authorize().
 */

import { useSyncExternalStore } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API, ApiError } from "./api"

import type { Role, Session } from "@/types/auth"
export type { Role, User, Session } from "@/types/auth"

const STORAGE_KEY = "amtdex_session"

let cachedRaw: string | null | undefined
let cachedSession: Session | null = null

function readCachedSession(): Session | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === cachedRaw) return cachedSession
    cachedRaw = raw
    cachedSession = null
    if (raw) {
      const value: unknown = JSON.parse(raw)
      if (typeof value === "object" && value !== null && "user" in value) {
        const user = (value as Session).user
        if (user && typeof user.id === "string" && typeof user.name === "string" && typeof user.email === "string"
          && ["admin", "editor", "author", "viewer"].includes(user.role)) cachedSession = { user }
      }
    }
    return cachedSession
  } catch {
    cachedSession = null
    return null
  }
}

function writeCachedSession(s: Session | null) {
  if (typeof window === "undefined") return
  try {
    if (!s) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch { /* empty */ }
  listeners.forEach((cb) => cb())
}

const listeners = new Set<() => void>()
function subscribe(cb: () => void) {
  listeners.add(cb)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) cb()
  }
  window.addEventListener("storage", onStorage)
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage) }
}

/**
 * Synchronous getters for immediate checks during render
 */
export function getSession(): Session | null {
  return readCachedSession()
}

export function isAuthenticated(): boolean {
  return !!readCachedSession()
}

export function hasRole(allowed: Role[]): boolean {
  const s = readCachedSession()
  return !!s && allowed.includes(s.user.role)
}

const ROLE_RANK: Record<Role, number> = { viewer: 1, author: 2, editor: 3, admin: 4 }

export function canAccess(required: Role): boolean {
  const s = readCachedSession()
  if (!s) return false
  return ROLE_RANK[s.user.role] >= ROLE_RANK[required]
}

/**
 * Imperative login helper
 */
export async function login(email: string, password: string): Promise<Session> {
  const res = await API.login({ email, password })
  const session: Session = { user: res.user }
  writeCachedSession(session)
  return session
}

/**
 * Imperative logout helper
 */
export async function logout(): Promise<void> {
  try {
    await API.logout()
  } catch {
    // ignore server errors during logout
  } finally {
    writeCachedSession(null)
  }
}

/**
 * Hook: Sync External Store for reactive session
 */
export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, readCachedSession, () => null)
}

/**
 * TanStack Query Hook: Full reactive Sanctum user query
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const res = await API.me()
        const s: Session = { user: res.user }
        writeCachedSession(s)
        return res.user
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          writeCachedSession(null)
          return null
        }
        // In dev mock fallback if cached
        const cached = readCachedSession()
        if (cached && import.meta.env.DEV) {
          return cached.user
        }
        writeCachedSession(null)
        return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })
}

/**
 * TanStack Mutation Hook for Login
 */
export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return login(email, password)
    },
    onSuccess: (session) => {
      queryClient.setQueryData(["auth", "me"], session.user)
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

/**
 * TanStack Mutation Hook for Logout
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      return logout()
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null)
      queryClient.clear()
    },
  })
}
