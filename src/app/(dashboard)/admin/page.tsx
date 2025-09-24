import { Metadata } from 'next'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'

export const metadata: Metadata = {
  title: 'Tableau de bord - Administration CIPREL',
  description: 'Dashboard administrateur pour la gestion de la démarche compétences CIPREL',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord administrateur
        </h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble des activités et performances de la plateforme CIPREL Compétences
        </p>
      </div>

      {/* Actions rapides */}
      <QuickActions />

      {/* Statistiques */}
      <StatsCards />

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCharts />
        <RecentActivity />
      </div>
    </div>
  )
}
