import { createServerClient } from './server'
import { redirect } from 'next/navigation'
import type { AuthUser, Profile } from '@/types'

/**
 * Get the current authenticated user from server-side
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get the user profile with role information
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) return null

    return {
      id: user.id,
      email: user.email!,
      name: profile.name,
      role: profile.role as 'USER' | 'ADMIN' | 'MANAGER',
      avatar_url: profile.avatar_url,
      phone: profile.phone,
      created_at: profile.created_at!,
      updated_at: profile.updated_at!,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get the current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile
  } catch (error) {
    console.error('Error getting current profile:', error)
    return null
  }
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

/**
 * Require admin role - redirect to unauthorized if not admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth()

  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    redirect('/unauthorized')
  }

  return user
}

/**
 * Check if user has permission for action
 */
export async function checkPermission(requiredRoles: ('USER' | 'ADMIN' | 'MANAGER')[]): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) return false

  return requiredRoles.includes(user.role)
}

/**
 * Sign out user and redirect to login
 */
export async function signOut() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Get session from server-side
 */
export async function getSession() {
  const supabase = createServerClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}