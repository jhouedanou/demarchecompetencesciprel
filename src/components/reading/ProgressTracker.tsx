'use client'

import { useUser } from '@/lib/supabase/client'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { CheckCircle, Circle, Lock, BookOpen, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import Link from 'next/link'

export default function ProgressTracker() {
  const { user } = useUser()
  const { signOut } = useAuthStore()
  const {
    sections,
    allCompleted,
    loading,
    canAccessQuiz,
    getCompletionPercentage,
    getNextSection
  } = useReadingProgress(user)

  const handleLogout = async () => {
    await signOut()
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
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`/demarche/${section.id}`}
            className={`flex items-start p-3 rounded-lg border transition-all ${
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
              {section.reading_time && section.reading_time > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(section.reading_time / 60)} min
                </p>
              )}
            </div>
          </Link>
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

      {/* Quiz access status */}
      <div className="pt-4 border-t border-gray-200">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Accès aux quiz
            </p>
            <p className="text-xs text-gray-600">
              {allCompleted
                ? 'Toutes les sections sont complétées !'
                : `${sections.filter(s => !s.completed).length} section(s) restante(s)`
              }
            </p>
          </div>
          {allCompleted ? (
            <Link
              href="/competences/quiz-introduction"
              className="w-full flex items-center justify-center gap-2 bg-ciprel-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-ciprel-green-700 transition-colors shadow-md"
            >
              Commencer le quiz
            </Link>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 px-4 py-3 rounded-lg text-sm font-medium cursor-not-allowed">
              <Lock className="h-4 w-4" />
              Quiz verrouillé
            </div>
          )}
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
