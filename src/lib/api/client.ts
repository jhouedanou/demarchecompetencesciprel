/**
 * API Client utilities for authenticated requests
 * Handles JWT token injection for server-side authentication
 * Supports both Supabase JWT auth and local admin auth
 */

import { supabase } from '@/lib/supabase/client'

const ADMIN_STORAGE_KEY = 'ciprel_admin_auth'

// Module-level token cache to avoid repeated getSession() calls
let cachedToken: string | null = null
let tokenCacheTimestamp = 0
const TOKEN_CACHE_TTL = 30_000 // 30 seconds

/**
 * Check if local admin is authenticated
 */
function isLocalAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const savedAuth = localStorage.getItem(ADMIN_STORAGE_KEY)
    if (savedAuth) {
      const auth = JSON.parse(savedAuth)
      return auth.isAuthenticated === true
    }
  } catch {
    // Ignore errors
  }
  return false
}

/**
 * Get the current user's JWT access token (with 30s in-memory cache)
 * @returns The JWT token or null if not authenticated
 */
export async function getAccessToken(): Promise<string | null> {
  // Return cached token if still fresh
  if (cachedToken && (Date.now() - tokenCacheTimestamp < TOKEN_CACHE_TTL)) {
    return cachedToken
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('[API Client] Error getting session:', error)
      cachedToken = null
      return null
    }

    if (!session?.access_token) {
      console.warn('[API Client] No access token in session')
      cachedToken = null
      return null
    }

    // Cache the token
    cachedToken = session.access_token
    tokenCacheTimestamp = Date.now()
    return cachedToken
  } catch (error) {
    console.error('[API Client] Exception getting token:', error)
    cachedToken = null
    return null
  }
}

/**
 * Invalidate the cached token (e.g. on sign-out)
 */
export function clearTokenCache(): void {
  cachedToken = null
  tokenCacheTimestamp = 0
}

/**
 * Fetch wrapper that automatically adds JWT token to requests
 * Use this instead of native fetch() for authenticated API calls
 * Supports both Supabase JWT auth and local admin auth
 *
 * @example
 * const data = await authFetch('/api/admin/users')
 * const result = await authFetch('/api/admin/questions', { method: 'POST', body: {...} })
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAccessToken()
  const isLocalAdmin = isLocalAdminAuthenticated()

  const headers = new Headers(options.headers || {})

  // Add Authorization header with JWT token if available
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  } else if (isLocalAdmin) {
    headers.set('X-Admin-Auth', 'local-admin-authenticated')
  } else {
    console.warn('[authFetch] No token available for request:', url)
  }

  // Ensure Content-Type is set for JSON requests
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    return response
  } catch (error) {
    console.error('[authFetch] Fetch error:', url, error)
    throw error
  }
}

/**
 * Helper function for GET requests
 */
export async function authGet(url: string): Promise<Response> {
  return authFetch(url, { method: 'GET' })
}

/**
 * Helper function for POST requests
 */
export async function authPost(
  url: string,
  data: any
): Promise<Response> {
  return authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

/**
 * Helper function for PUT requests
 */
export async function authPut(
  url: string,
  data: any
): Promise<Response> {
  return authFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

/**
 * Helper function for DELETE requests
 */
export async function authDelete(url: string): Promise<Response> {
  return authFetch(url, { method: 'DELETE' })
}
