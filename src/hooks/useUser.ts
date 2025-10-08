import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const startTime = performance.now()
    console.log('🔄 [useUser] Starting session check...')

    async function checkSession() {
      try {
        console.log('📡 [useUser] Calling /api/auth/session...')
        const sessionStartTime = performance.now()

        const response = await fetch('/api/auth/session', {
          credentials: 'include', // Important pour envoyer les cookies
        })

        const sessionElapsed = performance.now() - sessionStartTime
        console.log(`✅ [useUser] /api/auth/session completed in ${sessionElapsed.toFixed(0)}ms`)

        const { user: sessionUser } = await response.json()

        if (isMounted) {
          setUser(sessionUser)
          setLoading(false)

          const totalElapsed = performance.now() - startTime
          console.log(`✨ [useUser] Total session check completed in ${totalElapsed.toFixed(0)}ms`)

          if (sessionUser) {
            console.log(`👤 [useUser] User: ${sessionUser.email}`)
          } else {
            console.log('👤 [useUser] No user logged in')
          }
        }
      } catch (error) {
        const errorElapsed = performance.now() - startTime
        console.error(`❌ [useUser] Session check failed after ${errorElapsed.toFixed(0)}ms:`, error)

        if (isMounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [])

  return { user, loading }
}
