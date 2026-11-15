import { useMutation, useQueryClient } from "@tanstack/react-query"
import { API } from "@/lib/api"
import type { TestimonialData, FaqData, TeamMemberData, ClientData } from "@/types/content"
import { useContentCollection, type ContentQueryOptions } from "./collection"

export function useTestimonialsQuery(options: ContentQueryOptions = {}) {
  // People and quotes are never invented: without the server there is nothing to show.
  return useContentCollection<TestimonialData>("testimonials", API.testimonials.list, async () => [], options)
}

export function useCreateTestimonialMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: TestimonialData) => API.testimonials.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "testimonials"] }),
  })
}

export function useUpdateTestimonialMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: TestimonialData }) => API.testimonials.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "testimonials"] }),
  })
}

export function useDeleteTestimonialMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => API.testimonials.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "testimonials"] }),
  })
}

// ── FAQS QUERY & MUTATIONS ──
export function useFaqsQuery(options: ContentQueryOptions = {}) {
  return useContentCollection<FaqData>("faqs", API.faqs.list, async () => [], options)
}

export function useCreateFaqMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FaqData) => API.faqs.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "faqs"] }),
  })
}

export function useUpdateFaqMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: FaqData }) => API.faqs.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "faqs"] }),
  })
}

export function useDeleteFaqMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => API.faqs.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "faqs"] }),
  })
}

// ── TEAM QUERY & MUTATIONS ──
export function useTeamQuery(options: ContentQueryOptions = {}) {
  return useContentCollection<TeamMemberData>("team", API.team.list, async () => [], options)
}

export function useCreateTeamMemberMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: TeamMemberData) => API.team.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "team"] }),
  })
}

export function useUpdateTeamMemberMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: TeamMemberData }) => API.team.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "team"] }),
  })
}

export function useDeleteTeamMemberMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => API.team.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "team"] }),
  })
}

// ── CLIENTS QUERY & MUTATIONS ──
export function useClientsQuery(options: ContentQueryOptions = {}) {
  return useContentCollection<ClientData>("clients", API.clients.list, async () => {
    const { LOGOS } = await import("@/data/site")
    return LOGOS.map((name, index) => ({ name, logo: "", sort_order: index, is_active: true }))
  }, options)
}

export function useCreateClientMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ClientData) => API.clients.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "clients"] }),
  })
}

export function useUpdateClientMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: ClientData }) => API.clients.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "clients"] }),
  })
}

export function useDeleteClientMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => API.clients.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "clients"] }),
  })
}
