import React, { createContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const login = async (email, password) => {
    const resp = await api.post('/auth/token/', { username: email, password })
    localStorage.setItem('access_token', resp.data.access)
    localStorage.setItem('refresh_token', resp.data.refresh)
    // fetch profile
    const profile = await api.get('/auth/profile/')
    localStorage.setItem('user', JSON.stringify(profile.data))
    setUser(profile.data)
    return profile.data
  }

  const register = async (payload) => {
    const resp = await api.post('/auth/register/', payload)
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
    const resp = await api.patch('/auth/profile/', data)
    localStorage.setItem('user', JSON.stringify(resp.data))
    setUser(resp.data)
    return resp.data
  }

  return <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>{children}</AuthContext.Provider>
}

export default AuthContext
