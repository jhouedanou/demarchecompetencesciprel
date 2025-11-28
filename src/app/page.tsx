'use client'

import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Mousewheel, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import ProgressTracker from '@/components/reading/ProgressTracker'
import { useUser } from '@/hooks/useUser'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { useQuizStore } from '@/stores/quiz-store'
import { useAuthStore } from '@/stores/auth-store'
import { useWorkshops, type Workshop } from '@/hooks/useWorkshops'
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
const SurveySelector = lazy(() => import('@/components/ciprel/SurveySelector').then(m => ({ default: m.SurveySelector })))
const LogoutModal = lazy(() => import('@/components/auth/LogoutModal').then(m => ({ default: m.LogoutModal })))
const VideoPlayerModal = lazy(() => import('@/components/modals/VideoPlayerModal').then(m => ({ default: m.VideoPlayerModal })))
const MetiersHome = lazy(() => import('@/components/MetiersHome').then(m => ({ default: m.MetiersHome })))
const MetiersQuiz = lazy(() => import('@/components/MetiersQuiz').then(m => ({ default: m.MetiersQuiz })))
const FEERICValues = lazy(() => import('@/components/FEERICValues').then(m => ({ default: m.FEERICValues })))
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
  X,
  LogOut,
  Briefcase,
  Presentation,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

type SectionType = 'introduction' | 'dialectique' | 'synoptique' | 'leviers' | 'ressources' | null

const SLIDE_TITLES = [
  'Présentation',
  'Définitions, Objectifs & Ressources',
  'Workshops métiers'
]

// Mapping statique des icônes et couleurs par nom de métier
const METIERS_DISPLAY_CONFIG: Record<string, { icon: string; color: string }> = {
  'Introduction DC': { icon: '📘', color: 'from-blue-500 to-blue-600' },
  'Production': { icon: '⚡', color: 'from-blue-500 to-blue-600' },
  'SIDT': { icon: '💻', color: 'from-purple-500 to-purple-600' },
  'Maintenance': { icon: '🔧', color: 'from-orange-500 to-orange-600' },
  'QSE-RSE/Sûreté': { icon: '🛡️', color: 'from-green-500 to-green-600' },
  'Campagne Sensibilisation': { icon: '📢', color: 'from-pink-500 to-pink-600' },
  'Contrôle Interne': { icon: '📊', color: 'from-red-500 to-red-600' },
  'Stocks': { icon: '📦', color: 'from-yellow-500 to-yellow-600' },
  'RH/Juridique': { icon: '⚖️', color: 'from-indigo-500 to-indigo-600' },
  'Services Généraux': { icon: '🏢', color: 'from-pink-500 to-pink-600' },
  'DAF': { icon: '💰', color: 'from-teal-500 to-teal-600' },
  'Projets': { icon: '🎯', color: 'from-cyan-500 to-cyan-600' },
  'Achats & Logistique': { icon: '🚚', color: 'from-lime-500 to-lime-600' }
}

interface MetierData {
  id: number
  titre: string
  statut: boolean
  ordre: number
}

interface MetierDisplay {
  id: number
  nom: string
  icon: string
  color: string
}

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

interface ActiveMetier {
  id: number
  titre: string
}

export default function HomePage() {
  const { user, loading } = useUser()
  const { sections, canAccessQuiz, markSectionCompleted } = useReadingProgress(user)
  const { signOut } = useAuthStore()
  const { workshops, loading: workshopsLoading } = useWorkshops()
  const [activeModal, setActiveModal] = useState<SectionType>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [quizConfig, setQuizConfig] = useState<{
    isOpen: boolean
    type: 'INTRODUCTION' | 'WORKSHOP'
    metierId?: number
  }>({ isOpen: false, type: 'INTRODUCTION' })
  const [surveyModalOpen, setSurveyModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [initialVideoIndex, setInitialVideoIndex] = useState(0)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [videoSectionMarked, setVideoSectionMarked] = useState(false)
  const [activeMetier, setActiveMetier] = useState<ActiveMetier | null>(null)
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [showMetiersQuiz, setShowMetiersQuiz] = useState(false)
  const [workshopModalOpen, setWorkshopModalOpen] = useState(false)
  const [metiers, setMetiers] = useState<MetierDisplay[]>([])
  const [metiersLoading, setMetiersLoading] = useState(true)
  const swiperRef = useRef<SwiperType | null>(null)
  const swiperDefinitionsRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const totalSlides = 3 // Structure finale avec 3 slides
  const [definitionCarouselIndex, setDefinitionCarouselIndex] = useState(0)
  const practiceVideos = PRACTICE_VIDEOS
  const resetQuiz = useQuizStore(state => state.resetQuiz)
  const router = useRouter()

  // Fetch métiers from API
  useEffect(() => {
    const fetchMetiers = async () => {
      try {
        setMetiersLoading(true)
        const response = await fetch('/api/metiers')
        const data = await response.json()

        if (data.success && data.data) {
          // Filtrer uniquement les métiers actifs et mapper avec display config
          const activeMetiers = data.data
            .filter((m: MetierData) => m.statut === true)
            .sort((a: MetierData, b: MetierData) => a.ordre - b.ordre)
            .map((m: MetierData) => {
              const config = METIERS_DISPLAY_CONFIG[m.titre] || {
                icon: '📋',
                color: 'from-gray-500 to-gray-600'
              }
              return {
                id: m.id,
                nom: m.titre,
                icon: config.icon,
                color: config.color
              }
            })

          setMetiers(activeMetiers)
        }
      } catch (error) {
        // Silent error handling
      } finally {
        setMetiersLoading(false)
      }
    }

    fetchMetiers()
  }, [])

  // Écouter les événements pour ouvrir les modaux
  useEffect(() => {
    const handleOpenLogout = () => setLogoutModalOpen(true)
    const handleOpenSurvey = () => setSurveyModalOpen(true)
    const handleAuthChanged = () => {
      // Pas besoin de window.location.reload(), juste forcer un re-render
      // React va automatiquement re-fetch les données grâce à useUser()
    }

    window.addEventListener('open-logout', handleOpenLogout)
    window.addEventListener('open-survey', handleOpenSurvey)
    window.addEventListener('auth-changed', handleAuthChanged)

    return () => {
      window.removeEventListener('open-logout', handleOpenLogout)
      window.removeEventListener('open-survey', handleOpenSurvey)
      window.removeEventListener('auth-changed', handleAuthChanged)
    }
  }, [])

  // Détecter quand la section vidéos est visible et la marquer comme terminée
  useEffect(() => {
    if (!user || videoSectionMarked || loading) return

    // Utiliser un timeout pour s'assurer que le DOM est prêt
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              // La section vidéos est visible à plus de 50%
              if (markSectionCompleted && !videoSectionMarked) {
                markSectionCompleted('videos', 0)
                setVideoSectionMarked(true)
              }
            }
          })
        },
        { threshold: 0.5 }
      )

      // La section vidéos a été supprimée, ce code n'est plus nécessaire

      return () => {
        observer.disconnect()
      }
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [user, videoSectionMarked, markSectionCompleted, loading])

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

  const goDefinitionsPrev = () => {
    swiperDefinitionsRef.current?.slidePrev()
  }

  const goDefinitionsNext = () => {
    swiperDefinitionsRef.current?.slideNext()
  }

  const openQuizModal = () => {
    resetQuiz()
    setQuizConfig({ isOpen: true, type: 'INTRODUCTION' })
  }

  const closeQuizModal = () => {
    setQuizConfig(prev => ({ ...prev, isOpen: false }))
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
      {/* Hamburger Button - Mobile/Tablet only - Caché sur la première slide */}
      {activeSlide !== 0 && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-ciprel-orange-600 text-white p-3 rounded-lg shadow-lg hover:bg-ciprel-orange-700 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      )}

      {/* Overlay - Mobile/Tablet only */}
      {sidebarOpen && activeSlide !== 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - 30% à gauche - Cachée sur la première slide */}
      <aside className={`
        w-[280px] lg:w-[20%]
        min-h-screen
        border-r border-gray-200
        bg-white/95 backdrop-blur-sm
        fixed lg:sticky
        top-0
        h-screen
        overflow-y-auto
        z-40
        transition-transform duration-300 ease-in-out
        ${activeSlide === 0 ? '-translate-x-full' : (sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}
      `}>
        <div className="p-6 space-y-8">
          {/* Navigation Menu - UNE SEULE NAVIGATION pour tous */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Menu
            </h4>
            <div className="space-y-2">
              {SLIDE_TITLES.map((slideName, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleSlideTo(index)
                    setSidebarOpen(false)
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-all ${activeSlide === index
                    ? 'bg-ciprel-orange-100 border-l-4 border-ciprel-orange-600 text-ciprel-orange-900 font-medium'
                    : 'bg-white border-l-4 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                >
                  {index + 1}. {slideName}
                </button>
              ))}
            </div>
          </div>

          {/* Login Call-to-Action pour utilisateurs non connectés */}
          {!user && (
            <div className="pt-4 border-t border-gray-200">
              <div className="bg-white rounded-lg shadow-lg border p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Connectez-vous
                </h3>
                <p className="text-gray-600 text-xs mb-4">
                  Créez un compte pour accéder aux quiz et suivre votre progression.
                </p>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new Event('open-login'))
                    }
                  }}
                  className="w-full text-center bg-ciprel-green-600 text-white px-4 py-2 rounded-lg hover:bg-ciprel-green-700 transition-colors font-semibold text-sm"
                >
                  Se connecter
                </button>
              </div>
            </div>
          )}

          {/* Actions pour utilisateurs connectés */}
          {user && (
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {/* Lien vers le tableau de bord */}
              <button
                onClick={() => {
                  setSidebarOpen(false)
                  router.push('/competences')
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-ciprel-green-600 hover:bg-ciprel-green-700 rounded-lg transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Tableau de bord
              </button>

              {/* Logout Button */}
              <button
                onClick={async () => {
                  await signOut()
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content - 80% normalement, 100% sur la première slide */}
      <div className={`w-full transition-all duration-300 ${activeSlide === 0 ? 'lg:w-full' : 'lg:w-[80%]'} lg:ml-0`}>
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
          <SwiperSlide id="slide-presentation">
            {/* HERO SECTION - Slide 0 - Bienvenue */}
            <section className="h-full overflow-y-auto bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50">
              <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-16">

                {/* Hero Header with logos on sides */}
                <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
                  <img src="/images/logo.webp" alt="CIPREL" className="h-12 w-auto object-contain drop-shadow-lg" />
                  <h1 className="text-3xl md:text-4xl font-bold text-ciprel-orange-600 whitespace-nowrap">
                    Bienvenue sur la Démarche Compétence
                  </h1>
                  <img src="/images/30ans.png" alt="30 ans CIPREL" className="h-12 w-auto object-contain drop-shadow-lg" />
                </div>

                <p className="text-center text-gray-700 text-lg mb-8 max-w-3xl mx-auto">
                  <strong>Développer nos compétences, c'est nourrir notre énergie collective.</strong>
                </p>

                {/* Two Columns Content */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">

                  {/* Left Column - La Démarche */}
                  <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-ciprel-orange-600 mb-4 flex items-center">
                      <Target className="h-6 w-6 mr-3 text-ciprel-orange-600" />
                      La Démarche Compétence
                    </h3>

                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        Chez CIPREL, nous sommes convaincus que la <strong>performance durable repose sur la force des compétences collectives</strong>.
                      </p>

                      <p className="text-gray-700 leading-relaxed">
                        La Démarche Compétence est un <strong>projet stratégique</strong> qui vise à identifier, développer et valoriser les savoirs, savoir-faire et savoir-être de chacun.
                      </p>

                      <p className="text-gray-700 leading-relaxed">
                        Elle illustre notre volonté de faire grandir à la fois l'entreprise et ses collaborateurs, dans l'esprit de nos valeurs <strong>FEERIC</strong> : Force du collectif, Engagement, Équité, Respect, Innovation et Convivialité.
                      </p>

                      <div className="bg-ciprel-orange-50 border-l-4 border-ciprel-orange-600 p-4 mt-4">
                        <p className="text-gray-800 italic font-semibold">
                          Plus qu'un simple projet, cette démarche est un <strong>voyage collectif</strong> : comprendre ce que nous faisons, pourquoi nous le faisons et comment nous pouvons le faire encore mieux, ensemble.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Contents */}
                  <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-ciprel-green-600 mb-4 flex items-center">
                      <BookOpen className="h-6 w-6 mr-3 text-ciprel-green-600" />
                      Sur cette page
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-ciprel-black mb-2">Nos axes de communication :</h4>
                        <ul className="space-y-2 ml-4">
                          <li className="text-gray-700">
                            <span className="font-semibold text-ciprel-orange-600">•</span> La valorisation des métiers
                          </li>
                          <li className="text-gray-700">
                            <span className="font-semibold text-ciprel-orange-600">•</span> Les valeurs FEERIC en action
                          </li>
                        </ul>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-ciprel-black mb-2">Vous découvrirez :</h4>
                        <ul className="space-y-2 ml-4 text-sm">
                          <li className="text-gray-700"><span className="font-semibold text-ciprel-green-600">•</span> Des workshops métiers interactifs</li>
                          <li className="text-gray-700"><span className="font-semibold text-ciprel-green-600">•</span> Des newsletters</li>
                          <li className="text-gray-700"><span className="font-semibold text-ciprel-green-600">•</span> Des capsules vidéo métiers</li>
                          <li className="text-gray-700"><span className="font-semibold text-ciprel-green-600">•</span> Des quiz et témoignages</li>
                          <li className="text-gray-700"><span className="font-semibold text-ciprel-green-600">•</span> Tous les supports et outils à télécharger</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={goNext}
                    className="bg-ciprel-green-600 text-white px-8 py-4 rounded-lg hover:bg-ciprel-green-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <ChevronDown className="h-5 w-5 mr-2" />
                    Accéder à l'introduction de la démarche compétences
                  </button>
                </div>
              </div>
            </section>
          </SwiperSlide>

          <SwiperSlide id="slide-definitions-objectifs">
            {/* DEFINITIONS AND OBJECTIVES SLIDE - Slide 1 - Définitions et objectifs */}
            <section className="h-full overflow-y-auto bg-gradient-to-br from-ciprel-green-50 via-white to-gray-50">
              <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-16">
                {/* Internal Carousel for Definitions and Objectives */}
                <div className="relative">
                  <Swiper
                    ref={swiperDefinitionsRef}
                    modules={[Navigation]}
                    slidesPerView={1}
                    direction="horizontal"
                    onSlideChange={(swiper) => setDefinitionCarouselIndex(swiper.activeIndex)}
                    className="relative"
                  >
                    {/* Slide 1: Définition */}
                    <SwiperSlide>
                      <div className="bg-white rounded-xl shadow-lg border-l-4 border-ciprel-green-500 p-8 md:p-10 mb-8 min-h-[500px] flex flex-col justify-center">
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
                    </SwiperSlide>

                    {/* Slide 2: Objectifs */}
                    <SwiperSlide>
                      <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 mb-8 min-h-[500px] flex flex-col justify-center">
                        <div className="text-center mb-8">
                          <span className="bg-ciprel-green-100 text-ciprel-green-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                            Objectifs stratégiques
                          </span>
                          <h2 className="text-3xl font-bold text-ciprel-black mb-4">
                            Objectifs de la démarche
                          </h2>
                          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Une vision commune pour l'entreprise et ses collaborateurs
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Pour CIPREL */}
                          <div className="bg-gradient-to-br from-ciprel-green-50 to-white rounded-xl shadow-lg p-6 border-t-4 border-ciprel-green-500 hover:shadow-xl transition-shadow duration-200">
                            <div className="flex items-center mb-4">
                              <div className="bg-ciprel-green-100 p-3 rounded-lg mr-4">
                                <Building2 className="h-7 w-7 text-ciprel-green-600" />
                              </div>
                              <h3 className="text-xl font-bold text-ciprel-black">Pour CIPREL</h3>
                            </div>
                            <ul className="space-y-3">
                              <li className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-ciprel-green-500 mr-3 flex-shrink-0 mt-1" />
                                <span className="text-gray-700 text-sm">Communiquer autour des compétences techniques et pratiques professionnelles fondamentales</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-ciprel-green-500 mr-3 flex-shrink-0 mt-1" />
                                <span className="text-gray-700 text-sm">Favoriser l'ancrage du contenu de la démarche compétence</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-ciprel-green-500 mr-3 flex-shrink-0 mt-1" />
                                <span className="text-gray-700 text-sm">Maintenir la dynamique autour des compétences, l'implication et la responsabilisation des salariés</span>
                              </li>
                            </ul>
                          </div>

                          {/* Pour le personnel */}
                          <div className="bg-gradient-to-br from-ciprel-orange-50 to-white rounded-xl shadow-lg p-6 border-t-4 border-ciprel-orange-500 hover:shadow-xl transition-shadow duration-200">
                            <div className="flex items-center mb-4">
                              <div className="bg-ciprel-orange-100 p-3 rounded-lg mr-4">
                                <Users className="h-7 w-7 text-ciprel-orange-600" />
                              </div>
                              <h3 className="text-xl font-bold text-ciprel-black">Pour le personnel</h3>
                            </div>
                            <ul className="space-y-3">
                              <li className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-ciprel-orange-500 mr-3 flex-shrink-0 mt-1" />
                                <span className="text-gray-700 text-sm">Comprendre le contenu de la démarche compétence, ses objectifs et les gains attendus</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-ciprel-orange-500 mr-3 flex-shrink-0 mt-1" />
                                <span className="text-gray-700 text-sm">Maîtriser le requis en pratiques professionnelles et en compétences</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>

                  {/* Navigation Arrows for Internal Carousel */}
                  <div className="flex justify-center gap-4 mt-8 mb-8">
                    <button
                      type="button"
                      onClick={goDefinitionsPrev}
                      className="bg-ciprel-orange-600 text-white p-3 rounded-full hover:bg-ciprel-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                      aria-label="Section précédente"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    {/* Indicator dots */}
                    <div className="flex items-center gap-2">
                      {[0, 1].map((index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all duration-200 ${
                            definitionCarouselIndex === index
                              ? 'bg-ciprel-orange-600 w-6'
                              : 'bg-gray-300 w-2'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={goDefinitionsNext}
                      className="bg-ciprel-green-600 text-white p-3 rounded-full hover:bg-ciprel-green-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                      aria-label="Section suivante"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* SECTION 3: QUIZ & ÉVALUATION */}
                <div className="mt-12 mb-12">
                  <div className="text-center mb-8">
                    <span className="bg-ciprel-orange-100 text-ciprel-orange-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                      Parcours d'apprentissage
                    </span>
                    <h3 className="text-3xl font-bold text-ciprel-black mb-4">
                      Testez vos connaissances
                    </h3>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                      Modules interactifs et évaluations pour valider votre compréhension
                    </p>
                  </div>

                  {/* Fonctionnalités */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-ciprel-green-500 text-center">
                      <div className="bg-ciprel-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-ciprel-green-600" />
                      </div>
                      <h4 className="font-bold text-lg text-ciprel-black mb-2">Modules interactifs</h4>
                      <p className="text-gray-600 text-sm">Découvrez les concepts clés de la démarche compétence</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-ciprel-orange-500 text-center">
                      <div className="bg-ciprel-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HelpCircle className="h-8 w-8 text-ciprel-orange-600" />
                      </div>
                      <h4 className="font-bold text-lg text-ciprel-black mb-2">Quiz & Auto-évaluation</h4>
                      <p className="text-gray-600 text-sm">Testez vos connaissances et progressez à votre rythme</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-ciprel-green-600 text-center">
                      <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 text-yellow-600" />
                      </div>
                      <h4 className="font-bold text-lg text-ciprel-black mb-2">Suivi personnalisé</h4>
                      <p className="text-gray-600 text-sm">Suivez votre progression et vos résultats en temps réel</p>
                    </div>
                  </div>

                  {/* Quiz et Sondage */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user ? (
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
                          Afficher le questionnaire
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
                          🔒 Connectez-vous pour accéder
                        </div>
                      </div>
                    )}

                    {user ? (
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
                          Afficher le questionnaire
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
                          🔒 Connectez-vous pour accéder
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 4: GUIDE & RESSOURCES */}
                <div className="mt-12 mb-12">
                  <div className="text-center mb-8">
                    <span className="bg-ciprel-green-100 text-ciprel-green-800 px-6 py-3 rounded-full font-bold text-lg flex items-center shadow-md justify-center mb-4">
                      <Award className="h-6 w-6 mr-2" />
                      Document essentiel
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
                      Le Guide de la Démarche Compétence CIPREL
                    </h3>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                      Fournir aux employés une <strong>vue d'ensemble</strong> sur le processus de gestion des compétences, son importance, ses objectifs et son déploiement.
                    </p>
                  </div>

                  {/* Carte principale du guide */}
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-4">
                    <div className="grid gap-8 items-start p-8 md:p-12">
                      <a
                        href="/Guide_démarche_compétence.pdf"
                        download
                        className="bg-ciprel-green-600 text-white px-6 py-4 rounded-lg hover:bg-ciprel-green-700 font-bold text-lg w-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Download className="h-6 w-6 mr-3" />
                        Télécharger le guide complet (PDF)
                      </a>
                    </div>
                  </div>
                </div>

                {/* SECTION 5: VIDÉO D'INTRODUCTION */}
                <div className="mt-12 mb-12">
                  <div className="text-center mb-8">
                    <span className="bg-ciprel-orange-100 text-ciprel-orange-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                      📹 Vidéo d'introduction
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
                      Découvrez la Démarche Compétence en 2 minutes
                    </h3>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                      Une présentation vidéo pour comprendre rapidement les enjeux et objectifs de notre démarche
                    </p>
                  </div>

                  {/* Lecteur vidéo */}
                  <div className="max-w-4xl mx-auto w-full mb-8">
                    <div className="relative aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden">
                      <video
                        ref={videoRef}
                        controls
                        className="absolute inset-0 w-full h-full"
                        poster="/images/poster.jpg"
                      >
                        <source src="/videos/video1.mp4" type="video/mp4" />
                        Votre navigateur ne supporte pas la lecture de vidéos HTML5.
                      </video>
                    </div>
                  </div>

                  {/* Points clés */}
                  <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
                    <h3 className="text-xl font-bold text-ciprel-black mb-4 flex items-center">
                      <CheckCircle2 className="h-6 w-6 text-ciprel-green-600 mr-3" />
                      Ce que vous allez découvrir
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <span className="text-ciprel-orange-600 font-bold mr-2">•</span>
                        <p className="text-gray-700">Les enjeux de la démarche compétence</p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-ciprel-orange-600 font-bold mr-2">•</span>
                        <p className="text-gray-700">Les bénéfices pour CIPREL et les collaborateurs</p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-ciprel-orange-600 font-bold mr-2">•</span>
                        <p className="text-gray-700">Le parcours de développement des compétences</p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-ciprel-orange-600 font-bold mr-2">•</span>
                        <p className="text-gray-700">Les outils et ressources disponibles</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons for Main Slides */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="bg-ciprel-orange-600 text-white px-8 py-4 rounded-lg hover:bg-ciprel-orange-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <ChevronUp className="h-5 w-5 mr-2" />
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="bg-ciprel-green-600 text-white px-8 py-4 rounded-lg hover:bg-ciprel-green-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                  >
                    Suivant
                    <ChevronDown className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            </section>
          </SwiperSlide>

          <SwiperSlide id="slide-workshops">
            {/* WORKSHOPS MÉTIERS - Slide 3 */}
            <section className="h-full overflow-y-auto bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50">
              <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-16">

                {/* En-tête */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ciprel-orange-100 to-ciprel-green-100 text-ciprel-black rounded-full text-sm font-semibold mb-4">
                    <Briefcase className="h-4 w-4" />
                    {metiers.length} Métiers Actifs
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
                    La déclinaison de la DC dans nos métiers
                  </h2>
                  <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-6">
                    Découvrez comment la démarche compétence s'applique à chaque métier de CIPREL
                  </p>
                </div>

                {/* Swiper horizontal des métiers avec navigation */}
                <div className="relative px-12">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    breakpoints={{
                      640: { slidesPerView: 2, spaceBetween: 20 },
                      768: { slidesPerView: 3, spaceBetween: 24 },
                      1024: { slidesPerView: 4, spaceBetween: 28 }
                    }}
                    navigation={{
                      prevEl: '.swiper-button-prev-workshops',
                      nextEl: '.swiper-button-next-workshops',
                    }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    modules={[Pagination, Navigation]}
                    className="w-full mb-8 workshops-swiper"
                    style={{
                      '--swiper-pagination-color': '#EE7F00',
                      '--swiper-pagination-bullet-inactive-color': '#58A636',
                      '--swiper-pagination-bullet-inactive-opacity': '0.4',
                    } as React.CSSProperties}
                  >
                    {metiers.map((metier) => {
                      // Extraire les couleurs du gradient pour la bordure
                      const gradientColors = metier.color.match(/from-(\S+)\s+to-(\S+)/)
                      const fromColor = gradientColors ? gradientColors[1] : 'blue-500'
                      const toColor = gradientColors ? gradientColors[2] : 'blue-600'

                      // Récupérer le workshop correspondant
                      const workshop = workshops.find(w => w.metier_id === metier.id)
                      const isActive = workshop?.is_active ?? false
                      const hasLink = workshop?.onedrive_link && workshop.onedrive_link.trim() !== ''

                      return (
                        <SwiperSlide key={metier.id}>
                          <button
                            onClick={() => {
                              if (isActive && hasLink) {
                                setSelectedWorkshop(workshop)
                                setWorkshopModalOpen(true)
                              }
                            }}
                            disabled={!isActive || !hasLink}
                            className={`group relative bg-white rounded-2xl shadow-md transition-all duration-300 p-6 h-80 w-full flex flex-col items-center justify-center border-4 border-transparent ${isActive && hasLink
                              ? 'hover:shadow-2xl transform hover:-translate-y-2 hover:border-opacity-100 cursor-pointer'
                              : 'opacity-50 cursor-not-allowed'
                              }`}
                            style={{
                              borderImage: `linear-gradient(135deg, var(--tw-gradient-stops)) 1`,
                              borderImageSlice: 1,
                            }}
                          >
                            {/* Bordure colorée avec gradient */}
                            <div
                              className={`absolute inset-0 rounded-2xl opacity-100 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                              style={{
                                background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, var(--tw-gradient-stops)) border-box`,
                                border: '4px solid transparent',
                                borderRadius: '1rem',
                              }}
                            >
                              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${metier.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                            </div>

                            {/* Badge numéro et statut */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                              <div className={`bg-gradient-to-r ${metier.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}>
                                #{metier.id}
                              </div>
                              {!isActive && (
                                <div className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                  Bientôt
                                </div>
                              )}
                            </div>

                            {/* Icône avec effet */}
                            <div className="relative mb-4">
                              <div className={`absolute inset-0 bg-gradient-to-br ${metier.color} opacity-10 rounded-full blur-2xl scale-150`} />
                              <div className="text-7xl transition-transform group-hover:scale-110 duration-300 relative z-10">
                                {metier.icon}
                              </div>
                            </div>

                            {/* Nom du métier */}
                            <h3 className="text-2xl font-bold text-center mb-4 text-ciprel-black group-hover:text-ciprel-orange-600 transition-colors duration-300">
                              {metier.nom}
                            </h3>

                            {/* Bouton d'action */}
                            <div className={`mt-auto px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${isActive && hasLink
                              ? `bg-gradient-to-r ${metier.color} text-white shadow-lg group-hover:shadow-xl`
                              : 'bg-gray-300 text-gray-500'
                              }`}>
                              <Presentation className="h-4 w-4" />
                              {isActive && hasLink ? 'Voir le workshop' : 'Prochainement'}
                            </div>
                          </button>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>

                  {/* Flèches de navigation personnalisées */}
                  <button
                    className="swiper-button-prev-workshops absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-ciprel-orange-600 hover:bg-ciprel-orange-600 hover:text-white transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Précédent"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    className="swiper-button-next-workshops absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-ciprel-orange-600 hover:bg-ciprel-orange-600 hover:text-white transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Suivant"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                {/* Légende */}
                <div className="text-center text-sm text-gray-500 mb-8 mt-4">
                  <p className="flex items-center justify-center gap-2">
                    <span>Utilisez les flèches</span>
                    <span className="inline-flex items-center gap-1">
                      <ChevronLeft className="h-4 w-4" />
                      <ChevronRight className="h-4 w-4" />
                    </span>
                    <span>ou faites glisser pour découvrir tous les métiers</span>
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="bg-ciprel-orange-600 text-white px-8 py-4 rounded-lg hover:bg-ciprel-orange-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <ChevronUp className="h-5 w-5 mr-2" />
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="bg-ciprel-green-600 text-white px-8 py-4 rounded-lg hover:bg-ciprel-green-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                  >
                    Suivant
                    <ChevronDown className="h-5 w-5 ml-2" />
                  </button>
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
                  className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${getSectionStatus('dialectique')
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
                  className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${getSectionStatus('synoptique')
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
                  className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${getSectionStatus('leviers')
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
                  className={`block p-6 rounded-xl border-2 text-left transition-all duration-200 group ${getSectionStatus('ressources')
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
                {user ? (
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
                      Afficher le questionnaire
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
                      🔒 Connectez-vous pour accéder
                    </div>
                  </div>
                )}

                {user ? (
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
                      Afficher le questionnaire
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
                      🔒 Connectez-vous pour accéder
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
            className={`rounded-full border border-ciprel-orange-200 bg-white/90 p-3 shadow-lg transition-all duration-200 ${activeSlide === 0
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
            className={`rounded-full border border-ciprel-orange-200 bg-white/90 p-3 shadow-lg transition-all duration-200 ${activeSlide === totalSlides - 1
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

      {/* Bouton sondage fixe en bas à gauche - visible sur toutes les pages */}
      {user && (
        <button
          onClick={() => setSurveyModalOpen(true)}
          className="fixed bottom-8 left-8 z-50 bg-ciprel-orange-500 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-ciprel-orange-600 hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
        >
          <HelpCircle className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold">Sondages</span>
        </button>
      )}

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
          open={quizConfig.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeQuizModal()
            }
          }}
        >
          <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-2xl font-semibold text-ciprel-black">
              {quizConfig.type === 'INTRODUCTION' ? "Quiz d'introduction" : "Quiz Workshop"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {quizConfig.type === 'INTRODUCTION' 
                ? "Validez vos connaissances sur les fondamentaux de la démarche compétences."
                : "Testez vos connaissances sur ce métier."}
            </DialogDescription>
            <Suspense fallback={<LoadingScreen message="Chargement du quiz..." />}>
              <QuizEngine 
                quizType={quizConfig.type} 
                metierId={quizConfig.metierId}
                onClose={closeQuizModal} 
              />
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
          <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-2xl font-semibold text-ciprel-black">
              Sondages CIPREL
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Choisissez le sondage que vous souhaitez remplir pour nous aider à améliorer la plateforme.
            </DialogDescription>
            <Suspense fallback={<LoadingScreen message="Chargement des sondages..." />}>
              <SurveySelector
                variant="modal"
                onClose={() => setSurveyModalOpen(false)}
                onNavigate={handleSurveyNavigate}
              />
            </Suspense>
          </DialogContent>
        </Dialog>
      </Suspense>

      <Suspense fallback={null}>
        <Dialog
          open={workshopModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setWorkshopModalOpen(false)
              setSelectedWorkshop(null)
            }
          }}
        >
          <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-2xl font-semibold text-ciprel-black">
              {selectedWorkshop?.metier_nom && `Workshop - ${selectedWorkshop.metier_nom}`}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Accédez aux ressources et documents pour le workshop
            </DialogDescription>
            <div className="space-y-6 py-4">
              <p className="text-gray-700">
                Bienvenue au workshop du métier <strong>{selectedWorkshop?.metier_nom}</strong>.
              </p>

              {selectedWorkshop?.publication_date && (
                <div className="bg-ciprel-green-50 border border-ciprel-green-200 rounded-lg p-4">
                  <p className="text-sm text-ciprel-green-800 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Publié le {new Date(selectedWorkshop.publication_date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {/* Section Vidéo */}
              {selectedWorkshop?.video_url && (
                <div className="bg-gradient-to-r from-ciprel-orange-50 to-ciprel-green-50 border border-ciprel-orange-200 rounded-xl p-6">
                  <h4 className="font-bold text-ciprel-black mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-ciprel-orange-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Vidéo du workshop
                  </h4>
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                    {(() => {
                      const videoUrl = selectedWorkshop.video_url || ''
                      // Extraire l'ID YouTube si c'est un lien YouTube
                      const youtubeMatch = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                      if (youtubeMatch) {
                        return (
                          <iframe
                            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                            title={`Vidéo ${selectedWorkshop.metier_nom}`}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )
                      }
                      // Sinon, afficher comme lien externe
                      return (
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ciprel-orange-500 to-ciprel-green-500 text-white hover:opacity-90 transition-opacity"
                        >
                          <div className="text-center">
                            <svg className="h-16 w-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span className="font-semibold text-lg">Voir la vidéo</span>
                          </div>
                        </a>
                      )
                    })()}
                  </div>
                </div>
              )}

              <div className="bg-white border-2 border-ciprel-orange-200 rounded-xl p-6">
                <h4 className="font-bold text-ciprel-black mb-3 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-ciprel-orange-600" />
                  Ressources du workshop
                </h4>
                <p className="text-gray-600 mb-4">
                  Retrouvez tous les supports, documents et ressources nécessaires pour ce workshop sur notre espace OneDrive.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedWorkshop?.onedrive_link ? (
                    <a
                      href={selectedWorkshop.onedrive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-ciprel-green-600 text-white px-6 py-3 rounded-lg hover:bg-ciprel-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.8 12.4c-.8-.7-1.9-1.1-3-1.1-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5c1.1 0 2.2-.4 3-1.1.2-.2.2-.5 0-.7l-1.4-1.4c-.2-.2-.5-.2-.7 0-.4.3-.8.5-1.3.5-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2c.5 0 .9.2 1.3.5.2.2.5.2.7 0l1.4-1.4c.2-.2.2-.5 0-.7z" />
                      </svg>
                      Ouvrir sur OneDrive
                    </a>
                  ) : (
                    <div className="bg-gray-100 text-gray-500 px-6 py-3 rounded-lg inline-flex items-center justify-center">
                      Lien OneDrive non disponible
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (!selectedWorkshop) return

                      setWorkshopModalOpen(false)
                      resetQuiz()
                      setQuizConfig({ 
                        isOpen: true, 
                        type: 'WORKSHOP', 
                        metierId: selectedWorkshop.metier_id 
                      })
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-ciprel-orange-500 text-white px-6 py-3 rounded-lg hover:bg-ciprel-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <HelpCircle className="h-5 w-5" />
                    Questionnaire
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setWorkshopModalOpen(false)
                  setSelectedWorkshop(null)
                }}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Fermer
              </button>
            </div>
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
        {/* AuthModal est géré globalement par GlobalLoginGate dans layout.tsx */}
        {/* Pas besoin de dupliquer ici */}

        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
        />
      </Suspense>
    </div>
  )
}
