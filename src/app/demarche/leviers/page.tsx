'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase/client'
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft, Zap, Target, Users, GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LeviersPage() {
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
        .eq('section_id', 'leviers')
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
          section_id: 'leviers',
          section_title: 'Leviers d\'Action',
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
          <div className="p-3 bg-ciprel-orange-100 rounded-lg">
            <Zap className="h-8 w-8 text-ciprel-orange-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Leviers d'Action
            </h1>
            <p className="text-gray-600 mt-2">Section 4 - Les outils pour développer les compétences</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div className="p-8">
          <div className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-semibold text-ciprel-orange-700 mb-4">
              Activer le développement des compétences
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Les leviers d'action sont les moyens concrets à disposition pour développer,
              renforcer et valoriser les compétences au sein de CIPREL.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-gradient-to-br from-ciprel-green-50 to-white rounded-lg p-6 border border-ciprel-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-ciprel-green-100 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-ciprel-green-600" />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900">Formation</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Formations présentielles et à distance</li>
                  <li>• E-learning et modules interactifs</li>
                  <li>• Certifications professionnelles</li>
                  <li>• Formations sur mesure</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-ciprel-blue-50 to-white rounded-lg p-6 border border-ciprel-blue-light">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-ciprel-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-ciprel-blue" />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900">Accompagnement</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Coaching individuel</li>
                  <li>• Mentorat et tutorat</li>
                  <li>• Communautés de pratique</li>
                  <li>• Retours d'expérience</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-ciprel-orange-50 to-white rounded-lg p-6 border border-ciprel-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-ciprel-orange-100 rounded-lg">
                    <Target className="h-6 w-6 text-ciprel-orange-600" />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900">Mise en pratique</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Missions transverses</li>
                  <li>• Projets d'innovation</li>
                  <li>• Rotation de poste</li>
                  <li>• Challenges et hackathons</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900">Évaluation</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Entretiens annuels</li>
                  <li>• Évaluations 360°</li>
                  <li>• Auto-évaluations</li>
                  <li>• Feedbacks continus</li>
                </ul>
              </div>
            </div>

            <div className="bg-ciprel-orange-50 rounded-lg p-6 border border-ciprel-orange-200 my-6">
              <h4 className="font-semibold text-lg text-ciprel-orange-800 mb-3">
                Approche intégrée
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                L'efficacité de la démarche compétence repose sur l'utilisation combinée
                et cohérente de ces différents leviers. Chaque collaborateur bénéficie
                d'un parcours personnalisé qui combine formation, accompagnement, mise en
                pratique et évaluation régulière.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <Link
          href="/demarche/synoptique"
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
          href="/demarche/ressources"
          className="bg-ciprel-orange-600 text-white px-6 py-3 rounded-lg hover:bg-ciprel-orange-700 transition-colors flex items-center gap-2"
        >
          Section suivante
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}
