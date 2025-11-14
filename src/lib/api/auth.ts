/**
 * Server-side API authentication utilities
 * Handles JWT token validation and user session management
 */

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Extract JWT token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader) {
    return null
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.warn('[API Auth] Invalid Authorization header format')
    return null
  }

  return parts[1]
}

/**
 * Get authenticated user from JWT token
 * Returns user and supabase client if authenticated, null otherwise
 */
export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = extractToken(request)

    if (!token) {
      console.warn('[API Auth] No token provided in request')
      return null
    }

    // Create Supabase client with the user's token
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Verify the token and get the user
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error) {
      console.error('[API Auth] Token validation error:', error.message)
      return null
    }

    if (!user) {
      console.warn('[API Auth] No user found for token')
      return null
    }

    console.log('[API Auth] User authenticated:', user.email)

    // Create a new client with the user's token for database queries
    const authenticatedClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    return {
      user,
      supabase: authenticatedClient,
    }
  } catch (error) {
    console.error('[API Auth] Exception during authentication:', error)
    return null
  }
}

/**
 * Check if user has admin or manager role
 */
export async function checkAdminPermissions(
  userId: string,
  supabase: ReturnType<typeof createClient<Database>>
): Promise<{ allowed: boolean; role?: string }> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('[API Auth] Error fetching profile:', error)
      return { allowed: false }
    }

    if (!profile) {
      console.warn('[API Auth] No profile found for user:', userId)
      return { allowed: false }
    }

    const allowed = ['ADMIN', 'MANAGER'].includes(profile.role)

    if (!allowed) {
      console.warn('[API Auth] User does not have admin permissions:', userId, 'Role:', profile.role)
    }

    return { allowed, role: profile.role }
  } catch (error) {
    console.error('[API Auth] Exception checking permissions:', error)
    return { allowed: false }
  }
}

/**
 * Middleware-like function to protect admin routes
 * Returns authenticated user and supabase client or error response data
 */
export async function requireAdmin(request: NextRequest): Promise<
  | { user: any; supabase: any; error: null }
  | { user: null; supabase: null; error: { message: string; status: number } }
> {
  const authResult = await getAuthenticatedUser(request)

  if (!authResult) {
    return {
      user: null,
      supabase: null,
      error: {
        message: 'Non autorisé - Token invalide ou manquant',
        status: 401,
      },
    }
  }

  const { user, supabase } = authResult

  const { allowed, role } = await checkAdminPermissions(user.id, supabase)

  if (!allowed) {
    return {
      user: null,
      supabase: null,
      error: {
        message: 'Permissions insuffisantes - Accès réservé aux administrateurs',
        status: 403,
      },
    }
  }

  console.log('[API Auth] Admin access granted:', user.email, 'Role:', role)

  return {
    user,
    supabase,
    error: null,
  }
}
