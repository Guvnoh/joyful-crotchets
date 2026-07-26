import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import type { Order, PaginatedResponse, DashboardStats } from '@/types'

export function useOrders(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.append(key, String(value))
      })
      const { data } = await api.get(`/orders?${params.toString()}`)
      return data as PaginatedResponse<Order>
    },
  })
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      const { data } = await api.get('/orders/my-orders')
      return data.data as Order[]
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`)
      return data.data as Order
    },
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post('/orders', orderData)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: string; note?: string }) => {
      const { data } = await api.put(`/orders/${id}/status`, { status, note })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/stats/dashboard')
      return data.data as DashboardStats
    },
  })
}

export function useSalesChart(period: string = 'monthly') {
  return useQuery({
    queryKey: ['sales-chart', period],
    queryFn: async () => {
      const { data } = await api.get(`/stats/sales-chart?period=${period}`)
      return data.data
    },
  })
}
