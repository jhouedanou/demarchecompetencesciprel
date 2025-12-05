'use client'

import { useState, useCallback, useEffect } from 'react'
import { authFetch } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Loader2, Edit2, Save, X, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import type { WorkshopMetier, WorkshopFonction } from '@/types/workshop-metier'
import {
  getPresentation,
  getRoles,
  getCompetences,
  getPartenariats,
  getTemoignage
} from '@/types/workshop-metier'

export function WorkshopsMetiersManager() {
  const [workshops, setWorkshops] = useState<WorkshopMetier[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Partial<WorkshopMetier>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const loadWorkshops = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authFetch('/api/admin/workshops-metiers')

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des workshops métiers')
      }

      const data = await response.json()
      setWorkshops(data.workshops || [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du chargement')
      setWorkshops([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWorkshops()
  }, [loadWorkshops])

  const handleToggleActive = async (workshop: WorkshopMetier) => {
    try {
      const response = await authFetch('/api/admin/workshops-metiers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: workshop.id,
          is_active: !workshop.is_active,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      toast.success(`Workshop ${!workshop.is_active ? 'activé' : 'désactivé'}`)
      loadWorkshops()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
    }
  }

  const handleStartEdit = (workshop: WorkshopMetier) => {
    setEditingId(workshop.id)
    setEditingData({ ...workshop })
    setExpandedId(workshop.id)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    try {
      const response = await authFetch('/api/admin/workshops-metiers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          ...editingData,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      toast.success('Workshop métier mis à jour')
      setEditingId(null)
      setEditingData({})
      loadWorkshops()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingData({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Workshops Métiers</h2>
        <p className="text-gray-600 mt-1">Gérez la visibilité des workshops métiers sur la page d'accueil</p>
      </div>

      {/* Liste des workshops */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="animate-spin text-ciprel-green-600" size={32} />
          </div>
        ) : workshops.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Aucun workshop métier trouvé</p>
            <p className="text-sm mt-2">Vérifiez que les données ont été importées dans Supabase</p>
          </div>
        ) : (
          <div className="divide-y">
            {workshops.map(workshop => (
              <div key={workshop.id} className="p-4">
                {/* En-tête du workshop */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{workshop.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{workshop.titre}</h3>
                      <p className="text-sm text-gray-500">{workshop.type} • {workshop.nombre_slides} slides</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Badge ordre */}
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      #{workshop.ordre}
                    </span>
                    
                    {/* Toggle actif/inactif */}
                    <button
                      onClick={() => handleToggleActive(workshop)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        workshop.is_active
                          ? 'bg-ciprel-green-100 text-ciprel-green-700 hover:bg-ciprel-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {workshop.is_active ? (
                        <>
                          <Eye size={16} /> Actif
                        </>
                      ) : (
                        <>
                          <EyeOff size={16} /> Inactif
                        </>
                      )}
                    </button>

                    {/* Bouton éditer */}
                    {editingId !== workshop.id && (
                      <button
                        onClick={() => handleStartEdit(workshop)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}

                    {/* Bouton expand/collapse */}
                    <button
                      onClick={() => setExpandedId(expandedId === workshop.id ? null : workshop.id)}
                      className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                    >
                      {expandedId === workshop.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Contenu étendu */}
                {expandedId === workshop.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {editingId === workshop.id ? (
                      /* Formulaire d'édition basique */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                            <input
                              type="text"
                              value={editingData.titre || ''}
                              onChange={e => setEditingData(prev => ({ ...prev, titre: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icône (emoji)</label>
                            <input
                              type="text"
                              value={editingData.icon || ''}
                              onChange={e => setEditingData(prev => ({ ...prev, icon: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur (gradient Tailwind)</label>
                            <input
                              type="text"
                              value={editingData.color || ''}
                              onChange={e => setEditingData(prev => ({ ...prev, color: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
                              placeholder="from-blue-500 to-blue-600"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
                            <input
                              type="number"
                              value={editingData.ordre || 0}
                              onChange={e => setEditingData(prev => ({ ...prev, ordre: parseInt(e.target.value) || 0 }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <p className="text-sm text-amber-800">
                            <strong>Note:</strong> Le contenu détaillé du workshop (présentation, rôles, compétences, etc.) 
                            est stocké en format JSONB dans la base de données. Pour modifier ce contenu, 
                            utilisez directement l'éditeur SQL de Supabase ou un script de migration.
                          </p>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex gap-3 pt-4 border-t">
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700"
                          >
                            <Save size={16} /> Enregistrer
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            <X size={16} /> Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Affichage en lecture seule */
                      <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-700">Description:</span>
                            <p className="text-gray-600 mt-1">{getPresentation(workshop) || '-'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Rôles:</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {getRoles(workshop).map((r: WorkshopFonction, i: number) => (
                                <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  {r.titre}
                                </span>
                              ))}
                              {getRoles(workshop).length === 0 && <span className="text-gray-400">-</span>}
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Témoignage:</span>
                          <p className="text-gray-600 mt-1 italic">"{getTemoignage(workshop) || '-'}"</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-700">Compétences (Savoirs):</span>
                            <ul className="mt-1 text-gray-600 list-disc list-inside">
                              {getCompetences(workshop).savoirs.slice(0, 3).map((s, i) => (
                                <li key={i} className="truncate">{s}</li>
                              ))}
                              {getCompetences(workshop).savoirs.length > 3 && (
                                <li className="text-gray-400">+ {getCompetences(workshop).savoirs.length - 3} autres...</li>
                              )}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Partenariats:</span>
                            <p className="text-gray-600 mt-1">
                              {getPartenariats(workshop).internes.length} internes, {getPartenariats(workshop).externes.length} externes
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
