'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  ArrowRight,
  ArrowLeft,
  Send,
  CheckCircle,
  Sparkles,
  ThumbsUp,
  MessageSquare
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const uxSurveyData = [
  {
    id: 1,
    question: "Comment évaluez-vous la facilité de navigation sur cette plateforme ?",
    type: "rating" as const,
    ratingLabels: {
      1: "Très difficile",
      2: "Difficile",
      3: "Moyenne",
      4: "Facile",
      5: "Très facile"
    } as Record<number, string>
  },
  {
    id: 2,
    question: "Le design et l'apparence de la plateforme sont-ils attrayants ?",
    type: "rating" as const,
    ratingLabels: {
      1: "Pas du tout",
      2: "Peu attrayant",
      3: "Correct",
      4: "Attrayant",
      5: "Très attrayant"
    } as Record<number, string>
  },
  {
    id: 3,
    question: "Les informations présentées sont-elles claires et compréhensibles ?",
    type: "rating" as const,
    ratingLabels: {
      1: "Pas claires",
      2: "Peu claires",
      3: "Acceptables",
      4: "Claires",
      5: "Très claires"
    } as Record<number, string>
  },
  {
    id: 4,
    question: "Quelles fonctionnalités trouvez-vous les plus utiles ?",
    type: "multiple",
    options: [
      "Navigation par slides",
      "Quiz interactifs",
      "Workshops métiers",
      "Ressources documentaires",
      "Vidéos de formation",
      "Suivi de progression"
    ],
    hasOther: true
  },
  {
    id: 5,
    question: "Avez-vous rencontré des difficultés lors de votre utilisation ?",
    type: "single",
    options: [
      "Aucune difficulté",
      "Quelques difficultés mineures",
      "Difficultés modérées",
      "Difficultés importantes"
    ]
  },
  {
    id: 6,
    question: "Si oui, pouvez-vous décrire les difficultés rencontrées ?",
    type: "text",
    optional: true,
    placeholder: "Décrivez les difficultés ou problèmes que vous avez rencontrés..."
  },
  {
    id: 7,
    question: "Quelle est votre satisfaction globale concernant la plateforme ?",
    type: "rating" as const,
    ratingLabels: {
      1: "Très insatisfait",
      2: "Insatisfait",
      3: "Neutre",
      4: "Satisfait",
      5: "Très satisfait"
    } as Record<number, string>
  },
  {
    id: 8,
    question: "Recommanderiez-vous cette plateforme à vos collègues ?",
    type: "single",
    options: [
      "Certainement pas",
      "Probablement pas",
      "Peut-être",
      "Probablement",
      "Certainement"
    ]
  },
  {
    id: 9,
    question: "Quelles améliorations souhaiteriez-vous voir sur la plateforme ?",
    type: "text",
    placeholder: "Partagez vos suggestions d'amélioration..."
  },
  {
    id: 10,
    question: "Avez-vous des commentaires supplémentaires à partager ?",
    type: "text",
    optional: true,
    placeholder: "Tout commentaire additionnel est le bienvenu..."
  }
]

interface Answer {
  questionId: number
  rating?: number
  selectedOptions?: number[]
  textResponse?: string
  otherText?: string
}

interface CiprelUXSurveyContentProps {
  variant?: 'page' | 'modal'
  onClose?: () => void
  onNavigate?: (path: string) => void
}

export function CiprelUXSurveyContent({
  variant = 'page',
  onClose,
  onNavigate,
}: CiprelUXSurveyContentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])
  const [textResponse, setTextResponse] = useState('')
  const [otherText, setOtherText] = useState('')
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleRatingSelect = (value: number) => {
    setRating(value)
  }

  const handleOptionSelect = (optionIndex: number) => {
    const question = uxSurveyData[currentQuestion]

    if (question.type === 'single') {
      setSelectedOptions([optionIndex])
    } else {
      if (selectedOptions.includes(optionIndex)) {
        setSelectedOptions(selectedOptions.filter(i => i !== optionIndex))
      } else {
        setSelectedOptions([...selectedOptions, optionIndex])
      }
    }
  }

  const handleNext = () => {
    // Sauvegarder la réponse actuelle
    const currentAnswer: Answer = {
      questionId: uxSurveyData[currentQuestion].id,
      rating: rating || undefined,
      selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
      textResponse: textResponse.trim() || undefined,
      otherText: otherText.trim() || undefined
    }

    const newAnswers = [...answers.filter(a => a.questionId !== currentAnswer.questionId), currentAnswer]
    setAnswers(newAnswers)

    if (currentQuestion < uxSurveyData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Soumettre le sondage
      console.log('📊 Réponses UX Survey:', newAnswers)
      setIsSubmitted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const resetCurrentState = () => {
    setRating(0)
    setHoveredRating(0)
    setSelectedOptions([])
    setTextResponse('')
    setOtherText('')
    setShowOtherInput(false)
  }

  // Réinitialiser l'état quand la question change
  useEffect(() => {
    const savedAnswer = answers.find(a => a.questionId === uxSurveyData[currentQuestion].id)

    if (savedAnswer) {
      setRating(savedAnswer.rating || 0)
      setSelectedOptions(savedAnswer.selectedOptions || [])
      setTextResponse(savedAnswer.textResponse || '')
      setOtherText(savedAnswer.otherText || '')
      setShowOtherInput(!!savedAnswer.otherText)
    } else {
      resetCurrentState()
    }
  }, [currentQuestion, answers])

  const canProceed = () => {
    const question = uxSurveyData[currentQuestion]

    // Si la question est optionnelle, on peut toujours passer
    if (question.optional) {
      return true
    }

    if (question.type === 'rating') {
      return rating > 0
    } else if (question.type === 'text') {
      return textResponse.trim().length > 0
    } else {
      return selectedOptions.length > 0 || (showOtherInput && otherText.trim().length > 0)
    }
  }

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.location.href = path
    }
  }

  const paddingClass = variant === 'modal' ? 'py-6' : 'py-16'
  const containerSpacing = variant === 'modal' ? 'px-4 max-w-3xl' : 'px-6 max-w-4xl'
  const cardPadding = variant === 'modal' ? 'p-6' : 'p-8'
  const headingSize = variant === 'modal' ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
  const questionPadding = variant === 'modal' ? 'p-6' : 'p-8'
  const actionsJustify = variant === 'modal'
    ? 'justify-between items-center gap-4 flex-wrap sm:flex-nowrap'
    : 'justify-between items-center'

  if (isSubmitted) {
    return (
      <div className={paddingClass}>
        <div className={`container mx-auto ${containerSpacing}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className={`${cardPadding} text-center`}>
              <div className="w-24 h-24 bg-gradient-to-br from-ciprel-green-400 to-ciprel-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-12 h-12 text-white" />
              </div>

              <h2 className={`${headingSize} font-bold text-ciprel-black mb-4`}>
                Merci pour votre retour !
              </h2>

              <p className="text-lg text-gray-600 mb-8">
                Votre avis est précieux et nous aidera à améliorer continuellement
                l'expérience de la plateforme CIPREL Compétences.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-ciprel-green-50 border border-ciprel-green-200 rounded-lg">
                  <ThumbsUp className="w-8 h-8 text-ciprel-green-600 mx-auto mb-2" />
                  <p className="text-ciprel-green-800 font-medium text-sm">
                    Votre feedback améliore l'expérience de tous
                  </p>
                </div>

                <div className="p-4 bg-ciprel-orange-50 border border-ciprel-orange-200 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-ciprel-orange-600 mx-auto mb-2" />
                  <p className="text-ciprel-orange-800 font-medium text-sm">
                    L'équipe technique analysera vos suggestions
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => handleNavigate('/')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Retour à l'accueil
                </Button>

                {onClose && (
                  <Button
                    onClick={onClose}
                    className="flex items-center gap-2 bg-ciprel-green-600 hover:bg-ciprel-green-700"
                  >
                    Fermer
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  const question = uxSurveyData[currentQuestion]
  const progress = ((currentQuestion + 1) / uxSurveyData.length) * 100

  return (
    <div className={paddingClass}>
      <div className={`container mx-auto ${containerSpacing}`}>
        {/* En-tête et progression */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ciprel-green-100 text-ciprel-green-800 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Sondage Expérience Utilisateur
          </div>

          <h1 className={`${headingSize} font-bold text-ciprel-black mb-4`}>
            Question {currentQuestion + 1} sur {uxSurveyData.length}
          </h1>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <p className="text-gray-600">
            Aidez-nous à améliorer votre expérience sur la plateforme
          </p>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`${questionPadding} mb-6`}>
              <h2 className="text-xl md:text-2xl font-semibold text-ciprel-black mb-6">
                {question.question}
                {question.optional && (
                  <span className="text-sm text-gray-400 font-normal ml-2">(Optionnel)</span>
                )}
              </h2>

              {question.type === 'rating' ? (
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <motion.button
                        key={value}
                        onClick={() => handleRatingSelect(value)}
                        onMouseEnter={() => setHoveredRating(value)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star
                          className={`w-12 h-12 transition-colors ${
                            value <= (hoveredRating || rating)
                              ? 'fill-ciprel-orange-500 text-ciprel-orange-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>

                  {(hoveredRating > 0 || rating > 0) && question.ratingLabels && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-ciprel-orange-700 font-medium"
                    >
                      {question.ratingLabels && question.ratingLabels[hoveredRating || rating] || ''}
                    </motion.p>
                  )}
                </div>
              ) : question.type === 'text' ? (
                <div>
                  <Textarea
                    value={textResponse}
                    onChange={(e) => setTextResponse(e.target.value)}
                    placeholder={question.placeholder || "Votre réponse..."}
                    className="min-h-[120px] resize-none"
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {textResponse.length}/500 caractères
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {question.options?.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        selectedOptions.includes(index)
                          ? 'bg-ciprel-green-50 border-ciprel-green-500 text-ciprel-green-800'
                          : 'bg-white border-gray-200 hover:border-ciprel-green-300 hover:bg-ciprel-green-25'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOptions.includes(index)
                            ? 'bg-ciprel-green-500 border-ciprel-green-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedOptions.includes(index) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}

                  {question.hasOther && (
                    <div>
                      <motion.button
                        onClick={() => setShowOtherInput(!showOtherInput)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                          showOtherInput
                            ? 'bg-ciprel-green-50 border-ciprel-green-500 text-ciprel-green-800'
                            : 'bg-white border-gray-200 hover:border-ciprel-green-300'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            showOtherInput
                              ? 'bg-ciprel-green-500 border-ciprel-green-500'
                              : 'border-gray-300'
                          }`}>
                            {showOtherInput && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="font-medium">Autre (à préciser)</span>
                        </div>
                      </motion.button>

                      <AnimatePresence>
                        {showOtherInput && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3"
                          >
                            <Textarea
                              value={otherText}
                              onChange={(e) => setOtherText(e.target.value)}
                              placeholder="Précisez votre réponse..."
                              className="min-h-[80px] resize-none"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className={`flex ${actionsJustify}`}>
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-ciprel-green-600 hover:bg-ciprel-green-700"
          >
            {currentQuestion === uxSurveyData.length - 1 ? (
              <>
                <Send className="w-4 h-4" />
                Envoyer
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
