'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  Download, 
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { authFetch } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ReportStats {
  totalUsers: number
  totalQuizzes: number
  totalQuestions: number
  averageScore: number
  completionRate: number
  quizzesByType: Record<string, number>
  recentActivity: Array<{
    date: string
    quizCount: number
    userCount: number
  }>
}

export default function AdminReportsPage() {
  const router = useRouter()
  const { isAdminAuthenticated } = useAdmin()
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authFetch(`/api/admin/analytics/stats?period=${period}`)
      
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalUsers: data.totalUsers || 0,
          totalQuizzes: data.totalQuizResults || 0,
          totalQuestions: data.totalQuestions || 0,
          averageScore: data.averageScore || 0,
          completionRate: data.completionRate || 0,
          quizzesByType: data.quizzesByType || {},
          recentActivity: data.recentActivity || []
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    if (!isHydrated) return

    if (!isAdminAuthenticated) {
      router.push('/ciprel-admin')
      return
    }

    fetchReports()
  }, [isHydrated, isAdminAuthenticated, period, router, fetchReports])

  const handleExport = async () => {
    try {
      const response = await authFetch(`/api/admin/analytics/export?period=${period}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rapport-ciprel-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
    }
  }

  if (!isHydrated) {
    return null
  }

  if (!isAdminAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports et Statistiques</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble des performances et de l'activité</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">90 derniers jours</SelectItem>
              <SelectItem value="365">Cette année</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={fetchReports} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <Button onClick={handleExport} disabled={loading}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-ciprel-600" />
        </div>
      ) : (
        <>
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quiz Complétés</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalQuizzes || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalQuestions || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Score Moyen</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.averageScore?.toFixed(1) || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques détaillées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz par Type</CardTitle>
                <CardDescription>Répartition des quiz complétés par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.quizzesByType && Object.keys(stats.quizzesByType).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(stats.quizzesByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{type.toLowerCase().replace('_', ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-ciprel-600 h-2 rounded-full"
                              style={{ 
                                width: `${Math.min((count / (stats.totalQuizzes || 1)) * 100, 100)}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucune donnée disponible</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taux de Complétion</CardTitle>
                <CardDescription>Pourcentage de quiz terminés avec succès</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-ciprel-600"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${stats?.completionRate || 0}, 100`}
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {stats?.completionRate?.toFixed(0) || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liens rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Accès Rapides</CardTitle>
              <CardDescription>Naviguer vers d'autres sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => router.push('/admin/results')}
                >
                  <BarChart3 className="w-5 h-5 mb-2 text-ciprel-600" />
                  <span className="font-medium">Résultats Quiz</span>
                  <span className="text-xs text-gray-500">Voir tous les résultats détaillés</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => router.push('/admin/questions')}
                >
                  <FileText className="w-5 h-5 mb-2 text-ciprel-600" />
                  <span className="font-medium">Gestion Questions</span>
                  <span className="text-xs text-gray-500">Gérer la banque de questions</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => router.push('/admin/users')}
                >
                  <Users className="w-5 h-5 mb-2 text-ciprel-600" />
                  <span className="font-medium">Utilisateurs</span>
                  <span className="text-xs text-gray-500">Gérer les comptes utilisateurs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
