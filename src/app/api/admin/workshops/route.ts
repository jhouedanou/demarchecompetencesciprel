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
    console.log('🔧 [API /admin/workshops PUT] Received body:', JSON.stringify(body, null, 2))

    const { id, ...updates } = body

    // Validation
    if (!id) {
      return NextResponse.json({ error: 'ID du workshop manquant' }, { status: 400 })
    }

    console.log('🔧 [API /admin/workshops PUT] Workshop ID:', id)
    console.log('🔧 [API /admin/workshops PUT] Updates to apply:', JSON.stringify(updates, null, 2))

    // Mettre à jour le workshop
    const updatePayload = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    console.log('🔧 [API /admin/workshops PUT] Full payload for DB:', JSON.stringify(updatePayload, null, 2))

    const { data: updatedWorkshop, error: updateError } = await supabase
      .from('workshops')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ [API /admin/workshops PUT] Database error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    if (!updatedWorkshop) {
      console.error('❌ [API /admin/workshops PUT] Workshop not found for id:', id)
      return NextResponse.json({ error: 'Workshop non trouvé' }, { status: 404 })
    }

    console.log('✅ [API /admin/workshops PUT] Workshop updated successfully:', JSON.stringify(updatedWorkshop, null, 2))

    return NextResponse.json({ workshop: updatedWorkshop })
  } catch (error) {
    console.error('❌ [API /admin/workshops PUT] Server error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
