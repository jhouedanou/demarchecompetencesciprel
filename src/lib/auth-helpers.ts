import bcrypt from 'bcryptjs'
import { db, executeQuery, executeRun } from './db'
import type { AuthUser } from '@/types/auth'

interface Profile {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN' | 'MANAGER'
  avatar_url: string | null
  phone: string | null
  password_hash: string
  created_at: string
  updated_at: string
}

// Hash un mot de passe
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Vérifie un mot de passe
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Authentifie un utilisateur
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  console.log('🔐 [Auth] Authenticating user:', email)
  const startTime = performance.now()

  try {
    const profiles = await executeQuery<Profile>(
      'SELECT * FROM profiles WHERE email = ? LIMIT 1',
      [email]
    )

    if (profiles.length === 0) {
      console.warn('❌ [Auth] User not found:', email)
      return null
    }

    const profile = profiles[0]
    const isValid = await verifyPassword(password, profile.password_hash)

    if (!isValid) {
      console.warn('❌ [Auth] Invalid password for:', email)
      return null
    }

    const elapsed = performance.now() - startTime
    console.log(`✅ [Auth] User authenticated in ${elapsed.toFixed(0)}ms`)

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      avatar_url: profile.avatar_url || undefined,
      phone: profile.phone || undefined,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }
  } catch (error) {
    console.error('❌ [Auth] Authentication error:', error)
    return null
  }
}

// Crée un nouvel utilisateur
export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<AuthUser | null> {
  console.log('📝 [Auth] Creating user:', email)
  const startTime = performance.now()

  try {
    // Vérifier si l'utilisateur existe déjà
    const existing = await executeQuery<Profile>(
      'SELECT id FROM profiles WHERE email = ? LIMIT 1',
      [email]
    )

    if (existing.length > 0) {
      console.warn('❌ [Auth] User already exists:', email)
      throw new Error('Un utilisateur avec cet email existe déjà')
    }

    const userId = crypto.randomUUID()
    const passwordHash = await hashPassword(password)
    const now = new Date().toISOString()

    executeRun(
      `INSERT INTO profiles (id, email, name, password_hash, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'USER', ?, ?)`,
      [userId, email, name, passwordHash, now, now]
    )

    const elapsed = performance.now() - startTime
    console.log(`✅ [Auth] User created in ${elapsed.toFixed(0)}ms`)

    return {
      id: userId,
      email,
      name,
      role: 'USER',
      created_at: now,
      updated_at: now,
    }
  } catch (error) {
    console.error('❌ [Auth] User creation error:', error)
    throw error
  }
}

// Récupère un utilisateur par ID
export async function getUserById(userId: string): Promise<AuthUser | null> {
  try {
    const profiles = await executeQuery<Profile>(
      'SELECT * FROM profiles WHERE id = ? LIMIT 1',
      [userId]
    )

    if (profiles.length === 0) {
      return null
    }

    const profile = profiles[0]
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      avatar_url: profile.avatar_url || undefined,
      phone: profile.phone || undefined,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }
  } catch (error) {
    console.error('❌ [Auth] Get user error:', error)
    return null
  }
}

// Met à jour un profil utilisateur
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<AuthUser, 'name' | 'phone' | 'avatar_url'>>
): Promise<void> {
  const now = new Date().toISOString()
  const fields: string[] = []
  const values: any[] = []

  if (updates.name) {
    fields.push('name = ?')
    values.push(updates.name)
  }
  if (updates.phone !== undefined) {
    fields.push('phone = ?')
    values.push(updates.phone)
  }
  if (updates.avatar_url !== undefined) {
    fields.push('avatar_url = ?')
    values.push(updates.avatar_url)
  }

  fields.push('updated_at = ?')
  values.push(now)
  values.push(userId)

  executeRun(
    `UPDATE profiles SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
}
