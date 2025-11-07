'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Navbar } from '@/components/layout/Navbar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Vérifier si l'utilisateur est authentifié localement (admin)
      const hasLocalAdminAuth = typeof window !== 'undefined'
        ? localStorage.getItem('ciprel-admin-auth') === 'authenticated'
        : false

      if (!isAuthenticated && !hasLocalAdminAuth) {
        router.push('/login')
        return
      }

      // Vérifier si l'utilisateur a les permissions admin (seulement si authentifié via Supabase)
      if (isAuthenticated && user && !['ADMIN', 'MANAGER'].includes(user.role)) {
        router.push('/competences')
        return
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Vérifier si l'utilisateur est authentifié (Supabase ou localement)
  const hasLocalAdminAuth = typeof window !== 'undefined'
    ? localStorage.getItem('ciprel-admin-auth') === 'authenticated'
    : false

  const isAuthorized = hasLocalAdminAuth || (isAuthenticated && user && ['ADMIN', 'MANAGER'].includes(user.role))

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accès non autorisé
          </h1>
          <p className="text-gray-600 mb-8">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
          </p>
          <button
            onClick={() => router.push('/competences')}
            className="px-4 py-2 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
