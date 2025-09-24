import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { CookieBanner } from '@/components/gdpr/CookieBanner'
import { ENV } from '@/lib/utils/constants'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['300', '400', '500', '600', '700'],
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
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0ea5e9' },
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
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={ENV.SITE_NAME} />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <div className="relative min-h-screen bg-background">
            <main className="relative z-0">
              {children}
            </main>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#333',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '14px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            {/* GDPR Cookie Banner */}
            {ENV.GDPR_ENABLED && <CookieBanner />}
          </div>
        </AuthProvider>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: ENV.COMPANY_NAME,
              url: ENV.APP_URL,
              logo: `${ENV.APP_URL}/images/logo-ciprel.png`,
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