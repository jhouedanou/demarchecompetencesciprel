'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { CiprelHeroCorporate } from '@/components/ciprel/CiprelHeroCorporate'
import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ciprel-green-200 border-t-ciprel-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // La redirection vers /login se fait dans useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <CiprelNavigation />
      <CiprelHeroCorporate />
    </div>
  )
}