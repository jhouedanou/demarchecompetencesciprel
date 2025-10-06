'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/lib/supabase/client'
import { supabase } from '@/lib/supabase/client'
import { BookOpen, CheckCircle, ArrowLeft, FileText, Video, Link as LinkIcon, Mail, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RessourcesPage() {
  const { user } = useUser()
  const router = useRouter()
  const [readingTime, setReadingTime] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const checkCompletion = async () => {
      const { data } = await supabase
        .from('user_reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('section_id', 'ressources')
        .single()

      if (data) {
        setIsCompleted(true)
      }
    }

    checkCompletion()

    const interval = setInterval(() => {
      setReadingTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [user, router])

  const markAsComplete = async () => {
    if (!user || isCompleted || isSaving) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('user_reading_progress')
        .upsert({
          user_id: user.id,
          section_id: 'ressources',
          section_title: 'Ressources et Support',
          reading_time_seconds: readingTime,
          completed_at: new Date().toISOString()
        })

      if (!error) {
        setIsCompleted(true)
      }
    } catch (error) {
      console.error('Error marking section as complete:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-ciprel-green-100 rounded-lg">
            <BookOpen className="h-8 w-8 text-ciprel-green-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Ressources et Support
            </h1>
            <p className="text-gray-600 mt-2">Section 5 - Outils et accompagnement disponibles</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div className="p-8">
          <div className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-semibold text-ciprel-green-700 mb-4">
              Vos ressources pour réussir
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              CIPREL met à votre disposition un ensemble de ressources et de supports
              pour faciliter votre parcours de développement des compétences.
            </p>

            <div className="space-y-4 my-8">
              <div className="bg-white rounded-lg p-6 border-2 border-ciprel-green-200 hover:border-ciprel-green-400 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-ciprel-green-100 rounded-lg flex-shrink-0">
                    <FileText className="h-6 w-6 text-ciprel-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">
                      Documentation
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Guides, référentiels de compétences, fiches pratiques et procédures
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Guide de la démarche compétence (version complète)</li>
                      <li>• Référentiel des métiers et compétences CIPREL</li>
                      <li>• Fiches techniques par domaine d'activité</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-ciprel-blue-light hover:border-ciprel-blue transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-ciprel-blue-100 rounded-lg flex-shrink-0">
                    <Video className="h-6 w-6 text-ciprel-blue" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">
                      Formations en ligne
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Modules e-learning, vidéos tutorielles et webinaires
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Plateforme de formation continue</li>
                      <li>• Bibliothèque de vidéos pédagogiques</li>
                      <li>• Sessions de formation interactives</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-ciprel-orange-200 hover:border-ciprel-orange-400 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-ciprel-orange-100 rounded-lg flex-shrink-0">
                    <LinkIcon className="h-6 w-6 text-ciprel-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">
                      Outils digitaux
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Plateformes et applications pour gérer votre parcours
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Portail de gestion des compétences</li>
                      <li>• Outil d'auto-évaluation</li>
                      <li>• Planning de formations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-ciprel-green-50 to-ciprel-blue-50 rounded-lg p-6 border border-ciprel-green-200 my-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Besoin d'accompagnement ?
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                L'équipe Ressources Humaines est à votre disposition pour vous accompagner
                dans votre parcours de développement des compétences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <Mail className="h-5 w-5 text-ciprel-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">rh@ciprel.ci</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <Phone className="h-5 w-5 text-ciprel-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600">Téléphone</p>
                    <p className="text-sm font-medium text-gray-900">+225 XX XX XX XX</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ciprel-green-50 rounded-lg p-6 border border-ciprel-green-200">
              <h4 className="font-semibold text-lg text-ciprel-green-800 mb-3">
                Félicitations ! 🎉
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Vous avez terminé l'ensemble des sections de la démarche compétence.
                Vous êtes maintenant prêt à passer au quiz d'évaluation pour valider
                vos connaissances et accéder aux sondages.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <Link
          href="/demarche/leviers"
          className="text-ciprel-orange-600 hover:text-ciprel-orange-700 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          Section précédente
        </Link>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <>
              <CheckCircle className="h-6 w-6 text-ciprel-green-600" />
              <span className="text-ciprel-green-700 font-medium">Section terminée !</span>
            </>
          ) : (
            <>
              <span className="text-gray-700">Temps : {Math.floor(readingTime / 60)} min {readingTime % 60} s</span>
              <button
                onClick={markAsComplete}
                disabled={isSaving}
                className="bg-ciprel-green-600 text-white px-6 py-3 rounded-lg hover:bg-ciprel-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? 'Enregistrement...' : 'Marquer comme terminé'}
                <CheckCircle className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <Link
          href="/competences/quiz-introduction"
          className="bg-ciprel-green-600 text-white px-6 py-3 rounded-lg hover:bg-ciprel-green-700 transition-colors flex items-center gap-2 shadow-md"
        >
          Accéder au quiz
          <CheckCircle className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}
