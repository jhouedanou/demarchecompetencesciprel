'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore(state => state.initialize)
  const initRef = useRef(false)

  useEffect(() => {
    // Ensure initialize is only called once
    if (!initRef.current) {
      initRef.current = true
      initialize()
    }
  }, [])

  return <>{children}</>
}