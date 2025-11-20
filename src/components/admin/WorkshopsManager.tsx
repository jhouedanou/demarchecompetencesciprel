'use client'

import { useState, useCallback, useEffect } from 'react'
import { authFetch } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Loader2, Edit2, Save, X } from 'lucide-react'

interface Workshop {
  id: number
  metier_id: number
  metier_nom: string
  is_active: boolean
  publication_date: string | null
  onedrive_link: string | null
  created_at: string
  updated_at: string
}

export function WorkshopsManager() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Partial<Workshop>>({})

  const loadWorkshops = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authFetch('/api/admin/workshops')

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des workshops')
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

  const handleToggleActive = async (workshop: Workshop) => {
    try {
      const response = await authFetch('/api/admin/workshops', {
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

  const handleStartEdit = (workshop: Workshop) => {
    setEditingId(workshop.id)
    setEditingData({ ...workshop })
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    try {
      const response = await authFetch('/api/admin/workshops', {
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

      toast.success('Workshop mis à jour')
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
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Workshops</h2>
        <p className="text-gray-600 mt-1">Activez ou désactivez les workshops des métiers</p>
      </div>

      {/* Liste des workshops */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : workshops.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Aucun workshop trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Métier</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Lien OneDrive</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date de publication</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {workshops.map(workshop => (
                  <tr key={workshop.id} className="hover:bg-gray-50">
                    {editingId === workshop.id ? (
                      <>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {workshop.metier_nom}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <input
                            type="text"
                            value={editingData.onedrive_link || ''}
                            onChange={e =>
                              setEditingData(prev => ({
                                ...prev,
                                onedrive_link: e.target.value,
                              }))
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="URL OneDrive"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <input
                            type="date"
                            value={
                              editingData.publication_date
                                ? editingData.publication_date.split('T')[0]
                                : ''
                            }
                            onChange={e => {
                              const date = e.target.value ? new Date(e.target.value).toISOString() : null
                              setEditingData(prev => ({
                                ...prev,
                                publication_date: date,
                              }))
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editingData.is_active ?? false}
                              onChange={e =>
                                setEditingData(prev => ({
                                  ...prev,
                                  is_active: e.target.checked,
                                }))
                              }
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {editingData.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </label>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              title="Enregistrer"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Annuler"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {workshop.metier_nom}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {workshop.onedrive_link ? (
                            <a
                              href={workshop.onedrive_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate block"
                            >
                              {workshop.onedrive_link.length > 50
                                ? workshop.onedrive_link.substring(0, 50) + '...'
                                : workshop.onedrive_link}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {workshop.publication_date
                            ? new Date(workshop.publication_date).toLocaleDateString('fr-FR')
                            : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              workshop.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {workshop.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleStartEdit(workshop)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleToggleActive(workshop)}
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                workshop.is_active
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {workshop.is_active ? 'Désactiver' : 'Activer'}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">À propos des Workshops</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Les workshops inactifs ne s'affichent pas sur la plateforme publique</li>
          <li>Les admins peuvent voir tous les workshops (actifs et inactifs)</li>
          <li>Vous pouvez ajouter un lien OneDrive pour chaque workshop</li>
          <li>La date de publication est facultative</li>
        </ul>
      </div>
    </div>
  )
}
