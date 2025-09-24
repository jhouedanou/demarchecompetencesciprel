'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Brain, Video, TrendingUp, Clock, Award } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface StatsData {
  totalUsers: number
  totalQuizAttempts: number
  totalVideos: number
  averageScore: number
  completionRate: number
  activeToday: number
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/analytics/stats')
        
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsConfig = [
    {
      title: 'Utilisateurs totaux',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12.5%',
    },
    {
      title: 'Quiz complétés',
      value: stats?.totalQuizAttempts || 0,
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8.2%',
    },
    {
      title: 'Vidéos disponibles',
      value: stats?.totalVideos || 0,
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+3',
    },
    {
      title: 'Score moyen',
      value: `${stats?.averageScore || 0}%`,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+2.1%',
    },
    {
      title: 'Taux de complétion',
      value: `${stats?.completionRate || 0}%`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '+5.4%',
    },
    {
      title: 'Actifs aujourd\'hui',
      value: stats?.activeToday || 0,
      icon: Clock,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      change: '+18',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <LoadingSpinner />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-2xl font-bold text-gray-900">
                {typeof stat.value === 'number' && stat.value > 1000
                  ? `${(stat.value / 1000).toFixed(1)}k`
                  : stat.value
                }
              </div>
              
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium">
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-1">
                  vs mois dernier
                </span>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${stat.bgColor} ${stat.color.replace('text', 'bg')}`}
                style={{ 
                  width: `${Math.min(100, typeof stat.value === 'number' ? 
                    (stat.value / Math.max(stats?.totalUsers || 100, 100)) * 100 : 
                    75)}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
