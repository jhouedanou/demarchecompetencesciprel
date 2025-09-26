'use client'

import Link from 'next/link'
import { ENV } from '@/lib/utils/constants'


export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-8 lg:px-8">
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
    </footer>
  )
}
