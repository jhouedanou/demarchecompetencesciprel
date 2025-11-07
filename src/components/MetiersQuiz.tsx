'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'multiple_select'
  options: Array<{ id: string; text: string }>
  correctAnswers: string[]
  explanation?: string
}

interface MetiersQuizProps {
  metierId: number
  metierTitre: string
  onComplete?: (score: number) => void
}

export function MetiersQuiz({ metierId, metierTitre, onComplete }: MetiersQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    // Load quiz questions for the metier
    // For now, we'll use placeholder questions since the quiz data structure
    // depends on your backend implementation
    loadQuizQuestions()
  }, [metierId])

  const loadQuizQuestions = async () => {
    try {
      setLoading(true)
      // Fetch quiz questions from API endpoint
      // This would be: GET /api/metiers/:id/quiz or similar
      const mockQuestions: QuizQuestion[] = [
        {
          id: '1',
          question: `Quelle est la mission principale de ce métier?`,
          type: 'multiple_choice',
          options: [
            { id: 'a', text: 'Assurer la production et la qualité' },
            { id: 'b', text: 'Gérer les ressources humaines' },
            { id: 'c', text: 'Réaliser les tâches administratives' },
            { id: 'd', text: 'Développer les stratégies commerciales' }
          ],
          correctAnswers: ['a'],
          explanation: 'La mission principale est alignée avec les objectifs du département.'
        },
        {
          id: '2',
          question: 'Selon les compétences clés, le savoir-être est important dans ce métier.',
          type: 'true_false',
          options: [
            { id: 'true', text: 'Vrai' },
            { id: 'false', text: 'Faux' }
          ],
          correctAnswers: ['true'],
          explanation: 'Le savoir-être est crucial pour la réussite dans ce rôle.'
        },
        {
          id: '3',
          question: 'Quels sont les éléments essentiels des compétences clés? (Sélectionnez tout ce qui s\'applique)',
          type: 'multiple_select',
          options: [
            { id: 'savoir', text: 'Savoir' },
            { id: 'savoir-faire', text: 'Savoir-faire' },
            { id: 'savoir-etre', text: 'Savoir-être' },
            { id: 'savoir-vivre', text: 'Savoir-vivre' }
          ],
          correctAnswers: ['savoir', 'savoir-faire', 'savoir-etre'],
          explanation: 'Les trois piliers de la compétence sont le savoir, le savoir-faire et le savoir-être.'
        }
      ]
      setQuestions(mockQuestions)
    } catch (err) {
      console.error('Error loading quiz questions:', err)
      setError('Impossible de charger le quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answerId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return

    if (question.type === 'multiple_select') {
      // Toggle the answer for multiple select
      const current = selectedAnswers[questionId] || []
      if (current.includes(answerId)) {
        setSelectedAnswers({
          ...selectedAnswers,
          [questionId]: current.filter(a => a !== answerId)
        })
      } else {
        setSelectedAnswers({
          ...selectedAnswers,
          [questionId]: [...current, answerId]
        })
      }
    } else {
      // Single answer for multiple choice and true/false
      setSelectedAnswers({
        ...selectedAnswers,
        [questionId]: [answerId]
      })
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0
    questions.forEach(question => {
      const userAnswers = selectedAnswers[question.id] || []
      const isCorrect = JSON.stringify(userAnswers.sort()) === JSON.stringify(question.correctAnswers.sort())
      if (isCorrect) {
        correctCount++
      }
    })

    const finalScore = Math.round((correctCount / questions.length) * 100)
    setScore(finalScore)
    setShowResults(true)
    onComplete?.(finalScore)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-ciprel-orange-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900">Erreur</h3>
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!isStarted && !showResults) {
    return (
      <div className="bg-gradient-to-r from-ciprel-orange-50 to-yellow-50 rounded-lg border border-orange-200 p-8">
        <h3 className="text-2xl font-bold text-ciprel-orange-600 mb-4">Quiz: {metierTitre}</h3>
        <p className="text-gray-700 mb-6">
          Testez vos connaissances sur ce métier. Le quiz comporte <strong>{questions.length} questions</strong> et vous permet de valider votre compréhension de la démarche compétence.
        </p>
        <div className="space-y-3 mb-6 text-sm text-gray-700">
          <p className="flex items-center gap-2">
            <span className="text-ciprel-orange-600">✓</span> Questions variées (choix multiple, vrai/faux, sélection multiple)
          </p>
          <p className="flex items-center gap-2">
            <span className="text-ciprel-orange-600">✓</span> Explications fournies après chaque réponse
          </p>
          <p className="flex items-center gap-2">
            <span className="text-ciprel-orange-600">✓</span> Score final et résultats détaillés
          </p>
        </div>
        <button
          onClick={() => setIsStarted(true)}
          className="bg-ciprel-orange-600 hover:bg-ciprel-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Commencer le quiz
        </button>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-8">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-900 mb-2">Quiz complété!</h3>
          <p className="text-gray-700 mb-6">Voici votre score final:</p>
          <div className="text-6xl font-bold text-green-600 mb-4">{score}%</div>
          <p className="text-gray-700 mb-8">
            {score >= 80 ? 'Excellentes connaissances!' : score >= 60 ? 'Bon résultat!' : 'À travailler encore'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h4 className="font-bold text-gray-900 mb-4">Résumé de vos réponses:</h4>
          <div className="space-y-4">
            {questions.map((question, idx) => {
              const userAnswers = selectedAnswers[question.id] || []
              const isCorrect = JSON.stringify(userAnswers.sort()) === JSON.stringify(question.correctAnswers.sort())
              return (
                <div key={question.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">{idx + 1}. {question.question}</p>
                      <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </p>
                      {question.explanation && (
                        <p className="text-sm text-gray-600 mt-2 italic">{question.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={() => {
            setIsStarted(false)
            setShowResults(false)
            setCurrentQuestionIndex(0)
            setSelectedAnswers({})
            setScore(0)
          }}
          className="w-full bg-ciprel-orange-600 hover:bg-ciprel-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Recommencer le quiz
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex] || questions[0]
  const currentAnswers = selectedAnswers[currentQuestion.id] || []

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz: {metierTitre}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Question {currentQuestionIndex + 1} sur {questions.length}</span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-ciprel-orange-600 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">{currentQuestion.question}</h4>

        <div className="space-y-3">
          {currentQuestion.options.map(option => (
            <label key={option.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type={currentQuestion.type === 'multiple_select' ? 'checkbox' : 'radio'}
                name={`question-${currentQuestion.id}`}
                value={option.id}
                checked={currentAnswers.includes(option.id)}
                onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option.text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Précédent
        </button>

        <div className="flex gap-3">
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-ciprel-orange-600 hover:bg-ciprel-orange-700 text-white rounded-lg font-semibold transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Valider le quiz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
