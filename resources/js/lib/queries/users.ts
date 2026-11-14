import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API } from "@/lib/api"

export interface DashboardUser {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "author" | "viewer"
  avatar?: string | null
  bio?: string | null
  social_links?: Record<string, string> | null
  createdAt?: string
}

export function useUsersQuery() {
  return useQuery({ queryKey: ["users"], queryFn: async () => (await API.users.list()).data as DashboardUser[] })
}

export function useCreateUserMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password?: string; role: string; avatar?: string; bio?: string; social_links?: Record<string, string> }) => {
      return API.users.create(data)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useUpdateUserMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; email?: string; password?: string; role?: string; avatar?: string; bio?: string; social_links?: Record<string, string> } }) => {
      return API.users.update(id, data)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useDeleteUserMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      return API.users.delete(id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
