'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAdmin } from '@/contexts/AdminContext'
import { LogIn, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const { loginAdmin, isAdminAuthenticated } = useAdmin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  if (isAdminAuthenticated) {
    router.push('/admin')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate a small delay for security
    setTimeout(() => {
      if (loginAdmin(username, password)) {
        router.push('/admin')
      } else {
        setError('Identifiant ou mot de passe incorrect')
        setPassword('')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <Image src="/images/logo.webp" alt="CIPREL" width={160} height={64} className="h-16 w-auto mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-bold text-ciprel-orange-600 mb-2">Espace Admin</h1>
          <p className="text-gray-600">Gestion de la Démarche Compétence</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Username field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Identifiant
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre identifiant"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ciprel-orange-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                autoFocus
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ciprel-orange-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-ciprel-orange-600 hover:bg-ciprel-orange-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="text-ciprel-orange-600 hover:text-ciprel-orange-700 font-semibold transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}
