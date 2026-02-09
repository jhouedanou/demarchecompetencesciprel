'use client'

import { useRef, useState } from 'react'
import { Download, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import Link from 'next/link'

export default function ReportsPage() {
  const reportRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

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

      // A4 dimensions in mm
      const pdfWidth = 297 // landscape A4 width
      const pdfHeight = 210 // landscape A4 height

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Calculate scaling to fit width
      const ratio = pdfWidth / imgWidth
      const scaledHeight = imgHeight * ratio

      // If content fits on one page
      if (scaledHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight)
      } else {
        // Multi-page: slice the canvas into pages
        const pageCanvasHeight = pdfHeight / ratio
        let yOffset = 0
        let pageNum = 0

        while (yOffset < imgHeight) {
          if (pageNum > 0) {
            pdf.addPage()
          }

          const sliceHeight = Math.min(pageCanvasHeight, imgHeight - yOffset)

          // Create a temporary canvas for this page slice
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
    <div className="space-y-6">
      {/* Header with export button */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Rapports
            </h1>
            <p className="text-gray-600 mt-1">
              Vue d&apos;ensemble et export des données de la plateforme
            </p>
          </div>
        </div>

        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="bg-ciprel-green-600 hover:bg-ciprel-green-700 text-white"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Export en cours...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Exporter en PDF
            </>
          )}
        </Button>
      </div>

      {/* Content to capture for PDF */}
      <div ref={reportRef} className="space-y-6">
        {/* Title inside the captured area for PDF context */}
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

        {/* Stats */}
        <StatsCards />

        {/* Charts */}
        <AnalyticsCharts />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  )
}
