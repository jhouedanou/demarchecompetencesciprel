'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth-store'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

type AuthMode = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: AuthMode
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signIn, signUp } = useAuthStore()
  const router = useRouter()

  // Reset form when modal closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      setError('')
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [isOpen])

  useEffect(() => {
    setMode(defaultMode)
  }, [defaultMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        const { error: signInError } = await signIn({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          setError(signInError)
        } else {
          onClose()
          router.push('/competences')
        }
      } else {
        // Validation pour l'inscription
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas')
          return
        }

        if (formData.password.length < 8) {
          setError('Le mot de passe doit contenir au moins 8 caractères')
          return
        }

        const { error: signUpError } = await signUp({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          name: formData.name,
        })

        if (signUpError) {
          setError(signUpError)
        } else {
          onClose()
          // Afficher un message de succès
          router.push('/competences')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </button>

        <DialogTitle className="text-2xl font-bold text-ciprel-black">
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </DialogTitle>

        <DialogDescription className="text-sm text-gray-600">
          {mode === 'login'
            ? 'Connectez-vous pour accéder à votre espace personnel'
            : 'Créez votre compte pour suivre votre progression'}
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-700">
                <User className="mr-2 h-4 w-4" />
                Nom complet
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="Votre nom complet"
                className="h-11 rounded-lg border-gray-200 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-700">
              <Mail className="mr-2 h-4 w-4" />
              Adresse email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="votre.email@ciprel.ci"
              className="h-11 rounded-lg border-gray-200 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center text-sm font-semibold text-gray-700">
              <Lock className="mr-2 h-4 w-4" />
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                placeholder={mode === 'register' ? 'Au moins 8 caractères' : 'Votre mot de passe'}
                className="h-11 rounded-lg border-gray-200 pr-12 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute inset-y-0 right-0 flex h-11 items-center px-3 text-gray-400 hover:text-ciprel-green-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center text-sm font-semibold text-gray-700">
                <Lock className="mr-2 h-4 w-4" />
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={e => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  className="h-11 rounded-lg border-gray-200 pr-12 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute inset-y-0 right-0 flex h-11 items-center px-3 text-gray-400 hover:text-ciprel-green-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-ciprel-green-600 to-ciprel-green-700 text-sm font-semibold text-white shadow-lg transition hover:from-ciprel-green-700 hover:to-ciprel-green-800 hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {mode === 'login' ? 'Connexion...' : 'Création...'}
              </>
            ) : (
              <>
                {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={switchMode}
            className="text-sm text-gray-600 hover:text-ciprel-green-600 transition-colors"
          >
            {mode === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <span className="font-semibold text-ciprel-green-600">Créer un compte</span>
              </>
            ) : (
              <>
                Vous avez déjà un compte ?{' '}
                <span className="font-semibold text-ciprel-green-600">Se connecter</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-ciprel-green-50 p-3 text-sm text-gray-600">
          <p className="text-xs">
            Besoin d&apos;aide ? Contactez{' '}
            <a
              href="mailto:support@ciprel.ci"
              className="font-semibold text-ciprel-green-600 hover:text-ciprel-green-700 transition-colors"
            >
              support@ciprel.ci
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
