'use client'

import { Heart, Users, Scale, Hand, Lightbulb, Smile, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

const FEERIC_VALUES = [
  {
    letter: 'F',
    title: 'Force du collectif',
    description: 'Ensemble, nous sommes plus forts. La collaboration et la solidarité sont au cœur de notre culture.',
    icon: Users,
    color: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-900'
  },
  {
    letter: 'E',
    title: 'Engagement',
    description: 'Nous nous engageons pleinement dans nos missions avec passion et dévouement pour l\'excellence.',
    icon: Heart,
    color: 'bg-red-50 border-red-200',
    textColor: 'text-red-900'
  },
  {
    letter: 'E',
    title: 'Équité',
    description: 'L\'égalité des chances et le respect de chacun sont des principes fondamentaux.',
    icon: Scale,
    color: 'bg-amber-50 border-amber-200',
    textColor: 'text-amber-900'
  },
  {
    letter: 'R',
    title: 'Respect',
    description: 'Le respect mutuel envers tous crée un environnement de travail sain et productif.',
    icon: Hand,
    color: 'bg-green-50 border-green-200',
    textColor: 'text-green-900'
  },
  {
    letter: 'I',
    title: 'Innovation',
    description: 'L\'innovation constante nous permet de rester à la pointe et de relever les défis de demain.',
    icon: Lightbulb,
    color: 'bg-yellow-50 border-yellow-200',
    textColor: 'text-yellow-900'
  },
  {
    letter: 'C',
    title: 'Convivialité',
    description: 'Un environnement convivial crée des relations positives et renforce la cohésion d\'équipe.',
    icon: Smile,
    color: 'bg-purple-50 border-purple-200',
    textColor: 'text-purple-900'
  }
]

export function FEERICValues() {
  const swiperRef = useRef<any>(null)

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <span className="bg-gradient-to-r from-ciprel-orange-600 to-ciprel-orange-700 text-white px-3 py-1 rounded-lg">
            FEERIC
          </span>
          <span>Les Valeurs Comportementales de CIPREL</span>
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Les valeurs FEERIC sont les compétences comportementales fondamentales de CIPREL. Elles représentent nos principes éthiques et sont une composante essentielle du <strong>Savoir-être</strong> attendu de chaque collaborateur.
        </p>
      </div>

      {/* Values Slider */}
      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="feeric-swiper"
        >
          {FEERIC_VALUES.map((value, idx) => {
            const Icon = value.icon
            return (
              <SwiperSlide key={idx}>
                <div className={`${value.color} border rounded-xl p-8 transition-transform hover:scale-105 h-full`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${value.textColor}`} />
                      </div>
                    </div>
                    <div>
                      <div className={`text-3xl font-bold ${value.textColor}`}>{value.letter}</div>
                      <h3 className={`text-xl font-bold ${value.textColor}`}>{value.title}</h3>
                    </div>
                  </div>
                  <p className={`${value.textColor} opacity-85 leading-relaxed`}>
                    {value.description}
                  </p>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute -left-14 top-1/2 -translate-y-1/2 z-10 bg-ciprel-orange-500 text-white p-3 rounded-full hover:bg-ciprel-orange-600 transition-colors shadow-lg hidden lg:flex items-center justify-center"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute -right-14 top-1/2 -translate-y-1/2 z-10 bg-ciprel-orange-500 text-white p-3 rounded-full hover:bg-ciprel-orange-600 transition-colors shadow-lg hidden lg:flex items-center justify-center"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Context and Application */}
      <div className="bg-gradient-to-r from-ciprel-orange-50 to-yellow-50 rounded-xl border border-orange-200 p-8 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ancrage et Contexte d'Application</h3>
          <p className="text-gray-700 leading-relaxed">
            Ces valeurs sont centrales dans l'ancrage de la culture d'entreprise et se retrouvent dans tous nos processus :
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Formation */}
          <div className="bg-white rounded-lg p-6 border border-orange-100">
            <h4 className="text-lg font-bold text-ciprel-orange-600 mb-3">Formation des Intégrants & Recyclage</h4>
            <p className="text-gray-700">
              La formation dédiée aux nouveaux intégrants et au recyclage a pour objectif de faire prendre connaissance des valeurs FEERIC et d'initier l'ancrage des valeurs au quotidien.
            </p>
          </div>

          {/* Savoir-être */}
          <div className="bg-white rounded-lg p-6 border border-orange-100">
            <h4 className="text-lg font-bold text-ciprel-orange-600 mb-3">Savoir-être Métier</h4>
            <p className="text-gray-700">
              Le Savoir-être est une composante clé de la compétence. Pour tous les métiers mis à l'honneur, le savoir-être requis inclut spécifiquement le portage des valeurs FEERIC.
            </p>
          </div>
        </div>

        {/* Key Industries */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Métiers Impliquant les Valeurs FEERIC</h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-ciprel-orange-600 font-bold">●</span>
              <div>
                <p className="font-semibold text-gray-900">Production</p>
                <p className="text-gray-700">Force du collectif, Engagement, Équité, Respect, Innovation, Convivialité</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-ciprel-orange-600 font-bold">●</span>
              <div>
                <p className="font-semibold text-gray-900">Maintenance</p>
                <p className="text-gray-700">Traduction des valeurs comportementales FEERIC dans les actes quotidiens</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-ciprel-orange-600 font-bold">●</span>
              <div>
                <p className="font-semibold text-gray-900">QSE-RSE et Sûreté</p>
                <p className="text-gray-700">Respect, Engagement, Convivialité, Responsabilité, Équité mis en évidence dans les missions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Message */}
      <div className="bg-gradient-to-r from-ciprel-green-50 to-ciprel-green-100 rounded-xl border border-ciprel-green-200 p-8 text-center">
        <h4 className="text-2xl font-bold text-ciprel-green-900 mb-3">L'essence de notre Culture</h4>
        <p className="text-ciprel-green-800 text-lg leading-relaxed">
          Les valeurs FEERIC ne sont pas simplement des principes énoncés, mais des comportements à vivre au quotidien. Elles façonnent notre culture, nos décisions et nos relations. En incarnant ces valeurs, chaque collaborateur contribue à faire de CIPREL une entreprise où la <strong>performance durable</strong> rime avec <strong>bien-être collectif</strong>.
        </p>
      </div>
    </div>
  )
}
