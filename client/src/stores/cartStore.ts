import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/services/api'
import type { Cart, CartItem, Product } from '@/types'
import toast from 'react-hot-toast'

interface CartState {
  cart: Cart | null
  items: CartItem[]
  isLoading: boolean
  couponCode: string | null
  discount: number
  fetchCart: () => Promise<void>
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => Promise<void>
  removeItem: (productId: string, color?: string, size?: string) => Promise<void>
  clearCart: () => Promise<void>
  applyCoupon: (code: string) => Promise<void>
  removeCoupon: () => void
  getSubtotal: () => number
  getShipping: () => number
  getTax: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      items: [],
      isLoading: false,
      couponCode: null,
      discount: 0,

      fetchCart: async () => {
        try {
          const { data } = await api.get('/cart')
          set({
            cart: data.data,
            items: data.data?.items || [],
            couponCode: data.data?.couponCode || null,
          })
        } catch (error) {
          // guest cart from local
        }
      },

      addToCart: async (product, quantity = 1, color, size) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (item) =>
            item.product._id === product._id &&
            item.color === color &&
            item.size === size
        )

        let newItems: CartItem[]
        if (existingIndex > -1) {
          newItems = items.map((item, i) =>
            i === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
          )
        } else {
          newItems = [...items, { product, quantity, color, size }]
        }

        set({ items: newItems })

        try {
          await api.post('/cart/items', { productId: product._id, quantity, color, size })
        } catch (error) {
          // works offline via local storage
        }

        toast.success(`${product.name} added to cart`)
      },

      updateQuantity: async (productId, quantity, color, size) => {
        if (quantity < 1) return get().removeItem(productId, color, size)
        const items = get().items.map((item) =>
          item.product._id === productId && item.color === color && item.size === size
            ? { ...item, quantity }
            : item
        )
        set({ items })

        try {
          const cartItem = items.find(
            (i) => i.product._id === productId && i.color === color && i.size === size
          )
          if (cartItem) {
            const cart = get().cart
            const cartItemId = (cart?.items as any)?.find(
              (i: any) => i.product === productId
            )?._id
            if (cartItemId) {
              await api.put(`/cart/items/${cartItemId}`, { quantity })
            }
          }
        } catch (error) {}
      },

      removeItem: async (productId, color, size) => {
        const items = get().items.filter(
          (item) =>
            !(item.product._id === productId && item.color === color && item.size === size)
        )
        set({ items })
        toast.success('Item removed from cart')

        try {
          const cart = get().cart
          const cartItemId = (cart?.items as any)?.find(
            (i: any) => i.product === productId
          )?._id
          if (cartItemId) {
            await api.delete(`/cart/items/${cartItemId}`)
          }
        } catch (error) {}
      },

      clearCart: async () => {
        set({ items: [], couponCode: null, discount: 0 })
        try {
          await api.delete('/cart')
        } catch (error) {}
      },

      applyCoupon: async (code: string) => {
        try {
          const { data } = await api.post('/cart/coupon', { code })
          set({ couponCode: code, discount: data.data.discount })
          toast.success(`Coupon "${code}" applied! You save $${data.data.discount.toFixed(2)}`)
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Invalid coupon code')
          throw error
        }
      },

      removeCoupon: () => {
        set({ couponCode: null, discount: 0 })
        toast.success('Coupon removed')
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        if (subtotal >= 100) return 0
        return 8.99
      },

      getTax: () => {
        return get().getSubtotal() * 0.08
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = get().getShipping()
        const tax = get().getTax()
        const discount = get().discount
        return Math.max(0, subtotal + shipping + tax - discount)
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'jc-cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discount: state.discount,
      }),
    }
  )
)
