import React, { createContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

const AuthContext = createContext()

// Standalone axios instance for auth calls (token + profile + settings).
// It auto-refreshes the access token on 401 and retries the request once,
// so profile/settings saves never silently fail due to an expired token.
const authAxios = axios.create({ baseURL: API_BASE + '/api/' })

authAxios.interceptors.request.use(cfg => {
  if (cfg.url && cfg.url.startsWith('/') && cfg.baseURL) {
    cfg.url = cfg.url.substring(1)
  }
  // Attach token before auth/profile/settings requests
  if (!cfg.headers.Authorization) {
    const token = localStorage.getItem('access_token')
    if (token) cfg.headers.Authorization = 'Bearer ' + token
  }
  return cfg
})

// Queue for coordinating simultaneous refreshes
let isRefreshingAuth = false
let failedAuthQueue = []

const flushAuthQueue = (error, token = null) => {
  failedAuthQueue.forEach(p => error ? p.reject(error) : p.resolve(token))
  failedAuthQueue = []
}

authAxios.interceptors.response.use(
  res => res,
  async (err) => {
    const original = err.config
    const isRefreshEndpoint = `${original.url}`.includes('/token/refresh/')
    const isTokenEndpoint = `${original.url}`.includes('/token/')
    const status = err.response?.status

    // Only auto-retry once, on 401, for non-auth endpoints
    if (status === 401 && !original._authRetry && !isTokenEndpoint && !isRefreshEndpoint) {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) return Promise.reject(err)
      original._authRetry = true

      if (isRefreshingAuth) {
        // Wait for the in-flight refresh, then retry
        return new Promise((resolve, reject) => {
          failedAuthQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = 'Bearer ' + token
          return authAxios(original)
        }).catch(e => Promise.reject(e))
      }

      isRefreshingAuth = true
      try {
        const res = await authAxios.post('auth/token/refresh/', { refresh: refreshToken })
        const newToken = res.data.access
        localStorage.setItem('access_token', newToken)
        if (res.data.refresh) localStorage.setItem('refresh_token', res.data.refresh)
        // Update stored user in case the profile rotated
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user))
        }
        flushAuthQueue(null, newToken)
        original.headers.Authorization = 'Bearer ' + newToken
        return authAxios(original)
      } catch (refreshErr) {
        flushAuthQueue(refreshErr, null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        return Promise.reject(refreshErr)
      } finally {
        isRefreshingAuth = false
      }
    }
    return Promise.reject(err)
  }
)

export function AuthProvider({ children }) {
const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(() => {
    try {
      return !(localStorage.getItem('user') && localStorage.getItem('refresh_token'))
    } catch { return true }
  })
  // Tracks whether tokens were obtained in THIS session (so we skip a
  // redundant refresh round-trip right after login and enter faster).
  const freshlyLoggedIn = React.useRef(false)

  const silentRefresh = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) { setLoading(false); return }
    try {
      const res = await authAxios.post('auth/token/refresh/', { refresh })
      localStorage.setItem('access_token', res.data.access)
      if (res.data.refresh) localStorage.setItem('refresh_token', res.data.refresh)
      
      // Use user data already returned in refresh response
      const profile = res.data.user
      localStorage.setItem('user', JSON.stringify(profile))
      setUser(profile)
    } catch {
      // Refresh failed — keep existing user from localStorage but clear tokens
      const saved = localStorage.getItem('user')
      if (!saved) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

useEffect(() => {
    // If we JUST logged in this session, skip the redundant refresh
    // round-trip so the dashboard mounts instantly (tokens are already fresh).
    if (freshlyLoggedIn.current) {
      freshlyLoggedIn.current = false
      setLoading(false)
    } else {
      silentRefresh()
    }
    // Refresh every 10 minutes to keep session alive
    const interval = setInterval(silentRefresh, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [silentRefresh])

  const login = async (email, password) => {
    const resp = await authAxios.post('auth/token/', { username: email, password })
    localStorage.setItem('access_token', resp.data.access)
    localStorage.setItem('refresh_token', resp.data.refresh)
    
    // Use user data already returned in token response for faster login
    const profile = resp.data.user
    localStorage.setItem('user', JSON.stringify(profile))
    setUser(profile)
    // Mark as freshly logged in so the mount effect skips an extra refresh
    freshlyLoggedIn.current = true
    return profile
  }

  const register = async (payload) => {
    const resp = await authAxios.post('auth/register/', payload)
    if (resp.data && resp.data.access) {
      localStorage.setItem('access_token', resp.data.access)
      localStorage.setItem('refresh_token', resp.data.refresh)
const profile = resp.data.user
      localStorage.setItem('user', JSON.stringify(profile))
      setUser(profile)
      freshlyLoggedIn.current = true
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateProfile = async (data) => {
    const token = localStorage.getItem('access_token')
    const resp = await authAxios.patch('auth/profile/', data, {
      headers: { Authorization: 'Bearer ' + token }
    })
    localStorage.setItem('user', JSON.stringify(resp.data))
    setUser(resp.data)
    return resp.data
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile, silentRefresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
