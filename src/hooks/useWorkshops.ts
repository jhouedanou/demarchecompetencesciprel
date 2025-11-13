import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

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

      const { data, error: fetchError } = await (supabase
        .from('workshops' as any)
        .select('*')
        .order('metier_id', { ascending: true }) as any)

      if (fetchError) throw fetchError

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

      const { data, error: updateError } = await (supabase
        .from('workshops' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single() as any)

      if (updateError) throw updateError

      // Mettre à jour la liste locale
      if (data) {
        setWorkshops(prev =>
          prev.map(w => w.id === id ? data : w)
        )
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du workshop'
      setError(errorMessage)
      console.error('Error updating workshop:', err)
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
