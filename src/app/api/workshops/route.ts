import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing')
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Récupérer les paramètres de requête
    const url = new URL(request.url)
    const activeOnly = url.searchParams.get('activeOnly') !== 'false' // true by default

    // Construire la requête
    let query = supabase
      .from('workshops')
      .select('*')
      .order('metier_id', { ascending: true })

    // Si activeOnly est true (par défaut), filtrer par is_active
    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data: workshops, error } = await query

    if (error) {
      console.error('Erreur lors de la récupération des workshops:', error)
      return NextResponse.json(
        { error: 'Erreur de base de données' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      workshops: workshops || [],
      total: workshops?.length || 0,
    })
  } catch (error) {
    console.error('Erreur dans GET /api/workshops:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
