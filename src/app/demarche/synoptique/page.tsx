'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/lib/supabase/client'
import { supabase } from '@/lib/supabase/client'
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft, Network } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SynoptiquePage() {
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
        .eq('section_id', 'synoptique')
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
          section_id: 'synoptique',
          section_title: 'Vision Synoptique',
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
          <div className="p-3 bg-ciprel-blue-100 rounded-lg">
            <Network className="h-8 w-8 text-ciprel-blue" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Vision Synoptique
            </h1>
            <p className="text-gray-600 mt-2">Section 3 - Vue d'ensemble du système de compétences</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div className="p-8">
          <div className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-semibold text-ciprel-blue mb-4">
              Une vue d'ensemble intégrée
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              La vision synoptique permet d'appréhender le système de compétences dans
              sa globalité, en identifiant les liens, les flux et les dynamiques qui le composent.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Les dimensions de la vision synoptique
            </h3>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-ciprel-blue mr-3 mt-1 flex-shrink-0" />
                <span><strong>Cartographie des compétences :</strong> Visualiser l'ensemble des compétences organisationnelles</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-ciprel-blue mr-3 mt-1 flex-shrink-0" />
                <span><strong>Niveaux de maîtrise :</strong> Comprendre les échelons de progression</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-ciprel-blue mr-3 mt-1 flex-shrink-0" />
                <span><strong>Parcours d'évolution :</strong> Identifier les chemins de développement possibles</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-ciprel-blue mr-3 mt-1 flex-shrink-0" />
                <span><strong>Besoins stratégiques :</strong> Aligner les compétences avec les objectifs de l'entreprise</span>
              </li>
            </ul>

            <div className="bg-ciprel-blue-50 rounded-lg p-6 border border-ciprel-blue-light my-6">
              <h4 className="font-semibold text-lg text-ciprel-blue-dark mb-3">
                Bénéfices de la vision synoptique
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Une vision d'ensemble permet de :
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Identifier les lacunes et opportunités de développement</li>
                <li>• Optimiser l'allocation des ressources de formation</li>
                <li>• Faciliter la planification stratégique des talents</li>
                <li>• Renforcer la cohérence des parcours professionnels</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <Link
          href="/demarche/dialectique"
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
          href="/demarche/leviers"
          className="bg-ciprel-orange-600 text-white px-6 py-3 rounded-lg hover:bg-ciprel-orange-700 transition-colors flex items-center gap-2"
        >
          Section suivante
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}
