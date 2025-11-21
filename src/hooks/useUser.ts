import { useAuthStore } from '@/stores/auth-store'
import type { User } from '@supabase/supabase-js'
import type { AuthUser } from '@/types/auth'

// Hook utilitaire pour compatibilité avec les composants existants
// Utilise le Zustand store au lieu d'appels API lents
export function useUser() {
  const authUser = useAuthStore(state => state.user)
  const isLoading = useAuthStore(state => state.isLoading)

  // Convertir AuthUser en Supabase User pour compatibilité
  const user: User | null = authUser ? ({
    id: authUser.id,
    email: authUser.email,
    user_metadata: {
      name: authUser.name,
      role: authUser.role,
      avatar_url: authUser.avatar_url,
      phone: authUser.phone,
    },
  } as any) : null

  return { user, loading: isLoading }
}
