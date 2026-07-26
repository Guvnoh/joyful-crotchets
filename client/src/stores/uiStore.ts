import { create } from 'zustand'

interface UIState {
  isDarkMode: boolean
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isCartOpen: boolean
  isQuickViewOpen: boolean
  quickViewProductId: string | null
  toggleDarkMode: () => void
  setMobileMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setCartOpen: (open: boolean) => void
  setQuickView: (open: boolean, productId?: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isCartOpen: false,
  isQuickViewOpen: false,
  quickViewProductId: null,

  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.isDarkMode
      document.documentElement.classList.toggle('dark', newMode)
      return { isDarkMode: newMode }
    }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setQuickView: (open, productId) =>
    set({ isQuickViewOpen: open, quickViewProductId: productId || null }),
}))
