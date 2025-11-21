import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase/client'
import type { AuthUser, LoginCredentials, RegisterCredentials } from '@/types/auth'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  signIn: (credentials: LoginCredentials) => Promise<{ error?: string }>
  signUp: (credentials: RegisterCredentials) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error?: string }>
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean }>
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
          console.log('[Auth] Starting initialization...')
          set({ isLoading: true })

          // Vérifier si Supabase est configuré
          if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.warn('[Auth] Supabase not configured - skipping initialization')
            set({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          console.log('[Auth] Fetching session...')

          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession()

          if (error) {
            console.error('[Auth] Session error:', error)
            set({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          console.log('[Auth] Session retrieved:', session ? 'authenticated' : 'not authenticated')

          if (session?.user) {
            console.log('[Auth] Fetching profile for user:', session.user.id)
            // Get profile data
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profileError) {
              console.error('[Auth] Profile fetch error:', profileError)
              set({ user: null, isAuthenticated: false, isLoading: false })
              return
            }

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

              console.log('[Auth] User authenticated:', authUser.name, 'Role:', authUser.role)
              set({ user: authUser, isAuthenticated: true, isLoading: false })
            } else {
              console.log('[Auth] Profile not found')
              set({ user: null, isAuthenticated: false, isLoading: false })
            }
          } else {
            console.log('[Auth] No session, user not authenticated')
            set({ user: null, isAuthenticated: false, isLoading: false })
          }

          console.log('[Auth] Setting up auth state listener...')
          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('[Auth] Auth state change event:', event)
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
          console.log('[Auth] Initialization complete!')
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      signIn: async (credentials) => {
        const startTime = performance.now()
        console.log('🔐 [signIn] Starting login for:', credentials.email)

        try {
          set({ isLoading: true })

          // Étape 1: Authentification
          console.log('📡 [signIn] Step 1/2: Calling signInWithPassword...')
          const authStartTime = performance.now()

          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          const authElapsed = performance.now() - authStartTime
          console.log(`✅ [signIn] Auth completed in ${authElapsed.toFixed(0)}ms`)

          if (error) {
            const totalElapsed = performance.now() - startTime
            console.error(`❌ [signIn] Login failed after ${totalElapsed.toFixed(0)}ms:`, error.message)
            set({ isLoading: false })

            // Traduire les erreurs courantes en français
            let errorMessage = error.message
            if (error.message.includes('Invalid login credentials')) {
              errorMessage = 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.'
            } else if (error.message.includes('Email not confirmed')) {
              errorMessage = 'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.'
            } else if (error.message.includes('User not found')) {
              errorMessage = 'Aucun compte trouvé avec cet email.'
            } else if (error.message.includes('Too many requests')) {
              errorMessage = 'Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.'
            }

            return { error: errorMessage }
          }

          // Étape 2: Récupération du profil
          if (data.user) {
            console.log('📡 [signIn] Step 2/2: Fetching user profile...')
            const profileStartTime = performance.now()

            // Optimisation: Utiliser select avec moins de champs si possible
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, name, role, avatar_url, phone, created_at, updated_at')
              .eq('id', data.user.id)
              .single()

            const profileElapsed = performance.now() - profileStartTime
            console.log(`✅ [signIn] Profile fetched in ${profileElapsed.toFixed(0)}ms`)

            if (profileError) {
              console.error('❌ [signIn] Profile fetch error:', profileError)
            }

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

              // Cache le profil localement pour éviter de refetch
              if (typeof window !== 'undefined') {
                localStorage.setItem('cached_profile', JSON.stringify(authUser))
              }

              const totalElapsed = performance.now() - startTime
              console.log(`✨ [signIn] Login complete in ${totalElapsed.toFixed(0)}ms`)
              console.log(`👤 [signIn] Logged in as: ${authUser.name} (${authUser.role})`)
            } else {
              console.warn('⚠️ [signIn] No profile found for user')
            }
          }

          return {}
        } catch (error: any) {
          const totalElapsed = performance.now() - startTime
          console.error(`❌ [signIn] Exception after ${totalElapsed.toFixed(0)}ms:`, error)
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

          // Restrict allowed email domains
          const allowed = /@((ciprel\.ci)|(bigfiveabidjan\.com))$/i.test(credentials.email)
          if (!allowed) {
            set({ isLoading: false })
            return { error: 'Seules les adresses se terminant par ciprel.ci ou bigfiveabidjan.com sont autorisées' }
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
            return { error: 'CONFIRMATION_EMAIL_SENT:Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien dans l\'email pour activer votre compte et pouvoir vous connecter. Vérifiez également vos spams si vous ne le trouvez pas.' }
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
          // Use local scope to avoid 403 errors when session is invalid
          // This clears the client-side session without making a server call
          await supabase.auth.signOut({ scope: 'local' })
        } catch (error) {
          console.error('Sign out error:', error)
        } finally {
          // Always clear local state regardless of API call success
          set({ user: null, isAuthenticated: false, isLoading: false })
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

      resetPassword: async (email) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          })

          if (error) {
            return { error: error.message }
          }

          return { success: true }
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
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      skipHydration: false,
      // Specify storage explicitly for better browser compatibility
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          return JSON.parse(str)
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)