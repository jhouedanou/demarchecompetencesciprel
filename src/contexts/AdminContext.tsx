'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AdminContextType {
  isAdminAuthenticated: boolean
  adminUsername: string | null
  loginAdmin: (username: string, password: string) => boolean
  logoutAdmin: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'ù4:hatev12d>'
}

const STORAGE_KEY = 'ciprel_admin_auth'

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminUsername, setAdminUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if already authenticated on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem(STORAGE_KEY)
      if (savedAuth) {
        try {
          const auth = JSON.parse(savedAuth)
          if (auth.isAuthenticated && auth.username) {
            setIsAdminAuthenticated(true)
            setAdminUsername(auth.username)
          }
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
    setIsLoading(false)
  }, [])

  const loginAdmin = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdminAuthenticated(true)
      setAdminUsername(username)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: true, username }))
      }
      return true
    }
    return false
  }

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false)
    setAdminUsername(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <AdminContext.Provider value={{ isAdminAuthenticated, adminUsername, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
