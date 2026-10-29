import { describe, expect, it, beforeEach } from "vitest"
import { getSession, isAuthenticated, hasRole, canAccess, login, logout } from "@/lib/auth"

describe("auth layer (src/lib/auth.ts)", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("reports unauthenticated when storage is empty", () => {
    expect(getSession()).toBeNull()
    expect(isAuthenticated()).toBe(false)
    expect(hasRole(["admin"])).toBe(false)
    expect(canAccess("viewer")).toBe(false)
  })

  it("handles login and session persistence in dev mock", async () => {
    const session = await login("admin@amtdex.ye", "Amtdex2026!")
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
    await login("editor@amtdex.ye", "Amtdex2026!")
    expect(canAccess("viewer")).toBe(true)
    expect(canAccess("editor")).toBe(true)
    expect(canAccess("admin")).toBe(false)
  })

  it("clears session on logout", async () => {
    await login("admin@amtdex.ye", "Amtdex2026!")
    expect(isAuthenticated()).toBe(true)
    await logout()
    expect(isAuthenticated()).toBe(false)
    expect(getSession()).toBeNull()
  })
})

