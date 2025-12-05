'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  WorkshopMetier,
  getObjectifs,
  getPresentation,
  getRoles,
  getCompetences,
  getPartenariats,
  getTemoignage,
  isIntroductionWorkshop,
  isJobFocusWorkshop
} from '@/types/workshop-metier'
import {
  X,
  Target,
  Users,
  BookOpen,
  CheckCircle2,
  Building2,
  Globe,
  Quote,
  Play
} from 'lucide-react'
import { useState } from 'react'

interface WorkshopMetierModalProps {
  workshop: WorkshopMetier | null
  isOpen: boolean
  onClose: () => void
}

export function WorkshopMetierModal({ workshop, isOpen, onClose }: WorkshopMetierModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'competences' | 'interactions'>('overview')

  if (!workshop) return null

  // Extraction des données selon la nouvelle structure JSONB
  const presentation = getPresentation(workshop)
  const roles = getRoles(workshop)
  const competences = getCompetences(workshop)
  const partenariats = getPartenariats(workshop)
  const temoignage = getTemoignage(workshop)

  // Extraction des piliers (structure variable selon le workshop)
  const piliers = workshop.contenu.presentation?.piliers || []
  const piliersArray = Array.isArray(piliers)
    ? piliers
    : (typeof piliers === 'object' ? Object.values(piliers).flat() : [])

  // Extraire l'ID YouTube si une URL vidéo est fournie
  const getYouTubeId = (url: string) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : null
  }

  const youtubeId = workshop.fichier ? null : null // Pour l'instant pas de vidéo YouTube

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <DialogTitle className="sr-only">{workshop.titre}</DialogTitle>

        {/* Header */}
        <div className={`bg-gradient-to-r ${workshop.color} p-6 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-5xl">{workshop.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{workshop.titre}</h2>
              <p className="text-white/80">{workshop.nombre_slides} slides</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="flex gap-1 px-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Target },
              { id: 'roles', label: 'Rôles', icon: Users },
              { id: 'competences', label: 'Compétences', icon: BookOpen },
              { id: 'interactions', label: 'Interactions', icon: Globe },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-ciprel-orange-500 text-ciprel-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {/* Tab: Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Vidéo si disponible */}
              {youtubeId && (
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg mb-6">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={workshop.titre}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Définition du métier */}
              {presentation && (
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold text-ciprel-black mb-4">Présentation du métier</h3>
                  <p className="text-gray-700 text-lg italic mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-ciprel-orange-500">
                    "{presentation}"
                  </p>

                  {piliersArray.length > 0 && (
                    <>
                      <h4 className="font-semibold text-ciprel-black mb-3">Piliers fondamentaux</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {piliersArray.map((pilier: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg bg-gray-100 border border-gray-200">
                            <span className="text-gray-800 font-medium">
                              {typeof pilier === 'string' ? pilier : pilier?.titre || JSON.stringify(pilier)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Témoignage */}
              {temoignage && (
                <div className="bg-gradient-to-br from-ciprel-orange-50 to-white rounded-xl p-6 border border-ciprel-orange-200">
                  <div className="flex items-start gap-3">
                    <Quote className="h-8 w-8 text-ciprel-orange-500 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 text-lg italic">"{temoignage}"</p>
                      <p className="text-ciprel-orange-600 font-semibold mt-3">— Témoignage collaborateur</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Rôles */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-ciprel-black mb-6">Les rôles au sein du département</h3>
              <div className="grid gap-4">
                {roles.map((role, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-ciprel-orange-100">
                        <Users className="h-6 w-6 text-ciprel-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-ciprel-black text-lg">{role.titre}</h4>
                        <p className="text-gray-600 mt-2">{role.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Compétences */}
          {activeTab === 'competences' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-ciprel-black mb-6">Référentiel de compétences</h3>

              {/* Savoirs */}
              {competences.savoirs.length > 0 && (
                <div className="bg-ciprel-green-50 rounded-xl p-6 border-t-4 border-ciprel-green-500">
                  <h4 className="font-bold text-ciprel-green-700 text-lg mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Savoirs (Connaissances)
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {competences.savoirs.map((savoir, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-ciprel-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{savoir}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Savoir-faire */}
              {competences.savoir_faire.length > 0 && (
                <div className="bg-ciprel-orange-50 rounded-xl p-6 border-t-4 border-ciprel-orange-500">
                  <h4 className="font-bold text-ciprel-orange-700 text-lg mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Savoir-faire (Compétences techniques)
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {competences.savoir_faire.map((sf, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-ciprel-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{sf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Savoir-être */}
              {competences.savoir_etre.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-6 border-t-4 border-blue-500">
                  <h4 className="font-bold text-blue-700 text-lg mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Savoir-être (Compétences comportementales)
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {competences.savoir_etre.map((se, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{se}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab: Interactions */}
          {activeTab === 'interactions' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-ciprel-black mb-6">Écosystème relationnel</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Interactions internes */}
                {partenariats.internes.length > 0 && (
                  <div className="bg-ciprel-green-50 rounded-xl p-6 border-t-4 border-ciprel-green-500">
                    <h4 className="font-bold text-ciprel-green-700 text-lg mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Interactions internes
                    </h4>
                    <ul className="space-y-2">
                      {partenariats.internes.map((int, idx) => (
                        <li key={idx} className="flex items-center gap-2 bg-white p-3 rounded-lg">
                          <span className="w-2 h-2 rounded-full bg-ciprel-green-500" />
                          <span className="text-gray-700">{int}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactions externes */}
                {partenariats.externes.length > 0 && (
                  <div className="bg-ciprel-orange-50 rounded-xl p-6 border-t-4 border-ciprel-orange-500">
                    <h4 className="font-bold text-ciprel-orange-700 text-lg mb-4 flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Interactions externes
                    </h4>
                    <ul className="space-y-2">
                      {partenariats.externes.map((ext, idx) => (
                        <li key={idx} className="flex items-center gap-2 bg-white p-3 rounded-lg">
                          <span className="w-2 h-2 rounded-full bg-ciprel-orange-500" />
                          <span className="text-gray-700">{ext}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
