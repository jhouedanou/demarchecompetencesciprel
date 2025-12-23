'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { CompetencesNavbar } from '@/components/layout/CompetencesNavbar'
import { 
  Users, 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  Star,
  Send,
  AlertCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Question {
  id: string
  title: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string | null
  category: string
  quiz_type: string
  etape: string
  points: number
}

interface Evaluation360Response {
  question_id: string
  rating: number
  comment?: string
}

export default function Evaluation360Page() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore()
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<Map<string, Evaluation360Response>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/competences/evaluation-360')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuestions()
    }
  }, [isAuthenticated])

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Récupérer les questions pour l'évaluation 360
      // On utilise le type SONDAGE avec une catégorie spécifique ou on peut créer un type dédié
      const response = await fetch('/api/quiz?type=SONDAGE')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des questions')
      }
      
      const data = await response.json()
      
      // Filtrer les questions pour l'évaluation 360 (si nécessaire)
      const evaluation360Questions = data.questions || []
      setQuestions(evaluation360Questions)
    } catch (err: any) {
      console.error('Error fetching questions:', err)
      setError(err.message || 'Erreur lors du chargement')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRatingChange = (questionId: string, rating: number) => {
    const newResponses = new Map(responses)
    const existing = newResponses.get(questionId) || { question_id: questionId, rating: 0 }
    newResponses.set(questionId, { ...existing, rating })
    setResponses(newResponses)
  }

  const handleCommentChange = (questionId: string, comment: string) => {
    const newResponses = new Map(responses)
    const existing = newResponses.get(questionId) || { question_id: questionId, rating: 0 }
    newResponses.set(questionId, { ...existing, comment })
    setResponses(newResponses)
  }

  const handleSubmit = async () => {
    if (responses.size < questions.length) {
      setError('Veuillez répondre à toutes les questions')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const evaluationData = {
        quiz_type: 'SONDAGE',
        responses: Array.from(responses.values()),
        score: Array.from(responses.values()).reduce((sum, r) => sum + r.rating, 0),
        max_score: questions.length * 5,
        total_questions: questions.length,
        correct_answers: questions.length,
        duration: 0
      }

      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(evaluationData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la soumission')
      }

      setSubmitted(true)
    } catch (err: any) {
      console.error('Error submitting evaluation:', err)
      setError(err.message || 'Erreur lors de la soumission')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#36A24C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <CompetencesNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
            <p className="text-gray-600 mb-6">
              Vous devez vous connecter pour accéder à l'évaluation 360°.
            </p>
            <Link
              href="/login?redirect=/competences/evaluation-360"
              className="bg-ciprel-green-600 text-white px-6 py-3 rounded-lg hover:bg-ciprel-green-700 transition-colors inline-block"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <CompetencesNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Merci pour votre évaluation !</h2>
            <p className="text-gray-600 mb-6">
              Votre feedback 360° a été enregistré avec succès. Il contribuera à l'amélioration continue de notre démarche compétences.
            </p>
            <Link
              href="/competences"
              className="bg-ciprel-green-600 text-white px-6 py-3 rounded-lg hover:bg-ciprel-green-700 transition-colors inline-block"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <CompetencesNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/competences"
            className="inline-flex items-center text-ciprel-green-600 hover:text-ciprel-green-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-ciprel-orange-500">
            <div className="flex items-start gap-4">
              <div className="bg-ciprel-orange-100 p-3 rounded-lg">
                <Users className="h-8 w-8 text-ciprel-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Évaluation 360°</h1>
                <p className="text-gray-600">
                  Évaluez les compétences et les pratiques professionnelles dans le cadre de la démarche compétences CIPREL.
                  Vos retours sont précieux pour améliorer notre programme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-10 w-10 text-ciprel-green-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune question disponible</h3>
            <p className="text-gray-600">
              Les questions d'évaluation 360° ne sont pas encore configurées.
              Veuillez contacter l'administrateur.
            </p>
          </div>
        ) : (
          <>
            {/* Questions */}
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="bg-ciprel-green-100 text-ciprel-green-700 font-bold px-3 py-1 rounded-full text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.title}</h3>
                      <p className="text-gray-600">{question.question}</p>
                    </div>
                  </div>

                  {/* Rating stars */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Votre évaluation :</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRatingChange(question.id, rating)}
                          className={`p-2 rounded-lg transition-all ${
                            (responses.get(question.id)?.rating || 0) >= rating
                              ? 'text-yellow-500 bg-yellow-50'
                              : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
                          }`}
                        >
                          <Star className="h-8 w-8 fill-current" />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      1 = Pas du tout d'accord, 5 = Tout à fait d'accord
                    </p>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Commentaire (optionnel) :</label>
                    <textarea
                      value={responses.get(question.id)?.comment || ''}
                      onChange={(e) => handleCommentChange(question.id, e.target.value)}
                      placeholder="Partagez vos observations..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Submit button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || responses.size < questions.length}
                className="bg-ciprel-green-600 hover:bg-ciprel-green-700 text-white px-8 py-3 rounded-lg flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Soumettre l'évaluation
                  </>
                )}
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 text-center text-sm text-gray-500">
              {responses.size} / {questions.length} questions répondues
            </div>
          </>
        )}
      </div>
    </div>
  )
}
