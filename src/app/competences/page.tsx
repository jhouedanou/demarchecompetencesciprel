'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { CompetencesNavbar } from '@/components/layout/CompetencesNavbar'
import { 
  Trophy, 
  Download, 
  Video, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Clock,
  Award,
  TrendingUp
} from 'lucide-react'

interface QuizResult {
  id: string
  quiz_type: string
  score: number
  max_score: number
  percentage: number
  total_questions: number
  correct_answers: number
  attempt_number: number
  completed_at: string
  duration: number
}

export default function CompetencesDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore()
  const [results, setResults] = useState<QuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/competences')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuizResults()
    }
  }, [isAuthenticated])

  const fetchQuizResults = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/quiz/results', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des résultats')
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (err: any) {
      console.error('Error fetching quiz results:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  const getQuizTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INTRODUCTION: 'Quiz d\'Introduction',
      SONDAGE: 'Sondage',
      WORKSHOP: 'Atelier Métier',
    }
    return labels[type] || type
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#36A24C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <CompetencesNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Tableau de Bord
          </h1>
          <p className="text-slate-600">
            Bienvenue {user?.name} ! Consultez vos résultats et accédez à vos ressources.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Quiz Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-[#36A24C]" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Mes Résultats de Quiz
                </h2>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-[#36A24C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600">Chargement des résultats...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchQuizResults}
                    className="px-4 py-2 bg-[#36A24C] text-white rounded-lg hover:bg-[#2d8540] transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">Aucun quiz complété pour le moment</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Commencez par passer un quiz pour voir vos résultats ici
                  </p>
                  <button
                    onClick={() => router.push('/competences/quiz-introduction')}
                    className="px-6 py-2.5 bg-[#36A24C] text-white rounded-lg hover:bg-[#2d8540] transition-colors"
                  >
                    Passer un Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => {
                    const isPassed = result.percentage >= 70
                    return (
                      <div
                        key={result.id}
                        className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900">
                                {getQuizTypeLabel(result.quiz_type)}
                              </h3>
                              {isPassed ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <p className="text-sm text-slate-500">
                              Tentative #{result.attempt_number} • {formatDate(result.completed_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-900">
                              {result.percentage.toFixed(0)}%
                            </div>
                            <div className="text-sm text-slate-600">
                              {result.score}/{result.max_score} points
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Award className="w-4 h-4" />
                            <span>{result.correct_answers}/{result.total_questions} correct</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(result.duration)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              isPassed 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {isPassed ? 'Réussi' : 'Échoué'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Resources & Videos */}
          <div className="space-y-6">
            {/* Resources Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-6 h-6 text-[#EC7E05]" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Ressources
                </h2>
              </div>
              
              <div className="space-y-3">
                <a
                  href="/demarche/ressources"
                  className="block p-4 border border-slate-200 rounded-lg hover:border-[#36A24C] hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-[#36A24C] mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">
                        Guide de la Démarche
                      </h3>
                      <p className="text-sm text-slate-600">
                        Documentation complète et guides pratiques
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Videos Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-6 h-6 text-[#EC7E05]" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Vidéos
                </h2>
              </div>
              
              <div className="space-y-3">
                <a
                  href="/demarche/introduction"
                  className="block p-4 border border-slate-200 rounded-lg hover:border-[#36A24C] hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-[#36A24C] mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">
                        Vidéos de Formation
                      </h3>
                      <p className="text-sm text-slate-600">
                        Tutoriels et présentations vidéo
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Stats Summary */}
            {results.length > 0 && (
              <div className="bg-gradient-to-br from-[#36A24C] to-[#2d8540] rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">
                    Votre Progression
                  </h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Quiz complétés</span>
                    <span className="text-2xl font-bold">{results.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Taux de réussite</span>
                    <span className="text-2xl font-bold">
                      {((results.filter(r => r.percentage >= 70).length / results.length) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Score moyen</span>
                    <span className="text-2xl font-bold">
                      {(results.reduce((acc, r) => acc + r.percentage, 0) / results.length).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
