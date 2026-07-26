import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import type { ActivityLog, PaginatedResponse } from '@/types'

export function useActivityLogs(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.append(key, String(value))
      })
      const { data } = await api.get(`/activity-logs?${params.toString()}`)
      return data as PaginatedResponse<ActivityLog>
    },
  })
}
