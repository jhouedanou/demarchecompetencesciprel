'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Download,
  Calendar,
  RefreshCw,
  Loader2
} from 'lucide-react'
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
  const reportRef = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const [isExporting, setIsExporting] = useState(false)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authFetch(`/api/admin/analytics/stats?period=${period}`)

      if (response.ok) {
        const data = await response.json()
        setStats({
          totalUsers: data.totalUsers || 0,
          totalQuizzes: data.totalQuizResults || data.totalQuizAttempts || 0,
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
    fetchReports()
  }, [fetchReports])

  const handleExportPDF = async () => {
    if (!reportRef.current) return

    setIsExporting(true)

    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const element = reportRef.current

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f9fafb',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      const pdfWidth = 297
      const pdfHeight = 210

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      const ratio = pdfWidth / imgWidth
      const scaledHeight = imgHeight * ratio

      if (scaledHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight)
      } else {
        const pageCanvasHeight = pdfHeight / ratio
        let yOffset = 0
        let pageNum = 0

        while (yOffset < imgHeight) {
          if (pageNum > 0) {
            pdf.addPage()
          }

          const sliceHeight = Math.min(pageCanvasHeight, imgHeight - yOffset)

          const pageCanvas = document.createElement('canvas')
          pageCanvas.width = imgWidth
          pageCanvas.height = sliceHeight
          const ctx = pageCanvas.getContext('2d')

          if (ctx) {
            ctx.drawImage(
              canvas,
              0, yOffset, imgWidth, sliceHeight,
              0, 0, imgWidth, sliceHeight
            )

            const pageImgData = pageCanvas.toDataURL('image/png')
            const pageScaledHeight = sliceHeight * ratio

            pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageScaledHeight)
          }

          yOffset += pageCanvasHeight
          pageNum++
        }
      }

      const now = new Date()
      const dateStr = now.toISOString().slice(0, 10)
      pdf.save(`rapport-ciprel-${dateStr}.pdf`)
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error)
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports et Statistiques</h1>
          <p className="text-gray-600 mt-2">Vue d&apos;ensemble des performances et de l&apos;activité</p>
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

          <Button
            onClick={handleExportPDF}
            disabled={isExporting || loading}
            className="bg-ciprel-green-600 hover:bg-ciprel-green-700 text-white"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exporter PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-ciprel-600" />
        </div>
      ) : (
        <div ref={reportRef} className="space-y-6">
          {/* Titre dans la zone capturée pour le PDF */}
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h2 className="text-lg font-bold text-gray-900">
              CIPREL - Rapport de la Démarche Compétences
            </h2>
            <p className="text-sm text-gray-500">
              Généré le {new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

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
              <CardDescription>Naviguer vers d&apos;autres sections</CardDescription>
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
        </div>
      )}
    </div>
  )
}
