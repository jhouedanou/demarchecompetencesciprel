'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Key, User, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Identifiants administrateur
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin2014!'
}

export default function AdminAccessPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Vérifier si déjà connecté en tant qu'admin
    const adminAuth = localStorage.getItem('ciprel-admin-auth')
    if (adminAuth === 'authenticated') {
      router.push('/admin')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simuler une vérification
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (credentials.username === ADMIN_CREDENTIALS.username &&
        credentials.password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('ciprel-admin-auth', 'authenticated')
      router.push('/admin')
    } else {
      setError('Identifiants incorrects')
      setAttempts(prev => prev + 1)

      // Bloquer après 3 tentatives
      if (attempts >= 2) {
        setError('Trop de tentatives. Contactez l\'administrateur système.')
      }
    }

    setIsLoading(false)
  }

  if (attempts >= 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Accès Bloqué
            </h1>
            <p className="text-gray-600 mb-6">
              Trop de tentatives de connexion. Contactez l'administrateur système.
            </p>
            <a href="mailto:it@ciprel.ci" className="text-ciprel-green-600 font-medium">
              it@ciprel.ci
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ciprel-black via-gray-900 to-ciprel-green-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* En-tête sécurisé */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-ciprel-green-500 to-ciprel-green-600 rounded-full flex items-center justify-center shadow-2xl">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Administration CIPREL
          </h1>
          <p className="text-gray-300">
            Accès Restreint • Personnel Autorisé Uniquement
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Nom d'utilisateur
              </Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Votre identifiant"
                className="h-12 border-gray-300 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••••••••"
                className="h-12 border-gray-300 focus:border-ciprel-green-500 focus:ring-ciprel-green-500"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
                {attempts > 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    Tentative {attempts}/3
                  </p>
                )}
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
                  Accès Administration
                </div>
              )}
            </Button>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-ciprel-green-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-ciprel-green-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-ciprel-green-800 mb-1">
                    Accès Sécurisé
                  </h3>
                  <p className="text-xs text-ciprel-green-700">
                    Cet espace est réservé aux administrateurs autorisés.
                    Toutes les connexions sont enregistrées et surveillées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Support technique :
            <a href="mailto:it@ciprel.ci" className="text-ciprel-green-400 hover:text-ciprel-green-300 font-medium ml-1">
              it@ciprel.ci
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}