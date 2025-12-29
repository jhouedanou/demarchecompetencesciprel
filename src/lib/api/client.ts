/**
 * API Client utilities for authenticated requests
 * Handles JWT token injection for server-side authentication
 * Supports both Supabase JWT auth and local admin auth
 */

import { supabase } from '@/lib/supabase/client'

const ADMIN_STORAGE_KEY = 'ciprel_admin_auth'

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
 * Get the current user's JWT access token
 * @returns The JWT token or null if not authenticated
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('[API Client] Error getting session:', error)
      return null
    }

    if (!session?.access_token) {
      console.warn('[API Client] No access token in session')
      return null
    }

    return session.access_token
  } catch (error) {
    console.error('[API Client] Exception getting token:', error)
    return null
  }
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
    console.log('[authFetch] Token added to request:', url)
  } else if (isLocalAdmin) {
    // If no JWT but local admin is authenticated, add admin auth header
    headers.set('X-Admin-Auth', 'local-admin-authenticated')
    console.log('[authFetch] Local admin auth header added to request:', url)
  } else {
    console.warn('[authFetch] No token available for request:', url)
  }

  // Ensure Content-Type is set for JSON requests
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  console.log('[authFetch] Request details:', {
    method: options.method || 'GET',
    url,
    hasToken: !!token,
    hasLocalAdmin: isLocalAdmin
  })

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    console.log('[authFetch] Response:', {
      url,
      status: response.status,
      statusText: response.statusText
    })

    return response
  } catch (error) {
    console.error('[authFetch] Fetch error:', {
      url,
      error
    })
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
