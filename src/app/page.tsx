'use client'

import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Mousewheel } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import ProgressTracker from '@/components/reading/ProgressTracker'
import { useUser } from '@/lib/supabase/client'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { useQuizStore } from '@/stores/quiz-store'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { ContentSkeleton } from '@/components/ui/content-skeleton'

// Lazy loading des composants lourds
const SectionModal = lazy(() => import('@/components/modals/SectionModal').then(m => ({ default: m.SectionModal })))
const IntroductionContent = lazy(() => import('@/components/sections/IntroductionContent').then(m => ({ default: m.IntroductionContent })))
const DialectiqueContent = lazy(() => import('@/components/sections/DialectiqueContent').then(m => ({ default: m.DialectiqueContent })))
const SynoptiqueContent = lazy(() => import('@/components/sections/SynoptiqueContent').then(m => ({ default: m.SynoptiqueContent })))
const LeviersContent = lazy(() => import('@/components/sections/LeviersContent').then(m => ({ default: m.LeviersContent })))
const RessourcesContent = lazy(() => import('@/components/sections/RessourcesContent').then(m => ({ default: m.RessourcesContent })))
const QuizEngine = lazy(() => import('@/components/quiz/QuizEngine').then(m => ({ default: m.QuizEngine })))
const CiprelSondageContent = lazy(() => import('@/components/ciprel/CiprelSondageContent').then(m => ({ default: m.CiprelSondageContent })))
const AuthModal = lazy(() => import('@/components/auth/AuthModal').then(m => ({ default: m.AuthModal })))
const LogoutModal = lazy(() => import('@/components/auth/LogoutModal').then(m => ({ default: m.LogoutModal })))
const VideoPlayerModal = lazy(() => import('@/components/modals/VideoPlayerModal').then(m => ({ default: m.VideoPlayerModal })))
import {
  Building2,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Lock,
  HelpCircle,
  Download,
  Target,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Menu,
  X
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

type SectionType = 'introduction' | 'dialectique' | 'synoptique' | 'leviers' | 'ressources' | null

const SLIDE_TITLES = [
  'Accueil',
  'Définition',
  'Guide',
  'Objectifs',
  'Modules',
  'Vidéos',
  'Plateforme'
]

const PRACTICE_VIDEOS = [
  {
    id: 1,
    title: 'Étude de cas 1',
    description: 'Découvrez une situation métier illustrant la mise en œuvre de la démarche compétences.',
    url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  },
  {
    id: 2,
    title: 'Étude de cas 2',
    description: 'Découvrez une situation métier illustrant la mise en œuvre de la démarche compétences.',
    url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  },
  {
    id: 3,
    title: 'Étude de cas 3',
    description: 'Découvrez une situation métier illustrant la mise en œuvre de la démarche compétences.',
    url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  },
  {
    id: 4,
    title: 'Étude de cas 4',
    description: 'Découvrez une situation métier illustrant la mise en œuvre de la démarche compétences.',
    url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  },
]

export default function HomePage() {
  const { user, loading } = useUser()
  const { sections, canAccessQuiz, markSectionCompleted } = useReadingProgress(user)
  const [activeModal, setActiveModal] = useState<SectionType>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const [surveyModalOpen, setSurveyModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [initialVideoIndex, setInitialVideoIndex] = useState(0)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)
  const totalSlides = 7
  const practiceVideos = PRACTICE_VIDEOS
  const resetQuiz = useQuizStore(state => state.resetQuiz)
  const router = useRouter()

  // Écouter les événements pour ouvrir les modaux
  useEffect(() => {
    const handleOpenLogin = () => setAuthModalOpen(true)
    const handleOpenLogout = () => setLogoutModalOpen(true)

    window.addEventListener('open-login', handleOpenLogin)
    window.addEventListener('open-logout', handleOpenLogout)

    return () => {
      window.removeEventListener('open-login', handleOpenLogin)
      window.removeEventListener('open-logout', handleOpenLogout)
    }
  }, [])

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

  const handleSlideTo = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index)
    }
  }

  const goPrev = () => {
    swiperRef.current?.slidePrev()
  }

  const goNext = () => {
    swiperRef.current?.slideNext()
  }

  const openQuizModal = () => {
    resetQuiz()
    setQuizModalOpen(true)
  }

  const closeQuizModal = () => {
    setQuizModalOpen(false)
    resetQuiz()
  }

  const handleSurveyNavigate = (path: string) => {
    setSurveyModalOpen(false)
    router.push(path)
  }

  const openVideoModal = async (videoIndex: number = 0) => {
    setInitialVideoIndex(videoIndex)
    setVideoModalOpen(true)
    
    // Marquer la section "videos" comme complétée
    if (user && markSectionCompleted) {
      await markSectionCompleted('videos', 0)
    }
  }

  const closeVideoModal = () => {
    setVideoModalOpen(false)
  }

  // Afficher l'écran de chargement pendant la vérification de l'authentification
  if (loading) {
    return <LoadingScreen message="Vérification de votre session..." />
  }

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-row">
      {/* Hamburger Button - Mobile/Tablet only */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-ciprel-orange-600 text-white p-3 rounded-lg shadow-lg hover:bg-ciprel-orange-700 transition-colors"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay - Mobile/Tablet only */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - 30% à gauche */}
      <aside className={`
        w-[280px] lg:w-[30%]
        min-h-screen
        border-r border-gray-200
        bg-white/95 backdrop-blur-sm
        fixed lg:sticky
        top-0
        h-screen
        overflow-y-auto
        z-40
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {user && (
            <ProgressTracker
              onLinkClick={() => setSidebarOpen(false)}
              onSectionClick={(sectionId) => {
                openModal(sectionId as SectionType)
              }}
            />
          )}
          {!user && (
            <div className="bg-white rounded-lg shadow-lg border p-6">
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
                className="w-full text-center bg-ciprel-green-600 text-white px-4 py-2 rounded-lg hover:bg-ciprel-green-700 transition-colors font-semibold"
              >
                Se connecter
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content - 70% - avec padding left sur mobile */}
      <div className="w-full lg:w-[70%] lg:ml-0">
        {/* Desktop: Swiper */}
        <Swiper
          className="homepage-swiper h-screen hidden lg:block"
          direction="vertical"
          slidesPerView={1}
          speed={650}
          mousewheel={{ releaseOnEdges: true }}
          pagination={{ 
            clickable: true,
            renderBullet: (index: number, className: string) => {
              return `<span class="${className} swiper-pagination-bullet-custom group" data-slide-title="${SLIDE_TITLES[index] || ''}">
                <span class="tooltip-slide">${SLIDE_TITLES[index] || ''}</span>
              </span>`
            }
          }}
          modules={[Pagination, Mousewheel]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        >
        <SwiperSlide>
          {/* HERO SECTION */}
        <section className="h-full overflow-y-auto bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50">
          <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-16">
          {/* Logo CIPREL + Badge 30 ans */}
          <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
            <img src="/images/logo.webp" alt="CIPREL" className="h-20 w-auto object-contain drop-shadow-lg" />
            <img src="/images/30ans.png" alt="30 ans CIPREL" className="h-20 w-auto object-contain drop-shadow-lg" />
          </div>

          {/* Titre principal */}
          <h1 className="text-4xl md:text-5xl font-bold text-center text-ciprel-black mb-4">
            La Démarche Compétence CIPREL
          </h1>

          {/* Sous-titre */}
          <h2 className="text-xl md:text-2xl text-center text-gray-700 mb-8 font-light">
            Développez vos talents, construisez votre avenir professionnel
          </h2>

          {/* Contexte et enjeux - Slide 3 */}
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-8 md:p-10 mb-8 border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Véritable <strong>boussole du management stratégique</strong>, la démarche compétence se veut être un outil d'alignement des besoins en compétences individuelles et collectives avec les objectifs organisationnels et d'apprentissage continu.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ainsi et conscient de l'importance de cette gestion dynamique et efficiente du capital humain, <strong>CIPREL s'est engagée dans une démarche compétence</strong> ayant pour objectif l'adéquation profil-poste et ce en parfait alignement avec la stratégie du groupe ERANOVE.
              </p>
              <p className="text-gray-700 leading-relaxed">
                C'est dans cette optique que la direction des ressources humaines a opté pour une démarche de déploiement basée sur <strong>la communication interne et l'animation</strong> afin d'assurer l'ancrage du contenu de la démarche compétence ainsi que son appropriation effective par toutes les parties prenantes internes.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => handleSlideTo(2)}
              className="bg-ciprel-green-600 text-white px-8 py-4 rounded-lg hover:bg-ciprel-green-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Découvrir le guide complet
            </button>
          </div>
        </div>
        </section>
        </SwiperSlide>

        <SwiperSlide>
          {/* SECTION DÉFINITION - Slide 2 */}
        <section className="h-full overflow-y-auto bg-gradient-to-br from-ciprel-green-50 via-white to-gray-50">
          <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-16">
              {/* Définition */}
              <div className="bg-white rounded-xl shadow-lg border-l-4 border-ciprel-green-500 p-8 md:p-10">
                <h3 className="text-2xl font-bold text-ciprel-black mb-6 flex items-center">
                  <div className="bg-ciprel-green-100 p-2 rounded-lg mr-3">
                    <HelpCircle className="h-7 w-7 text-ciprel-green-600" />
                  </div>
                  Qu'est-ce que la démarche compétence ?
                </h3>


                <div className="space-y-4 mb-8">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Les compétences correspondent à un ensemble de <strong className="text-ciprel-green-700">connaissance (les savoirs)</strong>,
                    <strong className="text-ciprel-orange-600"> savoir-faire</strong> (habilité ou compétences technique propre au métier),
                    <strong className="text-ciprel-green-600"> savoir-être</strong> (habilité ou caractéristique comportementale),
                    observables et mesurables qui contribuent au succès du rendement au travail.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    La démarche compétence c'est donc un ensemble de <strong>processus et de procédures</strong> définis
                    par l'entreprise pour développer les compétences de ses salariés, il s'agit en d'autres
                    termes de créer, transférer, assembler et intégrer le capital compétence disponible en interne.
                  </p>
                </div>


                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-ciprel-green-50 to-white rounded-lg p-6 border border-ciprel-green-200">
                    <div className="flex items-center mb-3">
                      <Building2 className="h-6 w-6 text-ciprel-green-600 mr-2" />
                      <h4 className="font-bold text-ciprel-green-700 text-lg">Pour CIPREL</h4>
                    </div>
                    <p className="text-gray-700">
                      Accroître la <strong>performance économique et sociale</strong> en préservant les compétences
                      de l'entreprise et l'expertise interne
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-ciprel-orange-50 to-white rounded-lg p-6 border border-ciprel-orange-200">
                    <div className="flex items-center mb-3">
                      <Users className="h-6 w-6 text-ciprel-orange-600 mr-2" />
                      <h4 className="font-bold text-ciprel-orange-600 text-lg">Pour les collaborateurs</h4>
                    </div>
                    <p className="text-gray-700">
                      Accroître et entretenir leur <strong>capital compétences</strong> et les valoriser dans le cadre
                      d'un plan de développement professionnel
                    </p>
                  </div>
                </div>
              </div>
          </div>
        </section>
        </SwiperSlide>

        <SwiperSlide>
          {/* SECTION GUIDE - Slide 3 */}
        <section className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-ciprel-green-50">
          <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-20">
          {/* Badge Document essentiel */}
          <div className="flex justify-center mb-6">
            <span className="bg-ciprel-green-100 text-ciprel-green-800 px-6 py-3 rounded-full font-bold text-lg flex items-center shadow-md">
              <Award className="h-6 w-6 mr-2" />
              Document essentiel
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center text-ciprel-black mb-6">
            Le Guide de la Démarche Compétence CIPREL
          </h2>

          <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
            Fournir aux employés une <strong>vue d'ensemble</strong> sur le processus de gestion des compétences,
            son importance, ses objectifs et son déploiement.
          </p>

              {/* Carte principale du guide */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-12">
                <div className="grid gap-8 items-start p-8 md:p-12 md:grid-cols-[320px_minmax(0,1fr)]">
                  {/* Visuel du guide (gauche) */}
                  <div className="flex justify-center md:justify-start">
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

                  {/* Contenu du guide (droite) */}
                  <div className="md:pl-6">
                    <h3 className="text-2xl font-bold text-ciprel-black mb-8 flex items-center">
                      <div className="bg-ciprel-green-100 p-2 rounded-lg mr-3">
                        <BookOpen className="h-6 w-6 text-ciprel-green-600" />
                      </div>
                      Contenu du guide
                    </h3>

                    <ul className="space-y-5 mb-8">
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
                </div>
              </div>

             

          {/* CTA Button - Commencer le parcours */}
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => handleSlideTo(4)}
              className="bg-ciprel-orange-500 text-white px-8 py-4 rounded-lg hover:bg-ciprel-orange-600 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              <Target className="h-5 w-5 mr-2" />
              Commencer mon parcours
            </button>
          </div>
          </div>
        </section>
        </SwiperSlide>

        <SwiperSlide>
          {/* SECTION OBJECTIFS - Slide 4 */}
        <section className="h-full overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-16">
          <div className="text-center mb-12">
            <span className="bg-ciprel-green-100 text-ciprel-green-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
              Objectifs stratégiques
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
              Objectifs de la démarche
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Une vision commune pour l'entreprise et ses collaborateurs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pour CIPREL */}
            <div className="bg-gradient-to-br from-ciprel-green-50 to-white rounded-xl shadow-lg p-8 border-t-4 border-ciprel-green-500 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="bg-ciprel-green-100 p-3 rounded-lg mr-4">
                  <Building2 className="h-8 w-8 text-ciprel-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-ciprel-black">Pour CIPREL</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-ciprel-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Communiquer autour des compétences techniques et pratiques professionnelles fondamentales</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-ciprel-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Favoriser l'ancrage du contenu de la démarche compétence</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-ciprel-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Maintenir la dynamique autour des compétences, l'implication et la responsabilisation des salariés</span>
                </li>
              </ul>
            </div>

            {/* Pour le personnel */}
            <div className="bg-gradient-to-br from-ciprel-orange-50 to-white rounded-xl shadow-lg p-8 border-t-4 border-ciprel-orange-500 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="bg-ciprel-orange-100 p-3 rounded-lg mr-4">
                  <Users className="h-8 w-8 text-ciprel-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-ciprel-black">Pour le personnel</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-ciprel-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Comprendre le contenu de la démarche compétence, ses objectifs et les gains attendus</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-ciprel-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Maîtriser le requis en pratiques professionnelles et en compétences</span>
                </li>
              </ul>
            </div>
          </div>
          </div>
        </section>
        </SwiperSlide>

        <SwiperSlide>
          {/* SECTION MODULES - Slide 5 */}
        <section id="modules-section" className="h-full overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-16">
            <div className="text-center mb-12">
              <span className="bg-ciprel-orange-100 text-ciprel-orange-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                Parcours d'apprentissage
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
                Découvrir la démarche compétence
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                4 modules interactifs pour comprendre et maîtriser la démarche
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => openModal('dialectique')}
                className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${
                  getSectionStatus('dialectique')
                    ? 'bg-ciprel-green-50 border-ciprel-green-400 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-ciprel-green-400 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-ciprel-green-100 p-3 rounded-lg mr-3 group-hover:bg-ciprel-green-200 transition-colors">
                      <BookOpen className="h-6 w-6 text-ciprel-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">1. Dialectique de la démarche</h4>
                  </div>
                  {getSectionStatus('dialectique') && (
                    <div className="w-8 h-8 bg-ciprel-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-gray-600">Découvrez la définition et les bénéfices</p>
              </button>

              <button
                onClick={() => openModal('synoptique')}
                className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${
                  getSectionStatus('synoptique')
                    ? 'bg-ciprel-green-50 border-ciprel-green-400 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-ciprel-green-400 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-ciprel-green-100 p-3 rounded-lg mr-3 group-hover:bg-ciprel-green-200 transition-colors">
                      <Target className="h-6 w-6 text-ciprel-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">2. Synoptique des étapes</h4>
                  </div>
                  {getSectionStatus('synoptique') && (
                    <div className="w-8 h-8 bg-ciprel-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-gray-600">Les 5 étapes cycliques détaillées</p>
              </button>

              <button
                onClick={() => openModal('leviers')}
                className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${
                  getSectionStatus('leviers')
                    ? 'bg-ciprel-green-50 border-ciprel-green-400 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-ciprel-green-400 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-ciprel-green-100 p-3 rounded-lg mr-3 group-hover:bg-ciprel-green-200 transition-colors">
                      <TrendingUp className="h-6 w-6 text-ciprel-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">3. Facteurs clés de succès</h4>
                  </div>
                  {getSectionStatus('leviers') && (
                    <div className="w-8 h-8 bg-ciprel-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-gray-600">Les 4 leviers essentiels</p>
              </button>

              <button
                onClick={() => openModal('ressources')}
                className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${
                  getSectionStatus('ressources')
                    ? 'bg-ciprel-green-50 border-ciprel-green-400 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-ciprel-green-400 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-ciprel-green-100 p-3 rounded-lg mr-3 group-hover:bg-ciprel-green-200 transition-colors">
                      <Download className="h-6 w-6 text-ciprel-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">4. Ressources documentaires</h4>
                  </div>
                  {getSectionStatus('ressources') && (
                    <div className="w-8 h-8 bg-ciprel-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-gray-600">Guides et documents téléchargeables</p>
              </button>
            </div>

            <div className="bg-gradient-to-r from-ciprel-green-50 to-ciprel-orange-50 border-2 border-ciprel-green-200 rounded-xl p-6 text-center">
              <p className="text-ciprel-black font-semibold text-lg">
                📚 <strong>Important :</strong> Vous devez lire toutes les sections pour débloquer l'accès aux quiz et sondages.
              </p>
            </div>
        </div>
        </section>
        </SwiperSlide>

        <SwiperSlide>
          {/* SECTION APPLICATION PRATIQUE - Slide 6 (Vidéos) */}
        <section className="h-full overflow-y-auto bg-gradient-to-br from-ciprel-orange-50 via-white to-ciprel-green-50">
          <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-16">
          <div className="text-center mb-12">
            <span className="bg-ciprel-orange-100 text-ciprel-orange-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
              Application pratique
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
              Application pratique de votre démarche compétences
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Inspirez-vous de cas concrets pour déployer la démarche compétences sur le terrain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practiceVideos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => openVideoModal(index)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer text-left group"
              >
                <div className="relative aspect-video bg-gradient-to-br from-ciprel-orange-100 to-ciprel-green-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-6 group-hover:bg-ciprel-orange-500 group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <svg className="h-12 w-12 text-ciprel-orange-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-ciprel-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Vidéo {video.id}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-ciprel-black mb-2 group-hover:text-ciprel-orange-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {video.description}
                  </p>
                  <div className="mt-4 text-ciprel-orange-600 font-semibold text-sm flex items-center">
                    <span>Visionner</span>
                    <svg className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        </section>
        </SwiperSlide>

        <SwiperSlide>
          {/* SECTION PLATEFORME - Slide 7 (Plateforme) */}
        <section className="h-full overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-16">
          <div className="text-center mb-12">
            <span className="bg-ciprel-green-100 text-ciprel-green-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
              Plateforme interactive
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
              Votre plateforme d'apprentissage et d'évaluation
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Impliquer le personnel dans l'amélioration continue de la démarche compétence,
              mesurer la compréhension des concepts clés et faciliter l'appropriation.
            </p>
          </div>

          {/* Grille des fonctionnalités */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-ciprel-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-ciprel-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-ciprel-black">Modules interactifs</h3>
              <p className="text-gray-600">
                Concepts de compétence technique, pratiques professionnelles, procédures et développement
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-ciprel-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <HelpCircle className="h-7 w-7 text-ciprel-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-ciprel-black">Quiz & Auto-évaluation</h3>
              <p className="text-gray-600">
                Exercices d'auto-évaluation accessibles via QR code et quiz trimestriels
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-ciprel-yellow/20 border border-ciprel-yellow/40">
                <TrendingUp className="h-7 w-7 text-ciprel-yellow" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-ciprel-black">Suivi personnalisé</h3>
              <p className="text-gray-600">
                Espace personnel, tableau de bord managers et rapports RH détaillés
              </p>
            </div>
          </div>

          {/* Quiz et Sondage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user && canAccessQuiz() ? (
              <button
                type="button"
                onClick={openQuizModal}
                className="block w-full text-left p-6 bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 text-white rounded-xl hover:from-ciprel-green-600 hover:to-ciprel-green-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ciprel-green-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xl">Quiz d'introduction</h4>
                  <BookOpen className="h-7 w-7" />
                </div>
                <p className="text-ciprel-green-100 mb-4">Testez vos connaissances sur la démarche compétence</p>
                <div className="text-sm bg-white/20 rounded-lg px-3 py-2 inline-block">
                  ✓ Modules complétés - Accès débloqué
                </div>
              </button>
            ) : (
              <div className="block p-6 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xl">Quiz d'introduction</h4>
                  <Lock className="h-7 w-7" />
                </div>
                <p className="text-gray-400 mb-4">Testez vos connaissances sur la démarche compétence</p>
                <div className="text-sm bg-gray-400 text-white rounded-lg px-3 py-2 inline-block">
                  🔒 Lisez tous les modules pour débloquer
                </div>
              </div>
            )}

            {user && canAccessQuiz() ? (
              <button
                type="button"
                onClick={() => setSurveyModalOpen(true)}
                data-survey-trigger
                className="block w-full text-left p-6 bg-gradient-to-r from-ciprel-orange-500 to-ciprel-orange-600 text-white rounded-xl hover:from-ciprel-orange-600 hover:to-ciprel-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ciprel-orange-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xl">Sondage d'opinion</h4>
                  <HelpCircle className="h-7 w-7" />
                </div>
                <p className="text-ciprel-orange-100 mb-4">Partagez votre avis et vos suggestions d'amélioration</p>
                <div className="text-sm bg-white/20 rounded-lg px-3 py-2 inline-block">
                  ✓ Modules complétés - Accès débloqué
                </div>
              </button>
            ) : (
              <div className="block p-6 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xl">Sondage d'opinion</h4>
                  <Lock className="h-7 w-7" />
                </div>
                <p className="text-gray-400 mb-4">Partagez votre avis et vos suggestions d'amélioration</p>
                <div className="text-sm bg-gray-400 text-white rounded-lg px-3 py-2 inline-block">
                  🔒 Lisez tous les modules pour débloquer
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
        </SwiperSlide>
        </Swiper>

        {/* Mobile: Scroll naturel */}
        <div className="lg:hidden overflow-y-auto">
          {/* HERO SECTION */}
          <section id="hero" className="min-h-screen overflow-y-auto bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50 px-4 py-16">
            <div className="max-w-7xl mx-auto flex flex-col justify-center">
              <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
                <img src="/images/logo.webp" alt="CIPREL" className="h-20 w-auto object-contain drop-shadow-lg" />
                <img src="/images/30ans.png" alt="30 ans CIPREL" className="h-20 w-auto object-contain drop-shadow-lg" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-center text-ciprel-black mb-4">
                La Démarche Compétence CIPREL
              </h1>
              <h2 className="text-lg md:text-xl text-center text-gray-700 mb-8 font-light">
                Développez vos talents, construisez votre avenir professionnel
              </h2>
              <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-6 mb-8 border border-gray-100">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Véritable <strong>boussole du management stratégique</strong>, la démarche compétence se veut être un outil d'alignement des besoins en compétences individuelles et collectives avec les objectifs organisationnels et d'apprentissage continu.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Ainsi et conscient de l'importance de cette gestion dynamique et efficiente du capital humain, <strong>CIPREL s'est engagée dans une démarche compétence</strong> ayant pour objectif l'adéquation profil-poste et ce en parfait alignement avec la stratégie du groupe ERANOVE.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    C'est dans cette optique que la direction des ressources humaines a opté pour une démarche de déploiement basée sur <strong>la communication interne et l'animation</strong> afin d'assurer l'ancrage du contenu de la démarche compétence ainsi que son appropriation effective par toutes les parties prenantes internes.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <a
                  href="#guide"
                  className="bg-ciprel-green-600 text-white px-8 py-4 rounded-lg hover:bg-ciprel-green-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Découvrir le guide complet
                </a>
              </div>
            </div>
          </section>

          {/* SECTION GUIDE */}
          <section id="guide" className="min-h-screen bg-gradient-to-br from-gray-50 to-ciprel-green-50 px-4 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center mb-6">
                <span className="bg-ciprel-green-100 text-ciprel-green-800 px-6 py-3 rounded-full font-bold text-lg flex items-center shadow-md">
                  <Award className="h-6 w-6 mr-2" />
                  Document essentiel
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-ciprel-black mb-6">
                Le Guide de la Démarche Compétence CIPREL
              </h2>
              <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
                Fournir aux employés une <strong>vue d'ensemble</strong> sur le processus de gestion des compétences, son importance, ses objectifs et son déploiement.
              </p>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8 mb-8">
                <a
                  href="/Guide_démarche_compétence.pdf"
                  download
                  className="bg-ciprel-green-600 text-white px-6 py-4 rounded-lg hover:bg-ciprel-green-700 font-bold text-lg w-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Download className="h-6 w-6 mr-3" />
                  Télécharger le guide complet (PDF)
                </a>
              </div>
              <div className="flex justify-center">
                <a
                  href="#objectifs"
                  className="bg-ciprel-orange-500 text-white px-8 py-4 rounded-lg hover:bg-ciprel-orange-600 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Commencer mon parcours
                </a>
              </div>
            </div>
          </section>

          {/* SECTION OBJECTIFS */}
          <section id="objectifs" className="min-h-screen bg-white px-4 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="bg-ciprel-green-100 text-ciprel-green-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                  Objectifs stratégiques
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
                  Objectifs de la démarche
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Une vision commune pour l'entreprise et ses collaborateurs
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-ciprel-green-50 to-white rounded-xl shadow-lg p-8 border-t-4 border-ciprel-green-500">
                  <div className="flex items-center mb-6">
                    <div className="bg-ciprel-green-100 p-3 rounded-lg mr-4">
                      <Building2 className="h-8 w-8 text-ciprel-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-ciprel-black">Pour CIPREL</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-ciprel-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Communiquer autour des compétences techniques et pratiques professionnelles fondamentales</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-ciprel-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Favoriser l'ancrage du contenu de la démarche compétence</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-ciprel-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Maintenir la dynamique autour des compétences, l'implication et la responsabilisation des salariés</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-ciprel-orange-50 to-white rounded-xl shadow-lg p-8 border-t-4 border-ciprel-orange-500">
                  <div className="flex items-center mb-6">
                    <div className="bg-ciprel-orange-100 p-3 rounded-lg mr-4">
                      <Users className="h-8 w-8 text-ciprel-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-ciprel-black">Pour le personnel</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-ciprel-orange-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Comprendre le contenu de la démarche compétence, ses objectifs et les gains attendus</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-ciprel-orange-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Maîtriser le requis en pratiques professionnelles et en compétences</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center mt-12">
                <a
                  href="#modules"
                  className="bg-ciprel-orange-500 text-white px-8 py-4 rounded-lg hover:bg-ciprel-orange-600 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                >
                  Découvrir les modules
                  <ChevronDown className="h-5 w-5 ml-2" />
                </a>
              </div>
            </div>
          </section>

          {/* SECTION MODULES */}
          <section id="modules" className="min-h-screen bg-white px-4 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="bg-ciprel-orange-100 text-ciprel-orange-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                  Parcours d'apprentissage
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
                  Découvrir la démarche compétence
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  4 modules interactifs pour comprendre et maîtriser la démarche
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => openModal('dialectique')}
                  className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${
                    getSectionStatus('dialectique')
                      ? 'bg-ciprel-green-50 border-ciprel-green-400 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-ciprel-green-400 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-ciprel-green-100 p-3 rounded-lg mr-3 group-hover:bg-ciprel-green-200 transition-colors">
                        <BookOpen className="h-6 w-6 text-ciprel-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">1. Dialectique de la démarche</h4>
                    </div>
                    {getSectionStatus('dialectique') && (
                      <div className="w-8 h-8 bg-ciprel-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">Découvrez la définition et les bénéfices</p>
                </button>

                <button
                  onClick={() => openModal('synoptique')}
                  className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${
                    getSectionStatus('synoptique')
                      ? 'bg-ciprel-green-50 border-ciprel-green-400 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-ciprel-green-400 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-ciprel-green-100 p-3 rounded-lg mr-3 group-hover:bg-ciprel-green-200 transition-colors">
                        <Target className="h-6 w-6 text-ciprel-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">2. Synoptique des étapes</h4>
                    </div>
                    {getSectionStatus('synoptique') && (
                      <div className="w-8 h-8 bg-ciprel-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">Les 5 étapes cycliques détaillées</p>
                </button>

                <button
                  onClick={() => openModal('leviers')}
                  className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${
                    getSectionStatus('leviers')
                      ? 'bg-ciprel-green-50 border-ciprel-green-400 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-ciprel-green-400 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-ciprel-green-100 p-3 rounded-lg mr-3 group-hover:bg-ciprel-green-200 transition-colors">
                        <TrendingUp className="h-6 w-6 text-ciprel-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">3. Facteurs clés de succès</h4>
                    </div>
                    {getSectionStatus('leviers') && (
                      <div className="w-8 h-8 bg-ciprel-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">Les 4 leviers essentiels</p>
                </button>

                <button
                  onClick={() => openModal('ressources')}
                  className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${
                    getSectionStatus('ressources')
                      ? 'bg-ciprel-green-50 border-ciprel-green-400 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-ciprel-green-400 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-ciprel-green-100 p-3 rounded-lg mr-3 group-hover:bg-ciprel-green-200 transition-colors">
                        <Download className="h-6 w-6 text-ciprel-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">4. Ressources documentaires</h4>
                    </div>
                    {getSectionStatus('ressources') && (
                      <div className="w-8 h-8 bg-ciprel-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">Guides et documents téléchargeables</p>
                </button>
              </div>

              <div className="bg-gradient-to-r from-ciprel-green-50 to-ciprel-orange-50 border-2 border-ciprel-green-200 rounded-xl p-6 text-center mb-8">
                <p className="text-ciprel-black font-semibold text-lg">
                  📚 <strong>Important :</strong> Vous devez lire toutes les sections pour débloquer l'accès aux quiz et sondages.
                </p>
              </div>

              <div className="flex justify-center">
                <a
                  href="#plateforme"
                  className="bg-ciprel-orange-500 text-white px-8 py-4 rounded-lg hover:bg-ciprel-orange-600 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                >
                  Accéder aux quiz
                  <ChevronDown className="h-5 w-5 ml-2" />
                </a>
              </div>
            </div>
          </section>

          {/* SECTION APPLICATION PRATIQUE */}
          <section id="application-pratique" className="min-h-screen bg-gradient-to-br from-ciprel-orange-50 via-white to-ciprel-green-50 px-4 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10">
                <span className="bg-ciprel-orange-100 text-ciprel-orange-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                  Application pratique
                </span>
                <h2 className="text-3xl font-bold text-ciprel-black mb-3">
                  Application pratique de votre démarche compétences
                </h2>
                <p className="text-gray-600">
                  Inspirez-vous de ces mises en situation pour animer vos propres ateliers compétences.
                </p>
              </div>

              <div className="grid gap-6">
                {practiceVideos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => openVideoModal(index)}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer text-left group"
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-ciprel-orange-100 to-ciprel-green-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-6 group-hover:bg-ciprel-orange-500 group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <svg className="h-12 w-12 text-ciprel-orange-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-ciprel-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Vidéo {video.id}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-ciprel-black mb-2 group-hover:text-ciprel-orange-600 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {video.description}
                      </p>
                      <div className="text-ciprel-orange-600 font-semibold text-sm flex items-center">
                        <span>Visionner en mode TikTok</span>
                        <svg className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION PLATEFORME */}
          <section id="plateforme" className="min-h-screen bg-gray-50 px-4 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="bg-ciprel-green-100 text-ciprel-green-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                  Plateforme interactive
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
                  Votre plateforme d'apprentissage et d'évaluation
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Impliquer le personnel dans l'amélioration continue de la démarche compétence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user && canAccessQuiz() ? (
                  <button
                    type="button"
                    onClick={openQuizModal}
                    className="block w-full text-left p-6 bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 text-white rounded-xl hover:from-ciprel-green-600 hover:to-ciprel-green-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ciprel-green-500"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-xl">Quiz d'introduction</h4>
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <p className="text-ciprel-green-100 mb-4">Testez vos connaissances sur la démarche compétence</p>
                    <div className="text-sm bg-white/20 rounded-lg px-3 py-2 inline-block">
                      ✓ Modules complétés - Accès débloqué
                    </div>
                  </button>
                ) : (
                  <div className="block p-6 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-xl">Quiz d'introduction</h4>
                      <Lock className="h-7 w-7" />
                    </div>
                    <p className="text-gray-400 mb-4">Testez vos connaissances sur la démarche compétence</p>
                    <div className="text-sm bg-gray-400 text-white rounded-lg px-3 py-2 inline-block">
                      🔒 Lisez tous les modules pour débloquer
                    </div>
                  </div>
                )}

                {user && canAccessQuiz() ? (
                  <button
                    type="button"
                    onClick={() => setSurveyModalOpen(true)}
                    data-survey-trigger
                    className="block w-full text-left p-6 bg-gradient-to-r from-ciprel-orange-500 to-ciprel-orange-600 text-white rounded-xl hover:from-ciprel-orange-600 hover:to-ciprel-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ciprel-orange-500"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-xl">Sondage d'opinion</h4>
                      <HelpCircle className="h-7 w-7" />
                    </div>
                    <p className="text-ciprel-orange-100 mb-4">Partagez votre avis et vos suggestions d'amélioration</p>
                    <div className="text-sm bg-white/20 rounded-lg px-3 py-2 inline-block">
                      ✓ Modules complétés - Accès débloqué
                    </div>
                  </button>
                ) : (
                  <div className="block p-6 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-xl">Sondage d'opinion</h4>
                      <Lock className="h-7 w-7" />
                    </div>
                    <p className="text-gray-400 mb-4">Partagez votre avis et vos suggestions d'amélioration</p>
                    <div className="text-sm bg-gray-400 text-white rounded-lg px-3 py-2 inline-block">
                      🔒 Lisez tous les modules pour débloquer
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="absolute right-4 bottom-8 z-30 hidden lg:flex flex-col gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Slide précédent"
            disabled={activeSlide === 0}
            className={`rounded-full border border-ciprel-orange-200 bg-white/90 p-3 shadow-lg transition-all duration-200 ${
              activeSlide === 0
                ? 'cursor-not-allowed opacity-40 text-ciprel-orange-300'
                : 'text-ciprel-orange-600 hover:bg-ciprel-orange-500 hover:text-white'
            }`}
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Slide suivant"
            disabled={activeSlide === totalSlides - 1}
            className={`rounded-full border border-ciprel-orange-200 bg-white/90 p-3 shadow-lg transition-all duration-200 ${
              activeSlide === totalSlides - 1
                ? 'cursor-not-allowed opacity-40 text-ciprel-orange-300'
                : 'text-ciprel-orange-600 hover:bg-ciprel-orange-500 hover:text-white'
            }`}
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        <style jsx global>{`
          html {
            scroll-behavior: smooth;
          }

          .homepage-swiper .swiper-pagination {
            position: absolute;
            top: 50%;
            right: 1rem;
            left: auto;
            width: auto;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            transform: translateY(-50%);
            z-index: 20;
          }

          .homepage-swiper .swiper-pagination-bullet {
            background: rgba(238, 127, 0, 0.35);
            opacity: 1;
            position: relative;
          }

          .homepage-swiper .swiper-pagination-bullet-active {
            background: #ee7f00;
          }

          .swiper-pagination-bullet-custom {
            position: relative;
            cursor: pointer;
          }

          .tooltip-slide {
            position: absolute;
            right: 130%;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease-in-out;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .tooltip-slide::after {
            content: '';
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%) rotate(45deg);
            width: 8px;
            height: 8px;
            background: rgba(0, 0, 0, 0.9);
          }

          .swiper-pagination-bullet-custom:hover .tooltip-slide {
            opacity: 1;
          }

          @media (max-width: 768px) {
            .homepage-swiper .swiper-pagination {
              right: 0.75rem;
            }
          }
        `}</style>
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
        <SectionModal
          isOpen={activeModal === 'introduction'}
          onClose={closeModal}
          title="Introduction à la démarche compétence"
          sectionId="introduction"
        >
          <Suspense fallback={<ContentSkeleton />}>
            <IntroductionContent />
          </Suspense>
        </SectionModal>

        <SectionModal
          isOpen={activeModal === 'dialectique'}
          onClose={closeModal}
          title="Dialectique de la démarche compétence"
          sectionId="dialectique"
        >
          <Suspense fallback={<ContentSkeleton />}>
            <DialectiqueContent />
          </Suspense>
        </SectionModal>

        <SectionModal
          isOpen={activeModal === 'synoptique'}
          onClose={closeModal}
          title="Synoptique de la démarche compétence"
          sectionId="synoptique"
        >
          <Suspense fallback={<ContentSkeleton />}>
            <SynoptiqueContent />
          </Suspense>
        </SectionModal>

        <SectionModal
          isOpen={activeModal === 'leviers'}
          onClose={closeModal}
          title="Leviers et facteurs clés de succès"
          sectionId="leviers"
        >
          <Suspense fallback={<ContentSkeleton />}>
            <LeviersContent />
          </Suspense>
        </SectionModal>

        <SectionModal
          isOpen={activeModal === 'ressources'}
          onClose={closeModal}
          title="Ressources documentaires"
          sectionId="ressources"
        >
          <Suspense fallback={<ContentSkeleton />}>
            <RessourcesContent />
          </Suspense>
        </SectionModal>
      </Suspense>

      <Suspense fallback={null}>
        <Dialog
          open={quizModalOpen}
          onOpenChange={(open) => {
            if (open) {
              resetQuiz()
              setQuizModalOpen(true)
            } else {
              closeQuizModal()
            }
          }}
        >
          <DialogContent className="max-w-4xl w-full">
            <DialogTitle className="text-2xl font-semibold text-ciprel-black">
              Quiz d&apos;introduction
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Validez vos connaissances sur les fondamentaux de la démarche compétences.
            </DialogDescription>
            <Suspense fallback={<LoadingScreen message="Chargement du quiz..." />}>
              <QuizEngine quizType="INTRODUCTION" onClose={closeQuizModal} />
            </Suspense>
          </DialogContent>
        </Dialog>
      </Suspense>

      <Suspense fallback={null}>
        <Dialog
          open={surveyModalOpen}
          onOpenChange={(open) => {
            if (open) {
              setSurveyModalOpen(true)
            } else {
              setSurveyModalOpen(false)
            }
          }}
        >
          <DialogContent className="max-w-5xl w-full">
            <DialogTitle className="text-2xl font-semibold text-ciprel-black">
              Sondage d&apos;opinion
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Partagez vos attentes et vos retours pour améliorer le déploiement de la démarche compétences.
            </DialogDescription>
            <Suspense fallback={<LoadingScreen message="Chargement du sondage..." />}>
              <CiprelSondageContent
                variant="modal"
                onClose={() => setSurveyModalOpen(false)}
                onNavigate={handleSurveyNavigate}
              />
            </Suspense>
          </DialogContent>
        </Dialog>
      </Suspense>

      <Suspense fallback={null}>
        <VideoPlayerModal
          isOpen={videoModalOpen}
          onClose={closeVideoModal}
          videos={practiceVideos}
          initialVideoIndex={initialVideoIndex}
        />
      </Suspense>

      {/* Modaux d'authentification */}
      <Suspense fallback={null}>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultMode="login"
        />

        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
        />
      </Suspense>
    </div>
  )
}
