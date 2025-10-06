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
    if (percentage >= 90) {
      return { level: 'Excellent', color: 'text-ciprel-green-600', bg: 'bg-ciprel-green-50', icon: Trophy }
    }
    if (percentage >= 80) {
      return { level: 'Très bien', color: 'text-ciprel-orange-600', bg: 'bg-ciprel-orange-50', icon: Award }
    }
    if (percentage >= 70) {
      return { level: 'Bien', color: 'text-ciprel-blue', bg: 'bg-ciprel-blue/10', icon: Target }
    }
    if (percentage >= 50) {
      return { level: 'Passable', color: 'text-ciprel-light-green', bg: 'bg-ciprel-light-green/20', icon: TrendingUp }
    }
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
            <div className="text-center p-4 bg-ciprel-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-ciprel-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-ciprel-green-900">
                {correctAnswers}
              </div>
              <div className="text-sm text-ciprel-green-700">
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

            <div className="text-center p-4 bg-ciprel-blue/10 rounded-lg">
              <Clock className="h-8 w-8 text-ciprel-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-ciprel-blue-dark">
                {formatDuration(duration)}
              </div>
              <div className="text-sm text-ciprel-blue">
                Temps total
              </div>
            </div>
          </div>

          {/* Message de motivation */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            {(percentage || 0) >= 90 ? (
              <p className="text-lg text-gray-700">
                🎉 Excellent travail ! Vous maîtrisez parfaitement le sujet.
              </p>
            ) : (percentage || 0) >= 70 ? (
              <p className="text-lg text-gray-700">
                👏 Bravo ! Vous avez une bonne compréhension du sujet.
              </p>
            ) : (percentage || 0) >= 50 ? (
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
            <span>Recommandations personnalisées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Recommandations selon le score */}
            {(percentage || 0) >= 90 && (
              <div className="p-4 bg-ciprel-green-50 border border-ciprel-green-200 rounded-lg">
                <h4 className="font-semibold text-ciprel-green-700 mb-2 flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Excellente maîtrise !
                </h4>
                <p className="text-sm text-ciprel-green-700 mb-3">
                  Vous démontrez une excellente compréhension de la démarche compétences. Vous êtes prêt(e) à devenir un acteur clé de sa mise en œuvre.
                </p>
                <ul className="text-sm text-ciprel-green-700 space-y-2">
                  <li>✓ Partagez vos connaissances avec vos collègues</li>
                  <li>✓ Proposez-vous comme ambassadeur de la démarche</li>
                  <li>✓ Participez aux ateliers de perfectionnement</li>
                </ul>
              </div>
            )}

            {(percentage || 0) >= 70 && (percentage || 0) < 90 && (
              <div className="p-4 bg-ciprel-orange-50 border border-ciprel-orange-200 rounded-lg">
                <h4 className="font-semibold text-ciprel-orange-700 mb-2 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Bonne compréhension
                </h4>
                <p className="text-sm text-ciprel-orange-700 mb-3">
                  Vous avez acquis les bases essentielles. Quelques approfondissements vous permettront d'atteindre l'excellence.
                </p>
                <ul className="text-sm text-ciprel-orange-700 space-y-2">
                  <li>• Approfondissez les concepts qui vous semblent moins clairs</li>
                  <li>• Consultez le guide détaillé de la démarche compétences</li>
                  <li>• Échangez avec les experts RH pour clarifier certains points</li>
                </ul>
              </div>
            )}

            {(percentage || 0) >= 50 && (percentage || 0) < 70 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Bases à consolider
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Vous comprenez les grandes lignes mais certains aspects méritent d'être approfondis pour une meilleure maîtrise.
                </p>
                <ul className="text-sm text-yellow-700 space-y-2">
                  <li>• Relisez attentivement le Guide de la démarche compétence</li>
                  <li>• Participez aux sessions de formation disponibles</li>
                  <li>• Regardez les vidéos explicatives dans la vidéothèque</li>
                  <li>• N'hésitez pas à poser vos questions à l'équipe RH</li>
                </ul>
              </div>
            )}

            {(percentage || 0) < 50 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Révision recommandée
                </h4>
                <p className="text-sm text-red-700 mb-3">
                  La démarche compétences nécessite encore quelques apprentissages. Prenez le temps de vous familiariser avec les concepts clés.
                </p>
                <ul className="text-sm text-red-700 space-y-2">
                  <li>📖 Commencez par le Guide d'introduction à la démarche compétence</li>
                  <li>🎥 Visionnez les vidéos pédagogiques de la section Dialectique</li>
                  <li>👥 Inscrivez-vous à une session de formation avec l'équipe RH</li>
                  <li>🔄 Retentez le quiz après avoir révisé ces ressources</li>
                  <li>💬 Participez au sondage pour exprimer vos besoins de formation</li>
                </ul>
              </div>
            )}

            {/* Prochaines étapes communes */}
            <div className="p-4 bg-ciprel-blue/10 border border-ciprel-blue rounded-lg">
              <h4 className="font-semibold text-ciprel-blue-dark mb-2">
                📋 Prochaines étapes suggérées :
              </h4>
              <ul className="text-sm text-ciprel-blue space-y-2">
                <li>🗣️ Partagez votre avis via le sondage d'opinion</li>
                <li>📚 Explorez la section "Facteurs Clés de Succès"</li>
                <li>🎯 Consultez le référentiel des compétences CIPREL</li>
                <li>📊 Suivez votre progression dans votre tableau de bord</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
