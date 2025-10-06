'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  CheckCircle,
  BarChart3,
  Users
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const sondageData = [
  {
    id: 1,
    question: "Savez-vous ce que c'est que la démarche compétence ?",
    type: "single",
    options: [
      "Oui",
      "Non", 
      "J'ai une vague idée"
    ]
  },
  {
    id: 2,
    question: "Selon vous qu'est ce qu'une démarche compétence chez CIPREL :",
    type: "single",
    options: [
      "Un outil de gestion de carrière",
      "Un outil d'évaluation des compétences",
      "Un outil de sélection des profils"
    ]
  },
  {
    id: 3,
    question: "Selon vous quels sont les principaux bénéfices d'une telle démarche pour CIPREL ?",
    type: "multiple",
    options: [
      "L'optimisation des ressources",
      "Aide à l'évolution professionnelle",
      "Meilleure adéquation entre les besoins de l'entreprise et les compétences disponibles",
      "Meilleure gestion des talents"
    ],
    hasOther: true
  },
  {
    id: 4,
    question: "Qu'attendez-vous personnellement de ce projet ?",
    type: "text"
  },
  {
    id: 5,
    question: "Quelles sont vos principales inquiétudes concernant ce projet ?",
    type: "text"
  },
  {
    id: 6,
    question: "De quel type d'information avez-vous besoin pour comprendre ce projet ?",
    type: "multiple",
    options: [
      "Réunions d'information",
      "FAQ (Questions fréquemment posées)",
      "Documentation écrite"
    ],
    hasOther: true
  }
]

interface Answer {
  questionId: number
  selectedOptions?: number[]
  textResponse?: string
  otherText?: string
}

interface CiprelSondageContentProps {
  variant?: 'page' | 'modal'
  onClose?: () => void
  onNavigate?: (path: string) => void
}

export function CiprelSondageContent({
  variant = 'page',
  onClose,
  onNavigate,
}: CiprelSondageContentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])
  const [textResponse, setTextResponse] = useState('')
  const [otherText, setOtherText] = useState('')
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleOptionSelect = (optionIndex: number) => {
    const question = sondageData[currentQuestion]
    
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
      questionId: sondageData[currentQuestion].id,
      selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
      textResponse: textResponse.trim() || undefined,
      otherText: otherText.trim() || undefined
    }

    const newAnswers = [...answers.filter(a => a.questionId !== currentAnswer.questionId), currentAnswer]
    setAnswers(newAnswers)

    if (currentQuestion < sondageData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      // Le useEffect s'occupera de réinitialiser ou restaurer l'état
    } else {
      // Soumettre le sondage
      setIsSubmitted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      // Le useEffect s'occupera de restaurer la réponse précédente ou réinitialiser
    }
  }

  const resetCurrentState = () => {
    setSelectedOptions([])
    setTextResponse('')
    setOtherText('')
    setShowOtherInput(false)
  }

  // Réinitialiser l'état quand la question change
  useEffect(() => {
    // Vérifier s'il y a une réponse sauvegardée pour cette question
    const savedAnswer = answers.find(a => a.questionId === sondageData[currentQuestion].id)
    
    if (savedAnswer) {
      // Restaurer la réponse sauvegardée
      setSelectedOptions(savedAnswer.selectedOptions || [])
      setTextResponse(savedAnswer.textResponse || '')
      setOtherText(savedAnswer.otherText || '')
      setShowOtherInput(!!savedAnswer.otherText)
    } else {
      // Réinitialiser pour une nouvelle question
      resetCurrentState()
    }
  }, [currentQuestion, answers])

  const canProceed = () => {
    const question = sondageData[currentQuestion]
    
    if (question.type === 'text') {
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

  const paddingClass = variant === 'modal' ? 'py-8' : 'py-16'
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
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h2 className={`${headingSize} font-bold text-ciprel-black mb-4`}>
                Merci pour votre participation !
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Vos réponses ont été enregistrées et contribueront à améliorer 
                la mise en place de la démarche compétence chez CIPREL.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-ciprel-green-50 border border-ciprel-green-200 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-ciprel-green-600 mx-auto mb-2" />
                  <p className="text-ciprel-green-800 font-medium text-sm">
                    Vos réponses contribuent à l'analyse des besoins
                  </p>
                </div>
                
                <div className="p-4 bg-ciprel-orange-50 border border-ciprel-orange-200 rounded-lg">
                  <Users className="w-8 h-8 text-ciprel-orange-600 mx-auto mb-2" />
                  <p className="text-ciprel-orange-800 font-medium text-sm">
                    L'équipe RH étudiera vos retours attentivement
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => handleNavigate('/dialectique')} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  En savoir plus sur la démarche
                </Button>
                
                <Button 
                  onClick={() => handleNavigate('/facteurs-cles')} 
                  className="flex items-center gap-2 bg-ciprel-green-600 hover:bg-ciprel-green-700"
                >
                  Découvrir les facteurs clés
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {onClose && (
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    Fermer
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  const question = sondageData[currentQuestion]
  const progress = ((currentQuestion + 1) / sondageData.length) * 100

  return (
    <div className={paddingClass}>
      <div className={`container mx-auto ${containerSpacing}`}>
        {/* En-tête et progression */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ciprel-orange-100 text-ciprel-orange-800 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            Sondage d'Opinion
          </div>
          
          <h1 className={`${headingSize} font-bold text-ciprel-black mb-6`}>
            Question {currentQuestion + 1} sur {sondageData.length}
          </h1>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div 
              className="bg-gradient-to-r from-ciprel-orange-500 to-ciprel-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <p className="text-gray-600">
            Partagez votre point de vue sur la démarche compétence
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
            <Card className={`${questionPadding} mb-8`}>
              <h2 className="text-xl md:text-2xl font-semibold text-ciprel-black mb-6">
                {question.question}
              </h2>
              
              {question.type === 'text' ? (
                <div>
                  <Textarea
                    value={textResponse}
                    onChange={(e) => setTextResponse(e.target.value)}
                    placeholder="Votre réponse..."
                    className="min-h-[120px] resize-none"
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
                          ? 'bg-ciprel-orange-50 border-ciprel-orange-500 text-ciprel-orange-800'
                          : 'bg-white border-gray-200 hover:border-ciprel-orange-300 hover:bg-ciprel-orange-25'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOptions.includes(index)
                            ? 'bg-ciprel-orange-500 border-ciprel-orange-500'
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
                            ? 'bg-ciprel-orange-50 border-ciprel-orange-500 text-ciprel-orange-800'
                            : 'bg-white border-gray-200 hover:border-ciprel-orange-300'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            showOtherInput
                              ? 'bg-ciprel-orange-500 border-ciprel-orange-500'
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
            className="flex items-center gap-2 bg-ciprel-orange-600 hover:bg-ciprel-orange-700"
          >
            {currentQuestion === sondageData.length - 1 ? (
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
