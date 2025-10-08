'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  useEffect(() => {
    // Récupérer les paramètres d'erreur depuis l'URL
    const urlError = searchParams.get('error')
    const urlErrorCode = searchParams.get('error_code')
    const urlErrorDescription = searchParams.get('error_description')

    // Vérifier aussi le hash fragment (après #)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1)
      const hashParams = new URLSearchParams(hash)
      const hashError = hashParams.get('error')
      const hashErrorCode = hashParams.get('error_code')
      const hashErrorDescription = hashParams.get('error_description')

      if (hashError || urlError) {
        setError(hashErrorDescription || urlErrorDescription || hashError || urlError || 'Une erreur est survenue')
        setErrorCode(hashErrorCode || urlErrorCode || '')
      } else {
        // Si pas d'erreur, rediriger vers la page d'accueil
        router.push('/')
      }
    }
  }, [searchParams, router])

  const getErrorMessage = () => {
    if (errorCode === 'otp_expired') {
      return {
        title: 'Lien expiré',
        message: 'Le lien de connexion ou de réinitialisation que vous avez utilisé a expiré.',
        suggestions: [
          'Les liens magiques sont valides pendant 1 heure seulement',
          'Veuillez demander un nouveau lien',
          'Vérifiez que vous utilisez le lien le plus récent'
        ]
      }
    }

    if (errorCode === 'access_denied' || error?.includes('invalid')) {
      return {
        title: 'Lien invalide',
        message: 'Le lien que vous avez utilisé n\'est plus valide ou a déjà été utilisé.',
        suggestions: [
          'Chaque lien ne peut être utilisé qu\'une seule fois',
          'Demandez un nouveau lien de connexion',
          'Assurez-vous de copier le lien complet depuis votre email'
        ]
      }
    }

    return {
      title: 'Erreur d\'authentification',
      message: error || 'Une erreur est survenue lors de l\'authentification.',
      suggestions: [
        'Veuillez réessayer',
        'Si le problème persiste, contactez le support'
      ]
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
          {/* Header avec icône d'erreur */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {errorInfo.title}
            </h1>
          </div>

          {/* Contenu */}
          <div className="p-8">
            <p className="text-gray-700 text-lg mb-6 text-center">
              {errorInfo.message}
            </p>

            {/* Suggestions */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Que faire ?
              </h3>
              <ul className="space-y-2">
                {errorInfo.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-orange-800 flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Détails techniques (en mode développement) */}
            {errorCode && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-gray-500 font-mono">
                  Code d'erreur: {errorCode}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/')}
                className="w-full h-12 bg-gradient-to-r from-ciprel-green-600 to-ciprel-green-700 hover:from-ciprel-green-700 hover:to-ciprel-green-800 text-white rounded-lg font-semibold shadow-lg"
              >
                Retour à l'accueil
              </Button>

              <button
                onClick={() => {
                  router.push('/')
                  // Déclencher l'ouverture du modal de connexion
                  setTimeout(() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new Event('open-login'))
                    }
                  }, 100)
                }}
                className="w-full h-12 border-2 border-ciprel-green-600 text-ciprel-green-600 hover:bg-ciprel-green-50 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Demander un nouveau lien
              </button>
            </div>

            {/* Support */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Besoin d'aide ?
              </p>
              <a
                href="mailto:support@ciprel.ci"
                className="text-sm font-semibold text-ciprel-green-600 hover:text-ciprel-green-700 transition-colors"
              >
                support@ciprel.ci
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ciprel-green-600"></div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
