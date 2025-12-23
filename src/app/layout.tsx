import type { Metadata } from 'next'
import { Questrial } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { GlobalLoginGate } from '@/components/auth/GlobalLoginGate'
import { CookieBanner } from '@/components/gdpr/CookieBanner'
import { AdminProvider } from '@/contexts/AdminContext'
import { Footer } from '@/components/layout/Footer'
import { ENV } from '@/lib/utils/constants'

const questrial = Questrial({
  subsets: ['latin'],
  variable: '--font-body',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: ENV.SITE_NAME,
    template: `%s | ${ENV.SITE_NAME}`,
  },
  description: 'Application Next.js pour la démarche compétences CIPREL avec dashboard administrateur, quiz interactifs, sondages, section vidéo TikTok-like et conformité RGPD complète.',
  keywords: ['CIPREL', 'compétences', 'quiz', 'formation', 'Côte d\'Ivoire', 'électricité'],
  authors: [{ name: ENV.COMPANY_NAME }],
  creator: ENV.COMPANY_NAME,
  publisher: ENV.COMPANY_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: ENV.APP_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CI',
    url: ENV.APP_URL,
    siteName: ENV.SITE_NAME,
    title: ENV.SITE_NAME,
    description: 'Développez vos compétences avec CIPREL - Quiz interactifs, vidéos formations et suivi personnalisé.',
    images: [
      {
        url: `${ENV.APP_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: ENV.SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: ENV.SITE_NAME,
    description: 'Développez vos compétences avec CIPREL',
    images: [`${ENV.APP_URL}/images/og-image.png`],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EE7F00' },
    { media: '(prefers-color-scheme: dark)', color: '#EE7F00' },
  ],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" className={questrial.variable}>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={ENV.SITE_NAME} />
      </head>
      <body className="font-sans antialiased">
        {/* Bannière d'avertissement zoom */}
        <div 
          id="zoom-warning" 
          style={{
            display: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#EE7F00',
            color: 'white',
            padding: '12px 20px',
            textAlign: 'center',
            zIndex: 99999,
            fontSize: '14px',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          <span>⚠️ Votre navigateur est zoomé à plus de 100%. Pour une meilleure expérience, veuillez remettre le zoom à 100% (Ctrl + 0).</span>
          <button 
            id="zoom-warning-close"
            style={{
              marginLeft: '15px',
              background: 'white',
              color: '#EE7F00',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Fermer
          </button>
        </div>
        
        {/* Script de détection du zoom */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var warningDismissed = false;

                function checkZoom() {
                  if (warningDismissed) return;

                  // Méthode plus fiable : comparer la largeur de viewport avec la largeur de l'écran
                  var zoomLevel = Math.round((window.outerWidth / window.innerWidth) * 100);

                  // Fallback si outerWidth n'est pas disponible (certains navigateurs)
                  if (!window.outerWidth || zoomLevel === 0 || zoomLevel === Infinity) {
                    zoomLevel = Math.round((document.documentElement.clientWidth / window.innerWidth) * 100);
                  }

                  // Protection contre les valeurs aberrantes
                  if (isNaN(zoomLevel) || zoomLevel < 50 || zoomLevel > 300) {
                    zoomLevel = 100;
                  }

                  var warning = document.getElementById('zoom-warning');

                  if (warning) {
                    // Tolérance de 5% pour éviter les faux positifs
                    if (zoomLevel > 105) {
                      warning.style.display = 'block';
                      document.body.style.paddingTop = warning.offsetHeight + 'px';
                    } else {
                      warning.style.display = 'none';
                      document.body.style.paddingTop = '0';
                    }
                  }
                }

                function dismissWarning() {
                  warningDismissed = true;
                  var warning = document.getElementById('zoom-warning');
                  if (warning) {
                    warning.style.display = 'none';
                    document.body.style.paddingTop = '0';
                  }
                }

                document.addEventListener('DOMContentLoaded', function() {
                  // Petit délai pour laisser le temps au navigateur de se stabiliser
                  setTimeout(checkZoom, 100);

                  var closeBtn = document.getElementById('zoom-warning-close');
                  if (closeBtn) {
                    closeBtn.addEventListener('click', dismissWarning);
                  }
                });

                window.addEventListener('resize', checkZoom);
              })();
            `,
          }}
        />
        
        <AdminProvider>
          <AuthProvider>
            <div className="relative min-h-screen bg-background flex flex-col">
              <main className="relative z-0 flex-1">
                {children}
              </main>

              {/* Footer */}
              <Footer />

              {/* Global login modal gate */}
              <GlobalLoginGate />

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#FFFFFF',
                  color: '#0A0E12',
                  border: '1px solid #D8D8D8',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', 'Questrial', sans-serif",
                },
                success: {
                  iconTheme: {
                    primary: '#58A636',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EE7F00',
                    secondary: '#ffffff',
                  },
                },
              }}
            />

              {/* GDPR Cookie Banner */}
              {ENV.GDPR_ENABLED && <CookieBanner />}
            </div>
          </AuthProvider>
        </AdminProvider>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: ENV.COMPANY_NAME,
              url: ENV.APP_URL,
              logo: `${ENV.APP_URL}/images/logo.webp`,
              description: 'Compagnie Ivoirienne de Production d\'Électricité',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'CI',
                addressLocality: 'Abidjan',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+225-XX-XX-XX-XX',
                contactType: 'customer service',
                email: ENV.COMPANY_EMAIL,
              },
              sameAs: [
                'https://www.facebook.com/ciprel',
                'https://www.linkedin.com/company/ciprel',
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
