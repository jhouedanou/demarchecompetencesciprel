'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

interface Metier {
  id: number
  slug: string
  titre: string
  periode: string
  phase: number | string
  statut: boolean
  ordre: number
  description: string | null
  mission: string | null
  definitionEtObjectifs: string | null
  beneficesPourCiprel: string | null
  beneficesPourPersonnel: string | null
  laCompetence: any
  slogans: string[]
  competencesCles: any
  outils: string[]
}

interface ApiResponse {
  success: boolean
  count: number
  data: Metier[]
}

export function MetiersHome() {
  const [metier, setMetier] = useState<Metier | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActiveMetier()
  }, [])

  const fetchActiveMetier = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/metiers?active=true')
      const data: ApiResponse = await response.json()
      if (data.success && data.data.length > 0) {
        // Get the first (primary) active metier
        setMetier(data.data[0])
      }
    } catch (err) {
      console.error('Error fetching metier:', err)
      setError('Impossible de charger le contenu de la démarche')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-ciprel-orange-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900">Erreur</h3>
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!metier) {
    return null
  }

  const phaseLabel =
    metier.phase === 'Introductive' ? 'Phase Introductive' : `Phase ${metier.phase}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{metier.titre}</h2>
            <div className="flex gap-3 flex-wrap">
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {metier.periode}
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${
                  metier.phase === 'Introductive' ? 'bg-blue-500' : metier.phase === 1 ? 'bg-purple-500' : 'bg-indigo-500'
                }`}
              >
                {phaseLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission */}
      {metier.mission && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-ciprel-orange-600">•</span> Mission
          </h3>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 p-6">
            <p className="text-lg text-gray-800 leading-relaxed">{metier.mission}</p>
          </div>
        </section>
      )}

      {/* Description */}
      {metier.description && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-ciprel-orange-600">•</span> Description
          </h3>
          <p className="text-gray-700 leading-relaxed">{metier.description}</p>
        </section>
      )}

      {/* Definition et Objectifs */}
      {metier.definitionEtObjectifs && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-ciprel-orange-600">•</span> Définition et Objectifs
          </h3>
          <p className="text-gray-700 leading-relaxed">{metier.definitionEtObjectifs}</p>
        </section>
      )}

      {/* Benefices */}
      {(metier.beneficesPourCiprel || metier.beneficesPourPersonnel) && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-ciprel-orange-600">•</span> Bénéfices
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {metier.beneficesPourCiprel && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                <h4 className="font-bold text-blue-900 mb-2">Pour CIPREL</h4>
                <p className="text-blue-800 leading-relaxed">{metier.beneficesPourCiprel}</p>
              </div>
            )}
            {metier.beneficesPourPersonnel && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
                <h4 className="font-bold text-green-900 mb-2">Pour le Personnel</h4>
                <p className="text-green-800 leading-relaxed">{metier.beneficesPourPersonnel}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Competences Cles */}
      {metier.competencesCles && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-ciprel-orange-600">•</span> Compétences Clés
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {metier.competencesCles.savoir && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                <h4 className="font-bold text-blue-900 mb-2">Savoir</h4>
                <p className="text-blue-800 leading-relaxed">{metier.competencesCles.savoir}</p>
              </div>
            )}
            {metier.competencesCles.savoirFaire && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
                <h4 className="font-bold text-green-900 mb-2">Savoir-faire</h4>
                <p className="text-green-800 leading-relaxed">{metier.competencesCles.savoirFaire}</p>
              </div>
            )}
            {metier.competencesCles.savoirEtre && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
                <h4 className="font-bold text-purple-900 mb-2">Savoir-être</h4>
                <p className="text-purple-800 leading-relaxed">{metier.competencesCles.savoirEtre}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Slogans */}
      {metier.slogans.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-ciprel-orange-600">•</span> Slogans
          </h3>
          <div className="space-y-3">
            {metier.slogans.map((slogan, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-ciprel-orange-600 p-4 rounded"
              >
                <p className="text-gray-800 italic">"{slogan}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Outils */}
      {metier.outils.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-ciprel-orange-600">•</span> Outils & Ressources
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
            {metier.outils.map((outil, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-ciprel-orange-600 font-bold mt-1">✓</span>
                <span className="text-gray-700">{outil}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* La Competence */}
      {metier.laCompetence && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-ciprel-orange-600">•</span> La Compétence
          </h3>
          <div className="space-y-4">
            {metier.laCompetence.definition && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
                <h4 className="font-bold text-indigo-900 mb-2">Définition</h4>
                <p className="text-indigo-800">{metier.laCompetence.definition}</p>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-4">
              {metier.laCompetence.savoir && (
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <h5 className="font-semibold text-blue-900 mb-2">Savoir</h5>
                  <p className="text-sm text-blue-800">{metier.laCompetence.savoir}</p>
                </div>
              )}
              {metier.laCompetence.savoirFaire && (
                <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                  <h5 className="font-semibold text-green-900 mb-2">Savoir-faire</h5>
                  <p className="text-sm text-green-800">{metier.laCompetence.savoirFaire}</p>
                </div>
              )}
              {metier.laCompetence.savoirEtre && (
                <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                  <h5 className="font-semibold text-purple-900 mb-2">Savoir-être</h5>
                  <p className="text-sm text-purple-800">{metier.laCompetence.savoirEtre}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
