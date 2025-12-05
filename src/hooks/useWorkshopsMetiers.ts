import { useState, useEffect, useCallback } from 'react'
import type { WorkshopMetier } from '@/types/workshop-metier'

interface UseWorkshopsMetiersReturn {
  workshopsMetiers: WorkshopMetier[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useWorkshopsMetiers(): UseWorkshopsMetiersReturn {
  const [workshopsMetiers, setWorkshopsMetiers] = useState<WorkshopMetier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkshopsMetiers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/workshops-metiers')
      const result = await response.json()
      
      if (result.success) {
        // Les données sont déjà au format WorkshopMetier depuis l'API
        setWorkshopsMetiers(result.data as WorkshopMetier[])
      } else {
        setError(result.error || 'Erreur lors du chargement')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error('Erreur useWorkshopsMetiers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkshopsMetiers()
  }, [fetchWorkshopsMetiers])

  return {
    workshopsMetiers,
    loading,
    error,
    refetch: fetchWorkshopsMetiers
  }
}
