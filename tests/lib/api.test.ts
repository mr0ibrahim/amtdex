import { describe, expect, it, vi, beforeEach } from "vitest"
import { ApiError, getApiBaseUrl, getXsrfCookie, ensureCsrfToken, apiClient } from "@/lib/api"

describe("api layer (src/lib/api.ts)", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim()
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      }
    })
    delete window.__AMTDEX_CONFIG__
  })

  it("resolves default baseURL to /api/v1 when config is empty", () => {
    expect(getApiBaseUrl()).toBe("/api/v1")
  })

  it("resolves baseURL from window.__AMTDEX_CONFIG__ when set by Laravel Blade", () => {
    window.__AMTDEX_CONFIG__ = {
      apiUrl: "https://custom.amtdex.test/api/v1/",
    }
    expect(getApiBaseUrl()).toBe("https://custom.amtdex.test/api/v1")
  })

  it("extracts XSRF-TOKEN cookie properly", () => {
    document.cookie = "other=value"
    document.cookie = "XSRF-TOKEN=test-csrf-token-123%3D"
    document.cookie = "session=abc"
    expect(getXsrfCookie()).toBe("test-csrf-token-123=")
  })

  it("returns null if XSRF-TOKEN cookie is missing", () => {
    document.cookie = "session=abc; other=xyz"
    expect(getXsrfCookie()).toBeNull()
  })

  it("constructs ApiError with Laravel 422 field error extractor", () => {
    const error = new ApiError(422, "البيانات المدخلة غير صالحة", {
      email: ["البريد الإلكتروني مستخدم بالفعل."],
      password: ["كلمة المرور قصيرة جداً."],
    })

    expect(error.status).toBe(422)
    expect(error.message).toBe("البيانات المدخلة غير صالحة")
    expect(error.getFieldError("email")).toBe("البريد الإلكتروني مستخدم بالفعل.")
    expect(error.getFieldError("password")).toBe("كلمة المرور قصيرة جداً.")
    expect(error.getFieldError("unknown")).toBeUndefined()
  })

  it("fetches /sanctum/csrf-cookie when ensuring token and cookie is not present", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as Response)

    await ensureCsrfToken(true)
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining("/sanctum/csrf-cookie"), expect.objectContaining({
      method: "GET",
      credentials: "include",
    }))
  })

  it("handles 422 response in apiClient by throwing ApiError with validation errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => ({
        message: "بيانات غير صالحة",
        errors: { name: ["الاسم مطلوب"] },
      }),
    } as Response)

    await expect(apiClient("/test", "GET")).rejects.toThrow(ApiError)
  })

  it("handles 429 response in apiClient by throwing rate limit ApiError", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 429,
    } as Response)

    await expect(apiClient("/test", "GET")).rejects.toThrow("تم تجاوز حد الطلبات")
  })
})
