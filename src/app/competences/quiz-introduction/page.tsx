'use client'

import { useState, useEffect } from 'react'
import { QuizModal } from '@/components/modals/QuizModal'
import { useUser } from '@/lib/supabase/client'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { useQuizStore } from '@/stores/quiz-store'
import { Lock, BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function QuizIntroductionPage() {
  const { user } = useUser()
  const { canAccessQuiz, loading, sections, getNextSection } = useReadingProgress(user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const resetQuiz = useQuizStore(state => state.resetQuiz)
  const router = useRouter()

  // User has access to the quiz - Open modal automatically
  useEffect(() => {
    if (user && canAccessQuiz()) {
      resetQuiz()
      setIsModalOpen(true)
    }
  }, [user, canAccessQuiz, resetQuiz])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetQuiz()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ciprel-orange-50 via-white to-ciprel-green-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ciprel-orange-50 via-white to-ciprel-green-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
          <p className="text-gray-600 mb-6">
            Vous devez vous connecter pour accéder au quiz d'introduction.
          </p>
          <Link
            href="/auth/login"
            className="bg-ciprel-green-600 text-white px-6 py-2 rounded-lg hover:bg-ciprel-green-700 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  if (!canAccessQuiz()) {
    const nextSection = getNextSection()
    const completedSections = sections.filter(s => s.completed).length
    const totalSections = sections.length

    return (
      <div className="min-h-screen bg-gradient-to-br from-ciprel-orange-50 via-white to-ciprel-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-ciprel-orange-600 hover:text-ciprel-orange-700 mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
              <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Quiz verrouillé
              </h1>
            </div>

            {/* Lock message */}
              <div className="bg-white rounded-lg shadow-md p-8 border border-ciprel-gray-200">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Lecture des sections requise
                  </h2>
                  <p className="text-gray-600 mb-6">
                  Pour accéder au quiz d'introduction, vous devez d'abord lire toutes les sections
                  de la démarche compétence CIPREL.
                </p>
              </div>

              {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm text-gray-500">
                      {completedSections}/{totalSections} sections complétées
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-ciprel-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedSections / totalSections) * 100}%` }}
                    ></div>
                  </div>
                </div>

              {/* Sections list */}
              <div className="space-y-3 mb-6">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      section.completed
                        ? 'bg-ciprel-green-50 border-ciprel-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {section.completed ? (
                        <div className="w-5 h-5 bg-ciprel-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                      <span className={`text-sm ${
                      section.completed ? 'text-ciprel-green-700' : 'text-gray-700'
                    }`}>
                      {section.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Next action */}
              {nextSection && (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    <strong>Prochaine étape :</strong> {nextSection.title}
                  </p>
                  <Link
                    href={`/demarche/${nextSection.id}`}
                    className="inline-flex items-center bg-ciprel-orange-500 text-white px-6 py-2 rounded-lg hover:bg-ciprel-orange-600 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Continuer la lecture
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ciprel-orange-50 via-white to-ciprel-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-ciprel-orange-600 hover:text-ciprel-orange-700 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quiz Introduction à la Démarche Compétences
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Évaluez vos connaissances sur les concepts fondamentaux de la démarche compétences chez CIPREL.
            </p>

            <div className="bg-white rounded-lg shadow-md border border-ciprel-gray-200 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-semibold text-ciprel-orange-600 mb-2">7</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-ciprel-green-600 mb-2">30</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-ciprel-blue mb-2">70%</div>
                  <div className="text-sm text-gray-600">Score requis</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                resetQuiz()
                setIsModalOpen(true)
              }}
              className="bg-ciprel-green-600 text-white px-8 py-3 rounded-lg hover:bg-ciprel-green-700 transition-colors font-semibold inline-flex items-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Commencer le quiz
            </button>
          </div>
        </div>
      </div>

      <QuizModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        quizType="INTRODUCTION"
        title="Quiz d'introduction"
        description="Validez vos connaissances sur les fondamentaux de la démarche compétences."
      />
    </div>
  )
}
