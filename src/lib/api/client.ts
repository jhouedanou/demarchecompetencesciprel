/**
 * API Client utilities for authenticated requests
 * Handles JWT token injection for server-side authentication
 */

import { supabase } from '@/lib/supabase/client'

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

    return session?.access_token || null
  } catch (error) {
    console.error('[API Client] Exception getting token:', error)
    return null
  }
}

/**
 * Fetch wrapper that automatically adds JWT token to requests
 * Use this instead of native fetch() for authenticated API calls
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

  const headers = new Headers(options.headers || {})

  // Add Authorization header with JWT token
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  // Ensure Content-Type is set for JSON requests
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(url, {
    ...options,
    headers,
  })
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
