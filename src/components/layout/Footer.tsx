'use client'

import Link from 'next/link'
import { ENV } from '@/lib/utils/constants'

const footerNavigation = {
  solutions: [
    { name: 'Quiz Introduction', href: '/competences/quiz-introduction' },
    { name: 'Sondage Opinion', href: '/competences/sondage' },
    { name: 'Vidéothèque', href: '/competences/videos' },
    { name: 'Suivi Progression', href: '/competences/resultats' },
  ],
  support: [
    { name: 'Centre d\'aide', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Contact', href: '/contact' },
    { name: 'Status', href: '/status' },
  ],
  company: [
    { name: 'À propos', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carrières', href: '/careers' },
    { name: 'Presse', href: '/press' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/legal/mentions-legales' },
    { name: 'Politique de confidentialité', href: '/legal/politique-confidentialite' },
    { name: 'Cookies', href: '/legal/cookies' },
    { name: 'CGU', href: '/legal/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/images/logo.webp"
                alt="CIPREL"
              />
              <span className="ml-3 text-xl font-bold text-gray-900">
                Compétences
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-600">
              Développez vos compétences professionnelles avec la plateforme de formation CIPREL. 
              Quiz interactifs, vidéos de formation et suivi personnalisé pour votre évolution professionnelle.
            </p>
            <div className="flex space-x-6">
              {/* Social media links si nécessaire */}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Solutions</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Entreprise</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Légal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} {ENV.COMPANY_NAME}. Tous droits réservés.
            </p>
            <div className="flex items-center mt-4 sm:mt-0 space-x-4 text-xs text-gray-500">
              <span>Fait avec ❤️ en Côte d'Ivoire</span>
              <span>•</span>
              <span>Version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
