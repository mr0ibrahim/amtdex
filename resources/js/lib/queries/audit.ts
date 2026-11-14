import { useQuery } from "@tanstack/react-query"
import { API } from "@/lib/api"

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
      const response = await API.audit.list()
      return { logs: response.data as AuditLog[], blockedIps: response.blockedIps ?? [] }
    },
  })
}
