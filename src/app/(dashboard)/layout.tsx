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
        ? (() => {
            try {
              const authData = localStorage.getItem('ciprel_admin_auth')
              if (!authData) return false
              const parsed = JSON.parse(authData)
              return parsed.isAuthenticated === true
            } catch {
              return false
            }
          })()
        : false

      // Si authentification locale, c'est OK, on ne vérifie pas plus
      if (hasLocalAdminAuth) {
        return
      }

      // Sinon, vérifier l'authentification Supabase
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      // Vérifier si l'utilisateur a les permissions admin (seulement si authentifié via Supabase)
      if (user && !['ADMIN', 'MANAGER'].includes(user.role)) {
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
    ? (() => {
        try {
          const authData = localStorage.getItem('ciprel_admin_auth')
          if (!authData) return false
          const parsed = JSON.parse(authData)
          return parsed.isAuthenticated === true
        } catch {
          return false
        }
      })()
    : false

  const isAuthorized = hasLocalAdminAuth || (isAuthenticated && user && ['ADMIN', 'MANAGER'].includes(user.role))

  if (!isAuthorized) {
    // Rediriger vers la page de connexion admin
    if (typeof window !== 'undefined') {
      router.push('/admin-login')
    }
    return null
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
