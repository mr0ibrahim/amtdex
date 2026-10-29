/**
 * Amtdex — Production API Client (Laravel Sanctum & REST Ready)
 *
 * Architecture:
 * - Relative baseURL: /api/v1 (supports subfolder & reverse proxy via window.__AMTDEX_CONFIG__)
 * - Cookie-based Sanctum authentication (credentials: 'include')
 * - Automatic /sanctum/csrf-cookie negotiation before mutating verbs (POST, PUT, PATCH, DELETE)
 * - Automatic 419 CSRF retry mechanism
 * - Structured ApiError with HTTP 422 Laravel validation mapping
 * - Global 401 / 403 / 429 interceptors
 * - DEV-only fallback mocks when local backend is unreachable; strict error throwing in PROD
 */

export interface ApiValidationErrorPayload {
  message: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>
  data?: unknown

  constructor(status: number, message: string, errors?: Record<string, string[]>, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
    this.data = data
  }

  /**
   * Helper to extract the first validation error message for a given field
   */
  getFieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0]
  }
}

/**
 * Resolve runtime API Base URL
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined" && window.__AMTDEX_CONFIG__?.apiUrl) {
    return window.__AMTDEX_CONFIG__.apiUrl.replace(/\/$/, "")
  }
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
  if (envUrl) {
    return envUrl.replace(/\/$/, "")
  }
  return "/api/v1"
}

/**
 * Parse XSRF-TOKEN cookie set by Laravel Sanctum
 */
export function getXsrfCookie(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

let csrfPromise: Promise<void> | null = null

/**
 * Fetch CSRF cookie from Sanctum if not already present
 */
export async function ensureCsrfToken(force = false): Promise<void> {
  if (typeof window === "undefined") return

  if (!force && getXsrfCookie()) {
    return
  }

  if (!csrfPromise || force) {
    const origin =
      typeof window !== "undefined" && window.location?.origin && window.location.origin !== "null"
        ? window.location.origin
        : "http://127.0.0.1:8000"
    const csrfUrl = `${origin.replace(/\/$/, "")}/sanctum/csrf-cookie`

    csrfPromise = fetch(csrfUrl, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(() => {
        csrfPromise = null
      })
      .catch((err) => {
        csrfPromise = null
        // In DEV, if Laravel backend isn't up, log warning rather than crash
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn("[Amtdex API] /sanctum/csrf-cookie unavailable in DEV mode. Falling back to mock if needed.", err)
        } else {
          throw err
        }
      })
  }

  return csrfPromise
}

type RequestOptions = {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  isRetry?: boolean
}

/**
 * Core HTTP client
 */
export async function apiClient<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const isMutating = method !== "GET"
  const isDev = import.meta.env.DEV

  if (isMutating) {
    try {
      await ensureCsrfToken()
    } catch {
      if (!isDev) {
        throw new ApiError(0, "فشل تهيئة رمز حماية CSRF من الخادم.")
      }
    }
  }

  const base = getApiBaseUrl()
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  let url = `${base}${cleanEndpoint}`

  if (options.params) {
    const search = new URLSearchParams()
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined) search.append(k, String(v))
    })
    const qs = search.toString()
    if (qs) url += (url.includes("?") ? "&" : "?") + qs
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...options.headers,
  }

  // Include X-XSRF-TOKEN for mutating requests
  const xsrf = getXsrfCookie()
  if (xsrf && isMutating) {
    headers["X-XSRF-TOKEN"] = xsrf
  }

  let requestBody: BodyInit | undefined = undefined
  if (body !== undefined) {
    if (body instanceof FormData) {
      requestBody = body
      // Let browser set multipart boundary
      delete headers["Content-Type"]
    } else {
      headers["Content-Type"] = "application/json"
      requestBody = JSON.stringify(body)
    }
  }

  try {
    const init: RequestInit = {
      method,
      headers,
      credentials: "include",
    }
    if (requestBody !== undefined && isMutating) {
      init.body = requestBody
    }

    const res = await fetch(url, init)

    // Handle 419 (CSRF Token Mismatch) — retry once
    if (res.status === 419 && !options.isRetry && isMutating) {
      await ensureCsrfToken(true)
      return apiClient<T>(endpoint, method, body, { ...options, isRetry: true })
    }

    // Handle 401 Unauthorized
    if (res.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        // Clear local session storage if any
        try { localStorage.removeItem("amtdex_session") } catch { /* ignore */ }
      }
      throw new ApiError(401, "انتهت الجلسة أو غير مصرح. يرجى تسجيل الدخول.")
    }

    // Handle 403 Forbidden
    if (res.status === 403) {
      throw new ApiError(403, "ليس لديك الصلاحية للوصول إلى هذا المورد.")
    }

    // Handle 429 Too Many Requests
    if (res.status === 429) {
      throw new ApiError(429, "تم تجاوز حد الطلبات المسموح بها، يرجى الانتظار قليلاً ثم المحاولة.")
    }

    // Handle 422 Validation Error
    if (res.status === 422) {
      const json = (await res.json().catch(() => ({}))) as ApiValidationErrorPayload
      throw new ApiError(422, json.message || "بيانات الإدخال غير صالحة.", json.errors, json)
    }

    // Handle other non-2xx statuses
    if (!res.ok) {
      const errText = await res.text().catch(() => "")
      let errJson: { message?: string } | null = null
      try { errJson = JSON.parse(errText) } catch { /* empty */ }
      const msg = errJson?.message || `طلب الخادم غير ناجح (${res.status}): ${res.statusText}`
      throw new ApiError(res.status, msg)
    }

    // 204 No Content
    if (res.status === 204) {
      return {} as T
    }

    return (await res.json()) as T
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err
    }

    // In DEV mode, allow fallback if backend is not reachable
    if (isDev) {
      const devMock = handleDevFallback<T>(method, cleanEndpoint, body)
      if (devMock !== undefined) {
        return devMock
      }
    }

    throw new ApiError(
      0,
      err instanceof Error ? err.message : "تعذر الاتصال بالخادم، يرجى التحقق من اتصال الشبكة.",
    )
  }
}

/**
 * DEV Mode Mock Fallback Handler
 * Activated strictly in DEV mode when real Laravel backend is offline.
 */
function handleDevFallback<T>(method: string, endpoint: string, body?: unknown): T | undefined {
  // Public form submissions
  if (method === "POST") {
    if (endpoint === "/contact") {
      return { ok: true, message: "تم استلام رسالتك بنجاح (وضع التطوير)" } as T
    }
    if (endpoint === "/quotes") {
      return { ok: true, message: "تم تقديم طلب عرض السعر بنجاح (وضع التطوير)" } as T
    }
    if (endpoint === "/newsletter") {
      return { ok: true, message: "تم الاشتراك في النشرة البريدية بنجاح (وضع التطوير)" } as T
    }
    if (endpoint === "/login") {
      const creds = body as { email?: string; password?: string }
      if (creds?.email && creds?.password === "Amtdex2026!") {
        return {
          user: {
            id: creds.email,
            name: creds.email.includes("admin") ? "أحمد الغامدي" : "مستخدم تجريبي",
            email: creds.email,
            role: creds.email.includes("admin") ? "admin" : creds.email.includes("editor") ? "editor" : "viewer",
          },
        } as T
      }
      throw new ApiError(422, "البيانات المدخلة غير صحيحة", {
        email: ["البريد الإلكتروني أو كلمة المرور غير صحيحة."],
      })
    }
    if (endpoint === "/logout") {
      return { ok: true } as T
    }
  }

  // Auth me
  if (method === "GET" && endpoint === "/me") {
    // If mock session exists in localStorage, return it, else 401
    try {
      const raw = localStorage.getItem("amtdex_session")
      if (raw) {
        const s = JSON.parse(raw)
        return { user: s.user } as T
      }
    } catch { /* empty */ }
    throw new ApiError(401, "غير مصرح — يرجى تسجيل الدخول")
  }

  return undefined
}

/**
 * High-level typed API facade
 */
export const API = {
  get baseUrl() {
    return getApiBaseUrl()
  },

  // Public Lead Endpoints
  contact(data: FormData) {
    return apiClient<{ ok: boolean; message?: string }>("/contact", "POST", data)
  },

  quote(data: Record<string, unknown>) {
    return apiClient<{ ok: boolean; message?: string }>("/quotes", "POST", data)
  },

  newsletter(email: string) {
    return apiClient<{ ok: boolean; message?: string }>("/newsletter", "POST", { email })
  },

  // Auth Endpoints
  me() {
    return apiClient<{ user: { id: string; name: string; email: string; role: "admin" | "editor" | "viewer" } }>("/me", "GET")
  },

  login(credentials: { email: string; password: string }) {
    return apiClient<{ user: { id: string; name: string; email: string; role: "admin" | "editor" | "viewer" } }>("/login", "POST", credentials)
  },

  logout() {
    return apiClient<{ ok: boolean }>("/logout", "POST")
  },

  // Dashboard & Content Endpoints
  leads: {
    list(params?: { status?: string; source?: string; page?: number; per_page?: number }) {
      return apiClient<{ data: Array<{ id: string; name: string; email: string; phone?: string; message: string; status: string; source: string; createdAt: string; meta?: Record<string, unknown> }>; meta?: { total: number } }>("/leads", "GET", undefined, { params })
    },
    updateStatus(id: string, status: string) {
      return apiClient<{ ok: boolean }>(`/leads/${id}/status`, "PATCH", { status })
    },
    delete(id: string) {
      return apiClient<{ ok: boolean }>(`/leads/${id}`, "DELETE")
    },
  },

  services: {
    list() {
      return apiClient<{ data: Array<unknown> }>("/services", "GET")
    },
    create(data: unknown) {
      return apiClient<{ ok: boolean; data: unknown }>("/services", "POST", data)
    },
    update(slug: string, data: unknown) {
      return apiClient<{ ok: boolean; data: unknown }>(`/services/${slug}`, "PUT", data)
    },
    delete(slug: string) {
      return apiClient<{ ok: boolean }>(`/services/${slug}`, "DELETE")
    },
  },

  projects: {
    list() {
      return apiClient<{ data: Array<unknown> }>("/projects", "GET")
    },
    create(data: unknown) {
      return apiClient<{ ok: boolean; data: unknown }>("/projects", "POST", data)
    },
    update(slug: string, data: unknown) {
      return apiClient<{ ok: boolean; data: unknown }>(`/projects/${slug}`, "PUT", data)
    },
    delete(slug: string) {
      return apiClient<{ ok: boolean }>(`/projects/${slug}`, "DELETE")
    },
  },

  seo: {
    list() {
      return apiClient<{ data: Array<{ path: string; title: string; description: string; noindex?: boolean }> }>("/seo", "GET")
    },
    upsert(data: { path: string; title: string; description: string; noindex?: boolean }) {
      return apiClient<{ ok: boolean }>("/seo", "POST", data)
    },
    delete(path: string) {
      return apiClient<{ ok: boolean }>(`/seo?path=${encodeURIComponent(path)}`, "DELETE")
    },
  },

  users: {
    list() {
      return apiClient<{ data: Array<{ id: string; name: string; email: string; role: string; createdAt?: string }> }>("/users", "GET")
    },
  },

  audit: {
    list() {
      return apiClient<{ data: Array<{ id: number; user: string; action: string; ip: string; at: string }>; blockedIps?: string[] }>("/audit", "GET")
    },
  },

  media: {
    list() {
      return apiClient<{ data: Array<{ id: string; url: string; name: string; size: number; mime: string }> }>("/media", "GET")
    },
    upload(file: File) {
      const form = new FormData()
      form.append("file", file)
      return apiClient<{ ok: boolean; url: string; id: string }>("/media", "POST", form)
    },
    delete(id: string) {
      return apiClient<{ ok: boolean }>(`/media/${id}`, "DELETE")
    },
  },

  settings: {
    get() {
      return apiClient<{ siteName: string; email: string; phone: string }>("/settings", "GET")
    },
    update(data: { siteName: string; email: string; phone: string }) {
      return apiClient<{ ok: boolean }>("/settings", "PUT", data)
    },
  },

  overview: {
    stats() {
      return apiClient<{
        activeProjects: { value: number; sub: string }
        contactRequests: { value: number; sub: string }
        quotes: { value: number; sub: string }
      }>("/dashboard/stats", "GET")
    },
  },
} as const
