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
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            Votre progression
          </h3>
          <span className="text-sm font-medium text-gray-600">
            {completionPercentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        {/* Section list */}
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex items-center p-3 rounded-lg border ${
                section.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex-shrink-0 mr-3">
                {section.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  section.completed ? 'text-green-900' : 'text-gray-700'
                }`}>
                  {section.title}
                </p>
                {section.reading_time && section.reading_time > 0 && (
                  <p className="text-xs text-gray-500">
                    Temps de lecture : {Math.round(section.reading_time / 60)} min
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Next section hint */}
        {nextSection && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Prochaine étape :</strong> {nextSection.title}
            </p>
          </div>
        )}

        {/* Quiz access status */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Accès aux quiz et sondages
              </p>
              <p className="text-xs text-gray-500">
                {allCompleted
                  ? 'Vous avez accès à tous les quiz !'
                  : `Complétez ${sections.filter(s => !s.completed).length} section(s) restante(s)`
                }
              </p>
            </div>
            <div className="flex items-center">
              {allCompleted ? (
                <Link
                  href="/competences/quiz-introduction"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Commencer le quiz
                </Link>
              ) : (
                <div className="flex items-center text-gray-400">
                  <Lock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Verrouillé</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logout button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}