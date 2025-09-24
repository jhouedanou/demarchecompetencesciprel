import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase/client'
import type { AuthUser, LoginCredentials, RegisterCredentials } from '@/types'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  signIn: (credentials: LoginCredentials) => Promise<{ error?: string }>
  signUp: (credentials: RegisterCredentials) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error?: string }>
  setUser: (user: AuthUser | null) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      initialize: async () => {
        try {
          set({ isLoading: true })

          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession()

          if (error) {
            console.error('Auth session error:', error)
            set({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          if (session?.user) {
            // Get profile data
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profile) {
              const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email!,
                name: profile.name,
                role: profile.role as 'USER' | 'ADMIN' | 'MANAGER',
                avatar_url: profile.avatar_url,
                phone: profile.phone,
                created_at: profile.created_at!,
                updated_at: profile.updated_at!,
              }

              set({ user: authUser, isAuthenticated: true, isLoading: false })
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false })
            }
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false })
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

              if (profile) {
                const authUser: AuthUser = {
                  id: session.user.id,
                  email: session.user.email!,
                  name: profile.name,
                  role: profile.role as 'USER' | 'ADMIN' | 'MANAGER',
                  avatar_url: profile.avatar_url,
                  phone: profile.phone,
                  created_at: profile.created_at!,
                  updated_at: profile.updated_at!,
                }

                set({ user: authUser, isAuthenticated: true, isLoading: false })
              }
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, isAuthenticated: false, isLoading: false })
            }
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      signIn: async (credentials) => {
        try {
          set({ isLoading: true })

          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error) {
            set({ isLoading: false })
            return { error: error.message }
          }

          // Get profile after successful sign in
          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single()

            if (profile) {
              const authUser: AuthUser = {
                id: data.user.id,
                email: data.user.email!,
                name: profile.name,
                role: profile.role as 'USER' | 'ADMIN' | 'MANAGER',
                avatar_url: profile.avatar_url,
                phone: profile.phone,
                created_at: profile.created_at!,
                updated_at: profile.updated_at!,
              }

              set({ user: authUser, isAuthenticated: true, isLoading: false })
            }
          }

          return {}
        } catch (error: any) {
          set({ isLoading: false })
          return { error: error.message }
        }
      },

      signUp: async (credentials) => {
        try {
          set({ isLoading: true })

          if (credentials.password !== credentials.confirmPassword) {
            set({ isLoading: false })
            return { error: 'Les mots de passe ne correspondent pas' }
          }

          const { data, error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
              data: {
                name: credentials.name,
              },
            },
          })

          if (error) {
            set({ isLoading: false })
            return { error: error.message }
          }

          if (data.user && data.session) {
            // Profile should be created automatically via trigger
            // Wait a bit for the trigger to complete
            await new Promise(resolve => setTimeout(resolve, 1000))

            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single()

            if (profile) {
              const authUser: AuthUser = {
                id: data.user.id,
                email: data.user.email!,
                name: profile.name,
                role: profile.role as 'USER' | 'ADMIN' | 'MANAGER',
                avatar_url: profile.avatar_url,
                phone: profile.phone,
                created_at: profile.created_at!,
                updated_at: profile.updated_at!,
              }

              set({ user: authUser, isAuthenticated: true, isLoading: false })
            }
          } else {
            set({ isLoading: false })
            return { error: 'Veuillez vérifier votre email pour confirmer votre inscription' }
          }

          return {}
        } catch (error: any) {
          set({ isLoading: false })
          return { error: error.message }
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true })
          await supabase.auth.signOut()
          set({ user: null, isAuthenticated: false, isLoading: false })
        } catch (error) {
          console.error('Sign out error:', error)
          set({ isLoading: false })
        }
      },

      updateProfile: async (updates) => {
        try {
          const { user } = get()
          if (!user) return { error: 'Utilisateur non connecté' }

          const { error } = await supabase
            .from('profiles')
            .update({
              name: updates.name,
              phone: updates.phone,
              avatar_url: updates.avatar_url,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

          if (error) {
            return { error: error.message }
          }

          // Update local state
          set({
            user: {
              ...user,
              ...updates,
              updated_at: new Date().toISOString(),
            },
          })

          return {}
        } catch (error: any) {
          return { error: error.message }
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user, isLoading: false })
      },
    }),
    {
      name: 'ciprel-auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)