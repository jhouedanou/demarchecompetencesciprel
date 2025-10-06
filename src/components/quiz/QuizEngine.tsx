'use client'

import { useEffect, useState } from 'react'
import { useQuizStore } from '@/stores/quiz-store'
import { QuestionCard } from './QuestionCard'
import { ProgressBar } from './ProgressBar'
import { Timer } from './Timer'
import { ResultsView } from './ResultsView'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { AlertCircle, Play, RotateCcw } from 'lucide-react'
import { QuizQuestion } from '@/types'

interface QuizEngineProps {
  quizType: 'INTRODUCTION' | 'SONDAGE'
  className?: string
}

export function QuizEngine({ quizType, className }: QuizEngineProps) {
  const [isStarted, setIsStarted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  const {
    questions,
    currentQuestionIndex,
    answers,
    isLoading,
    error,
    timeLimit,
    startTime,
    isCompleted,
    loadQuestions,
    startQuiz,
    submitAnswer,
    completeQuiz,
    resetQuiz,
  } = useQuizStore()

  useEffect(() => {
    if (!questions.length && !isLoading) {
      loadQuestions(quizType)
    }
  }, [quizType, questions.length, isLoading, loadQuestions])

  const handleStartQuiz = () => {
    startQuiz()
    setIsStarted(true)
  }

  const handleAnswerSubmit = (questionId: string, selectedAnswers: string[]) => {
    submitAnswer(questionId, selectedAnswers)
    
    // Passer à la question suivante automatiquement après 1 seconde
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        // Question suivante sera gérée par le store
      } else {
        // Dernier question, terminer le quiz
        handleCompleteQuiz()
      }
    }, 1000)
  }

  const handleCompleteQuiz = async () => {
    try {
      await completeQuiz(quizType)
      setShowResults(true)
    } catch (error) {
      console.error('Erreur lors de la finalisation du quiz:', error)
    }
  }

  const handleRestartQuiz = () => {
    resetQuiz()
    setIsStarted(false)
    setShowResults(false)
  }

  const handleTimeUp = () => {
    handleCompleteQuiz()
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 text-center ${className}`}>
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-600 mb-6">
          {error}
        </p>
        <Button 
          onClick={() => loadQuestions(quizType)}
          className="bg-ciprel-green-600 hover:bg-ciprel-green-700"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    )
  }

  if (isLoading || !questions.length) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
        <LoadingSpinner text="Chargement du quiz..." />
      </div>
    )
  }

  if (showResults || isCompleted) {
    return (
      <div className={className}>
        <ResultsView 
          quizType={quizType}
          onRestart={handleRestartQuiz}
        />
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 text-center ${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-gray-600 mb-6">
            Ce quiz contient {questions.length} questions. 
            {timeLimit && ` Vous avez ${timeLimit} minutes pour le compléter.`}
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">Instructions importantes :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Lisez chaque question attentivement</li>
                  <li>Certaines questions peuvent avoir plusieurs bonnes réponses</li>
                  <li>Vous ne pourrez pas revenir en arrière</li>
                  <li>Le quiz sera automatiquement soumis à la fin du temps imparti</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleStartQuiz}
          size="lg"
          className="bg-ciprel-green-600 hover:bg-ciprel-green-700 text-white px-8 py-3"
        >
          <Play className="h-5 w-5 mr-2" />
          Commencer le quiz
        </Button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (!currentQuestion) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 text-center ${className}`}>
        <p className="text-gray-600">Aucune question disponible.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec progression et timer */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </div>
          
          {timeLimit && startTime && (
            <Timer
              startTime={startTime}
              duration={timeLimit * 60} // Convertir en secondes
              onTimeUp={handleTimeUp}
            />
          )}
        </div>
        
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={questions.length}
        />
      </div>

      {/* Question actuelle */}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswerSubmit}
        userAnswer={answers.find(a => a.questionId === currentQuestion.id)?.selectedAnswers}
      />
    </div>
  )
}
