import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { authFetch } from '@/lib/api/client'

export interface Workshop {
  id: number
  metier_id: number
  metier_nom: string
  is_active: boolean
  publication_date: string | null
  onedrive_link: string | null
  created_at: string
  updated_at: string
}

export const useWorkshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Récupérer tous les workshops (publics ou pour les admins)
  const getWorkshops = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Try API endpoint first (for admins with JWT auth)
      try {
        const response = await authFetch('/api/admin/workshops')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()
        setWorkshops(data.workshops || [])
        return
      } catch (apiErr) {
        console.warn('API endpoint failed, falling back to direct Supabase query:', apiErr)
      }

      // Fallback: Direct Supabase query (for non-admin users viewing active workshops)
      const { data, error: fetchError } = await (supabase
        .from('workshops' as any)
        .select('*')
        .order('metier_id', { ascending: true }) as any)

      if (fetchError) throw fetchError

      console.log('[useWorkshops] Fetched workshops:', data)
      setWorkshops(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des workshops'
      setError(errorMessage)
      console.error('Error fetching workshops:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Récupérer un workshop spécifique par ID du métier
  const getWorkshopByMetierId = useCallback(async (metierId: number) => {
    try {
      const { data, error: fetchError } = await (supabase
        .from('workshops' as any)
        .select('*')
        .eq('metier_id', metierId)
        .single() as any)

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      return data || null
    } catch (err) {
      console.error('Error fetching workshop:', err)
      return null
    }
  }, [])

  // Créer un nouveau workshop
  const createWorkshop = useCallback(async (workshop: Omit<Workshop, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null)

      const { data, error: insertError } = await (supabase
        .from('workshops' as any)
        .insert([workshop])
        .select()
        .single() as any)

      if (insertError) throw insertError

      // Mettre à jour la liste locale
      if (data) {
        setWorkshops(prev => [...prev, data])
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du workshop'
      setError(errorMessage)
      console.error('Error creating workshop:', err)
      return null
    }
  }, [])

  // Mettre à jour un workshop existant
  const updateWorkshop = useCallback(async (id: number, updates: Partial<Workshop>) => {
    try {
      setError(null)

      console.log('[useWorkshops] Updating workshop:', { id, updates })

      // Use API endpoint for authenticated requests
      const response = await authFetch('/api/admin/workshops', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      })

      console.log('[useWorkshops] API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[useWorkshops] API error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      const workshop = data.workshop

      console.log('[useWorkshops] Workshop updated successfully:', workshop)

      // Mettre à jour la liste locale
      if (workshop) {
        setWorkshops(prev =>
          prev.map(w => w.id === id ? workshop : w)
        )
      }

      return workshop
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du workshop'
      setError(errorMessage)
      console.error('[useWorkshops] Error updating workshop:', err)
      return null
    }
  }, [])

  // Supprimer un workshop
  const deleteWorkshop = useCallback(async (id: number) => {
    try {
      setError(null)

      const { error: deleteError } = await (supabase
        .from('workshops' as any)
        .delete()
        .eq('id', id) as any)

      if (deleteError) throw deleteError

      // Mettre à jour la liste locale
      setWorkshops(prev => prev.filter(w => w.id !== id))

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du workshop'
      setError(errorMessage)
      console.error('Error deleting workshop:', err)
      return false
    }
  }, [])

  // Activer/désactiver un workshop
  const toggleWorkshopActive = useCallback(async (id: number, isActive: boolean) => {
    return updateWorkshop(id, { is_active: !isActive })
  }, [updateWorkshop])

  // Charger les workshops au montage du composant
  useEffect(() => {
    getWorkshops()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('workshops-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workshops'
        },
        (payload) => {
          console.log('[useWorkshops] Real-time update received:', payload)
          getWorkshops()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [getWorkshops])

  return {
    workshops,
    loading,
    error,
    getWorkshops,
    getWorkshopByMetierId,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    toggleWorkshopActive,
  }
}
