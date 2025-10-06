'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  ArrowRight,
  Shield,
  BookOpen,
  Target,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth-store'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signIn, isAuthenticated, isLoading: authLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/competences')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error: signInError } = await signIn({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        setError(signInError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // Effacer l'erreur quand l'utilisateur tape
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ciprel-green-200 border-t-ciprel-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full" />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
     

            <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="h-12 rounded-xl border-gray-200 focus:border-ciprel-orange focus:ring-ciprel-orange"
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
                      placeholder="Votre mot de passe"
                      className="h-12 rounded-xl border-gray-200 pr-12 focus:border-ciprel-orange focus:ring-ciprel-orange"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute inset-y-0 right-0 flex h-12 items-center px-3 text-gray-400 hover:text-ciprel-orange"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ciprel-orange to-ciprel-orange-secondary text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      Se connecter
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 rounded-xl bg-slate-50/70 p-4 text-sm text-slate-600">
                <p>
                  Vous n'avez pas encore de compte ?{' '}
                  <Link
                    href="/register"
                    className="font-semibold text-ciprel-orange hover:text-ciprel-orange-secondary transition-colors"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-slate-600 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <span>Besoin d'aide ?</span>
              <a
                href="mailto:support@ciprel.ci"
                className="inline-flex items-center gap-1 font-semibold text-ciprel-green hover:text-ciprel-green-secondary transition-colors"
              >
                support@ciprel.ci
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </main>
    </div>
  )
}
