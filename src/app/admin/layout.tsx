'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    // Vérifier l'authentification admin
    const adminAuth = localStorage.getItem('ciprel-admin-auth')
    if (adminAuth !== 'authenticated') {
      router.push('/ciprel-admin')
      return
    }
  }, [router])

  // Vérification côté client
  if (typeof window !== 'undefined') {
    const adminAuth = localStorage.getItem('ciprel-admin-auth')
    if (adminAuth !== 'authenticated') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Accès non autorisé
            </h1>
            <p className="text-gray-600">
              Redirection en cours...
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}