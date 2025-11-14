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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check authorization - don't wait for isLoading to be false
  // Use locally available data first
  const hasLocalAdminAuth = mounted && getLocalAdminAuth()
  const isSupabaseAuthorized = isAuthenticated && user && ['ADMIN', 'MANAGER'].includes(user.role)
  const isAuthorized = hasLocalAdminAuth || isSupabaseAuthorized

  // Redirect logic
  useEffect(() => {
    if (!mounted) return

    // If we have local auth, we're good
    if (hasLocalAdminAuth) {
      console.log('[Dashboard] User has local admin auth')
      return
    }

    // If Supabase auth is done loading, check it
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('[Dashboard] User not authenticated via Supabase, redirecting to login')
        router.push('/login')
        return
      }

      if (user && !['ADMIN', 'MANAGER'].includes(user.role)) {
        console.log('[Dashboard] User is not admin/manager, redirecting to competences')
        router.push('/competences')
        return
      }

      console.log('[Dashboard] User authorized via Supabase')
    }
  }, [mounted, hasLocalAdminAuth, isLoading, isAuthenticated, user, router])

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  // Show loading if not authorized yet and still checking Supabase auth
  if (!isAuthorized && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // If not authorized and done loading, return null (redirect will happen)
  if (!isAuthorized) {
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
