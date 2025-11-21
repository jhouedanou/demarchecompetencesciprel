import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect } from 'react'
import type { Database } from '@/types/database'
import type { User } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Vérifier si Supabase est configuré
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

// Client-side Supabase client using SSR for cookie management
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

// Hook to get current user avec cache
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Si Supabase n'est pas configuré, terminer immédiatement le chargement
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - user will be null')
      setUser(null)
      setLoading(false)
      return
    }

    let isMounted = true
    // Réduire le timeout à 5 secondes au lieu de 10
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth session check timed out after 5s')
        setLoading(false)
      }
    }, 5000)

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error.message)
        }

        if (isMounted) {
          setUser(session?.user ?? null)
          setLoading(false)
          clearTimeout(timeoutId)
        }
      } catch (error) {
        console.error('Exception getting session:', error)
        if (isMounted) {
          setUser(null)
          setLoading(false)
          clearTimeout(timeoutId)
        }
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      }
    )

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}

// Create user client (for components that need the client)
export function createUserClient() {
  return supabase
}

// Export the client as default for convenience
export default supabase