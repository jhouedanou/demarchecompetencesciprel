'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signOut, user } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // Déconnecter l'admin aussi si nécessaire
      localStorage.removeItem('ciprel_admin_auth')
      await signOut()
      onClose()
      router.push('/')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-ciprel-orange-100 p-4">
            <AlertTriangle className="h-8 w-8 text-ciprel-orange-600" />
          </div>

          <DialogTitle className="text-2xl font-bold text-ciprel-black mb-2">
            Confirmer la déconnexion
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-600 mb-6">
            {user?.name && (
              <p className="mb-2">
                <span className="font-semibold text-gray-800">{user.name}</span>
              </p>
            )}
            Êtes-vous sûr de vouloir vous déconnecter ? Votre progression est sauvegardée et vous pourrez vous reconnecter à tout moment.
          </DialogDescription>

          <div className="flex w-full gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-11 rounded-lg border-gray-300 hover:bg-gray-50"
            >
              Annuler
            </Button>

            <Button
              type="button"
              onClick={handleLogout}
              disabled={isLoading}
              className="flex-1 h-11 rounded-lg bg-ciprel-orange-600 text-white hover:bg-ciprel-orange-700 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2" />
                  Déconnexion...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            💡 Astuce : Utilisez la déconnexion uniquement si vous êtes sur un appareil partagé
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
