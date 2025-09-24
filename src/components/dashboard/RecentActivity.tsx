'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { 
  User, 
  Brain, 
  Video, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play
} from 'lucide-react'
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

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/analytics/activity')
        
        if (response.ok) {
          const data = await response.json()
          setActivities(data.activities || [])
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'activité récente:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentActivity()
    
    // Actualiser toutes les 30 secondes
    const interval = setInterval(fetchRecentActivity, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case 'user_signup':
        return <User className="h-4 w-4 text-green-600" />
      case 'quiz_completed':
        return status === 'success' 
          ? <CheckCircle className="h-4 w-4 text-green-600" />
          : <AlertCircle className="h-4 w-4 text-orange-600" />
      case 'video_viewed':
        return <Play className="h-4 w-4 text-blue-600" />
      case 'login':
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <Brain className="h-4 w-4 text-purple-600" />
    }
  }

  const getActivityColor = (type: string, status?: string) => {
    switch (type) {
      case 'user_signup':
        return 'bg-green-50 border-green-200'
      case 'quiz_completed':
        return status === 'success' 
          ? 'bg-green-50 border-green-200'
          : 'bg-orange-50 border-orange-200'
      case 'video_viewed':
        return 'bg-blue-50 border-blue-200'
      case 'login':
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-purple-50 border-purple-200'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
    
    return format(time, 'dd MMM HH:mm', { locale: fr })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner text="Chargement de l'activité..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          Activité récente
          <div className="flex items-center text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            En temps réel
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="p-6 text-center">
            <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              Aucune activité récente
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`border-l-4 p-4 ${getActivityColor(activity.type, activity.status)} ${
                  index !== activities.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage 
                      src={activity.user_avatar} 
                      alt={activity.user_name}
                    />
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                      {getInitials(activity.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getActivityIcon(activity.type, activity.status)}
                        <span className="text-sm font-medium text-gray-900">
                          {activity.user_name}
                        </span>
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        {getRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.details}
                    </p>
                    
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.user_email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
