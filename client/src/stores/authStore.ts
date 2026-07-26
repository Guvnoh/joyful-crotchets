import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/services/api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  setTokens: (token: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        console.log('authStore.login called', email)
        set({ isLoading: true })
        try {
          console.log('Making API call...')
          const { data } = await api.post('/auth/login', { email, password })
          console.log('API response:', data)
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/register', userData)
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          // ignore
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          })
        }
      },

      loadUser: async () => {
        const token = get().token
        if (!token) return
        set({ isLoading: true })
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data.data, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false })
        }
      },

      updateProfile: async (userData) => {
        const { data } = await api.put('/auth/profile', userData)
        set({ user: data.data })
      },

      setTokens: (token, refreshToken) => {
        set({ token, refreshToken, isAuthenticated: true })
      },
    }),
    {
      name: 'jc-auth',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
