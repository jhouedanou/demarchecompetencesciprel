'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '@/lib/api/client'
import { AdminLoadingScreen } from '@/components/admin/AdminLoadingScreen'
import toast from 'react-hot-toast'
import {
  Loader2,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  GripVertical,
  RefreshCw,
  FileText,
  Users,
  BookOpen,
  Users2,
  Quote,
  Download,
  HelpCircle,
  ExternalLink,
  Link
} from 'lucide-react'
import type { WorkshopMetier, WorkshopFonction, WorkshopContenu } from '@/types/workshop-metier'

// Types pour l'édition
interface EditableWorkshop extends Partial<WorkshopMetier> {
  contenu?: WorkshopContenu
}

export function WorkshopsMetiersAdminUnified() {
  const router = useRouter()
  const [workshops, setWorkshops] = useState<WorkshopMetier[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<EditableWorkshop>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'general' | 'presentation' | 'organisation' | 'competences' | 'partenariats' | 'temoignage' | 'ressources'>('general')

  const loadWorkshops = useCallback(async () => {
    try {
      setLoading(true)
      console.log('[WorkshopsAdmin] Loading workshops...')
      const response = await authFetch('/api/admin/workshops-metiers')

      console.log('[WorkshopsAdmin] Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[WorkshopsAdmin] Error response:', errorData)
        throw new Error(errorData.error || 'Erreur lors du chargement des workshops métiers')
      }

      const data = await response.json()
      console.log('[WorkshopsAdmin] Workshops loaded:', data.workshops?.length || 0)
      setWorkshops(data.workshops || [])
    } catch (error) {
      console.error('[WorkshopsAdmin] Load error:', error)
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
    setEditingData({ 
      ...workshop,
      video: workshop.video || '',
      onedrive: workshop.onedrive || '',
      contenu: workshop.contenu ? JSON.parse(JSON.stringify(workshop.contenu)) : {}
    })
    setExpandedId(workshop.id)
    setActiveTab('general')
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    try {
      setSaving(true)
      
      const payload = {
        id: editingId,
        titre: editingData.titre,
        icon: editingData.icon,
        color: editingData.color,
        ordre: editingData.ordre,
        is_active: editingData.is_active,
        video: editingData.video || '',
        onedrive: editingData.onedrive || '',
        support_url: editingData.support_url || '',
        referentiel_url: editingData.referentiel_url || '',
        contenu: editingData.contenu,
      }
      
      console.log('Saving workshop with payload:', payload)
      
      // Timeout de 30 secondes
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      try {
        const response = await authFetch('/api/admin/workshops-metiers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Error response:', errorData)
          throw new Error(errorData.error || 'Erreur lors de la mise à jour')
        }

        const result = await response.json()
        console.log('Save result:', result)
        
        toast.success('Workshop métier mis à jour')
        setEditingId(null)
        setEditingData({})
        loadWorkshops()
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('La requête a pris trop de temps (timeout)')
        }
        throw fetchError
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingData({})
  }

  // Fonctions utilitaires pour éditer le contenu JSONB
  const updateContenu = (path: string[], value: any) => {
    setEditingData(prev => {
      const newData = { ...prev }
      if (!newData.contenu) newData.contenu = {}
      
      let current: any = newData.contenu
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {}
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      
      return newData
    })
  }

  const getContenuValue = (path: string[], defaultValue: any = '') => {
    if (!editingData.contenu) return defaultValue
    let current: any = editingData.contenu
    for (const key of path) {
      if (current && current[key] !== undefined) {
        current = current[key]
      } else {
        return defaultValue
      }
    }
    return current
  }

  // Composant pour éditer un tableau de strings
  const StringArrayEditor = ({ 
    label, 
    path, 
    placeholder = 'Ajouter un élément...' 
  }: { 
    label: string
    path: string[]
    placeholder?: string 
  }) => {
    // Récupérer les données et les normaliser en tableau
    const rawValue = getContenuValue(path, [])
    
    // Fonction pour normaliser les données en tableau de strings
    const normalizeToArray = (value: any): string[] => {
      if (Array.isArray(value)) {
        return value.map(item => typeof item === 'string' ? item : JSON.stringify(item))
      }
      if (typeof value === 'string') {
        // Essayer de parser si c'est du JSON
        try {
          const parsed = JSON.parse(value)
          if (Array.isArray(parsed)) return parsed
          if (parsed.activites && Array.isArray(parsed.activites)) {
            // Format {"activites": [...], "part": "80%"}
            const prefix = parsed.part ? `(${parsed.part}) ` : ''
            return parsed.activites.map((a: string) => prefix + a)
          }
          return [value]
        } catch {
          return [value]
        }
      }
      if (typeof value === 'object' && value !== null) {
        // Gérer le format {"activites": [...], "part": "80%"}
        if (value.activites && Array.isArray(value.activites)) {
          const prefix = value.part ? `(${value.part}) ` : ''
          return value.activites.map((a: string) => prefix + a)
        }
        return []
      }
      return []
    }
    
    const items = normalizeToArray(rawValue)
    const [newItem, setNewItem] = useState('')

    const addItem = () => {
      if (newItem.trim()) {
        updateContenu(path, [...items, newItem.trim()])
        setNewItem('')
      }
    }

    const removeItem = (index: number) => {
      updateContenu(path, items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, value: string) => {
      const newItems = [...items]
      newItems[index] = value
      updateContenu(path, newItems)
    }

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addItem}
            className="p-2 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    )
  }

  // Composant pour éditer les fonctions/rôles
  const FonctionsEditor = ({ path }: { path: string[] }) => {
    const fonctions = getContenuValue(path, []) as WorkshopFonction[]
    
    const addFonction = () => {
      updateContenu(path, [...fonctions, { titre: '', role: '' }])
    }

    const removeFonction = (index: number) => {
      updateContenu(path, fonctions.filter((_, i) => i !== index))
    }

    const updateFonction = (index: number, field: 'titre' | 'role', value: string) => {
      const newFonctions = [...fonctions]
      newFonctions[index] = { ...newFonctions[index], [field]: value }
      updateContenu(path, newFonctions)
    }

    return (
      <div className="space-y-4">
        {fonctions.map((fonction, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Fonction #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeFonction(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Titre du poste</label>
                <input
                  type="text"
                  value={fonction.titre || ''}
                  onChange={(e) => updateFonction(index, 'titre', e.target.value)}
                  placeholder="Ex: Responsable QSE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ciprel-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description du rôle</label>
                <textarea
                  value={fonction.role || ''}
                  onChange={(e) => updateFonction(index, 'role', e.target.value)}
                  placeholder="Décrivez les responsabilités..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ciprel-green-500"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addFonction}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-ciprel-green-500 hover:text-ciprel-green-600 transition-colors"
        >
          <Plus size={18} />
          Ajouter une fonction
        </button>
      </div>
    )
  }

  // Rendu des onglets d'édition
  const renderEditTabs = (workshop: WorkshopMetier) => {
    const tabs = [
      { id: 'general', label: 'Général', icon: FileText },
      { id: 'presentation', label: 'Présentation', icon: FileText },
      { id: 'organisation', label: 'Organisation', icon: Users },
      { id: 'competences', label: 'Compétences', icon: BookOpen },
      { id: 'partenariats', label: 'Partenariats', icon: Users2 },
      { id: 'temoignage', label: 'Témoignage', icon: Quote },
      { id: 'ressources', label: 'Ressources', icon: Download },
    ] as const

    return (
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-ciprel-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    )
  }

  // Rendu du contenu d'édition selon l'onglet
  const renderEditContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                value={editingData.titre || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, titre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icône (emoji)</label>
              <input
                type="text"
                value={editingData.icon || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur (classes Tailwind)</label>
              <input
                type="text"
                value={editingData.color || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="Ex: from-blue-500 to-blue-600"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
              <input
                type="number"
                value={editingData.ordre || 0}
                onChange={(e) => setEditingData(prev => ({ ...prev, ordre: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">🎬 URL Vidéo</label>
              <input
                type="url"
                value={editingData.video || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, video: e.target.value }))}
                placeholder="https://www.youtube.com/embed/... ou URL de la vidéo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Lien vers la vidéo du workshop (YouTube, Vimeo, etc.)</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">📁 Lien OneDrive</label>
              <input
                type="url"
                value={editingData.onedrive || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, onedrive: e.target.value }))}
                placeholder="https://onedrive.live.com/... ou lien de partage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Lien vers les ressources OneDrive du workshop</p>
            </div>
          </div>
        )

      case 'presentation':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description du métier</label>
              <textarea
                value={getContenuValue(['presentation', 'description'], '')}
                onChange={(e) => updateContenu(['presentation', 'description'], e.target.value)}
                rows={4}
                placeholder="Description générale du métier ou du pôle..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
            </div>
            
            <StringArrayEditor
              label="Entités/Piliers"
              path={['presentation', 'piliers']}
              placeholder="Ajouter un pilier..."
            />
            
            <StringArrayEditor
              label="Domaines d'activité"
              path={['presentation', 'domaines']}
              placeholder="Ajouter un domaine..."
            />
          </div>
        )

      case 'organisation':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800">Fonctions et rôles</h4>
            <FonctionsEditor path={['organisation', 'fonctions']} />
          </div>
        )

      case 'competences':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <BookOpen size={18} />
                  Savoir (Connaissances)
                </h4>
                <StringArrayEditor
                  label=""
                  path={['referentiel', 'savoir']}
                  placeholder="Ajouter une connaissance..."
                />
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Users size={18} />
                  Savoir-faire (Pratique)
                </h4>
                <StringArrayEditor
                  label=""
                  path={['referentiel', 'savoir_faire']}
                  placeholder="Ajouter un savoir-faire..."
                />
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Users2 size={18} />
                  Savoir-être (Comportement)
                </h4>
                <StringArrayEditor
                  label=""
                  path={['referentiel', 'savoir_etre']}
                  placeholder="Ajouter un savoir-être..."
                />
              </div>
            </div>
          </div>
        )

      case 'partenariats':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-3">Partenaires internes</h4>
                <StringArrayEditor
                  label=""
                  path={['partenariats', 'internes']}
                  placeholder="Ajouter un partenaire interne..."
                />
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-3">Partenaires externes</h4>
                <StringArrayEditor
                  label=""
                  path={['partenariats', 'externes']}
                  placeholder="Ajouter un partenaire externe..."
                />
              </div>
            </div>
          </div>
        )

      case 'temoignage':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Citation principale</label>
              <textarea
                value={typeof getContenuValue(['temoignage'], '') === 'string' 
                  ? getContenuValue(['temoignage'], '')
                  : getContenuValue(['temoignage', 'citation'], '')}
                onChange={(e) => {
                  // Si c'était une string, la convertir en objet
                  const current = getContenuValue(['temoignage'], {})
                  if (typeof current === 'string') {
                    updateContenu(['temoignage'], { citation: e.target.value, signature: '' })
                  } else {
                    updateContenu(['temoignage', 'citation'], e.target.value)
                  }
                }}
                rows={4}
                placeholder="Citation ou témoignage du métier..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature / Slogan</label>
              <input
                type="text"
                value={getContenuValue(['temoignage', 'signature'], '')}
                onChange={(e) => updateContenu(['temoignage', 'signature'], e.target.value)}
                placeholder="Ex: Nos compétences, notre énergie."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
            </div>
            
            <StringArrayEditor
              label="Points de fierté"
              path={['temoignage', 'points_fierte']}
              placeholder="Ajouter un point de fierté..."
            />
          </div>
        )

      case 'ressources':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800">Ressources téléchargeables</h4>
                  <p className="text-sm text-blue-600">
                    Ajoutez les liens vers les ressources du workshop (support de présentation, référentiel, etc.)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Link size={16} />
                URL du support de présentation
              </label>
              <input
                type="url"
                value={editingData.support_url || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, support_url: e.target.value }))}
                placeholder="https://onedrive.com/... ou autre lien direct"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Lien vers le fichier PowerPoint ou PDF du support</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Link size={16} />
                URL du référentiel de compétences
              </label>
              <input
                type="url"
                value={editingData.referentiel_url || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, referentiel_url: e.target.value }))}
                placeholder="https://onedrive.com/... ou autre lien direct"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Lien vers le document du référentiel métier</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Link size={16} />
                Lien OneDrive général (optionnel)
              </label>
              <input
                type="url"
                value={editingData.onedrive || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, onedrive: e.target.value }))}
                placeholder="https://onedrive.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Dossier OneDrive contenant toutes les ressources</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Link size={16} />
                URL de la vidéo du workshop (optionnel)
              </label>
              <input
                type="url"
                value={editingData.video || ''}
                onChange={(e) => setEditingData(prev => ({ ...prev, video: e.target.value }))}
                placeholder="https://youtube.com/... ou https://onedrive.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Lien vers une vidéo de présentation du workshop</p>
            </div>

            {/* Aperçu des ressources configurées */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-gray-800 mb-3">Aperçu des ressources</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className={editingData.support_url ? 'text-green-600' : 'text-gray-400'}>
                    {editingData.support_url ? '✓' : '○'}
                  </span>
                  <span className={editingData.support_url ? 'text-gray-700' : 'text-gray-400'}>
                    Support de présentation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={editingData.referentiel_url ? 'text-green-600' : 'text-gray-400'}>
                    {editingData.referentiel_url ? '✓' : '○'}
                  </span>
                  <span className={editingData.referentiel_url ? 'text-gray-700' : 'text-gray-400'}>
                    Référentiel de compétences
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={editingData.onedrive ? 'text-green-600' : 'text-gray-400'}>
                    {editingData.onedrive ? '✓' : '○'}
                  </span>
                  <span className={editingData.onedrive ? 'text-gray-700' : 'text-gray-400'}>
                    Dossier OneDrive
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={editingData.video ? 'text-green-600' : 'text-gray-400'}>
                    {editingData.video ? '✓' : '○'}
                  </span>
                  <span className={editingData.video ? 'text-gray-700' : 'text-gray-400'}>
                    Vidéo du workshop
                  </span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Workshops Métiers</h2>
          <p className="text-gray-600 mt-1">Gérez la visibilité et le contenu des workshops métiers</p>
        </div>
        <button
          onClick={loadWorkshops}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Liste des workshops */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <AdminLoadingScreen message="Chargement des workshops" />
        ) : workshops.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Aucun workshop métier trouvé</p>
            <p className="text-sm mt-2">Vérifiez que les données ont été importées dans Supabase</p>
          </div>
        ) : (
          <div className="divide-y">
            {workshops.sort((a, b) => a.ordre - b.ordre).map(workshop => (
              <div key={workshop.id} className="p-4">
                {/* En-tête du workshop */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{workshop.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{workshop.titre}</h3>
                      <p className="text-sm text-gray-500">
                        {workshop.type === 'introduction_generale' ? 'Introduction générale' : 'Workshop métier'} • {workshop.nombre_slides} slides
                      </p>
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
                        title="Éditer le contenu"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}

                    {/* Bouton gérer les questions du quiz */}
                    <button
                      onClick={() => router.push(`/admin/workshops-metiers/${workshop.id}/questions`)}
                      className="flex items-center gap-1 px-3 py-1.5 text-purple-600 hover:bg-purple-50 rounded-lg text-sm font-medium"
                      title="Gérer les questions du quiz"
                    >
                      <HelpCircle size={16} />
                      Quiz
                    </button>

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
                      /* Formulaire d'édition complet */
                      <div className="space-y-4">
                        {renderEditTabs(workshop)}
                        {renderEditContent()}

                        {/* Boutons de sauvegarde */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                          >
                            <X size={18} />
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700 disabled:opacity-50"
                          >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Aperçu du contenu */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Présentation */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-gray-500" />
                            Présentation
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {workshop.contenu?.presentation?.description || 'Non définie'}
                          </p>
                        </div>

                        {/* Organisation */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <Users size={16} className="text-gray-500" />
                            Organisation
                          </h4>
                          <p className="text-sm text-gray-600">
                            {workshop.contenu?.organisation?.fonctions?.length || 0} fonction(s) définie(s)
                          </p>
                        </div>

                        {/* Compétences */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <BookOpen size={16} className="text-gray-500" />
                            Compétences
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Savoir: {workshop.contenu?.referentiel?.savoir?.length || 0}</p>
                            <p>Savoir-faire: {workshop.contenu?.referentiel?.savoir_faire?.length || 0}</p>
                            <p>Savoir-être: {workshop.contenu?.referentiel?.savoir_etre?.length || 0}</p>
                          </div>
                        </div>

                        {/* Partenariats */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <Users2 size={16} className="text-gray-500" />
                            Partenariats
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Internes: {workshop.contenu?.partenariats?.internes?.length || 0}</p>
                            <p>Externes: {workshop.contenu?.partenariats?.externes?.length || 0}</p>
                          </div>
                        </div>

                        {/* Témoignage */}
                        <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <Quote size={16} className="text-gray-500" />
                            Témoignage
                          </h4>
                          <p className="text-sm text-gray-600 italic line-clamp-2">
                            {typeof workshop.contenu?.temoignage === 'string' 
                              ? workshop.contenu.temoignage 
                              : workshop.contenu?.temoignage?.citation || 'Non défini'}
                          </p>
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
