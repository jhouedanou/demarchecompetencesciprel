'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Navbar } from '@/components/layout/Navbar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface DashboardLayoutProps {
  children: React.ReactNode
}

function getLocalAdminAuth(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const authData = localStorage.getItem('ciprel_admin_auth')
    if (!authData) return false
    const parsed = JSON.parse(authData)
    return parsed.isAuthenticated === true
  } catch {
    return false
  }
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [redirectChecked, setRedirectChecked] = useState(false)

  useEffect(() => {
    // Don't do redirect checks until we're done loading
    if (isLoading) {
      return
    }

    // Check if user has local admin auth
    const hasLocalAdminAuth = getLocalAdminAuth()

    // If locally authenticated, we're good
    if (hasLocalAdminAuth) {
      setRedirectChecked(true)
      return
    }

    // Otherwise, must be authenticated via Supabase
    if (!isAuthenticated) {
      console.log('[Dashboard] User not authenticated, redirecting to login')
      router.push('/login')
      return
    }

    // Must have admin or manager role
    if (user && !['ADMIN', 'MANAGER'].includes(user.role)) {
      console.log('[Dashboard] User is not admin/manager, redirecting to competences')
      router.push('/competences')
      return
    }

    // All checks passed
    console.log('[Dashboard] User authorized')
    setRedirectChecked(true)
  }, [isLoading, isAuthenticated, user, router])

  // Show loading state while checking auth
  if (isLoading || !redirectChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Final check before rendering - make sure we're authorized
  const hasLocalAdminAuth = getLocalAdminAuth()
  const isAuthorized = hasLocalAdminAuth || (isAuthenticated && user && ['ADMIN', 'MANAGER'].includes(user.role))

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
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
