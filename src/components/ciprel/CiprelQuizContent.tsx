'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Trophy,
  Target
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const quizData = [
  {
    question: "La démarche compétence c'est :",
    options: [
      "Un moyen de retenir les potentiels et les talents",
      "Un levier de performance", 
      "Un levier de certification qualité"
    ],
    correctAnswers: [0, 1, 2], // Toutes les réponses sont correctes
    type: "multiple"
  },
  {
    question: "La démarche compétence est la responsabilité de :",
    options: [
      "Tous",
      "La direction générale",
      "Le groupe ERANOVE"
    ],
    correctAnswers: [0], // Tous
    type: "single"
  },
  {
    question: "Les compétences sont essentiellement :",
    options: [
      "Techniques",
      "Comportementales", 
      "Fondamentales"
    ],
    correctAnswers: [0, 1, 2], // Toutes sont essentielles
    type: "multiple"
  },
  {
    question: "Le savoir-faire c'est :",
    options: [
      "La capacité à assurer des tâches techniques ou managériales",
      "L'ensemble des capacités cognitives et relationnelles",
      "La capacité à bien faire les choses"
    ],
    correctAnswers: [0], // Capacité à assurer des tâches techniques ou managériales
    type: "single"
  },
  {
    question: "Le savoir être c'est :",
    options: [
      "L'ensemble des connaissances cumulées grâce à l'expérience",
      "La capacité à agir dans son environnement",
      "L'ensemble des capacités cognitives et relationnelles"
    ],
    correctAnswers: [2], // L'ensemble des capacités cognitives et relationnelles
    type: "single"
  },
  {
    question: "Quelles sont les étapes de la démarche compétence :",
    options: [
      "Identification des compétences requises",
      "Développer les compétences",
      "Challenger les plus méritants",
      "Cartographier et évaluer les compétences acquises",
      "Évaluer et suivre les évolutions",
      "Tolérer les écarts",
      "Analyser les écarts en compétences et définir les besoins"
    ],
    correctAnswers: [0, 1, 3, 4, 6], // Les vraies étapes (pas "challenger" ni "tolérer")
    type: "multiple"
  }
]

export function CiprelQuizContent() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [userAnswers, setUserAnswers] = useState<number[][]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerSelect = (answerIndex: number) => {
    const question = quizData[currentQuestion]
    
    if (question.type === 'single') {
      setSelectedAnswers([answerIndex])
    } else {
      if (selectedAnswers.includes(answerIndex)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== answerIndex))
      } else {
        setSelectedAnswers([...selectedAnswers, answerIndex])
      }
    }
  }

  const handleNext = () => {
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestion] = selectedAnswers

    setUserAnswers(newUserAnswers)

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswers([])
    } else {
      calculateScore(newUserAnswers)
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswers(userAnswers[currentQuestion - 1] || [])
    }
  }

  const calculateScore = (answers: number[][]) => {
    let correctCount = 0
    
    answers.forEach((userAnswer, index) => {
      const correctAnswer = quizData[index].correctAnswers
      
      if (quizData[index].type === 'single') {
        if (userAnswer.length === 1 && correctAnswer.includes(userAnswer[0])) {
          correctCount++
        }
      } else {
        const sortedUser = [...userAnswer].sort()
        const sortedCorrect = [...correctAnswer].sort()
        
        if (sortedUser.length === sortedCorrect.length && 
            sortedUser.every((val, i) => val === sortedCorrect[i])) {
          correctCount++
        }
      }
    })
    
    setScore(Math.round((correctCount / quizData.length) * 100))
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setUserAnswers([])
    setShowResults(false)
    setScore(0)
  }

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-ciprel-orange-600'
    return 'text-red-600'
  }

  const getScoreIcon = () => {
    if (score >= 80) return Trophy
    if (score >= 60) return Award
    return Target
  }

  if (showResults) {
    const ScoreIcon = getScoreIcon()
    
    return (
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-ciprel-orange-100' : 'bg-red-100'
              }`}>
                <ScoreIcon className={`w-12 h-12 ${getScoreColor()}`} />
              </div>
              
              <h2 className="text-3xl font-bold text-ciprel-black mb-4">
                Quiz terminé !
              </h2>
              
              <div className={`text-6xl font-bold ${getScoreColor()} mb-4`}>
                {score}%
              </div>
              
              <p className="text-lg text-gray-600 mb-8">
                Vous avez obtenu {userAnswers.filter((answer, index) => {
                  const correctAnswer = quizData[index].correctAnswers
                  if (quizData[index].type === 'single') {
                    return answer.length === 1 && correctAnswer.includes(answer[0])
                  } else {
                    const sortedUser = [...answer].sort()
                    const sortedCorrect = [...correctAnswer].sort()
                    return sortedUser.length === sortedCorrect.length && 
                           sortedUser.every((val, i) => val === sortedCorrect[i])
                  }
                }).length} bonne(s) réponse(s) sur {quizData.length}
              </p>

              <div className="space-y-4 mb-8">
                {score >= 80 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      🎉 Excellent ! Vous maîtrisez bien les concepts de la démarche compétence.
                    </p>
                  </div>
                )}
                
                {score >= 60 && score < 80 && (
                  <div className="p-4 bg-ciprel-orange-50 border border-ciprel-orange-200 rounded-lg">
                    <p className="text-ciprel-orange-800 font-medium">
                      👍 Bon travail ! Vous avez une bonne compréhension de base.
                    </p>
                  </div>
                )}
                
                {score < 60 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">
                      📚 N'hésitez pas à revoir les concepts avant de recommencer.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetQuiz} variant="outline" className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Recommencer
                </Button>
                
                <Button 
                  onClick={() => window.location.href = '/sondage'} 
                  className="flex items-center gap-2 bg-ciprel-green-600 hover:bg-ciprel-green-700"
                >
                  Continuer vers le sondage
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  const question = quizData[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.length) * 100

  return (
    <div className="py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* En-tête et progression */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ciprel-green-100 text-ciprel-green-800 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Quiz Phase Introductive
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-6">
            Question {currentQuestion + 1} sur {quizData.length}
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
            {question.type === 'multiple' ? 'Plusieurs réponses possibles' : 'Une seule réponse'}
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
            <Card className="p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-ciprel-black mb-6">
                {question.question}
              </h2>
              
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswers.includes(index)
                        ? 'bg-ciprel-green-50 border-ciprel-green-500 text-ciprel-green-800'
                        : 'bg-white border-gray-200 hover:border-ciprel-green-300 hover:bg-ciprel-green-25'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers.includes(index)
                          ? 'bg-ciprel-green-500 border-ciprel-green-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers.includes(index) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
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
            disabled={selectedAnswers.length === 0}
            className="flex items-center gap-2 bg-ciprel-green-600 hover:bg-ciprel-green-700"
          >
            {currentQuestion === quizData.length - 1 ? 'Terminer' : 'Suivant'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
