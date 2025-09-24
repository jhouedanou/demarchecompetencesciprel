import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'
    
    // Vérifier l'authentification et les permissions
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier les permissions admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['ADMIN', 'MANAGER'].includes(profile.role)) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
    }

    // Calculer la date de début selon la période
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Générer les données d'activité utilisateur (simulation avec données réelles quand disponibles)
    const userActivity = []
    for (let i = parseInt(period); i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      
      // En production, ces données viendraient de vraies requêtes à la base
      userActivity.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 50) + 10,
        quiz_completions: Math.floor(Math.random() * 20) + 5,
        video_views: Math.floor(Math.random() * 100) + 20,
      })
    }

    // Performance par catégorie de quiz
    const { data: quizPerformance } = await supabase
      .from('quiz_results')
      .select(`
        responses,
        score,
        max_score
      `)
      .gte('completed_at', startDate.toISOString())

    // Analyser les performances par catégorie (simulation)
    const categories = ['DEFINITION', 'RESPONSABILITE', 'COMPETENCES', 'ETAPES']
    const quizPerformanceData = categories.map(category => ({
      category,
      average_score: Math.floor(Math.random() * 30) + 60, // 60-90%
      attempts: Math.floor(Math.random() * 100) + 10,
    }))

    // Statistiques des appareils (simulation)
    const deviceStats = [
      { name: 'Mobile', value: 45, color: '#3B82F6' },
      { name: 'Desktop', value: 35, color: '#10B981' },
      { name: 'Tablet', value: 20, color: '#8B5CF6' },
    ]

    const chartData = {
      userActivity,
      quizPerformance: quizPerformanceData,
      deviceStats
    }

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Erreur dans GET /api/admin/analytics/charts:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
