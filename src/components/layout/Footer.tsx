'use client'

import Link from 'next/link'
import { ENV } from '@/lib/utils/constants'
import { Mail, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-t border-slate-700" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-300">
              © {new Date().getFullYear()} {ENV.COMPANY_NAME}. Tous droits réservés.
            </p>
          </div>

          {/* Right side - Developer info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <span>Développé par</span>
              <a
                href="https://bigfive.solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#36A24C] hover:text-[#EC7E05] font-semibold transition-colors"
              >
                Big Five Solutions
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <span className="hidden sm:inline text-slate-600">•</span>
            
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Support:</span>
              <a
                href="mailto:jeanluc@bigfiveabidjan.com"
                className="text-[#36A24C] hover:text-[#EC7E05] font-medium transition-colors"
              >
                jeanluc@bigfiveabidjan.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
