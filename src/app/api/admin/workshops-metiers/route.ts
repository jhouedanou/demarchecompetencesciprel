import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET - Récupérer tous les workshops métiers (admin voit tous, même inactifs)
export async function GET(request: NextRequest) {
  try {
    const { supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    const { data: workshops, error: dbError } = await supabase
      .from('workshops_metiers')
      .select('*')
      .order('ordre', { ascending: true })

    if (dbError) {
      console.error('Erreur lors de la récupération des workshops métiers:', dbError)
      return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 })
    }

    return NextResponse.json({ success: true, workshops: workshops || [] })
  } catch (error) {
    console.error('Erreur dans GET /api/admin/workshops-metiers:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Mettre à jour un workshop métier
export async function PUT(request: NextRequest) {
  try {
    const { supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID du workshop manquant' }, { status: 400 })
    }

    const updatePayload = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data: updatedWorkshop, error: updateError } = await supabase
      .from('workshops_metiers')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Erreur mise à jour workshop métier:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    if (!updatedWorkshop) {
      return NextResponse.json({ error: 'Workshop non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ success: true, workshop: updatedWorkshop })
  } catch (error) {
    console.error('Erreur dans PUT /api/admin/workshops-metiers:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau workshop métier
export async function POST(request: NextRequest) {
  try {
    const { supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    const body = await request.json()
    
    // Validation des champs requis
    if (!body.id || !body.titre || !body.departement) {
      return NextResponse.json({ 
        error: 'Champs requis manquants: id, titre, departement' 
      }, { status: 400 })
    }

    const { data: newWorkshop, error: insertError } = await supabase
      .from('workshops_metiers')
      .insert([body])
      .select()
      .single()

    if (insertError) {
      console.error('Erreur création workshop métier:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, workshop: newWorkshop })
  } catch (error) {
    console.error('Erreur dans POST /api/admin/workshops-metiers:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un workshop métier
export async function DELETE(request: NextRequest) {
  try {
    const { supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    const { error: deleteError } = await supabase
      .from('workshops_metiers')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Erreur suppression workshop métier:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur dans DELETE /api/admin/workshops-metiers:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
