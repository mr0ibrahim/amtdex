import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API } from "@/lib/api"
import type { Lead, LeadStatus } from "@/types/lead"

export function useLeadsQuery(filter?: { status?: string; source?: string }) {
  return useQuery({ queryKey: ["leads", filter], queryFn: async () => (await API.leads.list(filter)).data as Lead[] })
}
export function useUpdateLeadStatusMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) => API.leads.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); qc.invalidateQueries({ queryKey: ["dashboard", "stats"] }) },
  })
}
export function useDeleteLeadMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => API.leads.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); qc.invalidateQueries({ queryKey: ["dashboard", "stats"] }) },
  })
}
