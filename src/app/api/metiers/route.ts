import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    console.log('📚 [API /api/metiers] Fetching all metiers from workshops table')

    // Optionally filter by status
    const { searchParams } = new URL(request.url)
    const onlyActive = searchParams.get('active') === 'true'

    // Fetch from Supabase workshops table
    let query = supabase
      .from('workshops')
      .select('*')
      .order('metier_id', { ascending: true })

    if (onlyActive) {
      query = query.eq('is_active', true)
    }

    const { data: workshops, error } = await query

    if (error) {
      console.error('❌ [API /api/metiers] Supabase error:', error)
      throw error
    }

    // Transform workshops to metiers format
    const metiers = workshops?.map(workshop => ({
      id: workshop.metier_id,
      slug: `metier-${workshop.metier_id}`,
      titre: workshop.metier_nom,
      periode: '',
      phase: 1,
      statut: workshop.is_active,
      ordre: workshop.metier_id,
      description: null,
      mission: null,
      definitionEtObjectifs: null,
      beneficesPourCiprel: null,
      beneficesPourPersonnel: null,
      laCompetence: null,
      slogans: [],
      competencesCles: null,
      outils: [],
      onedrive_url: workshop.onedrive_link || '',
      publication_date: workshop.publication_date || ''
    })) || []

    return NextResponse.json({
      success: true,
      count: metiers.length,
      data: metiers
    })
  } catch (error) {
    console.error('❌ [API /api/metiers] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metiers blocks' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('✏️ [API /api/metiers] Update metier in workshops table')

    const body = await request.json()
    const { id, statut, ordre, ...otherData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Update in Supabase workshops table
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (statut !== undefined) {
      updateData.is_active = statut
    }

    console.log(`🔄 [API /api/metiers] Updating metier_id ${id} with:`, updateData)

    // Update the workshop
    const { data: updatedWorkshop, error } = await supabase
      .from('workshops')
      .update(updateData)
      .eq('metier_id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ [API /api/metiers] Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!updatedWorkshop) {
      return NextResponse.json(
        { error: 'Metier not found' },
        { status: 404 }
      )
    }

    console.log(`✅ [API /api/metiers] Metier ${id} updated successfully`)

    // Return in metiers format
    return NextResponse.json({
      success: true,
      message: 'Metier block updated successfully',
      data: {
        id: updatedWorkshop.metier_id,
        slug: `metier-${updatedWorkshop.metier_id}`,
        titre: updatedWorkshop.metier_nom,
        periode: '',
        phase: 1,
        statut: updatedWorkshop.is_active,
        ordre: updatedWorkshop.metier_id,
        description: null,
        mission: null,
        definitionEtObjectifs: null,
        beneficesPourCiprel: null,
        beneficesPourPersonnel: null,
        laCompetence: null,
        slogans: [],
        competencesCles: null,
        outils: [],
        onedrive_url: updatedWorkshop.onedrive_link || '',
        publication_date: updatedWorkshop.publication_date || ''
      }
    })
  } catch (error) {
    console.error('❌ [API /api/metiers] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update metier block' },
      { status: 500 }
    )
  }
}
