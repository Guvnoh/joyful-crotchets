import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/services/api'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

interface WishlistState {
  items: Product[]
  isLoading: boolean
  fetchWishlist: () => Promise<void>
  toggleWishlist: (product: Product) => Promise<void>
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => Promise<void>
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        try {
          const { data } = await api.get('/wishlist')
          set({ items: data.data?.products || [] })
        } catch (error) {}
      },

      toggleWishlist: async (product) => {
        const items = get().items
        const exists = items.find((i) => i._id === product._id)
        let newItems: Product[]

        if (exists) {
          newItems = items.filter((i) => i._id !== product._id)
          toast.success('Removed from wishlist')
        } else {
          newItems = [...items, product]
          toast.success('Added to wishlist')
        }

        set({ items: newItems })

        try {
          await api.post(`/wishlist/${product._id}`)
        } catch (error) {}
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i._id === productId)
      },

      clearWishlist: async () => {
        set({ items: [] })
        try {
          await api.delete('/wishlist')
        } catch (error) {}
      },
    }),
    {
      name: 'jc-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
