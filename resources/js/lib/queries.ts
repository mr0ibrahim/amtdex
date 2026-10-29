/**
 * Amtdex — Unified Data Layer (TanStack Query)
 *
 * Bridges the React Dashboard and public components to Laravel API v1.
 * Provides typed queries and mutations with loading, error, and empty states.
 * In DEV mode, falls back cleanly to mock fixtures if the backend server is unreachable.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API, ApiError } from "./api"
import type { Lead, LeadStatus } from "./leadStore"
import type { Service } from "@/types/service"
import type { Project } from "@/types/project"
import type { SeoEntry } from "./seoStore"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { PROJECTS as SEED_PROJECTS } from "@/data/projects"

// ── LEADS QUERIES & MUTATIONS ──
export function useLeadsQuery(filter?: { status?: string; source?: string }) {
  return useQuery({
    queryKey: ["leads", filter],
    queryFn: async () => {
      try {
        const res = await API.leads.list(filter)
        return res.data as Lead[]
      } catch (err) {
        if (import.meta.env.DEV) {
          // Dev fallback to local store
          const { getLeads } = await import("./leadStore")
          return getLeads()
        }
        throw err
      }
    },
  })
}

export function useUpdateLeadStatusMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      try {
        await API.leads.updateStatus(id, status)
      } catch (err) {
        if (!import.meta.env.DEV) throw err
        const { updateLeadStatus } = await import("./leadStore")
        updateLeadStatus(id, status)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] })
      qc.invalidateQueries({ queryKey: ["dashboard", "stats"] })
    },
  })
}

export function useDeleteLeadMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await API.leads.delete(id)
      } catch (err) {
        if (!import.meta.env.DEV) throw err
        const { deleteLead } = await import("./leadStore")
        deleteLead(id)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] })
      qc.invalidateQueries({ queryKey: ["dashboard", "stats"] })
    },
  })
}

// ── CONTENT (SERVICES & PROJECTS) ──
export function useServicesQuery() {
  return useQuery({
    queryKey: ["content", "services"],
    queryFn: async () => {
      try {
        const res = await API.services.list()
        return res.data as Service[]
      } catch (err) {
        if (import.meta.env.DEV) {
          const { getServices } = await import("./contentStore")
          return getServices() || SEED_SERVICES
        }
        throw err
      }
    },
  })
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: ["content", "projects"],
    queryFn: async () => {
      try {
        const res = await API.projects.list()
        return res.data as Project[]
      } catch (err) {
        if (import.meta.env.DEV) {
          const { getProjects } = await import("./contentStore")
          return getProjects() || SEED_PROJECTS
        }
        throw err
      }
    },
  })
}

export function useUpsertServiceMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (service: Service) => {
      try {
        await API.services.update(service.slug, service)
      } catch (err) {
        if (!import.meta.env.DEV) throw err
        const { upsertService } = await import("./contentStore")
        upsertService(service)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content", "services"] })
    },
  })
}

export function useDeleteServiceMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (slug: string) => {
      try {
        await API.services.delete(slug)
      } catch (err) {
        if (!import.meta.env.DEV) throw err
        const { deleteService } = await import("./contentStore")
        deleteService(slug)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content", "services"] })
    },
  })
}

export function useUpsertProjectMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (project: Project) => {
      try {
        await API.projects.update(project.slug, project)
      } catch (err) {
        if (!import.meta.env.DEV) throw err
        const { upsertProject } = await import("./contentStore")
        upsertProject(project)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content", "projects"] })
    },
  })
}

export function useDeleteProjectMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (slug: string) => {
      try {
        await API.projects.delete(slug)
      } catch (err) {
        if (!import.meta.env.DEV) throw err
        const { deleteProject } = await import("./contentStore")
        deleteProject(slug)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content", "projects"] })
    },
  })
}

// ── SEO QUERIES & MUTATIONS ──
export function useSeoQuery() {
  return useQuery({
    queryKey: ["seo"],
    queryFn: async () => {
      try {
        const res = await API.seo.list()
        return res.data as SeoEntry[]
      } catch (err) {
        if (import.meta.env.DEV) {
          const { getSeo } = await import("./seoStore")
          return getSeo()
        }
        throw err
      }
    },
  })
}

export function useUpsertSeoMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (entry: SeoEntry) => {
      try {
        await API.seo.upsert(entry)
      } catch (err) {
        if (!import.meta.env.DEV) throw err
        const { upsertSeo } = await import("./seoStore")
        upsertSeo(entry)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seo"] })
    },
  })
}

export function useDeleteSeoMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (path: string) => {
      try {
        await API.seo.delete(path)
      } catch (err) {
        if (!import.meta.env.DEV) throw err
        const { deleteSeo } = await import("./seoStore")
        deleteSeo(path)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seo"] })
    },
  })
}

// ── USERS QUERY ──
export interface DashboardUser {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
}

export function useUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await API.users.list()
        return res.data as DashboardUser[]
      } catch (err) {
        if (import.meta.env.DEV) {
          return [
            { id: "1", email: "admin@amtdex.ye", name: "أحمد الغامدي", role: "admin" as const },
            { id: "2", email: "editor@amtdex.ye", name: "ريم الدوسري", role: "editor" as const },
            { id: "3", email: "viewer@amtdex.ye", name: "لينا عسيري", role: "viewer" as const },
          ]
        }
        throw err
      }
    },
  })
}

// ── AUDIT LOGS QUERY ──
export interface AuditLog {
  id: number
  user: string
  action: string
  ip: string
  at: string
}

export function useAuditLogsQuery() {
  return useQuery({
    queryKey: ["audit"],
    queryFn: async () => {
      try {
        const res = await API.audit.list()
        return {
          logs: res.data as AuditLog[],
          blockedIps: res.blockedIps || [],
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          return {
            logs: [
              { id: 1, user: "admin@amtdex.ye", action: "تسجيل دخول", ip: "197.36.1.12", at: "2026-10-24 23:15" },
              { id: 2, user: "admin@amtdex.ye", action: "تعديل خدمة web", ip: "197.36.1.12", at: "2026-10-24 23:12" },
              { id: 3, user: "editor@amtdex.ye", action: "محاولة دخول فاشلة", ip: "197.36.2.88", at: "2026-10-24 22:40" },
            ],
            blockedIps: [],
          }
        }
        throw err
      }
    },
  })
}

// ── MEDIA QUERY & MUTATIONS ──
export interface MediaItem {
  id: string
  url: string
  name: string
  size: number
  mime: string
}

export function useMediaQuery() {
  return useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      try {
        const res = await API.media.list()
        return res.data as MediaItem[]
      } catch (err) {
        if (import.meta.env.DEV) {
          return [
            { id: "1", url: "/favicon.svg", name: "logo.svg", size: 12400, mime: "image/svg+xml" },
            { id: "2", url: "/favicon.svg", name: "banner.webp", size: 45000, mime: "image/webp" },
          ]
        }
        throw err
      }
    },
  })
}

export function useUploadMediaMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      // Security client boundary: max 10MB, image MIME only
      const MAX_SIZE = 10 * 1024 * 1024 // 10MB
      if (file.size > MAX_SIZE) {
        throw new ApiError(422, "حجم الملف يتجاوز الحد المسموح (10 ميجابايت)")
      }
      const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf"]
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new ApiError(422, "نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WebP, SVG, PDF")
      }
      return API.media.upload(file)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["media"] })
    },
  })
}

// ── SETTINGS QUERY & MUTATIONS ──
export interface SiteSettings {
  siteName: string
  email: string
  phone: string
}

export function useSettingsQuery() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      try {
        return await API.settings.get()
      } catch (err) {
        if (import.meta.env.DEV) {
          return {
            siteName: "Amtdex",
            email: "hello@amtdex.ye",
            phone: "+967 7xx xxx xxx",
          }
        }
        throw err
      }
    },
  })
}

export function useUpdateSettingsMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      try {
        await API.settings.update(settings)
      } catch (err) {
        if (!import.meta.env.DEV) throw err
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] })
    },
  })
}

// ── OVERVIEW STATS QUERY ──
export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      try {
        return await API.overview.stats()
      } catch (err) {
        if (import.meta.env.DEV) {
          return {
            activeProjects: { value: 12, sub: "4 قيد التنفيذ" },
            contactRequests: { value: 8, sub: "2 جديدة اليوم" },
            quotes: { value: 5, sub: "بانتظار الرد" },
          }
        }
        throw err
      }
    },
  })
}

