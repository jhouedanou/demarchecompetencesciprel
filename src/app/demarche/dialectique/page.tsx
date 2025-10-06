'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/lib/supabase/client'
import { supabase } from '@/lib/supabase/client'
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DialectiquePage() {
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
        .eq('section_id', 'dialectique')
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
          section_id: 'dialectique',
          section_title: 'Approche Dialectique',
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
              Approche Dialectique
            </h1>
            <p className="text-gray-600 mt-2">Section 2 - Les interactions entre compétences</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div className="p-8">
          <div className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-semibold text-ciprel-green-700 mb-4">
              Comprendre les interactions
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              L'approche dialectique de la démarche compétence met en lumière les relations
              et interactions entre les différentes compétences au sein de l'organisation.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Les principes clés
            </h3>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-ciprel-green-600 mr-3 mt-1 flex-shrink-0" />
                <span>Les compétences ne sont pas isolées mais interconnectées</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-ciprel-green-600 mr-3 mt-1 flex-shrink-0" />
                <span>Comprendre les synergies entre compétences complémentaires</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-ciprel-green-600 mr-3 mt-1 flex-shrink-0" />
                <span>Identifier les dépendances et prérequis entre compétences</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-ciprel-green-600 mr-3 mt-1 flex-shrink-0" />
                <span>Favoriser le développement harmonieux des compétences</span>
              </li>
            </ul>

            <div className="bg-ciprel-green-50 rounded-lg p-6 border border-ciprel-green-200 my-6">
              <h4 className="font-semibold text-lg text-ciprel-green-800 mb-3">
                Exemple pratique
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                La compétence "Leadership" interagit avec "Communication", "Gestion de projet"
                et "Intelligence émotionnelle". Le développement de l'une renforce les autres,
                créant un effet multiplicateur sur la performance globale.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <Link
          href="/demarche/introduction"
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
          href="/demarche/synoptique"
          className="bg-ciprel-orange-600 text-white px-6 py-3 rounded-lg hover:bg-ciprel-orange-700 transition-colors flex items-center gap-2"
        >
          Section suivante
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}
