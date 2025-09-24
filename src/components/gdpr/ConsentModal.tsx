'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { STORAGE_KEYS } from '@/lib/utils/constants'
import type { ConsentPreferences } from '@/types'

interface ConsentModalProps {
  onSave: (consent: ConsentPreferences) => void
  onClose: () => void
}

export function ConsentModal({ onSave, onClose }: ConsentModalProps) {
  const [consent, setConsent] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    // Load existing consent if available
    const existing = localStorage.getItem(STORAGE_KEYS.CONSENT_PREFERENCES)
    if (existing) {
      try {
        const parsed = JSON.parse(existing)
        setConsent({
          essential: true, // Always true
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false,
          functional: parsed.functional || false,
        })
      } catch (error) {
        console.error('Error parsing existing consent:', error)
      }
    }
  }, [])

  const handleSave = () => {
    onSave(consent)
  }

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    onSave(allAccepted)
  }

  const handleRejectAll = () => {
    const essentialOnly: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
    onSave(essentialOnly)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle>Préférences de confidentialité</CardTitle>
            <CardDescription className="mt-2">
              Gérez vos préférences de cookies et de confidentialité.
              Vous pouvez modifier ces paramètres à tout moment.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Essential Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Cookies essentiels</h4>
                <p className="text-sm text-muted-foreground">
                  Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.
                </p>
              </div>
              <Switch
                checked={true}
                disabled
                aria-label="Cookies essentiels (obligatoires)"
              />
            </div>
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
              <strong>Utilisés pour :</strong> Authentification, sécurité, préférences de langue,
              panier d'achat, et autres fonctionnalités de base du site.
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Cookies d'analyse</h4>
                <p className="text-sm text-muted-foreground">
                  Nous aident à comprendre comment vous utilisez notre site.
                </p>
              </div>
              <Switch
                checked={consent.analytics}
                onCheckedChange={(checked) =>
                  setConsent({ ...consent, analytics: checked })
                }
                aria-label="Cookies d'analyse"
              />
            </div>
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
              <strong>Utilisés pour :</strong> Google Analytics, mesure d'audience,
              statistiques de performance, analyse du comportement des utilisateurs.
              <br />
              <strong>Services tiers :</strong> Google Analytics, Hotjar
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Cookies marketing</h4>
                <p className="text-sm text-muted-foreground">
                  Utilisés pour personnaliser les publicités et mesurer leur efficacité.
                </p>
              </div>
              <Switch
                checked={consent.marketing}
                onCheckedChange={(checked) =>
                  setConsent({ ...consent, marketing: checked })
                }
                aria-label="Cookies marketing"
              />
            </div>
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
              <strong>Utilisés pour :</strong> Publicités ciblées, retargeting,
              mesure des campagnes publicitaires, réseaux sociaux.
              <br />
              <strong>Services tiers :</strong> Facebook Pixel, Google Ads, LinkedIn Ads
            </div>
          </div>

          {/* Functional Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Cookies fonctionnels</h4>
                <p className="text-sm text-muted-foreground">
                  Améliorent l'expérience utilisateur avec des fonctionnalités supplémentaires.
                </p>
              </div>
              <Switch
                checked={consent.functional}
                onCheckedChange={(checked) =>
                  setConsent({ ...consent, functional: checked })
                }
                aria-label="Cookies fonctionnels"
              />
            </div>
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
              <strong>Utilisés pour :</strong> Chat en direct, widgets de réseaux sociaux,
              personnalisation de l'interface, préférences utilisateur avancées.
              <br />
              <strong>Services tiers :</strong> Intercom, YouTube, Vimeo
            </div>
          </div>

          {/* Legal Links */}
          <div className="pt-4 border-t text-xs text-muted-foreground">
            <p>
              Pour plus d'informations sur notre utilisation des cookies et sur vos droits,
              consultez notre{' '}
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

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 pt-4 border-t sm:flex-row sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              className="flex-1"
            >
              Refuser tout
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              className="flex-1"
            >
              Enregistrer les préférences
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="flex-1"
            >
              Tout accepter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}