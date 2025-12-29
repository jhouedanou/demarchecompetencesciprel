'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, LogOut, Settings, BookOpen, Video, Brain, ChevronDown, FileText, MessageCircle, BarChart3, Shield, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils/cn'

const navigation = [
  { name: 'Accueil', href: '/', icon: BookOpen },
  { name: 'Évaluations', href: '/competences/quiz-introduction', icon: Brain },
]

const sondageItems = [
  { name: 'Sondage Opinion', href: '/sondage', icon: MessageCircle },
  { name: 'Évaluation 360°', href: '/competences/evaluation-360', icon: Users },
  { name: 'Feedback Manager', href: '/competences/feedback', icon: FileText },
]

export function CompetencesNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      // Still redirect even if sign out fails
      router.push('/')
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center py-3">
              <Image
                className="h-10 w-auto"
                src="/images/logo.webp"
                alt="CIPREL"
                width={100}
                height={40}
              />
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-bold text-ciprel-black">
                  CIPREL
                </span>
                <span className="text-xs text-ciprel-green-500 font-medium uppercase tracking-wide">
                  Compétences
                </span>
              </div>
            </div>

            {/* Navigation Desktop Moderne */}
            <div className="hidden md:ml-16 md:flex md:items-center">
              <nav className="flex items-center space-x-1">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'relative px-6 py-4 text-sm font-medium transition-all duration-300 group',
                        isActive
                          ? 'text-ciprel-green-600'
                          : 'text-gray-700 hover:text-ciprel-green-600'
                      )}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {isActive && (
                        <div className="absolute inset-0 bg-ciprel-green-50 rounded-lg border border-ciprel-green-100" />
                      )}
                      {!isActive && (
                        <div className="absolute inset-0 bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                      <div className={cn(
                        'absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300',
                        isActive
                          ? 'w-8 bg-ciprel-green-500'
                          : 'w-0 group-hover:w-6 bg-ciprel-green-400'
                      )} />
                    </Link>
                  )
                })}

                {/* Menu Sondages Moderne */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'relative px-6 py-4 text-sm font-medium transition-all duration-300 group hover:bg-transparent',
                        pathname.includes('/sondage') || pathname.includes('/evaluation') || pathname.includes('/feedback')
                          ? 'text-ciprel-green-600'
                          : 'text-gray-700 hover:text-ciprel-green-600'
                      )}
                    >
                      <span className="relative z-10 flex items-center">
                        Sondages
                        <ChevronDown className="h-3 w-3 ml-1.5 transition-transform group-data-[state=open]:rotate-180" />
                      </span>
                      {(pathname.includes('/sondage') || pathname.includes('/evaluation') || pathname.includes('/feedback')) && (
                        <div className="absolute inset-0 bg-ciprel-green-50 rounded-lg border border-ciprel-green-100" />
                      )}
                      <div className="absolute inset-0 bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className={cn(
                        'absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300',
                        (pathname.includes('/sondage') || pathname.includes('/evaluation') || pathname.includes('/feedback'))
                          ? 'w-8 bg-ciprel-green-500'
                          : 'w-0 group-hover:w-6 bg-ciprel-green-400'
                      )} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 shadow-xl border-0 bg-white/95 backdrop-blur-lg" align="start">
                    <div className="p-2">
                      <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
                        Évaluations & Feedback
                      </DropdownMenuLabel>
                      <div className="space-y-1 mt-2">
                        {sondageItems.map((item) => (
                          <DropdownMenuItem key={item.name} asChild className="p-0">
                            <Link
                              href={item.href}
                              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-ciprel-green-600 hover:bg-ciprel-green-50 transition-colors duration-200 cursor-pointer"
                            >
                              <div className="w-2 h-2 bg-ciprel-orange-400 rounded-full mr-3" />
                              <span>{item.name}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
          </div>

          {/* Actions droite */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Menu utilisateur connecté */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-ciprel-green-300">
                      <Avatar className="h-10 w-10 border-2 border-ciprel-green-100">
                        <AvatarImage
                          src={user?.avatar_url || undefined}
                          alt={user?.name || 'Avatar'}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-ciprel-green-500 to-ciprel-green-600 text-white font-semibold">
                          {getInitials(user?.name || null)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64 shadow-xl border-gray-100" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center space-x-3 p-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-ciprel-green-500 to-ciprel-green-600 text-white">
                            {getInitials(user?.name || null)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-ciprel-black">
                            {user?.name || 'Utilisateur'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-ciprel-green-100 text-ciprel-green-800 mt-1">
                            {user?.role === 'ADMIN' ? 'Administrateur' : user?.role === 'MANAGER' ? 'Manager' : 'Utilisateur'}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-3 h-4 w-4 text-ciprel-green-600" />
                        <span>Mon Profil</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/competences/resultats" className="cursor-pointer">
                        <BarChart3 className="mr-3 h-4 w-4 text-ciprel-orange-500" />
                        <span>Mes Résultats</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Boutons pour utilisateurs non connectés */}
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-ciprel-black hover:text-ciprel-green-600 hover:bg-ciprel-green-50"
                  >
                    Se connecter
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 hover:from-ciprel-green-600 hover:to-ciprel-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}

            {/* Menu mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Menu mobile moderne */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg">
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
                      isActive
                        ? 'bg-ciprel-green-50 text-ciprel-green-700 border border-ciprel-green-200'
                        : 'text-gray-700 hover:text-ciprel-green-600 hover:bg-gray-50'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}

              {/* Sondages en mobile */}
              <div className="pt-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Évaluations & Feedback
                </div>
                <div className="space-y-1">
                  {sondageItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-ciprel-green-600 hover:bg-ciprel-green-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="w-1.5 h-1.5 bg-ciprel-orange-400 rounded-full mr-3" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="px-4 pb-6 pt-2 border-t border-gray-100 space-y-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-ciprel-black hover:text-ciprel-green-600 hover:bg-ciprel-green-50"
                  >
                    Se connecter
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 hover:from-ciprel-green-600 hover:to-ciprel-green-700 text-white">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
