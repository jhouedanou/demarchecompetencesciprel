import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import type { Database } from '@/types/database'
import type { User } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Vérification en développement
if (process.env.NODE_ENV === 'development') {
  console.log('🔑 [Supabase Config] URL:', supabaseUrl ? `✅ ${supabaseUrl}` : '❌ Manquante')
  console.log('🔑 [Supabase Config] Key:', supabaseAnonKey ? `✅ ${supabaseAnonKey.substring(0, 20)}...` : '❌ Manquante')
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [Supabase Config] Missing environment variables!')
  throw new Error('Missing Supabase environment variables')
}

console.log('⚡ [Supabase Config] Initializing Supabase client...')

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

// Hook to get current user avec cache
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const startTime = performance.now()
    console.log('🔄 [useUser] Starting session check...')

    // Essayer de charger depuis le cache localStorage en premier
    const cachedSession = typeof window !== 'undefined'
      ? localStorage.getItem('supabase.auth.token')
      : null

    if (cachedSession) {
      console.log('💾 [useUser] Found cached session, using it immediately')
      // Charger immédiatement depuis le cache pour une UX plus rapide
      try {
        const parsed = JSON.parse(cachedSession)
        if (parsed?.currentSession?.user) {
          setUser(parsed.currentSession.user)
          setLoading(false)
          console.log('⚡ [useUser] Loaded from cache in <1ms')
        }
      } catch (e) {
        console.warn('⚠️ [useUser] Failed to parse cached session')
      }
    }

    // Timeout de sécurité pour éviter un loading infini
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        const elapsed = performance.now() - startTime
        console.warn(`⚠️ [useUser] Session check timeout after ${elapsed.toFixed(0)}ms - forcing loading to false`)
        setLoading(false)
      }
    }, 3000) // 3 secondes max (réduit de 5s)

    // Get initial session
    const getSession = async () => {
      try {
        console.log('📡 [useUser] Calling supabase.auth.getSession()...')
        const sessionStartTime = performance.now()

        const { data: { session }, error } = await supabase.auth.getSession()

        const sessionElapsed = performance.now() - sessionStartTime
        console.log(`✅ [useUser] getSession() completed in ${sessionElapsed.toFixed(0)}ms`)

        if (error) {
          console.error('❌ [useUser] Error getting session:', error)
        } else {
          console.log(`👤 [useUser] Session status: ${session ? 'LOGGED IN' : 'NOT LOGGED IN'}`)
          if (session?.user) {
            console.log(`📧 [useUser] User email: ${session.user.email}`)
          }
        }

        if (isMounted) {
          setUser(session?.user ?? null)
          setLoading(false)
          clearTimeout(timeoutId)

          const totalElapsed = performance.now() - startTime
          console.log(`✨ [useUser] Total session check completed in ${totalElapsed.toFixed(0)}ms`)
        }
      } catch (error) {
        const errorElapsed = performance.now() - startTime
        console.error(`❌ [useUser] Exception getting session after ${errorElapsed.toFixed(0)}ms:`, error)
        if (isMounted) {
          setLoading(false)
          clearTimeout(timeoutId)
        }
      }
    }

    getSession()

    // Listen for auth changes
    console.log('👂 [useUser] Setting up auth state listener...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`🔔 [useUser] Auth state changed: ${event}`)
        if (isMounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      }
    )

    return () => {
      console.log('🧹 [useUser] Cleaning up...')
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