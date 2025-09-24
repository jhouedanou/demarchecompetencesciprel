import { Metadata } from 'next'
import { QuizEngine } from '@/components/quiz/QuizEngine'

export const metadata: Metadata = {
  title: 'Quiz Introduction - Démarche Compétences',
  description: 'Testez vos connaissances sur la démarche compétences CIPREL avec notre quiz interactif.',
}

export default function QuizIntroductionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quiz Introduction à la Démarche Compétences
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Évaluez vos connaissances sur les concepts fondamentaux de la démarche compétences chez CIPREL.
            </p>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">7</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-2">30</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">70%</div>
                  <div className="text-sm text-gray-600">Score requis</div>
                </div>
              </div>
            </div>
          </div>

          <QuizEngine quizType="INTRODUCTION" />
        </div>
      </div>
    </div>
  )
}
