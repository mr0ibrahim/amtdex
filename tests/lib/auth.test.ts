import { act, renderHook } from "@testing-library/react"
import { mockAuthApi } from "../helpers/auth"
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest"
import { getSession, isAuthenticated, hasRole, canAccess, login, logout, useSession } from "@/lib/auth"

describe("auth layer (src/lib/auth.ts)", () => {
  afterEach(() => vi.restoreAllMocks())

  beforeEach(() => {
    mockAuthApi()
    localStorage.clear()
  })

  it("reports unauthenticated when storage is empty", () => {
    expect(getSession()).toBeNull()
    expect(isAuthenticated()).toBe(false)
    expect(hasRole(["admin"])).toBe(false)
    expect(canAccess("viewer")).toBe(false)
  })

  it("handles login and session persistence using the API response", async () => {
    const session = await login("admin@amtdex.ye", "test-only-password")
    expect(session.user.role).toBe("admin")
    expect(session.user.name).toBe("أحمد الغامدي")
    expect(isAuthenticated()).toBe(true)
    expect(hasRole(["admin"])).toBe(true)
    expect(hasRole(["editor"])).toBe(false)
    expect(canAccess("admin")).toBe(true)
    expect(canAccess("editor")).toBe(true)
    expect(canAccess("viewer")).toBe(true)
  })

  it("checks role hierarchy with canAccess correctly", async () => {
    await login("editor@amtdex.ye", "test-only-password")
    expect(canAccess("viewer")).toBe(true)
    expect(canAccess("editor")).toBe(true)
    expect(canAccess("admin")).toBe(false)
  })

  it("clears session on logout", async () => {
    await login("admin@amtdex.ye", "test-only-password")
    expect(isAuthenticated()).toBe(true)
    await logout()
    expect(isAuthenticated()).toBe(false)
    expect(getSession()).toBeNull()
  })
  it("returns a stable session snapshot and updates subscribers on logout", async () => {
    await login("admin@example.test", "test-only-password")
    expect(getSession()).toBe(getSession())
    const { result } = renderHook(() => useSession())
    expect(result.current?.user.role).toBe("admin")
    await act(async () => { await logout() })
    expect(result.current).toBeNull()
  })
  it("rejects malformed cached sessions without crashing", () => {
    localStorage.setItem("amtdex_session", JSON.stringify({ user: { role: "unknown" } }))
    expect(getSession()).toBeNull()
  })

})

