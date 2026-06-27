// context/AuthContext.js
'use client'

import { createContext, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()
const STORAGE_KEY = 'user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) // { name, role, token }
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ⏰ Timer ID for auto logout
  let logoutTimer

  // ✅ Check if JWT is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      return payload.exp < now
    } catch (e) {
      return true // If malformed, treat as expired
    }
  }

  // ⏱ Auto logout when token expires
  const scheduleAutoLogout = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiryTime = payload.exp * 1000 - Date.now()
      if (expiryTime > 0) {
        logoutTimer = setTimeout(() => logout(), expiryTime)
      }
    } catch (e) {
      logout()
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      if (!parsed.token || isTokenExpired(parsed.token)) {
        logout()
      } else {
        setUser(parsed)
        scheduleAutoLogout(parsed.token)
      }
    }
    setLoading(false)

    // Cleanup on unmount
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer)
    }
  }, [])

  const login = (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
    scheduleAutoLogout(userData.token)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
