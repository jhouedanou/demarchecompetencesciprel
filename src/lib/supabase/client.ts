import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import type { Database } from '@/types/database'
import type { User } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Vérification en développement
if (process.env.NODE_ENV === 'development') {
  console.log('🔑 Supabase URL:', supabaseUrl ? '✅ Chargée' : '❌ Manquante')
  console.log('🔑 Supabase Key:', supabaseAnonKey ? '✅ Chargée' : '❌ Manquante')
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

// Hook to get current user
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Timeout de sécurité pour éviter un loading infini
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('⚠️ Session check timeout - setting loading to false')
        setLoading(false)
      }
    }, 5000) // 5 secondes max

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        if (isMounted) {
          setUser(session?.user ?? null)
          setLoading(false)
          clearTimeout(timeoutId)
        }
      } catch (error) {
        console.error('Exception getting session:', error)
        if (isMounted) {
          setLoading(false)
          clearTimeout(timeoutId)
        }
      }
    }

    getSession()

    // Listen for auth changes
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