import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import type { Product, PaginatedResponse } from '@/types'

interface ProductFilters {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: string
  minPrice?: number
  maxPrice?: number
  isFeatured?: boolean
  isBestSeller?: boolean
  isNewArrival?: boolean
  inStock?: boolean
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, String(value))
        }
      })
      const { data } = await api.get(`/products?${params.toString()}`)
      return data as PaginatedResponse<Product>
    },
  })
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${idOrSlug}`)
      return data.data as Product
    },
    enabled: !!idOrSlug,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/products/featured')
      return data.data as Product[]
    },
  })
}

export function useBestSellers() {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => {
      const { data } = await api.get('/products/best-sellers')
      return data.data as Product[]
    },
  })
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      const { data } = await api.get('/products/new-arrivals')
      return data.data as Product[]
    },
  })
}

export function useRelatedProducts(productId: string) {
  return useQuery({
    queryKey: ['products', 'related', productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}/related`)
      return data.data as Product[]
    },
    enabled: !!productId,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productData: any) => {
      const { data } = await api.post('/products', productData)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data: productData }: { id: string; data: any }) => {
      const { data } = await api.put(`/products/${id}`, productData)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
