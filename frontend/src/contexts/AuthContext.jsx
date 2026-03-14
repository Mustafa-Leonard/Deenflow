import React, { createContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const AuthContext = createContext()

// Standalone axios instance for auth (no interceptors that loop)
const authAxios = axios.create({ baseURL: API_BASE + '/api' })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  const silentRefresh = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) { setLoading(false); return }
    try {
      const res = await authAxios.post('/auth/token/refresh/', { refresh })
      localStorage.setItem('access_token', res.data.access)
      if (res.data.refresh) localStorage.setItem('refresh_token', res.data.refresh)
      // Re-fetch profile with fresh token
      const profile = await authAxios.get('/auth/profile/', {
        headers: { Authorization: 'Bearer ' + res.data.access }
      })
      localStorage.setItem('user', JSON.stringify(profile.data))
      setUser(profile.data)
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
    silentRefresh()
    // Refresh every 10 minutes to keep session alive
    const interval = setInterval(silentRefresh, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [silentRefresh])

  const login = async (email, password) => {
    const resp = await authAxios.post('/auth/token/', { username: email, password })
    localStorage.setItem('access_token', resp.data.access)
    localStorage.setItem('refresh_token', resp.data.refresh)
    const profile = await authAxios.get('/auth/profile/', {
      headers: { Authorization: 'Bearer ' + resp.data.access }
    })
    localStorage.setItem('user', JSON.stringify(profile.data))
    setUser(profile.data)
    return profile.data
  }

  const register = async (payload) => {
    const resp = await authAxios.post('/auth/register/', payload)
    if (resp.data && resp.data.access) {
      localStorage.setItem('access_token', resp.data.access)
      localStorage.setItem('refresh_token', resp.data.refresh)
      const profile = resp.data.user
      localStorage.setItem('user', JSON.stringify(profile))
      setUser(profile)
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
    const resp = await authAxios.patch('/auth/profile/', data, {
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
