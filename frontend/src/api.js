import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

const instance = axios.create({
  baseURL: API_BASE + '/api/',
  headers: { 'Content-Type': 'application/json' }
})

instance.interceptors.request.use(cfg => {
  // Normalize leading slash to ensure it's relative to baseURL (prevents 404s)
  if (cfg.url && cfg.url.startsWith('/') && cfg.baseURL) {
    cfg.url = cfg.url.substring(1)
  }
  const token = localStorage.getItem('access_token')
  if (token) {
    cfg.headers['Authorization'] = 'Bearer ' + token
  }
  return cfg
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

instance.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config

    // Don't intercept auth pages or refresh endpoint itself
    const authPages = ['/login', '/register', '/admin/login']
    const isAuthPage = authPages.some(p => window.location.pathname.startsWith(p))
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/token/refresh/')

    if (err.response?.status === 401 && !originalRequest._retry && !isAuthPage && !isRefreshEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return instance(originalRequest)
        }).catch(e => Promise.reject(e))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        isRefreshing = false
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(err)
      }

      try {
        const res = await axios.post(`${API_BASE}/api/auth/token/refresh/`, { refresh: refreshToken })
        const newToken = res.data.access
        localStorage.setItem('access_token', newToken)
        if (res.data.refresh) localStorage.setItem('refresh_token', res.data.refresh)
        instance.defaults.headers['Authorization'] = 'Bearer ' + newToken
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken
        processQueue(null, newToken)
        return instance(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(err)
  }
)

export default instance
