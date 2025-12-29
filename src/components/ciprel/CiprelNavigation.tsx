'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  Phone,
  ChevronDown,
  Settings,
  Shield
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

const sondageItems = [
  { 
    href: '/sondage', 
    label: 'Sondage Opinion', 
    description: 'Partagez votre avis sur la démarche compétence'
  },
  // Ajout d'autres sondages futurs
  { 
    href: '/sondage/satisfaction', 
    label: 'Satisfaction Formation', 
    description: 'Évaluez la qualité des formations'
  },
  { 
    href: '/sondage/besoins', 
    label: 'Analyse des Besoins', 
    description: 'Identifiez vos besoins en compétences'
  }
]

export function CiprelNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [sondageDropdownOpen, setSondageDropdownOpen] = useState(false)
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false)

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50 border-b-2 border-ciprel-green-500">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo CIPREL Corporate */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
            <Image src="/images/logo.webp" alt="CIPREL" width={120} height={48} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col items-center space-y-1 px-3 py-2 rounded-xl text-gray-700 hover:text-ciprel-green-600 hover:bg-gradient-to-r hover:from-ciprel-green-50 hover:to-ciprel-orange-50 transition-all duration-300 font-medium"
                >
                  <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-xs text-center">{item.label}</span>
                </Link>
              )
            })}
            
            {/* Menu Sondages */}
            <div className="relative group">
              <button
                onMouseEnter={() => setSondageDropdownOpen(true)}
                onMouseLeave={() => setSondageDropdownOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl text-gray-700 hover:text-ciprel-green-600 hover:bg-gradient-to-r hover:from-ciprel-green-50 hover:to-ciprel-orange-50 transition-all duration-300 font-medium"
              >
                <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Sondages</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              <AnimatePresence>
                {sondageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-80 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                    onMouseEnter={() => setSondageDropdownOpen(true)}
                    onMouseLeave={() => setSondageDropdownOpen(false)}
                  >
                    {sondageItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-6 py-3 hover:bg-gradient-to-r hover:from-ciprel-green-50 hover:to-ciprel-orange-50 transition-colors duration-200"
                      >
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu Administration */}
            <div className="relative group">
              <button
                onMouseEnter={() => setAdminDropdownOpen(true)}
                onMouseLeave={() => setAdminDropdownOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl text-gray-700 hover:text-ciprel-green-600 hover:bg-gradient-to-r hover:from-ciprel-green-50 hover:to-ciprel-orange-50 transition-all duration-300 font-medium"
              >
                <Settings className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Administration</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              <AnimatePresence>
                {adminDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 w-72 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                    onMouseEnter={() => setAdminDropdownOpen(true)}
                    onMouseLeave={() => setAdminDropdownOpen(false)}
                  >
                    <Link
                      href="/admin"
                      className="block px-6 py-3 hover:bg-gradient-to-r hover:from-ciprel-green-50 hover:to-ciprel-orange-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-ciprel-green-600" />
                        <div>
                          <div className="font-medium text-gray-900">Tableau de Bord</div>
                          <div className="text-sm text-gray-500">Interface d'administration</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/login"
                      className="block px-6 py-3 hover:bg-gradient-to-r hover:from-ciprel-green-50 hover:to-ciprel-orange-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Key className="w-5 h-5 text-ciprel-orange-600" />
                        <div>
                          <div className="font-medium text-gray-900">Connexion Sécurisée</div>
                          <div className="text-sm text-gray-500">Accès administrateur</div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-ciprel-green-50 to-ciprel-orange-50 hover:from-ciprel-green-100 hover:to-ciprel-orange-100 transition-colors shadow-md"
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
              className="lg:hidden border-t-2 border-ciprel-green-100 bg-gradient-to-b from-white to-gray-50"
            >
              <div className="py-6 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-4 px-6 py-4 mx-2 rounded-xl hover:bg-gradient-to-r hover:from-ciprel-green-50 hover:to-ciprel-orange-50 transition-all duration-200 group"
                    >
                      <Icon className="w-6 h-6 text-ciprel-green-600 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{item.label}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    </Link>
                  )
                })}
                
                {/* Sondages Mobile */}
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="px-6 py-2">
                    <div className="flex items-center space-x-2 text-ciprel-green-700 font-semibold text-lg">
                      <BarChart3 className="w-5 h-5" />
                      <span>Sondages</span>
                    </div>
                  </div>
                  {sondageItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-start space-x-4 px-8 py-3 mx-2 rounded-xl hover:bg-gradient-to-r hover:from-ciprel-green-50 hover:to-ciprel-orange-50 transition-colors duration-200"
                    >
                      <div className="w-2 h-2 bg-ciprel-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Administration Mobile */}
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="px-6 py-2">
                    <div className="flex items-center space-x-2 text-ciprel-green-700 font-semibold text-lg">
                      <Settings className="w-5 h-5" />
                      <span>Administration</span>
                    </div>
                  </div>
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-4 px-8 py-3 mx-2 rounded-xl hover:bg-gradient-to-r hover:from-ciprel-green-50 hover:to-ciprel-orange-50 transition-colors duration-200"
                  >
                    <Shield className="w-5 h-5 text-ciprel-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Tableau de Bord</div>
                      <div className="text-sm text-gray-600">Interface d'administration</div>
                    </div>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-4 px-8 py-3 mx-2 rounded-xl hover:bg-gradient-to-r hover:from-ciprel-green-50 hover:to-ciprel-orange-50 transition-colors duration-200"
                  >
                    <Key className="w-5 h-5 text-ciprel-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900">Connexion Sécurisée</div>
                      <div className="text-sm text-gray-600">Accès administrateur</div>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
