'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { CompetencesNavbar } from '@/components/layout/CompetencesNavbar'
import { 
  FileText, 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  Send,
  AlertCircle,
  Loader2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Meh
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

interface FeedbackResponse {
  question_id: string
  sentiment: 'positive' | 'neutral' | 'negative'
  feedback: string
}

export default function FeedbackPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore()
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<Map<string, FeedbackResponse>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [generalFeedback, setGeneralFeedback] = useState('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/competences/feedback')
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
      
      // Récupérer les questions pour le feedback manager
      const response = await fetch('/api/quiz?type=SONDAGE')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des questions')
      }
      
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (err: any) {
      console.error('Error fetching questions:', err)
      setError(err.message || 'Erreur lors du chargement')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSentimentChange = (questionId: string, sentiment: 'positive' | 'neutral' | 'negative') => {
    const newResponses = new Map(responses)
    const existing = newResponses.get(questionId) || { question_id: questionId, sentiment: 'neutral', feedback: '' }
    newResponses.set(questionId, { ...existing, sentiment })
    setResponses(newResponses)
  }

  const handleFeedbackChange = (questionId: string, feedback: string) => {
    const newResponses = new Map(responses)
    const existing = newResponses.get(questionId) || { question_id: questionId, sentiment: 'neutral', feedback: '' }
    newResponses.set(questionId, { ...existing, feedback })
    setResponses(newResponses)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const feedbackData = {
        quiz_type: 'SONDAGE',
        responses: [
          ...Array.from(responses.values()),
          { question_id: 'general', feedback: generalFeedback }
        ],
        score: 0,
        max_score: questions.length,
        total_questions: questions.length,
        correct_answers: responses.size,
        duration: 0
      }

      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(feedbackData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la soumission')
      }

      setSubmitted(true)
    } catch (err: any) {
      console.error('Error submitting feedback:', err)
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
              Vous devez vous connecter pour accéder au feedback manager.
            </p>
            <Link
              href="/login?redirect=/competences/feedback"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Merci pour votre feedback !</h2>
            <p className="text-gray-600 mb-6">
              Vos retours ont été enregistrés avec succès. Ils seront analysés pour améliorer notre démarche compétences.
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

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-6 w-6" />
      case 'negative':
        return <ThumbsDown className="h-6 w-6" />
      default:
        return <Meh className="h-6 w-6" />
    }
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
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-ciprel-green-500">
            <div className="flex items-start gap-4">
              <div className="bg-ciprel-green-100 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-ciprel-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Feedback Manager</h1>
                <p className="text-gray-600">
                  Partagez vos retours sur la démarche compétences CIPREL. 
                  Votre feedback nous aide à améliorer continuellement notre programme.
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
        ) : (
          <>
            {/* Questions */}
            {questions.length > 0 && (
              <div className="space-y-6 mb-8">
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="bg-ciprel-orange-100 text-ciprel-orange-700 font-bold px-3 py-1 rounded-full text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.title}</h3>
                        <p className="text-gray-600">{question.question}</p>
                      </div>
                    </div>

                    {/* Sentiment buttons */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Votre sentiment :</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSentimentChange(question.id, 'negative')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            responses.get(question.id)?.sentiment === 'negative'
                              ? 'bg-red-100 text-red-700 border-2 border-red-300'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          <ThumbsDown className="h-5 w-5" />
                          <span className="text-sm font-medium">Négatif</span>
                        </button>
                        <button
                          onClick={() => handleSentimentChange(question.id, 'neutral')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            responses.get(question.id)?.sentiment === 'neutral'
                              ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                              : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
                          }`}
                        >
                          <Meh className="h-5 w-5" />
                          <span className="text-sm font-medium">Neutre</span>
                        </button>
                        <button
                          onClick={() => handleSentimentChange(question.id, 'positive')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            responses.get(question.id)?.sentiment === 'positive'
                              ? 'bg-green-100 text-green-700 border-2 border-green-300'
                              : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                          }`}
                        >
                          <ThumbsUp className="h-5 w-5" />
                          <span className="text-sm font-medium">Positif</span>
                        </button>
                      </div>
                    </div>

                    {/* Feedback text */}
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Votre feedback :</label>
                      <textarea
                        value={responses.get(question.id)?.feedback || ''}
                        onChange={(e) => handleFeedbackChange(question.id, e.target.value)}
                        placeholder="Partagez vos commentaires..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* General Feedback */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-ciprel-green-100 p-2 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-ciprel-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedback général</h3>
                  <p className="text-gray-600 text-sm">
                    Partagez librement vos suggestions, remarques ou idées d'amélioration pour la démarche compétences.
                  </p>
                </div>
              </div>
              
              <textarea
                value={generalFeedback}
                onChange={(e) => setGeneralFeedback(e.target.value)}
                placeholder="Vos commentaires généraux sur la démarche compétences CIPREL..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
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
                    Soumettre le feedback
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
