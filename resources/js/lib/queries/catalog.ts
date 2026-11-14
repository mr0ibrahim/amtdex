import { useMutation, useQueryClient } from "@tanstack/react-query"
import { API } from "@/lib/api"
import type { Service, ServiceDraft } from "@/types/service"
import type { Project, ProjectDraft } from "@/types/project"
import { SERVICES } from "@/data/services"
import { PROJECTS } from "@/data/projects"
import { useContentCollection, type ContentQueryOptions } from "./collection"

export function useServicesQuery(options: ContentQueryOptions = {}) {
  return useContentCollection<Service>("services", API.services.list, async () => SERVICES, options)
}
export function useProjectsQuery(options: ContentQueryOptions = {}) {
  return useContentCollection<Project>("projects", API.projects.list, async () => PROJECTS, options)
}

export function useUpsertServiceMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ originalSlug, ...service }: ServiceDraft) => !service.id
      ? API.services.create(service) : API.services.update(originalSlug ?? service.slug, service),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "services"] }),
  })
}

export function useDeleteServiceMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (slug: string) => API.services.delete(slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "services"] }),
  })
}

export function useUpsertProjectMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ originalSlug, ...project }: ProjectDraft) => !project.id
      ? API.projects.create(project) : API.projects.update(originalSlug ?? project.slug, project),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "projects"] }),
  })
}

export function useDeleteProjectMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (slug: string) => API.projects.delete(slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", "projects"] }),
  })
}
