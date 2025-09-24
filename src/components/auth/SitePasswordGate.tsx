'use client'

import { useState, useEffect } from 'react'
import { Shield, Eye, EyeOff, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SITE_PASSWORD = 'ciprel2024' // Mot de passe simple - en production, utilisez des variables d'environnement

interface SitePasswordGateProps {
  children: React.ReactNode
}

export function SitePasswordGate({ children }: SitePasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const stored = localStorage.getItem('site-auth')
    if (stored === 'authenticated') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simuler une vérification
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password === SITE_PASSWORD) {
      localStorage.setItem('site-auth', 'authenticated')
      setIsAuthenticated(true)
    } else {
      setError('Mot de passe incorrect')
    }

    setIsLoading(false)
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-ciprel-green-500 to-ciprel-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-ciprel-black mb-2">
            Accès Sécurisé
          </h1>
          <p className="text-gray-600">
            Plateforme CIPREL Compétences
          </p>
        </div>

        {/* Formulaire d'authentification */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Mot de passe d'accès
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className="pr-12 h-12 border-gray-300 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-ciprel-green-600 to-ciprel-green-700 hover:from-ciprel-green-700 hover:to-ciprel-green-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Vérification...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Accéder à la plateforme
                </div>
              )}
            </Button>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-ciprel-green-600" />
              <span>Accès sécurisé aux collaborateurs CIPREL</span>
            </div>
          </div>
        </div>

        {/* Aide */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Besoin d'aide ? Contactez l'administrateur système
          </p>
          <a
            href="mailto:it@ciprel.ci"
            className="text-sm text-ciprel-green-600 hover:text-ciprel-green-700 font-medium"
          >
            it@ciprel.ci
          </a>
        </div>
      </div>
    </div>
  )
}