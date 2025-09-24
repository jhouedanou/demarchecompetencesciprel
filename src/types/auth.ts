export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN' | 'MANAGER'
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
}

export interface UserProfile {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN' | 'MANAGER'
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface CreateUserRequest {
  email: string
  password: string
  name: string
  role: 'USER' | 'ADMIN' | 'MANAGER'
  phone?: string
}

export interface UpdateUserRequest {
  name?: string
  role?: 'USER' | 'ADMIN' | 'MANAGER'
  phone?: string
  avatar_url?: string
}
