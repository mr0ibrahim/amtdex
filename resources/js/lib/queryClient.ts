
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: (failureCount, error: unknown) => {
        // Do not retry on 401, 403, 404, 422
        const status = (error as { status?: number })?.status
        if (status === 401 || status === 403 || status === 404 || status === 422) return false
        return failureCount < 2
      },
    },
  },
})
