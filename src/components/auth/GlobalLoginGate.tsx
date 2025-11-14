'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { AuthModal } from '@/components/auth/AuthModal'

export function GlobalLoginGate() {
  const pathname = usePathname()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLoading = useAuthStore(state => state.isLoading)
  const initialize = useAuthStore(state => state.initialize)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const initRef = useRef(false)

  // Pages où la modale ne doit pas s'afficher
  const excludedPages = ['/register', '/login', '/reset-password', '/forgot-password']
  const shouldHideModal = excludedPages.includes(pathname)

  useEffect(() => {
    // Ensure auth is initialized only once
    if (!initRef.current) {
      initRef.current = true
      initialize()
    }
  }, [])

  useEffect(() => {
    const handler = () => setAuthModalOpen(true)
    window.addEventListener('open-login', handler as EventListener)
    return () => window.removeEventListener('open-login', handler as EventListener)
  }, [])

  // When user becomes authenticated, ensure modal is hidden
  useEffect(() => {
    if (isAuthenticated) setAuthModalOpen(false)
  }, [isAuthenticated])

  // Hide modal only on excluded pages, allow display even during loading
  if (shouldHideModal) return null

  return (
    <AuthModal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      defaultMode="login"
    />
  )
}
