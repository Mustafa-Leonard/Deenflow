import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const instance = axios.create({
  baseURL: API_BASE + '/api',
  headers: { 'Content-Type': 'application/json' }
})

instance.interceptors.request.use(cfg => {
  const token = localStorage.getItem('access_token')
  if (token) {
    cfg.headers['Authorization'] = 'Bearer ' + token
  }
  return cfg
})

instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      // Don't redirect if we're already on an auth page
      const authPages = ['/login', '/register', '/admin/login']
      const isAuthPage = authPages.some(p => window.location.pathname.startsWith(p))
      if (!isAuthPage) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default instance
