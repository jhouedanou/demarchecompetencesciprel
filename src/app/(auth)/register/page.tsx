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
  Building,
  Sparkles,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth-store'

export default function RegisterPage() {
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

  const { signUp, isAuthenticated, isLoading: authLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setIsLoading(false)
      return
    }

    try {
      const { error: signUpError } = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      if (signUpError) {
        setError(signUpError)
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription")
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
    <div className="relative min-h-screen bg-gradient-to-br from-white via-slate-50 to-ciprel-green-50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-ciprel-green-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-ciprel-orange-200/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">
        <aside className="mx-auto w-full max-w-2xl px-6 py-16 text-center lg:mx-0 lg:flex lg:w-2/5 lg:flex-col lg:justify-center lg:px-12 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ciprel-green-700 shadow-sm ring-1 ring-ciprel-green-100/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Nouveaux parcours disponibles
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-ciprel-black sm:text-4xl">
            Créez votre compte CIPREL Compétences
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Accédez aux contenus exclusifs, participez aux campagnes de montée en compétences et suivez votre progression au sein de l'entreprise.
          </p>

          <dl className="mt-8 space-y-4 text-left">
            {[{
              icon: Building,
              title: 'Une plateforme pensée pour CIPREL',
              description: 'Tous les outils dont vous avez besoin pour soutenir vos objectifs stratégiques.',
            },
            {
              icon: Layers,
              title: 'Parcours multi-métiers',
              description: 'Des contenus adaptés à chaque pôle pour dynamiser les compétences clés.',
            }].map(feature => (
              <div
                key={feature.title}
                className="group flex items-start gap-3 rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm transition hover:border-ciprel-green-200 hover:shadow-lg"
              >
                <feature.icon className="mt-1 h-5 w-5 text-ciprel-green-600 transition group-hover:scale-110" />
                <div>
                  <dt className="text-sm font-semibold text-ciprel-black">{feature.title}</dt>
                  <dd className="mt-1 text-sm text-slate-600">{feature.description}</dd>
                </div>
              </div>
            ))}
          </dl>
        </aside>

        <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col gap-3 text-center lg:text-left">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-ciprel-green-500 to-ciprel-green-600 shadow-lg lg:mx-0">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-ciprel-black">Créer un compte</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Quelques informations suffisent pour rejoindre la plateforme et débloquer vos parcours.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-700">
                    <User className="mr-2 h-4 w-4" />
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Votre nom et prénom"
                    className="h-12 rounded-xl border-gray-200 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-700">
                    <Mail className="mr-2 h-4 w-4" />
                    Adresse email professionnelle
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="prenom.nom@ciprel.ci"
                    className="h-12 rounded-xl border-gray-200 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
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
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Minimum 6 caractères"
                      className="h-12 rounded-xl border-gray-200 pr-12 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute inset-y-0 right-0 flex h-12 items-center px-3 text-gray-400 hover:text-ciprel-green-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

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
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Répétez votre mot de passe"
                      className="h-12 rounded-xl border-gray-200 pr-12 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute inset-y-0 right-0 flex h-12 items-center px-3 text-gray-400 hover:text-ciprel-green-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className={`rounded-xl border p-4 text-sm ${
                    error.startsWith('CONFIRMATION_EMAIL_SENT:')
                      ? 'border-green-200 bg-green-50/80 text-green-700'
                      : 'border-red-200 bg-red-50/80 text-red-600'
                  }`}>
                    {error.startsWith('CONFIRMATION_EMAIL_SENT:')
                      ? error.replace('CONFIRMATION_EMAIL_SENT:', '')
                      : error
                    }
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ciprel-green-600 to-ciprel-green-700 text-sm font-semibold text-white shadow-lg transition hover:from-ciprel-green-700 hover:to-ciprel-green-800"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Création du compte...
                    </>
                  ) : (
                    <>
                      <Building className="h-4 w-4" />
                      Créer mon compte
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 rounded-xl bg-slate-50/70 p-4 text-sm text-slate-600">
                <p>
                  Vous avez déjà un compte ?{' '}
                  <Link href="/login" className="font-semibold text-ciprel-green-600 hover:text-ciprel-green-700">
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-slate-600 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <span>Support technique</span>
              <a
                href="mailto:support@ciprel.ci"
                className="inline-flex items-center gap-1 font-semibold text-ciprel-green-600 hover:text-ciprel-green-700"
              >
                support@ciprel.ci
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
