import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase/client'
import type { QuizQuestion, QuizAnswer } from '@/types'

interface QuizStore {
  // State
  questions: QuizQuestion[]
  currentQuestionIndex: number
  answers: QuizAnswer[]
  isLoading: boolean
  error: string | null
  timeLimit?: number // en minutes
  startTime?: number
  completedAt?: number
  isCompleted: boolean
  score?: number
  percentage?: number

  // Actions
  loadQuestions: (quizType: string, metierId?: number) => Promise<void>
  startQuiz: () => void
  submitAnswer: (questionId: string, selectedAnswers: string[]) => void
  completeQuiz: (quizType: string) => Promise<void>
  resetQuiz: () => void
  setError: (error: string | null) => void
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      isLoading: false,
      error: null,
      timeLimit: 30, // 30 minutes par défaut
      startTime: undefined,
      completedAt: undefined,
      isCompleted: false,
      score: undefined,
      percentage: undefined,

      loadQuestions: async (quizType: string, metierId?: number) => {
        try {
          set({ isLoading: true, error: null })

          // Build URL with appropriate parameters
          const params = new URLSearchParams()

          // For WORKSHOP quizzes, prefer metier_id if provided
          if (metierId) {
            params.append('metier_id', metierId.toString())
          } else {
            // Fallback to type for INTRODUCTION/SONDAGE
            params.append('type', quizType)
          }

          const response = await fetch(`/api/quiz?${params.toString()}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Erreur lors du chargement des questions')
          }

          const data = await response.json()

          if (!data.questions || data.questions.length === 0) {
            throw new Error('Aucune question trouvée pour ce quiz')
          }

          set({
            questions: data.questions,
            isLoading: false,
            timeLimit: quizType === 'INTRODUCTION' ? 30 : undefined
          })
        } catch (error: any) {
          set({
            error: error.message || 'Erreur lors du chargement du quiz',
            isLoading: false
          })
        }
      },

      startQuiz: () => {
        set({
          startTime: Date.now(),
          currentQuestionIndex: 0,
          answers: [],
          isCompleted: false,
          score: undefined,
          percentage: undefined,
          completedAt: undefined
        })
      },

      submitAnswer: (questionId: string, selectedAnswers: string[]) => {
        const { questions, currentQuestionIndex, answers } = get()
        const currentQuestion = questions[currentQuestionIndex]

        if (!currentQuestion || currentQuestion.id !== questionId) return

        // Calculate if answer is correct
        const isCorrect = selectedAnswers.length === currentQuestion.correct_answer.length &&
          selectedAnswers.every(answer => currentQuestion.correct_answer.includes(answer))

        const answer: QuizAnswer = {
          questionId,
          selectedAnswers,
          isCorrect,
          timeSpent: 0, // Calculé différemment si nécessaire
          timestamp: new Date().toISOString(),
        }

        const updatedAnswers = [...answers]
        const existingIndex = updatedAnswers.findIndex(a => a.questionId === questionId)

        if (existingIndex >= 0) {
          updatedAnswers[existingIndex] = answer
        } else {
          updatedAnswers.push(answer)
        }

        // Passer à la question suivante automatiquement
        const nextIndex = currentQuestionIndex < questions.length - 1
          ? currentQuestionIndex + 1
          : currentQuestionIndex

        set({
          answers: updatedAnswers,
          currentQuestionIndex: nextIndex
        })
      },

      completeQuiz: async (quizType: string) => {
        const { questions, answers, startTime } = get()

        // If startTime is missing, use current time as fallback to avoid blocking users
        const effectiveStartTime = startTime || Date.now()

        if (!startTime) {
          console.warn('Quiz startTime was missing, using current time as fallback')
        }

        // Calculer le score
        const correctAnswers = answers.filter(a => a.isCorrect).length
        const totalPossiblePoints = questions.reduce((total, q) => total + (q.points || 1), 0)
        const score = answers.reduce((total, answer) => {
          const question = questions.find(q => q.id === answer.questionId)
          return total + (answer.isCorrect ? (question?.points || 1) : 0)
        }, 0)
        const percentage = totalPossiblePoints > 0 ? (score / totalPossiblePoints) * 100 : 0
        const duration = Math.floor((Date.now() - effectiveStartTime) / 1000)
        const completedAt = Date.now()

        try {
          // Sauvegarder le résultat
          const response = await fetch('/api/quiz', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quiz_type: quizType,
              responses: answers,
              score,
              max_score: totalPossiblePoints,
              total_questions: questions.length,
              correct_answers: correctAnswers,
              duration,
              started_at: new Date(effectiveStartTime).toISOString()
            })
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error('Erreur API:', errorData)

            // Message d'erreur personnalisé selon le code de statut
            if (response.status === 401) {
              throw new Error(errorData.message || 'Vous devez être connecté pour sauvegarder vos résultats.')
            } else if (response.status === 400) {
              throw new Error(errorData.message || 'Données invalides.')
            } else {
              throw new Error(errorData.message || 'Erreur lors de la sauvegarde')
            }
          }

          // Mettre à jour l'état
          set({
            isCompleted: true,
            score,
            percentage: Math.round(percentage * 100) / 100,
            completedAt
          })

        } catch (error: any) {
          // Même en cas d'erreur de sauvegarde, on peut montrer les résultats localement
          // Importer et afficher un toast d'avertissement
          if (typeof window !== 'undefined') {
            import('react-hot-toast').then(({ default: toast }) => {
              if (error.message.includes('connecté')) {
                toast.error('⚠️ Résultats non sauvegardés : vous n\'êtes pas connecté', {
                  duration: 5000,
                  position: 'top-center'
                })
              } else {
                toast.error('⚠️ Impossible de sauvegarder vos résultats', {
                  duration: 4000
                })
              }
            })
          }

          set({
            isCompleted: true,
            score,
            percentage: Math.round(percentage * 100) / 100,
            completedAt,
            // Ne pas définir error pour permettre l'affichage des résultats
          })
        }
      },

      resetQuiz: () => {
        set({
          questions: [],
          currentQuestionIndex: 0,
          answers: [],
          isLoading: false,
          error: null,
          startTime: undefined,
          completedAt: undefined,
          isCompleted: false,
          score: undefined,
          percentage: undefined
        })
      },

      setError: (error: string | null) => {
        set({ error })
      },
    }),
    {
      name: 'ciprel-quiz-store',
      partialize: (state) => ({
        // Only persist questions to avoid stale state issues
        questions: state.questions,
      }),
    }
  )
)