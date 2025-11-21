'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, Search, User, LogOut, Settings, Eye, CheckCircle, AlertCircle, Play, Brain, Clock } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { LogoutModal } from '@/components/auth/LogoutModal'
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
import { authFetch } from '@/lib/api/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ActivityItem {
  id: string
  type: 'user_signup' | 'quiz_completed' | 'video_viewed' | 'login'
  user_name: string
  user_email: string
  user_avatar?: string
  details: string
  timestamp: string
  status?: 'success' | 'warning' | 'error'
}

export function Navbar() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await authFetch('/api/admin/analytics/activity')
        if (response.ok) {
          const data = await response.json()
          setActivities(data.activities || [])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchRecentActivity()
      // Poll every minute
      const interval = setInterval(fetchRecentActivity, 60000)
      return () => clearInterval(interval)
    }
  }, [user])

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "À l'instant"
    if (diffInMinutes < 60) return `${diffInMinutes} min`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h`

    return format(time, 'dd MMM', { locale: fr })
  }

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case 'user_signup':
        return <User className="h-3 w-3 text-green-600" />
      case 'quiz_completed':
        return status === 'success'
          ? <CheckCircle className="h-3 w-3 text-green-600" />
          : <AlertCircle className="h-3 w-3 text-orange-600" />
      case 'video_viewed':
        return <Play className="h-3 w-3 text-blue-600" />
      case 'login':
        return <Clock className="h-3 w-3 text-gray-600" />
      default:
        return <Brain className="h-3 w-3 text-purple-600" />
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
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-40">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Logo et titre (visible sur mobile) */}
        <div className="flex items-center lg:hidden">
          <img
            src="/images/logo.webp"
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-gray-400 hover:text-gray-500 relative outline-none">
                <Bell className="h-6 w-6" />
                {activities.length > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {activities.length > 9 ? '9+' : activities.length}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
                <span className="text-xs text-gray-500">{activities.length} nouvelles</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-gray-500">Chargement...</div>
                ) : activities.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    Aucune notification récente
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {activities.map((activity) => (
                      <div key={activity.id} className="p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={activity.user_avatar} />
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                              {getInitials(activity.user_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {activity.user_name}
                              </p>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                {getRelativeTime(activity.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                              {activity.details}
                            </p>
                            <div className="flex items-center gap-1.5">
                              {getActivityIcon(activity.type, activity.status)}
                              <span className="text-[10px] text-gray-400">
                                {activity.type === 'user_signup' ? 'Inscription' :
                                  activity.type === 'quiz_completed' ? 'Quiz' :
                                    activity.type === 'video_viewed' ? 'Vidéo' : 'Activité'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                <Link href="/admin" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Voir toute l'activité
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

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
                onClick={() => setLogoutModalOpen(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modal de déconnexion */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
    </header>
  )
}
