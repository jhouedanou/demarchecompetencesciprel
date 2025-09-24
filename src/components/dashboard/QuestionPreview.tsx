'use client'

import { useState } from 'react'
import { X, CheckCircle, XCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import type { QuizQuestion } from '@/types'
import { QUIZ_CATEGORIES } from '@/lib/utils/constants'

interface QuestionPreviewProps {
  question: QuizQuestion
  onClose: () => void
}

export default function QuestionPreview({ question, onClose }: QuestionPreviewProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const options = [
    { key: 'A', value: question.option_a },
    { key: 'B', value: question.option_b },
    { key: 'C', value: question.option_c },
    ...(question.option_d ? [{ key: 'D', value: question.option_d }] : [])
  ]

  const handleOptionToggle = (option: string) => {
    if (showResults) return

    setSelectedAnswers(prev =>
      prev.includes(option)
        ? prev.filter(a => a !== option)
        : [...prev, option]
    )
  }

  const handleSubmit = () => {
    setShowResults(true)
  }

  const handleReset = () => {
    setSelectedAnswers([])
    setShowResults(false)
  }

  const isCorrectAnswer = (option: string) => {
    return question.correct_answer.includes(option)
  }

  const isSelectedCorrect = (option: string) => {
    return selectedAnswers.includes(option) && isCorrectAnswer(option)
  }

  const isSelectedIncorrect = (option: string) => {
    return selectedAnswers.includes(option) && !isCorrectAnswer(option)
  }

  const getOptionStyle = (option: string) => {
    if (!showResults) {
      return selectedAnswers.includes(option)
        ? 'border-ciprel-500 bg-ciprel-50'
        : 'border-gray-200 hover:border-gray-300'
    }

    // Mode résultats
    if (isSelectedCorrect(option)) {
      return 'border-green-500 bg-green-50'
    }
    if (isSelectedIncorrect(option)) {
      return 'border-red-500 bg-red-50'
    }
    if (isCorrectAnswer(option)) {
      return 'border-green-300 bg-green-25'
    }
    return 'border-gray-200'
  }

  const getOptionIcon = (option: string) => {
    if (!showResults) return null

    if (isSelectedCorrect(option) || (isCorrectAnswer(option) && !selectedAnswers.includes(option))) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }
    if (isSelectedIncorrect(option)) {
      return <XCircle className="w-5 h-5 text-red-600" />
    }
    return null
  }

  const getResultsMessage = () => {
    const correctSelected = selectedAnswers.filter(answer =>
      question.correct_answer.includes(answer)
    ).length
    const totalCorrect = question.correct_answer.length
    const incorrectSelected = selectedAnswers.length - correctSelected

    if (correctSelected === totalCorrect && incorrectSelected === 0) {
      return {
        type: 'success',
        message: '🎉 Parfait ! Toutes les bonnes réponses ont été sélectionnées.'
      }
    } else if (correctSelected > 0) {
      return {
        type: 'partial',
        message: `✅ ${correctSelected}/${totalCorrect} bonnes réponses trouvées.`
      }
    } else {
      return {
        type: 'error',
        message: '❌ Aucune bonne réponse sélectionnée.'
      }
    }
  }

  const results = showResults ? getResultsMessage() : null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Prévisualisation de la question
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className={
              question.category === 'DEFINITION' ? 'bg-blue-100 text-blue-800' :
              question.category === 'RESPONSABILITE' ? 'bg-green-100 text-green-800' :
              question.category === 'COMPETENCES' ? 'bg-purple-100 text-purple-800' :
              question.category === 'ETAPES' ? 'bg-orange-100 text-orange-800' :
              'bg-pink-100 text-pink-800'
            }>
              {QUIZ_CATEGORIES[question.category as keyof typeof QUIZ_CATEGORIES]}
            </Badge>
            <Badge className={
              question.quiz_type === 'INTRODUCTION'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-cyan-100 text-cyan-800'
            }>
              {question.quiz_type}
            </Badge>
            <span className="text-sm text-gray-600">
              {question.points} point{question.points !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Question principale */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {question.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {question.question}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {options.map((option) => (
                  <div
                    key={option.key}
                    onClick={() => handleOptionToggle(option.key)}
                    className={cn(
                      'p-4 border-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between',
                      getOptionStyle(option.key),
                      showResults && 'cursor-default'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 bg-white">
                        <span className="font-medium text-gray-700">
                          {option.key}
                        </span>
                      </div>
                      <span className="text-gray-800">
                        {option.value}
                      </span>
                    </div>
                    {getOptionIcon(option.key)}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                {!showResults ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedAnswers.length === 0}
                    className="bg-ciprel-600 hover:bg-ciprel-700"
                  >
                    Vérifier la réponse
                  </Button>
                ) : (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                  >
                    Recommencer
                  </Button>
                )}
              </div>

              {/* Résultats */}
              {results && (
                <Card className="mt-6">
                  <CardContent className="pt-4">
                    <div className={cn(
                      'flex items-start space-x-3 p-4 rounded-lg',
                      results.type === 'success' ? 'bg-green-50 border border-green-200' :
                      results.type === 'partial' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-red-50 border border-red-200'
                    )}>
                      <Info className={cn(
                        'w-5 h-5 mt-0.5 flex-shrink-0',
                        results.type === 'success' ? 'text-green-600' :
                        results.type === 'partial' ? 'text-yellow-600' :
                        'text-red-600'
                      )} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {results.message}
                        </p>
                        {question.feedback && (
                          <p className="text-gray-700 mt-2">
                            <strong>Feedback :</strong> {question.feedback}
                          </p>
                        )}
                        {question.explanation && (
                          <p className="text-gray-700 mt-2">
                            <strong>Explication :</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Informations techniques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Réponse(s) correcte(s) :</span>
                  <p className="text-gray-900">
                    {question.correct_answer.join(', ')}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ordre :</span>
                  <p className="text-gray-900">
                    {question.order_index}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Points :</span>
                  <p className="text-gray-900">
                    {question.points}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Statut :</span>
                  <p className="text-gray-900">
                    {question.id === 'preview' ? 'Prévisualisation' : 'Actif'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end p-6 border-t">
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  )
}