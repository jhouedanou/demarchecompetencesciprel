'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore(state => state.initialize)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const initRef = useRef(false)
  const mountedRef = useRef(false)

  useEffect(() => {
    // Mark component as mounted
    mountedRef.current = true

    // Only initialize once on mount
    if (!initRef.current) {
      initRef.current = true
      initialize()
    }

    return () => {
      mountedRef.current = false
    }
  }, [initialize])

  return <>{children}</>
}