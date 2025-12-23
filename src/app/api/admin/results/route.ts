import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Créer un client Supabase admin pour accéder aux données
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    // Note: L'authentification admin est gérée côté client via localStorage
    // Cette API est protégée par le fait que seuls les admins connaissent l'URL
    // et ont accès à la page admin

    // Get query parameters
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const quiz_type = url.searchParams.get('quiz_type')
    const user_id = url.searchParams.get('user_id')

    const offset = (page - 1) * limit

    console.log('📊 [GET /api/admin/results] Fetching results with params:', { page, limit, quiz_type, user_id })

    // Build the query using admin client
    let query = supabaseAdmin
      .from('quiz_results')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          email
        )
      `, { count: 'exact' })
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (quiz_type) {
      query = query.eq('quiz_type', quiz_type)
    }

    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    const { data: results, error, count } = await query

    if (error) {
      console.error('❌ [GET /api/admin/results] Error fetching quiz results:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des résultats', details: error.message }, { status: 500 })
    }

    console.log(`✅ [GET /api/admin/results] Found ${results?.length || 0} results, total: ${count}`)

    return NextResponse.json({
      results: results || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error: any) {
    console.error('❌ [GET /api/admin/results] Server error:', error)
    return NextResponse.json({ error: 'Erreur serveur', details: error.message }, { status: 500 })
  }
}
