'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ConsentModal } from './ConsentModal'
import { GDPR_CONFIG, STORAGE_KEYS } from '@/lib/utils/constants'
import type { ConsentPreferences } from '@/types'

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check if consent has been given
    const consent = localStorage.getItem(STORAGE_KEYS.CONSENT_PREFERENCES)
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = async () => {
    const consent: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    }

    await saveConsent(consent)
    setIsVisible(false)
  }

  const handleAcceptEssential = async () => {
    const consent: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    }

    await saveConsent(consent)
    setIsVisible(false)
  }

  const handleCustomize = () => {
    setShowModal(true)
  }

  const handleConsentSaved = async (consent: ConsentPreferences) => {
    await saveConsent(consent)
    setIsVisible(false)
    setShowModal(false)
  }

  const saveConsent = async (consent: ConsentPreferences) => {
    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.CONSENT_PREFERENCES, JSON.stringify({
        ...consent,
        timestamp: new Date().toISOString(),
        version: GDPR_CONFIG.CONSENT_VERSION,
      }))

      // Send to API
      await fetch('/api/gdpr/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consent),
      })

      // Initialize analytics and other services based on consent
      if (consent.analytics) {
        // Initialize Google Analytics, etc.
        console.log('Analytics enabled')
      }

      if (consent.marketing) {
        // Initialize marketing tools
        console.log('Marketing tools enabled')
      }

      if (consent.functional) {
        // Initialize functional cookies
        console.log('Functional cookies enabled')
      }
    } catch (error) {
      console.error('Error saving consent:', error)
    }
  }

  if (!isVisible) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" />
      <Card className="gdpr-banner z-50">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">
              Nous respectons votre vie privée
            </h3>
            <p className="text-sm text-muted-foreground">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site,
              analyser le trafic et personnaliser le contenu. Vous pouvez choisir d'accepter
              tous les cookies ou personnaliser vos préférences.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              En continuant à utiliser ce site, vous acceptez notre{' '}
              <a
                href="/legal/politique-confidentialite"
                className="underline hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                politique de confidentialité
              </a>
              {' '}et notre{' '}
              <a
                href="/legal/cookies"
                className="underline hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                politique de cookies
              </a>.
            </p>
          </div>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 sm:ml-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomize}
              className="whitespace-nowrap"
            >
              Personnaliser
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAcceptEssential}
              className="whitespace-nowrap"
            >
              Essentiel uniquement
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="whitespace-nowrap"
            >
              Tout accepter
            </Button>
          </div>
        </div>
      </Card>

      {showModal && (
        <ConsentModal
          onSave={handleConsentSaved}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}