'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, CheckCircle, LogOut, Brain, Link2, Edit2, Save, X, Calendar, RefreshCw } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'

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
  onedrive_url: string | null
  publication_date: string | null
}

interface ApiResponse {
  success: boolean
  count: number
  data: Metier[]
}

export default function AdminMetiersPage() {
  const { isAdminAuthenticated, adminUsername, logoutAdmin } = useAdmin()
  const { user } = useAuthStore()
  const router = useRouter()
  const [metiers, setMetiers] = useState<Metier[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [editingMetierId, setEditingMetierId] = useState<number | null>(null)
  const [editData, setEditData] = useState<{ onedrive_url?: string; publication_date?: string } | null>(null)

  // Redirect if not authenticated
  // Redirect if not authenticated
  useEffect(() => {
    const isSupabaseAdmin = user && ['ADMIN', 'MANAGER'].includes(user.role)
    if (!isAdminAuthenticated && !isSupabaseAdmin) {
      router.push('/admin')
    }
  }, [isAdminAuthenticated, user, router])

  // Fetch metiers on mount
  useEffect(() => {
    fetchMetiers()
  }, [])

  const fetchMetiers = async () => {
    try {
      console.log('🔍 [Admin Métiers] Fetching métiers from /api/metiers...')
      setLoading(true)
      const response = await fetch('/api/metiers')
      console.log('🔍 [Admin Métiers] Response status:', response.status)
      const data: ApiResponse = await response.json()
      console.log('🔍 [Admin Métiers] Data received:', data)
      if (data.success) {
        console.log('✅ [Admin Métiers] Setting métiers:', data.data.length, 'items')
        setMetiers(data.data)
      } else {
        console.error('❌ [Admin Métiers] API returned success:false')
      }
    } catch (error) {
      console.error('❌ [Admin Métiers] Error fetching metiers:', error)
      setMessage({ type: 'error', text: 'Erreur lors du chargement des blocs' })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: number) => {
    const metier = metiers.find(m => m.id === id)
    if (!metier) return

    try {
      setSaving(true)
      const response = await fetch('/api/metiers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          statut: !metier.statut
        })
      })

      if (response.ok) {
        const updatedMetier = metiers.find(m => m.id === id)
        if (updatedMetier) {
          updatedMetier.statut = !updatedMetier.statut
          setMetiers([...metiers])
          setMessage({ type: 'success', text: `${metier.titre} ${!metier.statut ? 'activé' : 'désactivé'}` })
        }
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' })
      }
    } catch (error) {
      console.error('Error updating metier:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' })
    } finally {
      setSaving(false)
    }
  }

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = metiers.findIndex(m => m.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= metiers.length) return

    // Swap ordre values
    const metier1 = metiers[currentIndex]
    const metier2 = metiers[newIndex]
    const tempOrdre = metier1.ordre
    metier1.ordre = metier2.ordre
    metier2.ordre = tempOrdre

    try {
      setSaving(true)
      const responses = await Promise.all([
        fetch('/api/metiers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: metier1.id, ordre: metier1.ordre })
        }),
        fetch('/api/metiers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: metier2.id, ordre: metier2.ordre })
        })
      ])

      // Check if both updates succeeded
      if (responses.every(r => r.ok)) {
        // Re-sort the list by ordre to reflect the new order
        const sortedMetiers = [...metiers].sort((a, b) => a.ordre - b.ordre)
        setMetiers(sortedMetiers)
        setMessage({ type: 'success', text: 'Ordre mis à jour' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Failed to update order')
      }
    } catch (error) {
      console.error('Error reordering:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la réorganisation' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditMetier = (metier: Metier) => {
    setEditingMetierId(metier.id)
    setEditData({
      onedrive_url: metier.onedrive_url || '',
      publication_date: metier.publication_date || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingMetierId(null)
    setEditData(null)
  }

  const handleSaveMetier = async (id: number) => {
    if (!editData) return
    console.log('💾 [Admin Métiers] Saving métier:', { id, editData })
    try {
      setSaving(true)
      const response = await fetch('/api/metiers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          onedrive_url: editData.onedrive_url,
          publication_date: editData.publication_date
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('💾 [Admin Métiers] Save result:', result)
        setMetiers(prev => prev.map(m =>
          m.id === id ? { ...m, onedrive_url: editData.onedrive_url || null, publication_date: editData.publication_date || null } : m
        ))
        setEditingMetierId(null)
        setEditData(null)
        setMessage({ type: 'success', text: 'Métier mis à jour avec succès' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
      }
    } catch (error) {
      console.error('Save error:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
    } finally {
      setSaving(false)
    }
  }

  if (!isAdminAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-ciprel-orange-600" />
          <p className="text-gray-600">Chargement des blocs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Métiers</h1>
              <p className="text-gray-600 mt-2">Gérez l'activation et l'ordre d'affichage des blocs métiers</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Connecté en tant que: <strong>{adminUsername || user?.email}</strong>
              </span>
              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    logoutAdmin()
                    router.push('/admin')
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div
            className={`p-4 rounded-lg flex gap-3 items-start ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>{message.text}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {metiers.map((metier) => (
            <div key={metier.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => setExpandedId(expandedId === metier.id ? null : metier.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleStatus(metier.id)
                          }}
                          disabled={saving}
                          className={`w-12 h-6 rounded-full transition-colors flex items-center justify-center ${metier.statut ? 'bg-green-500' : 'bg-gray-300'
                            } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span className="text-white text-xs font-bold">{metier.statut ? 'ON' : 'OFF'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{metier.titre}</h3>
                      <div className="flex gap-3 mt-1 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">{metier.periode}</span>
                        <span className={`px-2 py-1 rounded text-white ${metier.phase === 'Introductive' ? 'bg-blue-500' : metier.phase === 1 ? 'bg-purple-500' : 'bg-indigo-500'}`}>
                          {metier.phase === 'Introductive' ? 'Intro' : `Phase ${metier.phase}`}
                        </span>
                        <span className="text-gray-500">Ordre: {metier.ordre}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 ml-4">
                  {/* Questions button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/admin/metiers/${metier.id}/questions`)
                    }}
                    className="p-2 hover:bg-ciprel-green-100 rounded text-ciprel-green-600 transition-colors"
                    title="Gérer les questions"
                  >
                    <Brain className="h-5 w-5" />
                  </button>

                  {/* Reorder buttons */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReorder(metier.id, 'up')
                    }}
                    disabled={metiers[0].id === metier.id || saving}
                    className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Déplacer vers le haut"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReorder(metier.id, 'down')
                    }}
                    disabled={metiers[metiers.length - 1].id === metier.id || saving}
                    className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Déplacer vers le bas"
                  >
                    ↓
                  </button>
                </div>
              </div>

              {/* Workshop Section */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  {/* OneDrive Link */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Lien OneDrive</label>
                    {editingMetierId === metier.id ? (
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editData?.onedrive_url || ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, onedrive_url: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {metier.onedrive_url ? (
                          <a
                            href={metier.onedrive_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ciprel-green-600 hover:text-ciprel-green-700 text-sm flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link2 className="h-4 w-4" />
                            Voir
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">Non défini</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Publication Date */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Date de publication</label>
                    {editingMetierId === metier.id ? (
                      <input
                        type="date"
                        value={editData?.publication_date ? editData.publication_date.split('T')[0] : ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, publication_date: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {metier.publication_date ? (
                          <span className="text-gray-700 text-sm flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-ciprel-green-600" />
                            {new Date(metier.publication_date).toLocaleDateString('fr-FR')}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Non définie</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit/Save Buttons */}
                <div className="mt-3 flex gap-2">
                  {editingMetierId === metier.id ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSaveMetier(metier.id)
                        }}
                        className="inline-flex items-center px-3 py-1 bg-ciprel-green-600 text-white rounded text-sm hover:bg-ciprel-green-700"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Sauvegarder
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCancelEdit()
                        }}
                        className="inline-flex items-center px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditMetier(metier)
                      }}
                      className="inline-flex items-center px-3 py-1 bg-ciprel-orange-500 text-white rounded text-sm hover:bg-ciprel-orange-600"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Éditer Workshop
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded content (optional details) */}
              {expandedId === metier.id && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="space-y-4">
                    {metier.mission && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Mission</h4>
                        <p className="text-gray-700 text-sm">{metier.mission}</p>
                      </div>
                    )}

                    {metier.competencesCles && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Compétences Clés</h4>
                        <div className="space-y-2 text-sm">
                          {metier.competencesCles.savoir && (
                            <p>
                              <span className="font-medium text-gray-900">Savoir:</span> {metier.competencesCles.savoir}
                            </p>
                          )}
                          {metier.competencesCles.savoirFaire && (
                            <p>
                              <span className="font-medium text-gray-900">Savoir-faire:</span> {metier.competencesCles.savoirFaire}
                            </p>
                          )}
                          {metier.competencesCles.savoirEtre && (
                            <p>
                              <span className="font-medium text-gray-900">Savoir-être:</span> {metier.competencesCles.savoirEtre}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {metier.slogans.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Slogans</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {metier.slogans.map((slogan, idx) => (
                            <li key={idx}>{slogan}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {metier.outils.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Outils</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {metier.outils.map((outil, idx) => (
                            <li key={idx}>{outil}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
