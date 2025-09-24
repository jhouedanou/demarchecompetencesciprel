'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, Search, User, LogOut, Settings, Eye } from 'lucide-react'
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

export function Navbar() {
  const { user, signOut } = useAuthStore()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleSignOut = async () => {
    // Déconnecter l'admin aussi
    localStorage.removeItem('ciprel-admin-auth')
    await signOut()
    router.push('/')
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
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-40">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Logo et titre (visible sur mobile) */}
        <div className="flex items-center lg:hidden">
          <img 
            src="/images/logo-ciprel.png" 
            alt="CIPREL" 
            className="h-8 w-auto mr-3" 
          />
          <span className="text-xl font-bold text-gray-900">
            Admin CIPREL
          </span>
        </div>

        {/* Barre de recherche (desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions droite */}
        <div className="flex items-center space-x-4">
          {/* Bouton voir site */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:flex"
          >
            <Link href="/competences" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Voir le site
            </Link>
          </Button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-gray-500 relative"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user?.avatar_url || undefined} 
                    alt={user?.name || 'Avatar'} 
                  />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {getInitials(user?.name || null)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || 'Utilisateur'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {user?.role === 'ADMIN' ? 'Administrateur' : 'Manager'}
                  </span>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
