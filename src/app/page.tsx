'use client'

import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'
import { CiprelWelcomeSection } from '@/components/ciprel/CiprelWelcomeSection'
import ProgressTracker from '@/components/reading/ProgressTracker'
import { useUser } from '@/lib/supabase/client'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { useEffect, useRef } from 'react'

export default function HomePage() {
  const { user } = useUser()
  const { markSectionCompleted } = useReadingProgress(user)
  const sectionRef = useRef<HTMLDivElement>(null)
  const startTime = useRef<number>(Date.now())

  // Mark this section as read when component unmounts or user leaves
  useEffect(() => {
    startTime.current = Date.now()

    return () => {
      if (user) {
        const readingTime = Math.round((Date.now() - startTime.current) / 1000)
        markSectionCompleted('accueil', readingTime)
      }
    }
  }, [user, markSectionCompleted])

  return (
    <div className="min-h-screen bg-gray-50">
      <CiprelNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div ref={sectionRef}>
              <CiprelWelcomeSection />
            </div>
          </div>

          {/* Sidebar with progress tracker */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {user && <ProgressTracker />}
              {!user && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Connectez-vous pour suivre votre progression
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Créez un compte pour accéder aux quiz et suivre votre progression dans l'apprentissage de la démarche compétence.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}