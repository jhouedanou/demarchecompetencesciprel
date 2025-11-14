'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Calendar, ExternalLink, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Workshop } from '@/hooks/useWorkshops'

export default function WorkshopsListPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadActiveWorkshops()
  }, [])

  const loadActiveWorkshops = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await (supabase
        .from('workshops' as any)
        .select('*')
        .eq('is_active', true)
        .order('metier_id', { ascending: true }) as any)

      if (fetchError) throw fetchError

      setWorkshops(data || [])
    } catch (err) {
      console.error('Error loading workshops:', err)
      setError('Impossible de charger les workshops. Veuillez réessayer plus tard.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-ciprel-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des workshops...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Erreur de chargement</h2>
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={loadActiveWorkshops}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  if (workshops.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-ciprel-black mb-4">
              Aucun workshop disponible
            </h1>
            <p className="text-gray-600 text-lg">
              Les workshops métiers seront bientôt disponibles. Revenez plus tard !
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-ciprel-black mb-4">
            Workshops Métiers CIPREL
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos workshops dédiés à chaque métier. Accédez aux ressources, 
            présentations et documents de travail.
          </p>
        </div>

        {/* Grille de workshops */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-ciprel-green-500"
            >
              {/* En-tête de carte */}
              <div className="bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {workshop.metier_nom}
                </h2>
              </div>

              {/* Contenu de carte */}
              <div className="p-6">
                {/* Date de publication */}
                {workshop.publication_date && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <Calendar className="h-5 w-5 mr-2 text-ciprel-orange-500" />
                    <span className="text-sm">
                      Publié le {new Date(workshop.publication_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {/* Badge actif */}
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    Workshop actif
                  </span>
                </div>

                {/* Bouton d'accès */}
                {workshop.onedrive_link ? (
                  <a
                    href={workshop.onedrive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-ciprel-orange-500 hover:bg-ciprel-orange-600 text-white font-semibold py-3 rounded-lg transition-colors group">
                      <span>Accéder au workshop</span>
                      <ExternalLink className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                ) : (
                  <Button 
                    disabled 
                    className="w-full bg-gray-200 text-gray-500 cursor-not-allowed py-3 rounded-lg"
                  >
                    Lien non disponible
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer informatif */}
        <div className="mt-16 text-center">
          <div className="bg-ciprel-green-50 border border-ciprel-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-ciprel-green-800 mb-2">
              Besoin d'aide ?
            </h3>
            <p className="text-ciprel-green-700">
              Pour toute question concernant les workshops, contactez votre responsable 
              de métier ou l'équipe RH.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
