'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { LoginForm } from '@/components/auth/LoginForm'

export function GlobalLoginGate() {
  const pathname = usePathname()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLoading = useAuthStore(state => state.isLoading)
  const initialize = useAuthStore(state => state.initialize)
  const [showModal, setShowModal] = useState(false)

  // Pages où la modale ne doit pas s'afficher
  const excludedPages = ['/register', '/login', '/reset-password', '/forgot-password']
  const shouldHideModal = excludedPages.includes(pathname)

  useEffect(() => {
    // Ensure auth is initialized on mount in case provider hasn't yet run
    initialize()
  }, [initialize])

  useEffect(() => {
    const handler = () => setShowModal(true)
    window.addEventListener('open-login', handler as EventListener)
    return () => window.removeEventListener('open-login', handler as EventListener)
  }, [])

  // When user becomes authenticated, ensure modal is hidden
  useEffect(() => {
    if (isAuthenticated) setShowModal(false)
  }, [isAuthenticated])

  if (isLoading || isAuthenticated || !showModal || shouldHideModal) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-8 shadow-2xl">
        <button
          aria-label="Fermer"
          className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>
        <div className="mb-6 text-center">
          <img src="/images/logo.webp" alt="CIPREL" className="mx-auto h-12 w-auto mb-3" />
          <h2 className="text-2xl font-semibold text-gray-900">Connexion requise</h2>
          <p className="mt-1 text-sm text-gray-600">Veuillez vous connecter pour accéder à la plateforme</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
