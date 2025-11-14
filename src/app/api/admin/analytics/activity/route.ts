import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Authenticate and check admin permissions
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    // Récupérer les activités récentes
    const activities: Array<{
      id: string;
      type: string;
      user_name: string;
      user_email: string;
      user_avatar: string | null;
      details: string;
      timestamp: string;
      status: string;
    }> = []

    // Nouvelles inscriptions (dernières 24h)
    const { data: newUsers } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10)

    if (newUsers) {
      newUsers.forEach((user: any) => {
        activities.push({
          id: `signup_${user.id}`,
          type: 'user_signup',
          user_name: user.name || 'Utilisateur anonyme',
          user_email: user.email,
          user_avatar: user.avatar_url,
          details: 'S\'est inscrit sur la plateforme',
          timestamp: user.created_at,
          status: 'success'
        })
      })
    }

    // Quiz complétés récemment
    const { data: recentQuiz } = await supabase
      .from('quiz_results')
      .select(`
        id,
        quiz_type,
        score,
        max_score,
        percentage,
        completed_at,
        profiles!inner(name, email, avatar_url)
      `)
      .gte('completed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('completed_at', { ascending: false })
      .limit(10)

    if (recentQuiz) {
      recentQuiz.forEach((quiz: any) => {
        const profile = (quiz as any).profiles
        activities.push({
          id: `quiz_${quiz.id}`,
          type: 'quiz_completed',
          user_name: profile.name || 'Utilisateur anonyme',
          user_email: profile.email,
          user_avatar: profile.avatar_url,
          details: `A complété le quiz ${quiz.quiz_type} avec ${quiz.percentage}% de réussite`,
          timestamp: quiz.completed_at,
          status: (quiz.percentage || 0) >= 70 ? 'success' : 'warning'
        })
      })
    }

    // Vues vidéos récentes
    const { data: recentVideoViews } = await supabase
      .from('video_views')
      .select(`
        id,
        viewed_at,
        watch_duration,
        completed,
        profiles!inner(name, email, avatar_url),
        videos!inner(title)
      `)
      .gte('viewed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('viewed_at', { ascending: false })
      .limit(10)

    if (recentVideoViews) {
      recentVideoViews.forEach((view: any) => {
        const profile = (view as any).profiles
        const video = (view as any).videos
        activities.push({
          id: `video_${view.id}`,
          type: 'video_viewed',
          user_name: profile.name || 'Utilisateur anonyme',
          user_email: profile.email,
          user_avatar: profile.avatar_url,
          details: `A regardé "${video.title}"${view.completed ? ' (complètement)' : ''}`,
          timestamp: view.viewed_at,
          status: 'success'
        })
      })
    }

    // Trier les activités par date décroissante
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({
      activities: activities.slice(0, 20) // Limiter à 20 activités
    })
  } catch (error) {
    console.error('Erreur dans GET /api/admin/analytics/activity:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
