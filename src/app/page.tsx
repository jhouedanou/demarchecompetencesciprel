'use client'

import { useState, useEffect, useRef } from 'react'
// Navigation supprimée selon demande utilisateur
import ProgressTracker from '@/components/reading/ProgressTracker'
import { SectionModal } from '@/components/modals/SectionModal'
import { DialectiqueContent } from '@/components/sections/DialectiqueContent'
import { SynoptiqueContent } from '@/components/sections/SynoptiqueContent'
import { LeviersContent } from '@/components/sections/LeviersContent'
import { RessourcesContent } from '@/components/sections/RessourcesContent'
import { useUser } from '@/lib/supabase/client'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { Building2, Users, Zap, BookOpen, Award, TrendingUp, Lock, HelpCircle } from 'lucide-react'
import Link from 'next/link'

type SectionType = 'dialectique' | 'synoptique' | 'leviers' | 'ressources' | null

export default function HomePage() {
  const { user } = useUser()
  const { markSectionCompleted, sections, canAccessQuiz } = useReadingProgress(user)
  const [activeModal, setActiveModal] = useState<SectionType>(null)
  const startTime = useRef<number>(Date.now())

  // Mark homepage as read when component unmounts
  useEffect(() => {
    startTime.current = Date.now()

    return () => {
      if (user) {
        const readingTime = Math.round((Date.now() - startTime.current) / 1000)
        markSectionCompleted('accueil', readingTime)
      }
    }
  }, [user, markSectionCompleted])

  const getSectionStatus = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    return section?.completed || false
  }

  const openModal = (section: SectionType) => {
    setActiveModal(section)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              {/* Header */}
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="bg-gradient-to-r from-ciprel-green-700 to-ciprel-green-600 text-white p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-white p-3 rounded-full">
                      <Building2 className="h-8 w-8 text-ciprel-green-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Guide de la démarche compétence</h1>
                      <p className="text-ciprel-green-100">CIPREL - 30 ans d'expérience</p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <Zap className="w-full h-full" />
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="p-8">
                {/* Hero message */}
                <div className="mb-8">
                  <div className="relative h-48 bg-gradient-to-r from-ciprel-green-50 to-ciprel-orange-50 rounded-lg mb-6 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-8">
                        <img
                          src="/images/logo.webp"
                          alt="Logo CIPREL"
                          className="h-20 w-auto object-contain drop-shadow"
                        />
                        <img
                          src="/images/30ans.png"
                          alt="30 ans CIPREL"
                          className="h-20 w-auto object-contain drop-shadow"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-ciprel-green-50 border-l-4 border-ciprel-green-400 p-6 rounded-r-lg">
                    <div className="flex items-start">
                      <div>
                        <p className="text-ciprel-green-800 leading-relaxed">
                          Cette plateforme vous accompagne dans la découverte et la compréhension de notre démarche compétence,
                          un processus essentiel pour le développement de vos talents et la performance de notre organisation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Sections Navigation */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Découvrir la démarche compétence
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => openModal('dialectique')}
                      className={`block p-4 rounded-lg border text-left transition-all duration-200 ${
                        getSectionStatus('dialectique')
                          ? 'bg-ciprel-green-50 border-ciprel-green-300 shadow-md'
                          : 'bg-white border-gray-200 hover:border-ciprel-green-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">1. Dialectique de la démarche</h4>
                        {getSectionStatus('dialectique') && (
                          <div className="w-5 h-5 bg-ciprel-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">Découvrez la définition et les bénéfices</p>
                    </button>

                    <button
                      onClick={() => openModal('synoptique')}
                      className={`block p-4 rounded-lg border text-left transition-all duration-200 ${
                        getSectionStatus('synoptique')
                          ? 'bg-ciprel-green-50 border-ciprel-green-300 shadow-md'
                          : 'bg-white border-gray-200 hover:border-ciprel-green-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">2. Synoptique des étapes</h4>
                        {getSectionStatus('synoptique') && (
                          <div className="w-5 h-5 bg-ciprel-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">Les 5 étapes cycliques détaillées</p>
                    </button>

                    <button
                      onClick={() => openModal('leviers')}
                      className={`block p-4 rounded-lg border text-left transition-all duration-200 ${
                        getSectionStatus('leviers')
                          ? 'bg-ciprel-green-50 border-ciprel-green-300 shadow-md'
                          : 'bg-white border-gray-200 hover:border-ciprel-green-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">3. Facteurs clés de succès</h4>
                        {getSectionStatus('leviers') && (
                          <div className="w-5 h-5 bg-ciprel-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">Les 4 leviers essentiels</p>
                    </button>

                    <button
                      onClick={() => openModal('ressources')}
                      className={`block p-4 rounded-lg border text-left transition-all duration-200 ${
                        getSectionStatus('ressources')
                          ? 'bg-ciprel-green-50 border-ciprel-green-300 shadow-md'
                          : 'bg-white border-gray-200 hover:border-ciprel-green-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">4. Ressources documentaires</h4>
                        {getSectionStatus('ressources') && (
                          <div className="w-5 h-5 bg-ciprel-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">Guides et documents téléchargeables</p>
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-ciprel-green-50 border border-ciprel-green-200 rounded-lg">
                    <p className="text-ciprel-green-800 text-sm">
                      <strong>📚 Important :</strong> Vous devez lire toutes les sections pour débloquer l'accès aux quiz et sondages.
                    </p>
                  </div>

                  {/* Quiz and Survey Access */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user && canAccessQuiz() ? (
                      <Link
                        href="/competences/quiz-introduction"
                        className="block p-4 bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 text-white rounded-lg hover:from-ciprel-green-600 hover:to-ciprel-green-700 transition-all duration-200 shadow-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Quiz d'introduction</h4>
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <p className="text-ciprel-green-100 text-sm">Testez vos connaissances</p>
                      </Link>
                    ) : (
                      <div className="block p-4 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Quiz d'introduction</h4>
                          <Lock className="h-5 w-5" />
                        </div>
                        <p className="text-gray-400 text-sm">Lisez toutes les sections d'abord</p>
                      </div>
                    )}

                    {user && canAccessQuiz() ? (
                      <Link
                        href="/sondage"
                        className="block p-4 bg-gradient-to-r from-ciprel-orange-500 to-ciprel-orange-600 text-white rounded-lg hover:from-ciprel-orange-600 hover:to-ciprel-orange-700 transition-all duration-200 shadow-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Sondage d'opinion</h4>
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <p className="text-ciprel-orange-100 text-sm">Partagez votre avis</p>
                      </Link>
                    ) : (
                      <div className="block p-4 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Sondage d'opinion</h4>
                          <Lock className="h-5 w-5" />
                        </div>
                        <p className="text-gray-400 text-sm">Lisez toutes les sections d'abord</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {user && <ProgressTracker />}
              {!user && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Connectez-vous pour suivre votre progression
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Créez un compte pour accéder aux quiz et suivre votre progression.
                  </p>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('open-login'))
                      }
                    }}
                    className="w-full text-center bg-ciprel-green-600 text-white px-4 py-2 rounded-lg hover:bg-ciprel-green-700 transition-colors"
                  >
                    Se connecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SectionModal
        isOpen={activeModal === 'dialectique'}
        onClose={closeModal}
        title="Dialectique de la démarche compétence"
        sectionId="dialectique"
      >
        <DialectiqueContent />
      </SectionModal>

      <SectionModal
        isOpen={activeModal === 'synoptique'}
        onClose={closeModal}
        title="Synoptique de la démarche compétence"
        sectionId="synoptique"
      >
        <SynoptiqueContent />
      </SectionModal>

      <SectionModal
        isOpen={activeModal === 'leviers'}
        onClose={closeModal}
        title="Leviers et facteurs clés de succès"
        sectionId="leviers"
      >
        <LeviersContent />
      </SectionModal>

      <SectionModal
        isOpen={activeModal === 'ressources'}
        onClose={closeModal}
        title="Ressources documentaires"
        sectionId="ressources"
      >
        <RessourcesContent />
      </SectionModal>
    </div>
  )
}