'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  GitBranch, 
  ClipboardList, 
  BarChart3, 
  Key, 
  FileText, 
  Phone 
} from 'lucide-react'

const navigationItems = [
  { 
    href: '/', 
    label: 'Accueil', 
    icon: Home,
    description: 'Retour à l\'accueil'
  },
  { 
    href: '/dialectique', 
    label: 'Dialectique', 
    icon: BookOpen,
    description: 'Comprendre la démarche compétence'
  },
  { 
    href: '/synoptique', 
    label: 'Synoptique', 
    icon: GitBranch,
    description: 'Les 5 étapes cycliques'
  },
  { 
    href: '/quiz', 
    label: 'Quiz Introduction', 
    icon: ClipboardList,
    description: 'Testez vos connaissances'
  },
  { 
    href: '/sondage', 
    label: 'Sondage Opinion', 
    icon: BarChart3,
    description: 'Partagez votre avis'
  },
  { 
    href: '/facteurs-cles', 
    label: 'Facteurs Clés', 
    icon: Key,
    description: 'Leviers de succès'
  },
  { 
    href: '/ressources', 
    label: 'Ressources', 
    icon: FileText,
    description: 'Documents et guides'
  },
  { 
    href: '/contact', 
    label: 'Contact', 
    icon: Phone,
    description: 'Support RH'
  }
]

export function CiprelNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-ciprel-green-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo CIPREL */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <div className="font-bold text-ciprel-green-700 text-lg">CIPREL</div>
              <div className="text-xs text-ciprel-orange-600 font-medium">30 ans d'expérience</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-ciprel-green-600 hover:bg-ciprel-green-50 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-ciprel-green-50 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-ciprel-green-600" />
            ) : (
              <Menu className="w-6 h-6 text-ciprel-green-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-ciprel-green-100 bg-white"
            >
              <div className="py-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-ciprel-green-50 transition-colors duration-200"
                    >
                      <Icon className="w-5 h-5 text-ciprel-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
