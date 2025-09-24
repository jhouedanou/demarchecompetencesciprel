'use client'

import { useState, useEffect } from 'react'
import { QuizQuestion } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle, Circle, Clock, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface QuestionCardProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  onAnswer: (questionId: string, selectedAnswers: string[]) => void
  userAnswer?: string[]
  className?: string
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  userAnswer,
  className
}: QuestionCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(userAnswer || [])
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [questionStartTime] = useState(Date.now())

  useEffect(() => {
    if (userAnswer) {
      setSelectedAnswers(userAnswer)
      setHasAnswered(true)
      setShowFeedback(true)
    }
  }, [userAnswer])

  const options = [
    { value: 'A', label: question.option_a },
    { value: 'B', label: question.option_b },
    { value: 'C', label: question.option_c },
    ...(question.option_d ? [{ value: 'D', label: question.option_d }] : [])
  ]

  const isMultipleChoice = question.correct_answer.length > 1

  const handleOptionSelect = (optionValue: string) => {
    if (hasAnswered) return

    if (isMultipleChoice) {
      setSelectedAnswers(prev => 
        prev.includes(optionValue)
          ? prev.filter(a => a !== optionValue)
          : [...prev, optionValue]
      )
    } else {
      setSelectedAnswers([optionValue])
    }
  }

  const handleSubmit = () => {
    if (selectedAnswers.length === 0) return

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    setHasAnswered(true)
    setShowFeedback(true)
    
    // Délai pour montrer le feedback avant de passer à la suite
    setTimeout(() => {
      onAnswer(question.id, selectedAnswers)
    }, 2000)
  }

  const isCorrect = hasAnswered && 
    selectedAnswers.length === question.correct_answer.length &&
    selectedAnswers.every(answer => question.correct_answer.includes(answer))

  const getOptionStyle = (optionValue: string) => {
    if (!hasAnswered) {
      return selectedAnswers.includes(optionValue)
        ? 'border-blue-500 bg-blue-50 text-blue-900'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }

    // Après avoir répondu, montrer les bonnes et mauvaises réponses
    const isSelected = selectedAnswers.includes(optionValue)
    const isCorrectAnswer = question.correct_answer.includes(optionValue)

    if (isCorrectAnswer) {
      return 'border-green-500 bg-green-50 text-green-900'
    } else if (isSelected) {
      return 'border-red-500 bg-red-50 text-red-900'
    } else {
      return 'border-gray-200 bg-gray-50 text-gray-600'
    }
  }

  const getOptionIcon = (optionValue: string) => {
    if (!hasAnswered) {
      return selectedAnswers.includes(optionValue) 
        ? <CheckCircle className="h-5 w-5" />
        : <Circle className="h-5 w-5" />
    }

    const isSelected = selectedAnswers.includes(optionValue)
    const isCorrectAnswer = question.correct_answer.includes(optionValue)

    if (isCorrectAnswer) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (isSelected) {
      return <CheckCircle className="h-5 w-5 text-red-600" />
    } else {
      return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <HelpCircle className="h-4 w-4" />
              <span>Question {questionNumber} sur {totalQuestions}</span>
              {isMultipleChoice && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Choix multiples
                </span>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {question.question}
            </h2>
            
            {question.title && question.title !== question.question && (
              <p className="text-gray-600 mt-2">
                {question.title}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Options */}
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              disabled={hasAnswered}
              className={cn(
                'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-center space-x-3',
                getOptionStyle(option.value),
                !hasAnswered && 'hover:shadow-sm',
                hasAnswered && 'cursor-not-allowed'
              )}
            >
              {getOptionIcon(option.value)}
              <span className="flex-1 font-medium">
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {/* Instructions */}
        {!hasAnswered && (
          <div className="text-sm text-gray-500 text-center">
            {isMultipleChoice 
              ? 'Sélectionnez toutes les bonnes réponses'
              : 'Sélectionnez une réponse'
            }
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className={cn(
            'p-4 rounded-lg border-l-4',
            isCorrect 
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-red-50 border-red-500 text-red-800'
          )}>
            <div className="flex items-center mb-2">
              <div className={cn(
                'w-2 h-2 rounded-full mr-2',
                isCorrect ? 'bg-green-500' : 'bg-red-500'
              )} />
              <span className="font-semibold">
                {isCorrect ? 'Correct !' : 'Incorrect'}
              </span>
            </div>
            
            {question.feedback && (
              <p className="text-sm">
                {question.feedback}
              </p>
            )}

            {question.explanation && (
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <p className="text-sm">
                  <strong>Explication :</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bouton de soumission */}
        {!hasAnswered && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswers.length === 0}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
            >
              {questionNumber === totalQuestions ? 'Terminer' : 'Valider'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
