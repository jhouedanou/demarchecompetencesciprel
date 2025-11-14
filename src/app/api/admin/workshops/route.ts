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

    // Récupérer tous les workshops (les admins peuvent voir tous, y compris les inactifs)
    const { data: workshops, error: dbError } = await supabase
      .from('workshops')
      .select('*')
      .order('metier_id', { ascending: true })

    if (dbError) {
      console.error('Erreur lors de la récupération des workshops:', dbError)
      return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 })
    }

    return NextResponse.json({ workshops: workshops || [] })
  } catch (error) {
    console.error('Erreur dans GET /api/admin/workshops:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate and check admin permissions
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    const body = await request.json()
    const { id, ...updates } = body

    // Validation
    if (!id) {
      return NextResponse.json({ error: 'ID du workshop manquant' }, { status: 400 })
    }

    // Mettre à jour le workshop
    const { data: updatedWorkshop, error: updateError } = await supabase
      .from('workshops')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Erreur lors de la mise à jour du workshop:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    if (!updatedWorkshop) {
      return NextResponse.json({ error: 'Workshop non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ workshop: updatedWorkshop })
  } catch (error) {
    console.error('Erreur dans PUT /api/admin/workshops:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
