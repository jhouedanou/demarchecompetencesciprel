'use client'

import { useUser } from '@/lib/supabase/client'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { CheckCircle, Circle, Lock, BookOpen, LogOut, RotateCcw, HelpCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useState } from 'react'

interface ProgressTrackerProps {
  onLinkClick?: () => void
  onSectionClick?: (sectionId: string) => void
  isMetierActive?: boolean
}

export default function ProgressTracker({ onLinkClick, onSectionClick, isMetierActive = false }: ProgressTrackerProps = {}) {
  const { user } = useUser()
  const { signOut } = useAuthStore()
  const {
    sections,
    allCompleted,
    loading,
    canAccessQuiz,
    getCompletionPercentage,
    getNextSection,
    refreshProgress,
    markSectionCompleted
  } = useReadingProgress(user)
  const [isResetting, setIsResetting] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      // Error is already handled in the store
    }
  }

  const handleResetProgress = async () => {
    if (!user) return

    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir réinitialiser votre progression ? Toutes les sections complétées seront marquées comme non terminées.'
    )

    if (!confirmed) return

    setIsResetting(true)
    try {
      const { error } = await supabase
        .from('user_reading_progress')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('Error resetting progress:', error)
        alert('Erreur lors de la réinitialisation de la progression')
      } else {
        // Rafraîchir la progression après la réinitialisation
        if (refreshProgress) {
          await refreshProgress()
        }
        // Émettre un événement pour notifier les autres composants
        window.dispatchEvent(new CustomEvent('reading-progress-updated'))
      }
    } catch (error) {
      console.error('Error in handleResetProgress:', error)
      alert('Erreur lors de la réinitialisation de la progression')
    } finally {
      setIsResetting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const completionPercentage = getCompletionPercentage()
  const nextSection = getNextSection()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 flex items-center mb-2">
          <BookOpen className="h-6 w-6 mr-2 text-ciprel-orange-600" />
          Navigation
        </h3>
        <p className="text-sm text-gray-600">
          Explorez le parcours de la démarche compétence
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Avancement</span>
          <span className="text-lg font-bold text-ciprel-green-600">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Section list */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Sections
        </h4>
        {sections.filter(section => !(isMetierActive && section.id === 'videos')).map((section) => (
          <button
            key={section.id}
            onClick={() => {
              // Gérer le scroll vers la section vidéos
              if (section.id === 'videos') {
                // Scroll smooth immédiat vers la section vidéos (slide 6 ou section #application-pratique)
                const videoSection = document.querySelector('#application-pratique')
                if (videoSection) {
                  videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                } else {
                  // Pour la version desktop avec Swiper, aller à la slide 5 (index 5)
                  const swiperEl = document.querySelector('.homepage-swiper')
                  if (swiperEl && (swiperEl as any).swiper) {
                    (swiperEl as any).swiper.slideTo(5)
                  }
                }
                
                // Marquer la section vidéos comme complétée (en parallèle, sans bloquer le scroll)
                if (markSectionCompleted && user) {
                  markSectionCompleted('videos', 0)
                }
              } else if (onSectionClick) {
                onSectionClick(section.id)
              }
              if (onLinkClick) {
                onLinkClick()
              }
            }}
            className={`w-full flex items-start p-3 rounded-lg border transition-all text-left ${
              section.completed
                ? 'bg-ciprel-green-50 border-ciprel-green-200 hover:bg-ciprel-green-100'
                : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {section.completed ? (
                <CheckCircle className="h-5 w-5 text-ciprel-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium leading-tight ${
                section.completed ? 'text-ciprel-green-900' : 'text-gray-900'
              }`}>
                {section.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Next section hint */}
      {nextSection && (
        <div className="p-4 bg-gradient-to-br from-ciprel-orange-50 to-ciprel-orange-100 rounded-lg border border-ciprel-orange-200">
          <p className="text-xs font-semibold text-ciprel-orange-900 mb-1">
            Prochaine étape
          </p>
          <p className="text-sm text-ciprel-orange-700 font-medium">
            {nextSection.title}
          </p>
        </div>
      )}

      {/* Quiz and Survey access */}
      <div className="pt-4 border-t border-gray-200">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Accès aux activités
            </p>
            <p className="text-xs text-gray-600">
              {allCompleted
                ? 'Toutes les sections sont complétées !'
                : `${sections.filter(s => !s.completed).length} section(s) restante(s)`
              }
            </p>
          </div>

          {/* Quiz Button */}
          {allCompleted ? (
            <Link
              href="/competences/quiz-introduction"
              className="w-full flex items-center justify-center gap-2 bg-ciprel-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-ciprel-green-700 transition-colors shadow-md"
            >
              <BookOpen className="h-4 w-4" />
              Commencer le quiz
            </Link>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 px-4 py-3 rounded-lg text-sm font-medium cursor-not-allowed">
              <Lock className="h-4 w-4" />
              Quiz verrouillé
            </div>
          )}

          {/* Survey Button */}
          {allCompleted ? (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('open-survey'))
                }
                if (onLinkClick) {
                  onLinkClick()
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-ciprel-orange-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-ciprel-orange-700 transition-colors shadow-md"
            >
              <HelpCircle className="h-4 w-4" />
              Sondage d'opinion
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 px-4 py-3 rounded-lg text-sm font-medium cursor-not-allowed">
              <Lock className="h-4 w-4" />
              Sondage verrouillé
            </div>
          )}
        </div>
      </div>

      {/* Logout and Reset buttons */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>

        <button
          onClick={handleResetProgress}
          disabled={isResetting || loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
          {isResetting ? 'Réinitialisation...' : 'Réinitialiser la progression'}
        </button>
      </div>
    </div>
  )
}
