'use client'

import { useEffect, useState } from 'react'
import { useQuizStore } from '@/stores/quiz-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Target, 
  Clock, 
  RotateCcw, 
  Share2, 
  Download,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  Book
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import confetti from 'canvas-confetti'

interface ResultsViewProps {
  quizType: 'INTRODUCTION' | 'SONDAGE'
  onRestart: () => void
  className?: string
}

export function ResultsView({ quizType, onRestart, className }: ResultsViewProps) {
  const {
    questions,
    answers,
    score,
    percentage,
    startTime,
    completedAt,
  } = useQuizStore()

  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (percentage && percentage >= 70) {
      setShowConfetti(true)
      // Déclencher les confettis
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [percentage])

  const duration = completedAt && startTime 
    ? Math.floor((completedAt - startTime) / 1000)
    : 0

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}min ${remainingSeconds}s`
    }
    return `${remainingSeconds}s`
  }

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', icon: Trophy }
    if (percentage >= 80) return { level: 'Très bien', color: 'text-blue-600', bg: 'bg-blue-50', icon: Award }
    if (percentage >= 70) return { level: 'Bien', color: 'text-purple-600', bg: 'bg-purple-50', icon: Target }
    if (percentage >= 50) return { level: 'Passable', color: 'text-orange-600', bg: 'bg-orange-50', icon: TrendingUp }
    return { level: 'À améliorer', color: 'text-red-600', bg: 'bg-red-50', icon: Book }
  }

  const performance = percentage ? getPerformanceLevel(percentage) : null
  const correctAnswers = answers.filter(answer => answer.isCorrect).length
  const incorrectAnswers = answers.length - correctAnswers

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Résultat Quiz CIPREL Compétences',
          text: `J'ai obtenu ${percentage}% au quiz sur la démarche compétences !`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Partage annulé')
      }
    } else {
      // Fallback: copier dans le presse-papiers
      navigator.clipboard.writeText(
        `J'ai obtenu ${percentage}% au quiz CIPREL Compétences sur la démarche compétences ! ${window.location.href}`
      )
    }
  }

  const handleDownload = () => {
    const results = {
      quiz_type: quizType,
      score: `${score}/${questions.length}`,
      percentage: `${percentage}%`,
      duration: formatDuration(duration),
      completed_at: new Date().toLocaleString('fr-FR'),
      answers: answers.map((answer, index) => ({
        question: questions[index]?.question || '',
        selected_answers: answer.selectedAnswers,
        is_correct: answer.isCorrect,
        time_spent: answer.timeSpent
      }))
    }
    
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quiz-results-${quizType.toLowerCase()}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn('max-w-4xl mx-auto space-y-6', className)}>
      {/* Résultat principal */}
      <Card className="overflow-hidden">
        <CardHeader className={cn(
          'text-center pb-6',
          performance?.bg || 'bg-gray-50'
        )}>
          <div className="flex justify-center mb-4">
            {performance?.icon && (
              <performance.icon className={cn('h-16 w-16', performance.color)} />
            )}
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Quiz terminé !
          </CardTitle>
          
          <div className={cn(
            'inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold',
            performance?.bg,
            performance?.color
          )}>
            {performance?.level}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score principal */}
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {percentage}%
            </div>
            <p className="text-xl text-gray-600">
              {score} bonnes réponses sur {questions.length}
            </p>
          </div>

          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progression</span>
              <span>{percentage}%</span>
            </div>
            <Progress 
              value={percentage || 0} 
              className="h-3"
            />
          </div>

          {/* Statistiques détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">
                {correctAnswers}
              </div>
              <div className="text-sm text-green-700">
                Correctes
              </div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-900">
                {incorrectAnswers}
              </div>
              <div className="text-sm text-red-700">
                Incorrectes
              </div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">
                {formatDuration(duration)}
              </div>
              <div className="text-sm text-blue-700">
                Temps total
              </div>
            </div>
          </div>

          {/* Message de motivation */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            {percentage >= 90 ? (
              <p className="text-lg text-gray-700">
                🎉 Excellent travail ! Vous maîtrisez parfaitement le sujet.
              </p>
            ) : percentage >= 70 ? (
              <p className="text-lg text-gray-700">
                👏 Bravo ! Vous avez une bonne compréhension du sujet.
              </p>
            ) : percentage >= 50 ? (
              <p className="text-lg text-gray-700">
                👍 Pas mal ! Avec un peu plus d'étude, vous y arriverez parfaitement.
              </p>
            ) : (
              <p className="text-lg text-gray-700">
                📚 N'abandonnez pas ! Révisez et retentez le quiz.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onRestart}
          size="lg"
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Recommencer</span>
        </Button>

        <Button
          onClick={handleShare}
          size="lg"
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Share2 className="h-5 w-5" />
          <span>Partager</span>
        </Button>

        <Button
          onClick={handleDownload}
          size="lg"
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Télécharger</span>
        </Button>
      </div>

      {/* Conseils personnalisés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-5 w-5" />
            <span>Pour aller plus loin</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {percentage < 70 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Recommandations d'amélioration :
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Révisez les concepts fondamentaux de la démarche compétences</li>
                  <li>• Consultez la documentation CIPREL</li>
                  <li>• Regardez les vidéos de formation disponibles</li>
                </ul>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Prochaines étapes :
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Participez au sondage pour partager votre expérience</li>
                <li>• Explorez la vidéothèque pour approfondir vos connaissances</li>
                <li>• Suivez votre progression dans votre profil</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
