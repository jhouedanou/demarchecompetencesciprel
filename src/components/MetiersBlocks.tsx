'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle } from 'lucide-react'

interface Metier {
  id: number
  slug: string
  titre: string
  periode: string
  phase: number | string
  statut: boolean
  ordre: number
  mission: string | null
  slogans: string[]
  competencesCles: any
  outils: string[]
}

interface ApiResponse {
  success: boolean
  count: number
  data: Metier[]
}

export function MetiersBlocks() {
  const [metiers, setMetiers] = useState<Metier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActiveMetiers()
  }, [])

  const fetchActiveMetiers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/metiers?active=true')
      const data: ApiResponse = await response.json()
      if (data.success) {
        setMetiers(data.data)
      }
    } catch (err) {
      console.error('Error fetching metiers:', err)
      setError('Impossible de charger les blocs métiers')
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

  if (metiers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucun bloc métier disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {metiers.map((metier) => (
        <div
          key={metier.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-ciprel-orange-600 to-ciprel-orange-700 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">{metier.titre}</h3>
                <div className="flex gap-3 mt-2 text-sm text-orange-100">
                  <span className="bg-black bg-opacity-20 px-2 py-1 rounded">{metier.periode}</span>
                  <span className={`px-2 py-1 rounded text-white font-medium ${
                    metier.phase === 'Introductive' ? 'bg-blue-500' : metier.phase === 1 ? 'bg-purple-500' : 'bg-indigo-500'
                  }`}>
                    {metier.phase === 'Introductive' ? 'Phase Introductive' : `Phase ${metier.phase}`}
                  </span>
                </div>
              </div>
              <Link
                href={`/metiers/${metier.slug}`}
                className="bg-white text-ciprel-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors whitespace-nowrap"
              >
                Découvrir
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {metier.mission && (
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide text-ciprel-orange-600">
                  Mission
                </h4>
                <p className="text-gray-700 leading-relaxed">{metier.mission}</p>
              </div>
            )}

            {metier.slogans.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide text-ciprel-orange-600">
                  Slogans
                </h4>
                <div className="space-y-2">
                  {metier.slogans.map((slogan, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <span className="text-ciprel-orange-600 font-bold flex-shrink-0">•</span>
                      <span className="text-gray-700">{slogan}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metier.competencesCles && (
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide text-ciprel-orange-600">
                  Compétences Clés
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {metier.competencesCles.savoir && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-900 mb-2">Savoir</h5>
                      <p className="text-sm text-blue-800">{metier.competencesCles.savoir}</p>
                    </div>
                  )}
                  {metier.competencesCles.savoirFaire && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-900 mb-2">Savoir-faire</h5>
                      <p className="text-sm text-green-800">{metier.competencesCles.savoirFaire}</p>
                    </div>
                  )}
                  {metier.competencesCles.savoirEtre && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h5 className="font-semibold text-purple-900 mb-2">Savoir-être</h5>
                      <p className="text-sm text-purple-800">{metier.competencesCles.savoirEtre}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {metier.outils.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide text-ciprel-orange-600">
                  Outils & Ressources
                </h4>
                <ul className="space-y-2">
                  {metier.outils.map((outil, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-ciprel-orange-600 font-bold">✓</span>
                      {outil}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
