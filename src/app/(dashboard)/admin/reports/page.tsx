'use client''use client'



import { useEffect, useState, useCallback, useRef } from 'react'<<<<<<< HEAD

import { useRouter } from 'next/navigation'import { useEffect, useState, useCallback, useRef } from 'react'

import {=======

  BarChart3,import { useEffect, useState, useCallback } from 'react'

  Users,>>>>>>> origin/main

  FileText,import { useRouter } from 'next/navigation'

  TrendingUp,import {

  Download,  BarChart3,

  Calendar,  Users,

  RefreshCw,  FileText,

  Loader2,  TrendingUp,

} from 'lucide-react'  Download,

import { useAuthStore } from '@/stores/auth-store'  Calendar,

import { authFetch } from '@/lib/api/client'<<<<<<< HEAD

import { Button } from '@/components/ui/button'  RefreshCw,

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'  Loader2

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'} from 'lucide-react'

=======

interface ReportStats {  Filter,

  totalUsers: number  RefreshCw

  totalQuizzes: number} from 'lucide-react'

  totalQuestions: numberimport { useAuthStore } from '@/stores/auth-store'

  averageScore: number>>>>>>> origin/main

  completionRate: numberimport { authFetch } from '@/lib/api/client'

  quizzesByType: Record<string, number>import { Button } from '@/components/ui/button'

  recentActivity: Array<{import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

    date: stringimport { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

    quizCount: number

    userCount: numberinterface ReportStats {

  }>  totalUsers: number

}  totalQuizzes: number

  totalQuestions: number

export default function AdminReportsPage() {  averageScore: number

  const router = useRouter()  completionRate: number

  const { isAuthenticated, user } = useAuthStore()  quizzesByType: Record<string, number>

  const isAdmin = isAuthenticated && user && ['ADMIN', 'MANAGER'].includes(user.role)  recentActivity: Array<{

  const reportRef = useRef<HTMLDivElement>(null)    date: string

  const [stats, setStats] = useState<ReportStats | null>(null)    quizCount: number

  const [loading, setLoading] = useState(true)    userCount: number

  const [period, setPeriod] = useState('30')  }>

  const [isExporting, setIsExporting] = useState(false)}

  const [isHydrated, setIsHydrated] = useState(false)

export default function AdminReportsPage() {

  useEffect(() => {  const router = useRouter()

    setIsHydrated(true)<<<<<<< HEAD

  }, [])  const reportRef = useRef<HTMLDivElement>(null)

  const [stats, setStats] = useState<ReportStats | null>(null)

  const fetchReports = useCallback(async () => {  const [loading, setLoading] = useState(true)

    try {  const [period, setPeriod] = useState('30')

      setLoading(true)  const [isExporting, setIsExporting] = useState(false)

      const response = await authFetch(`/api/admin/analytics/stats?period=${period}`)=======

  const { isAuthenticated, user } = useAuthStore()

      if (response.ok) {  const isAdmin = isAuthenticated && user && ['ADMIN', 'MANAGER'].includes(user.role)

        const data = await response.json()  const [stats, setStats] = useState<ReportStats | null>(null)

        setStats({  const [loading, setLoading] = useState(true)

          totalUsers: data.totalUsers || 0,  const [period, setPeriod] = useState('30')

          totalQuizzes: data.totalQuizResults || data.totalQuizAttempts || 0,  const [isHydrated, setIsHydrated] = useState(false)

          totalQuestions: data.totalQuestions || 0,

          averageScore: data.averageScore || 0,  useEffect(() => {

          completionRate: data.completionRate || 0,    setIsHydrated(true)

          quizzesByType: data.quizzesByType || {},  }, [])

          recentActivity: data.recentActivity || []>>>>>>> origin/main

        })

      }  const fetchReports = useCallback(async () => {

    } catch (error) {    try {

      console.error('Erreur lors du chargement des rapports:', error)      setLoading(true)

    } finally {      const response = await authFetch(`/api/admin/analytics/stats?period=${period}`)

      setLoading(false)

    }      if (response.ok) {

  }, [period])        const data = await response.json()

        setStats({

  useEffect(() => {          totalUsers: data.totalUsers || 0,

    if (!isHydrated) return<<<<<<< HEAD

          totalQuizzes: data.totalQuizResults || data.totalQuizAttempts || 0,

    if (!isAdmin) {=======

      router.push('/admin-login')          totalQuizzes: data.totalQuizResults || 0,

      return>>>>>>> origin/main

    }          totalQuestions: data.totalQuestions || 0,

          averageScore: data.averageScore || 0,

    fetchReports()          completionRate: data.completionRate || 0,

  }, [isHydrated, isAdmin, router, fetchReports])          quizzesByType: data.quizzesByType || {},

          recentActivity: data.recentActivity || []

  const handleExportPDF = async () => {        })

    if (!reportRef.current) return      }

    } catch (error) {

    setIsExporting(true)      console.error('Erreur lors du chargement des rapports:', error)

    } finally {

    try {      setLoading(false)

      const html2canvas = (await import('html2canvas')).default    }

      const { jsPDF } = await import('jspdf')  }, [period])



      const element = reportRef.current  useEffect(() => {

<<<<<<< HEAD

      const canvas = await html2canvas(element, {    fetchReports()

        scale: 2,  }, [fetchReports])

        useCORS: true,

        logging: false,  const handleExportPDF = async () => {

        backgroundColor: '#f9fafb',    if (!reportRef.current) return

        windowWidth: element.scrollWidth,

        windowHeight: element.scrollHeight,    setIsExporting(true)

      })

    try {

      const imgData = canvas.toDataURL('image/png')      const html2canvas = (await import('html2canvas')).default

      const imgWidth = canvas.width      const { jsPDF } = await import('jspdf')

      const imgHeight = canvas.height

      const element = reportRef.current

      const pdfWidth = 297

      const pdfHeight = 210      const canvas = await html2canvas(element, {

        scale: 2,

      const pdf = new jsPDF({        useCORS: true,

        orientation: 'landscape',        logging: false,

        unit: 'mm',        backgroundColor: '#f9fafb',

        format: 'a4',        windowWidth: element.scrollWidth,

      })        windowHeight: element.scrollHeight,

      })

      const ratio = pdfWidth / imgWidth

      const scaledHeight = imgHeight * ratio      const imgData = canvas.toDataURL('image/png')

      const imgWidth = canvas.width

      if (scaledHeight <= pdfHeight) {      const imgHeight = canvas.height

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight)

      } else {      const pdfWidth = 297

        const pageCanvasHeight = pdfHeight / ratio      const pdfHeight = 210

        let yOffset = 0

        let pageNum = 0      const pdf = new jsPDF({

        orientation: 'landscape',

        while (yOffset < imgHeight) {        unit: 'mm',

          if (pageNum > 0) {        format: 'a4',

            pdf.addPage()      })

          }

      const ratio = pdfWidth / imgWidth

          const sliceHeight = Math.min(pageCanvasHeight, imgHeight - yOffset)      const scaledHeight = imgHeight * ratio



          const pageCanvas = document.createElement('canvas')      if (scaledHeight <= pdfHeight) {

          pageCanvas.width = imgWidth        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight)

          pageCanvas.height = sliceHeight      } else {

          const ctx = pageCanvas.getContext('2d')        const pageCanvasHeight = pdfHeight / ratio

        let yOffset = 0

          if (ctx) {        let pageNum = 0

            ctx.drawImage(

              canvas,        while (yOffset < imgHeight) {

              0, yOffset, imgWidth, sliceHeight,          if (pageNum > 0) {

              0, 0, imgWidth, sliceHeight            pdf.addPage()

            )          }



            const pageImgData = pageCanvas.toDataURL('image/png')          const sliceHeight = Math.min(pageCanvasHeight, imgHeight - yOffset)

            const pageScaledHeight = sliceHeight * ratio

          const pageCanvas = document.createElement('canvas')

            pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageScaledHeight)          pageCanvas.width = imgWidth

          }          pageCanvas.height = sliceHeight

          const ctx = pageCanvas.getContext('2d')

          yOffset += pageCanvasHeight

          pageNum++          if (ctx) {

        }            ctx.drawImage(

      }              canvas,

              0, yOffset, imgWidth, sliceHeight,

      const now = new Date()              0, 0, imgWidth, sliceHeight

      const dateStr = now.toISOString().slice(0, 10)            )

      pdf.save(`rapport-ciprel-${dateStr}.pdf`)

    } catch (error) {            const pageImgData = pageCanvas.toDataURL('image/png')

      console.error('Erreur lors de l\'export PDF:', error)            const pageScaledHeight = sliceHeight * ratio

      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.')

    } finally {            pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageScaledHeight)

      setIsExporting(false)          }

    }

  }          yOffset += pageCanvasHeight

          pageNum++

  if (!isHydrated) {        }

    return null      }

  }

      const now = new Date()

  if (!isAdmin) {      const dateStr = now.toISOString().slice(0, 10)

    return null      pdf.save(`rapport-ciprel-${dateStr}.pdf`)

  }    } catch (error) {

      console.error('Erreur lors de l\'export PDF:', error)

  return (      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.')

    <div className="container mx-auto p-6 space-y-6">    } finally {

      {/* Header */}      setIsExporting(false)

      <div className="flex items-center justify-between">    }

        <div>=======

          <h1 className="text-3xl font-bold text-gray-900">Rapports et Statistiques</h1>    if (!isHydrated) return

          <p className="text-gray-600 mt-2">Vue d&apos;ensemble des performances et de l&apos;activité</p>

        </div>    if (!isAdmin) {

      router.push('/admin-login')

        <div className="flex items-center space-x-4">      return

          <Select value={period} onValueChange={setPeriod}>    }

            <SelectTrigger className="w-40">

              <Calendar className="w-4 h-4 mr-2" />    fetchReports()

              <SelectValue placeholder="Période" />  }, [isHydrated, isAuthenticated, user, period, router, fetchReports])

            </SelectTrigger>

            <SelectContent>  const handleExport = async () => {

              <SelectItem value="7">7 derniers jours</SelectItem>    try {

              <SelectItem value="30">30 derniers jours</SelectItem>      const response = await authFetch(`/api/admin/analytics/export?period=${period}`)

              <SelectItem value="90">90 derniers jours</SelectItem>      if (response.ok) {

              <SelectItem value="365">Cette année</SelectItem>        const blob = await response.blob()

            </SelectContent>        const url = window.URL.createObjectURL(blob)

          </Select>        const a = document.createElement('a')

        a.href = url

          <Button variant="outline" onClick={fetchReports} disabled={loading}>        a.download = `rapport-ciprel-${new Date().toISOString().split('T')[0]}.csv`

            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />        document.body.appendChild(a)

            Actualiser        a.click()

          </Button>        window.URL.revokeObjectURL(url)

        document.body.removeChild(a)

          <Button      }

            onClick={handleExportPDF}    } catch (error) {

            disabled={isExporting || loading}      console.error('Erreur lors de l\'export:', error)

            className="bg-ciprel-green-600 hover:bg-ciprel-green-700 text-white"    }

          >  }

            {isExporting ? (

              <>  if (!isHydrated) {

                <Loader2 className="h-4 w-4 mr-2 animate-spin" />    return null

                Export en cours...  }

              </>

            ) : (  if (!isAdmin) {

              <>    return null

                <Download className="w-4 h-4 mr-2" />>>>>>>> origin/main

                Exporter PDF  }

              </>

            )}  return (

          </Button>    <div className="container mx-auto p-6 space-y-6">

        </div><<<<<<< HEAD

      </div>      {/* Header */}

      <div className="flex items-center justify-between">

      {loading ? (        <div>

        <div className="flex items-center justify-center py-12">          <h1 className="text-3xl font-bold text-gray-900">Rapports et Statistiques</h1>

          <RefreshCw className="w-8 h-8 animate-spin text-ciprel-600" />          <p className="text-gray-600 mt-2">Vue d&apos;ensemble des performances et de l&apos;activité</p>

        </div>=======

      ) : (      <div className="flex items-center justify-between">

        <div ref={reportRef} className="space-y-6">        <div>

          {/* Titre dans la zone capturée pour le PDF */}          <h1 className="text-3xl font-bold text-gray-900">Rapports et Statistiques</h1>

          <div className="bg-white rounded-lg shadow p-4 text-center">          <p className="text-gray-600 mt-2">Vue d'ensemble des performances et de l'activité</p>

            <h2 className="text-lg font-bold text-gray-900">>>>>>>> origin/main

              CIPREL - Rapport de la Démarche Compétences        </div>

            </h2>

            <p className="text-sm text-gray-500">        <div className="flex items-center space-x-4">

              Généré le {new Date().toLocaleDateString('fr-FR', {          <Select value={period} onValueChange={setPeriod}>

                day: 'numeric',            <SelectTrigger className="w-40">

                month: 'long',              <Calendar className="w-4 h-4 mr-2" />

                year: 'numeric',              <SelectValue placeholder="Période" />

                hour: '2-digit',            </SelectTrigger>

                minute: '2-digit',            <SelectContent>

              })}              <SelectItem value="7">7 derniers jours</SelectItem>

            </p>              <SelectItem value="30">30 derniers jours</SelectItem>

          </div>              <SelectItem value="90">90 derniers jours</SelectItem>

              <SelectItem value="365">Cette année</SelectItem>

          {/* Cartes de statistiques */}            </SelectContent>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">          </Select>

            <Card>

              <CardContent className="p-6">          <Button variant="outline" onClick={fetchReports} disabled={loading}>

                <div className="flex items-center space-x-4">            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />

                  <div className="p-3 bg-blue-100 rounded-lg">            Actualiser

                    <Users className="w-6 h-6 text-blue-600" />          </Button>

                  </div>

                  <div><<<<<<< HEAD

                    <p className="text-sm text-gray-600">Total Utilisateurs</p>          <Button

                    <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>            onClick={handleExportPDF}

                  </div>            disabled={isExporting || loading}

                </div>            className="bg-ciprel-green-600 hover:bg-ciprel-green-700 text-white"

              </CardContent>          >

            </Card>            {isExporting ? (

              <>

            <Card>                <Loader2 className="h-4 w-4 mr-2 animate-spin" />

              <CardContent className="p-6">                Export en cours...

                <div className="flex items-center space-x-4">              </>

                  <div className="p-3 bg-green-100 rounded-lg">            ) : (

                    <BarChart3 className="w-6 h-6 text-green-600" />              <>

                  </div>                <Download className="w-4 h-4 mr-2" />

                  <div>                Exporter PDF

                    <p className="text-sm text-gray-600">Quiz Complétés</p>              </>

                    <p className="text-2xl font-bold text-gray-900">{stats?.totalQuizzes || 0}</p>            )}

                  </div>=======

                </div>          <Button onClick={handleExport} disabled={loading}>

              </CardContent>            <Download className="w-4 h-4 mr-2" />

            </Card>            Exporter

>>>>>>> origin/main

            <Card>          </Button>

              <CardContent className="p-6">        </div>

                <div className="flex items-center space-x-4">      </div>

                  <div className="p-3 bg-purple-100 rounded-lg">

                    <FileText className="w-6 h-6 text-purple-600" />      {loading ? (

                  </div>        <div className="flex items-center justify-center py-12">

                  <div>          <RefreshCw className="w-8 h-8 animate-spin text-ciprel-600" />

                    <p className="text-sm text-gray-600">Total Questions</p>        </div>

                    <p className="text-2xl font-bold text-gray-900">{stats?.totalQuestions || 0}</p>      ) : (

                  </div><<<<<<< HEAD

                </div>        <div ref={reportRef} className="space-y-6">

              </CardContent>          {/* Titre dans la zone capturée pour le PDF */}

            </Card>          <div className="bg-white rounded-lg shadow p-4 text-center">

            <h2 className="text-lg font-bold text-gray-900">

            <Card>              CIPREL - Rapport de la Démarche Compétences

              <CardContent className="p-6">            </h2>

                <div className="flex items-center space-x-4">            <p className="text-sm text-gray-500">

                  <div className="p-3 bg-orange-100 rounded-lg">              Généré le {new Date().toLocaleDateString('fr-FR', {

                    <TrendingUp className="w-6 h-6 text-orange-600" />                day: 'numeric',

                  </div>                month: 'long',

                  <div>                year: 'numeric',

                    <p className="text-sm text-gray-600">Score Moyen</p>                hour: '2-digit',

                    <p className="text-2xl font-bold text-gray-900">{stats?.averageScore?.toFixed(1) || 0}%</p>                minute: '2-digit',

                  </div>              })}

                </div>            </p>

              </CardContent>          </div>

            </Card>

          </div>=======

        <>

          {/* Statistiques détaillées */}>>>>>>> origin/main

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">          {/* Cartes de statistiques */}

            <Card>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <CardHeader>            <Card>

                <CardTitle>Quiz par Type</CardTitle>              <CardContent className="p-6">

                <CardDescription>Répartition des quiz complétés par catégorie</CardDescription>                <div className="flex items-center space-x-4">

              </CardHeader>                  <div className="p-3 bg-blue-100 rounded-lg">

              <CardContent>                    <Users className="w-6 h-6 text-blue-600" />

                {stats?.quizzesByType && Object.keys(stats.quizzesByType).length > 0 ? (                  </div>

                  <div className="space-y-4">                  <div>

                    {Object.entries(stats.quizzesByType).map(([type, count]) => (                    <p className="text-sm text-gray-600">Total Utilisateurs</p>

                      <div key={type} className="flex items-center justify-between">                    <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>

                        <span className="text-sm text-gray-600 capitalize">{type.toLowerCase().replace('_', ' ')}</span>                  </div>

                        <div className="flex items-center space-x-2">                </div>

                          <div className="w-32 bg-gray-200 rounded-full h-2">              </CardContent>

                            <div            </Card>

                              className="bg-ciprel-600 h-2 rounded-full"

                              style={{            <Card>

                                width: `${Math.min((count / (stats.totalQuizzes || 1)) * 100, 100)}%`              <CardContent className="p-6">

                              }}                <div className="flex items-center space-x-4">

                            />                  <div className="p-3 bg-green-100 rounded-lg">

                          </div>                    <BarChart3 className="w-6 h-6 text-green-600" />

                          <span className="text-sm font-medium text-gray-900 w-12 text-right">{count}</span>                  </div>

                        </div>                  <div>

                      </div>                    <p className="text-sm text-gray-600">Quiz Complétés</p>

                    ))}                    <p className="text-2xl font-bold text-gray-900">{stats?.totalQuizzes || 0}</p>

                  </div>                  </div>

                ) : (                </div>

                  <p className="text-gray-500 text-center py-4">Aucune donnée disponible</p>              </CardContent>

                )}            </Card>

              </CardContent>

            </Card>            <Card>

              <CardContent className="p-6">

            <Card>                <div className="flex items-center space-x-4">

              <CardHeader>                  <div className="p-3 bg-purple-100 rounded-lg">

                <CardTitle>Taux de Complétion</CardTitle>                    <FileText className="w-6 h-6 text-purple-600" />

                <CardDescription>Pourcentage de quiz terminés avec succès</CardDescription>                  </div>

              </CardHeader>                  <div>

              <CardContent>                    <p className="text-sm text-gray-600">Total Questions</p>

                <div className="flex items-center justify-center py-8">                    <p className="text-2xl font-bold text-gray-900">{stats?.totalQuestions || 0}</p>

                  <div className="relative w-32 h-32">                  </div>

                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">                </div>

                      <path              </CardContent>

                        className="text-gray-200"            </Card>

                        stroke="currentColor"

                        strokeWidth="3"            <Card>

                        fill="none"              <CardContent className="p-6">

                        d="M18 2.0845                <div className="flex items-center space-x-4">

                          a 15.9155 15.9155 0 0 1 0 31.831                  <div className="p-3 bg-orange-100 rounded-lg">

                          a 15.9155 15.9155 0 0 1 0 -31.831"                    <TrendingUp className="w-6 h-6 text-orange-600" />

                      />                  </div>

                      <path                  <div>

                        className="text-ciprel-600"                    <p className="text-sm text-gray-600">Score Moyen</p>

                        stroke="currentColor"                    <p className="text-2xl font-bold text-gray-900">{stats?.averageScore?.toFixed(1) || 0}%</p>

                        strokeWidth="3"                  </div>

                        strokeDasharray={`${stats?.completionRate || 0}, 100`}                </div>

                        fill="none"              </CardContent>

                        d="M18 2.0845            </Card>

                          a 15.9155 15.9155 0 0 1 0 31.831          </div>

                          a 15.9155 15.9155 0 0 1 0 -31.831"

                      />          {/* Statistiques détaillées */}

                    </svg>          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="absolute inset-0 flex items-center justify-center">            <Card>

                      <span className="text-2xl font-bold text-gray-900">              <CardHeader>

                        {stats?.completionRate?.toFixed(0) || 0}%                <CardTitle>Quiz par Type</CardTitle>

                      </span>                <CardDescription>Répartition des quiz complétés par catégorie</CardDescription>

                    </div>              </CardHeader>

                  </div>              <CardContent>

                </div>                {stats?.quizzesByType && Object.keys(stats.quizzesByType).length > 0 ? (

              </CardContent>                  <div className="space-y-4">

            </Card>                    {Object.entries(stats.quizzesByType).map(([type, count]) => (

          </div>                      <div key={type} className="flex items-center justify-between">

                        <span className="text-sm text-gray-600 capitalize">{type.toLowerCase().replace('_', ' ')}</span>

          {/* Liens rapides */}                        <div className="flex items-center space-x-2">

          <Card>                          <div className="w-32 bg-gray-200 rounded-full h-2">

            <CardHeader>                            <div

              <CardTitle>Accès Rapides</CardTitle>                              className="bg-ciprel-600 h-2 rounded-full"

              <CardDescription>Naviguer vers d&apos;autres sections</CardDescription>                              style={{

            </CardHeader>                                width: `${Math.min((count / (stats.totalQuizzes || 1)) * 100, 100)}%`

            <CardContent>                              }}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">                            />

                <Button                          </div>

                  variant="outline"                          <span className="text-sm font-medium text-gray-900 w-12 text-right">{count}</span>

                  className="h-auto p-4 flex flex-col items-start"                        </div>

                  onClick={() => router.push('/admin/results')}                      </div>

                >                    ))}

                  <BarChart3 className="w-5 h-5 mb-2 text-ciprel-600" />                  </div>

                  <span className="font-medium">Résultats Quiz</span>                ) : (

                  <span className="text-xs text-gray-500">Voir tous les résultats détaillés</span>                  <p className="text-gray-500 text-center py-4">Aucune donnée disponible</p>

                </Button>                )}

              </CardContent>

                <Button            </Card>

                  variant="outline"

                  className="h-auto p-4 flex flex-col items-start"            <Card>

                  onClick={() => router.push('/admin/questions')}              <CardHeader>

                >                <CardTitle>Taux de Complétion</CardTitle>

                  <FileText className="w-5 h-5 mb-2 text-ciprel-600" />                <CardDescription>Pourcentage de quiz terminés avec succès</CardDescription>

                  <span className="font-medium">Gestion Questions</span>              </CardHeader>

                  <span className="text-xs text-gray-500">Gérer la banque de questions</span>              <CardContent>

                </Button>                <div className="flex items-center justify-center py-8">

                  <div className="relative w-32 h-32">

                <Button                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">

                  variant="outline"                      <path

                  className="h-auto p-4 flex flex-col items-start"                        className="text-gray-200"

                  onClick={() => router.push('/admin/users')}                        stroke="currentColor"

                >                        strokeWidth="3"

                  <Users className="w-5 h-5 mb-2 text-ciprel-600" />                        fill="none"

                  <span className="font-medium">Utilisateurs</span>                        d="M18 2.0845

                  <span className="text-xs text-gray-500">Gérer les comptes utilisateurs</span>                          a 15.9155 15.9155 0 0 1 0 31.831

                </Button>                          a 15.9155 15.9155 0 0 1 0 -31.831"

              </div>                      />

            </CardContent>                      <path

          </Card>                        className="text-ciprel-600"

        </div>                        stroke="currentColor"

      )}                        strokeWidth="3"

    </div>                        strokeDasharray={`${stats?.completionRate || 0}, 100`}

  )                        fill="none"

}                        d="M18 2.0845

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
<<<<<<< HEAD
              <CardDescription>Naviguer vers d&apos;autres sections</CardDescription>
=======
              <CardDescription>Naviguer vers d'autres sections</CardDescription>
>>>>>>> origin/main
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
<<<<<<< HEAD
        </div>
=======
        </>
>>>>>>> origin/main
      )}
    </div>
  )
}
