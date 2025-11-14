'use client'

import { useState } from 'react'
import { useWorkshops, type Workshop } from '@/hooks/useWorkshops'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, X, Edit2, Save, Calendar, Link as LinkIcon } from 'lucide-react'

const METIERS = [
  { id: 1, nom: 'Production' },
  { id: 2, nom: 'SIDT' },
  { id: 3, nom: 'Maintenance' },
  { id: 4, nom: 'QSE-RSE/Sûreté' },
  { id: 5, nom: 'Contrôle Interne' },
  { id: 6, nom: 'Stocks' },
  { id: 7, nom: 'RH/Juridique' },
  { id: 8, nom: 'Services Généraux' },
  { id: 9, nom: 'DFC' },
  { id: 10, nom: 'Projets' },
  { id: 11, nom: 'Achats & Logistique' },
  { id: 12, nom: 'Direction' }
]

export default function WorkshopsAdminPage() {
  const { workshops, loading, error, updateWorkshop, toggleWorkshopActive } = useWorkshops()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<Workshop> | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  // Note: Les workshops doivent être initialisés depuis Supabase Dashboard
  // Voir ADMIN_WORKSHOPS_GUIDE.md pour les instructions

  const handleEdit = (workshop: Workshop) => {
    setEditingId(workshop.id)
    setEditData({ ...workshop })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData(null)
  }

  const handleSave = async () => {
    if (!editingId || !editData) return

    const success = await updateWorkshop(editingId, editData)
    if (success) {
      setSuccessMessage('Workshop mis à jour avec succès!')
      setTimeout(() => setSuccessMessage(''), 3000)
      setEditingId(null)
      setEditData(null)
    }
  }

  const handleToggleActive = async (workshop: Workshop) => {
    await toggleWorkshopActive(workshop.id, workshop.is_active)
  }

  if (loading && workshops.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ciprel-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ciprel-black mb-2">
            Gestion des Workshops Métiers
          </h1>
          <p className="text-gray-600">
            Configurez les liens OneDrive et activez/désactivez les workshops par métier
          </p>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Erreur: {error}</p>
          </div>
        )}

        {/* Tableau des workshops */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Métier</th>
                  <th className="px-6 py-4 text-left font-semibold">Statut</th>
                  <th className="px-6 py-4 text-left font-semibold">Date de publication</th>
                  <th className="px-6 py-4 text-left font-semibold">Lien OneDrive</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {workshops
                  .sort((a, b) => a.metier_id - b.metier_id)
                  .map((workshop) => (
                    <tr key={workshop.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{workshop.metier_nom}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(workshop)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            editingId === workshop.id ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          } ${
                            workshop.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          disabled={editingId === workshop.id}
                        >
                          {workshop.is_active ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Inactif
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === workshop.id ? (
                          <input
                            type="date"
                            value={editData?.publication_date ? editData.publication_date.split('T')[0] : ''}
                            onChange={(e) => setEditData(prev => prev ? {
                              ...prev,
                              publication_date: e.target.value ? new Date(e.target.value).toISOString() : null
                            } : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ciprel-green-500"
                          />
                        ) : (
                          <span className="text-gray-600 flex items-center">
                            {workshop.publication_date ? (
                              <>
                                <Calendar className="h-4 w-4 mr-2 text-ciprel-green-600" />
                                {new Date(workshop.publication_date).toLocaleDateString('fr-FR')}
                              </>
                            ) : (
                              <span className="text-gray-400">Non définie</span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === workshop.id ? (
                          <input
                            type="url"
                            placeholder="https://..."
                            value={editData?.onedrive_link || ''}
                            onChange={(e) => setEditData(prev => prev ? {
                              ...prev,
                              onedrive_link: e.target.value || null
                            } : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ciprel-green-500 text-sm"
                          />
                        ) : workshop.onedrive_link ? (
                          <a
                            href={workshop.onedrive_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-ciprel-green-600 hover:text-ciprel-green-700 transition-colors"
                          >
                            <LinkIcon className="h-4 w-4 mr-1" />
                            Voir
                          </a>
                        ) : (
                          <span className="inline-flex items-center text-gray-400 cursor-not-allowed opacity-60">
                            <LinkIcon className="h-4 w-4 mr-1" />
                            Non défini
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {editingId === workshop.id ? (
                            <>
                              <button
                                onClick={handleSave}
                                className="inline-flex items-center px-3 py-2 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700 transition-colors"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Sauvegarder
                              </button>
                              <button
                                onClick={handleCancel}
                                className="inline-flex items-center px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEdit(workshop)}
                              className="inline-flex items-center px-3 py-2 bg-ciprel-orange-500 text-white rounded-lg hover:bg-ciprel-orange-600 transition-colors"
                            >
                              <Edit2 className="h-4 w-4 mr-1" />
                              Éditer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}