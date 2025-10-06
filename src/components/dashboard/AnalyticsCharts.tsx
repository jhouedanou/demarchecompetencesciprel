'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface ChartData {
  userActivity: Array<{
    date: string
    users: number
    quiz_completions: number
    video_views: number
  }>
  quizPerformance: Array<{
    category: string
    average_score: number
    attempts: number
  }>
  deviceStats: Array<{
    name: string
    value: number
    color: string
  }>
}

export function AnalyticsCharts() {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/analytics/charts?period=${selectedPeriod}`)
        
        if (response.ok) {
          const data = await response.json()
          setChartData(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des graphiques:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [selectedPeriod])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <LoadingSpinner />
          </Card>
        ))}
      </div>
    )
  }

  if (!chartData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Impossible de charger les données analytiques
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Contrôles de période */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Analyses et tendances
        </h3>
        
        <div className="flex space-x-2">
          {[
            { key: '7d', label: '7 jours' },
            { key: '30d', label: '30 jours' },
            { key: '90d', label: '3 mois' },
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-ciprel-green-600  text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activité des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData.userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                  formatter={(value, name) => [value, name === 'users' ? 'Utilisateurs actifs' : name === 'quiz_completions' ? 'Quiz complétés' : 'Vues vidéos']}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="quiz_completions"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance des quiz */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.quizPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}${name === 'average_score' ? '%' : ''}`,
                    name === 'average_score' ? 'Score moyen' : 'Tentatives'
                  ]}
                />
                <Bar 
                  dataKey="average_score" 
                  fill="#8B5CF6" 
                  name="average_score"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Statistiques des appareils */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Utilisation par appareil</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData.deviceStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.deviceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, 'Pourcentage']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Légende */}
            <div className="flex justify-center space-x-4 mt-4">
              {chartData.deviceStats.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
