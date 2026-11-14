import { useQuery } from "@tanstack/react-query"
import { API } from "@/lib/api"

export function useDashboardStatsQuery() {
  return useQuery({ queryKey: ["dashboard", "stats"], queryFn: () => API.overview.stats() })
}
