/**
 * Server-side API authentication utilities
 * Handles JWT token validation and user session management
 */

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Check if admin local authentication header is present
 */
export function checkAdminLocalAuth(request: NextRequest): boolean {
  const adminAuthHeader = request.headers.get('X-Admin-Auth')
  return adminAuthHeader === 'local-admin-authenticated'
}

/**
 * Create a service role Supabase client for admin operations
 * This bypasses RLS policies
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('[API Auth] Creating service client:', {
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    usingServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  })

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[API Auth] Missing Supabase configuration:', {
      url: supabaseUrl ? 'present' : 'MISSING',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'MISSING',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'MISSING'
    })
    throw new Error('Missing Supabase configuration')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

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

    const isAllowed = profile.role && ['ADMIN', 'MANAGER'].includes(profile.role)

    if (!isAllowed) {
      console.warn('[API Auth] User does not have admin permissions:', userId, 'Role:', profile.role)
    }

    return { allowed: isAllowed || false, role: profile.role || undefined }
  } catch (error) {
    console.error('[API Auth] Exception checking permissions:', error)
    return { allowed: false }
  }
}

/**
 * Middleware-like function to protect admin routes
 * Returns authenticated user and supabase client or error response data
 * Supports both Supabase JWT auth and local admin auth
 */
export async function requireAdmin(request: NextRequest): Promise<
  | { user: any; supabase: any; error: null }
  | { user: null; supabase: null; error: { message: string; status: number } }
> {
  const requestUrl = request.url
  const hasAdminHeader = request.headers.get('X-Admin-Auth')
  const hasAuthHeader = request.headers.get('Authorization')

  console.log('[API Auth] requireAdmin called:', {
    url: requestUrl,
    hasAdminHeader: !!hasAdminHeader,
    hasAuthHeader: !!hasAuthHeader,
    adminHeaderValue: hasAdminHeader
  })

  // First, check for local admin authentication
  if (checkAdminLocalAuth(request)) {
    console.log('[API Auth] Local admin authentication detected - creating service client')
    try {
      const serviceClient = createServiceClient()
      console.log('[API Auth] Service client created successfully')
      return {
        user: { id: 'local-admin', email: 'admin@ciprel.local', role: 'ADMIN' },
        supabase: serviceClient,
        error: null,
      }
    } catch (error) {
      console.error('[API Auth] Failed to create service client:', error)
      return {
        user: null,
        supabase: null,
        error: {
          message: 'Erreur de configuration serveur - vérifiez SUPABASE_SERVICE_ROLE_KEY',
          status: 500,
        },
      }
    }
  }

  // Fall back to Supabase JWT authentication
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
