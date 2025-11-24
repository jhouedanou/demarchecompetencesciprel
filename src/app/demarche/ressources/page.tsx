'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase/client'
import { BookOpen, CheckCircle, ArrowLeft, FileText, Video, Link as LinkIcon, Mail, Phone, Download, HelpCircle, Building2, Users } from 'lucide-react'
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

      {/* Section introduction */}
      <div className="bg-ciprel-green-50 rounded-xl border-l-4 border-ciprel-green-500 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-ciprel-green-700 mb-3">
          Vos ressources pour réussir
        </h2>
        <p className="text-gray-700 leading-relaxed">
          CIPREL met à votre disposition un ensemble de ressources et de supports
          pour faciliter votre parcours de développement des compétences.
        </p>
      </div>

      {/* Carte principale du guide - Layout 2 colonnes */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-12 p-8 md:p-12">
        <div className="mb-6">
          <div className="inline-flex items-center bg-ciprel-green-100 text-ciprel-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4 mr-2" />
            Document essentiel
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Le Guide de la Démarche Compétence CIPREL
          </h2>
          <p className="text-gray-600">
            Fournir aux employés une vue d'ensemble sur le processus de gestion des compétences, son importance, ses objectifs et son déploiement.
          </p>
        </div>

        <div className="grid lg:grid-cols-[350px,1fr] gap-8">
          {/* Visuel du guide (gauche) */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-72 h-96 bg-gradient-to-br from-ciprel-green-500 to-ciprel-green-700 rounded-xl shadow-2xl border-4 border-white flex flex-col items-center justify-center p-8 transform hover:scale-105 transition-transform duration-300">
                <BookOpen className="h-32 w-32 text-white mb-6" />
                <div className="text-white text-center">
                  <h3 className="text-2xl font-bold mb-2">Guide Complet</h3>
                  <p className="text-ciprel-green-100">Démarche Compétence CIPREL</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-ciprel-orange-500 text-white px-5 py-3 rounded-full font-bold shadow-lg text-lg">
                📘 PDF
              </div>
            </div>
          </div>

          {/* Contenu complet (droite) */}
          <div className="space-y-8">
            {/* Contenu du guide */}
            <div>
              <h3 className="text-2xl font-bold text-ciprel-black mb-6 flex items-center">
                <div className="bg-ciprel-green-100 p-2 rounded-lg mr-3">
                  <BookOpen className="h-6 w-6 text-ciprel-green-600" />
                </div>
                Contenu du guide
              </h3>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start group">
                  <div className="bg-ciprel-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-200">
                    1
                  </div>
                  <div>
                    <span className="text-gray-800 font-semibold text-lg">Présentation du concept</span>
                    <p className="text-gray-600 text-sm mt-1">Définition et enjeux de la démarche compétence</p>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="bg-ciprel-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-200">
                    2
                  </div>
                  <div>
                    <span className="text-gray-800 font-semibold text-lg">Objectifs de la démarche</span>
                    <p className="text-gray-600 text-sm mt-1">Bénéfices pour CIPREL et les collaborateurs</p>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="bg-ciprel-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-200">
                    3
                  </div>
                  <div>
                    <span className="text-gray-800 font-semibold text-lg">Étapes de la démarche</span>
                    <p className="text-gray-600 text-sm mt-1">Processus complet étape par étape</p>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="bg-ciprel-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-200">
                    4
                  </div>
                  <div>
                    <span className="text-gray-800 font-semibold text-lg">Rôles et responsabilités</span>
                    <p className="text-gray-600 text-sm mt-1">Qui fait quoi dans l'organisation</p>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="bg-ciprel-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-200">
                    5
                  </div>
                  <div>
                    <span className="text-gray-800 font-semibold text-lg">Foire aux questions (FAQ)</span>
                    <p className="text-gray-600 text-sm mt-1">Réponses aux questions fréquentes</p>
                  </div>
                </li>
              </ul>
              <a
                href="/Guide_démarche_compétence.pdf"
                download
                className="bg-ciprel-green-600 text-white px-6 py-4 rounded-lg hover:bg-ciprel-green-700 font-bold text-lg w-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="h-6 w-6 mr-3" />
                Télécharger le guide complet (PDF)
              </a>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  📧 Également disponible par email et sur l'intranet
                </p>
              </div>
            </div>

            {/* Définition */}
            <div className="bg-ciprel-green-50 rounded-xl border-l-4 border-ciprel-green-500 p-6">
              <h3 className="text-xl font-bold text-ciprel-black mb-4 flex items-center">
                <div className="bg-ciprel-green-100 p-2 rounded-lg mr-3">
                  <HelpCircle className="h-6 w-6 text-ciprel-green-600" />
                </div>
                Qu'est-ce que la démarche compétence ?
              </h3>
              <div className="space-y-3 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  Les compétences correspondent à un ensemble de{' '}
                  <strong className="text-ciprel-green-700">connaissance (les savoirs)</strong>,{' '}
                  <strong className="text-ciprel-orange-600">savoir-faire</strong> (habilité ou compétences technique propre au métier),{' '}
                  <strong className="text-ciprel-green-600">savoir-être</strong> (habilité ou caractéristique comportementale), observables et mesurables qui contribuent au succès du rendement au travail.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  La démarche compétence c'est donc un ensemble de <strong>processus et de procédures</strong> définis par l'entreprise pour développer les compétences de ses salariés, il s'agit en d'autres termes de créer, transférer, assembler et intégrer le capital compétence disponible en interne.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-ciprel-green-200">
                  <div className="flex items-center mb-2">
                    <Building2 className="h-5 w-5 text-ciprel-green-600 mr-2" />
                    <h4 className="font-bold text-ciprel-green-700">Pour CIPREL</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Accroître la <strong>performance économique et sociale</strong> en préservant les compétences de l'entreprise et l'expertise interne
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-ciprel-orange-200">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-ciprel-orange-600 mr-2" />
                    <h4 className="font-bold text-ciprel-orange-600">Pour les collaborateurs</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Accroître et entretenir leur <strong>capital compétences</strong> et les valoriser dans le cadre d'un plan de développement professionnel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Autres ressources */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div className="p-8">
          <div className="space-y-4">
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
