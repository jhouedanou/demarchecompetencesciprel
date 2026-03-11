'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Navbar } from '@/components/layout/Navbar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageTransition } from '@/components/shared/PageTransition'
import { TopLoadingBar } from '@/components/shared/TopLoadingBar'
import { DashboardProvider } from '@/contexts/DashboardContext'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if user is authorized (ADMIN or MANAGER role)
  const isAuthorized = mounted && isAuthenticated && user && ['ADMIN', 'MANAGER'].includes(user.role)

  // Redirect logic
  useEffect(() => {
    if (!mounted) return

    // If still loading Supabase auth, wait
    if (isLoading) return

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
  }, [mounted, isLoading, isAuthenticated, user, router])

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
    <DashboardProvider>
      <div className="min-h-screen bg-gray-50">
        <TopLoadingBar />
        <Navbar />

        <div className="flex pt-16">
          <AdminSidebar />

          <main className="flex-1 lg:ml-64 p-6">
            <div className="max-w-7xl mx-auto">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </main>
        </div>
      </div>
    </DashboardProvider>
  )
}
