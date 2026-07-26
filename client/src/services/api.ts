import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('jc-auth')
    if (stored) {
      try {
        const { state } = JSON.parse(stored)
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`
        }
      } catch (e) {}
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const stored = localStorage.getItem('jc-auth')
        if (stored) {
          const { state } = JSON.parse(stored)
          if (state?.refreshToken) {
            const { data } = await axios.post(
              `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
              { refreshToken: state.refreshToken }
            )
            const newToken = data.token
            const newRefreshToken = data.refreshToken
            
            const updatedState = {
              ...state,
              token: newToken,
              refreshToken: newRefreshToken,
            }
            localStorage.setItem('jc-auth', JSON.stringify({ state: updatedState }))

            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('jc-auth')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
