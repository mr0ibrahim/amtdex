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

export type Role = "admin" | "editor" | "viewer"

export type User = {
  id: string
  name: string
  email: string
  role: Role
}

export type Session = {
  user: User
  token?: string
}

const STORAGE_KEY = "amtdex_session"

function readCachedSession(): Session | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
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
  return () => listeners.delete(cb)
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

const ROLE_RANK: Record<Role, number> = { viewer: 1, editor: 2, admin: 3 }

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
