import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import type { Review } from '@/types'

export function useReviews(productId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['reviews', productId, page],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/product/${productId}?page=${page}&limit=${limit}`)
      return data
    },
    enabled: !!productId,
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (reviewData: any) => {
      const { data } = await api.post('/reviews', reviewData)
      return data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    },
  })
}
