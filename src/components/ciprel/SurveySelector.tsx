'use client'

import { useState, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Sparkles, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { LoadingScreen } from '@/components/ui/loading-screen'

// Lazy load des composants de sondage
const CiprelSondageContent = lazy(() => import('@/components/ciprel/CiprelSondageContent').then(m => ({ default: m.CiprelSondageContent })))
const CiprelUXSurveyContent = lazy(() => import('@/components/ciprel/CiprelUXSurveyContent').then(m => ({ default: m.CiprelUXSurveyContent })))

interface SurveySelectorProps {
  variant?: 'page' | 'modal'
  onClose?: () => void
  onNavigate?: (path: string) => void
}

export function SurveySelector({
  variant = 'modal',
  onClose,
  onNavigate,
}: SurveySelectorProps) {
  const [selectedSurvey, setSelectedSurvey] = useState<'opinion' | 'ux' | null>(null)

  if (selectedSurvey === 'opinion') {
    return (
      <Suspense fallback={<LoadingScreen message="Chargement du sondage..." />}>
        <CiprelSondageContent
          variant={variant}
          onClose={onClose}
          onNavigate={onNavigate}
        />
      </Suspense>
    )
  }

  if (selectedSurvey === 'ux') {
    return (
      <Suspense fallback={<LoadingScreen message="Chargement du sondage..." />}>
        <CiprelUXSurveyContent
          variant={variant}
          onClose={onClose}
          onNavigate={onNavigate}
        />
      </Suspense>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-ciprel-black mb-4">
            Choisissez votre sondage
          </h2>
          <p className="text-gray-600 text-lg">
            Votre avis compte ! Sélectionnez le sondage que vous souhaitez remplir.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sondage d'Opinion */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-ciprel-orange-400 h-full flex flex-col"
              onClick={() => setSelectedSurvey('opinion')}
            >
              <div className="flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-ciprel-orange-400 to-ciprel-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-ciprel-black mb-3">
                  Sondage d'Opinion
                </h3>

                <p className="text-gray-600 mb-4">
                  Partagez votre point de vue sur la démarche compétence, vos attentes et vos inquiétudes.
                </p>

                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-ciprel-orange-600 mr-2">•</span>
                    <span>Connaissance de la démarche compétence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ciprel-orange-600 mr-2">•</span>
                    <span>Bénéfices attendus pour CIPREL</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ciprel-orange-600 mr-2">•</span>
                    <span>Vos attentes personnelles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ciprel-orange-600 mr-2">•</span>
                    <span>Besoins en information</span>
                  </li>
                </ul>

                <div className="inline-flex items-center px-3 py-1 bg-ciprel-orange-100 text-ciprel-orange-800 rounded-full text-xs font-semibold">
                  6 questions • ~5 min
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-ciprel-orange-600 font-semibold">
                <span>Commencer ce sondage</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Card>
          </motion.div>

          {/* Sondage UX */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-ciprel-green-400 h-full flex flex-col"
              onClick={() => setSelectedSurvey('ux')}
            >
              <div className="flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-ciprel-green-400 to-ciprel-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-ciprel-black mb-3">
                  Sondage Expérience Utilisateur
                </h3>

                <p className="text-gray-600 mb-4">
                  Aidez-nous à améliorer la plateforme en partageant votre expérience de navigation et d'utilisation.
                </p>

                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-ciprel-green-600 mr-2">•</span>
                    <span>Facilité de navigation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ciprel-green-600 mr-2">•</span>
                    <span>Design et attractivité</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ciprel-green-600 mr-2">•</span>
                    <span>Fonctionnalités utiles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ciprel-green-600 mr-2">•</span>
                    <span>Suggestions d'amélioration</span>
                  </li>
                </ul>

                <div className="inline-flex items-center px-3 py-1 bg-ciprel-green-100 text-ciprel-green-800 rounded-full text-xs font-semibold">
                  10 questions • ~7 min
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-ciprel-green-600 font-semibold">
                <span>Commencer ce sondage</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
