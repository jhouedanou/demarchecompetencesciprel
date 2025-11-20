import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ [API /api/metiers] Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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
    console.log('📝 [API /api/metiers] Received body:', JSON.stringify(body, null, 2))

    const { id, statut, ordre, onedrive_url, publication_date, ...otherData } = body

    if (!id) {
      console.error('❌ [API /api/metiers] Missing ID in request body')
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

    if (onedrive_url !== undefined) {
      updateData.onedrive_link = onedrive_url
    }

    if (publication_date !== undefined) {
      console.log(`🔍 [API /api/metiers] publication_date value: "${publication_date}", type: ${typeof publication_date}`)
      updateData.publication_date = (publication_date === '' || publication_date === null) ? null : publication_date
      console.log(`🔍 [API /api/metiers] Converted to: ${updateData.publication_date}`)
    }

    console.log(`🔄 [API /api/metiers] Updating metier_id ${id} with:`, JSON.stringify(updateData, null, 2))

    // First check if the workshop exists
    const { data: existingWorkshop, error: fetchError } = await supabase
      .from('workshops')
      .select('*')
      .eq('metier_id', id)
      .maybeSingle()

    if (fetchError) {
      console.error('❌ [API /api/metiers] Error fetching workshop:', fetchError)
      return NextResponse.json(
        { error: `Database error: ${fetchError.message}` },
        { status: 500 }
      )
    }

    if (!existingWorkshop) {
      console.error(`❌ [API /api/metiers] Workshop with metier_id ${id} not found`)
      return NextResponse.json(
        { error: `Metier with ID ${id} not found` },
        { status: 404 }
      )
    }

    console.log(`📦 [API /api/metiers] Found existing workshop:`, existingWorkshop.metier_nom)

    // Update the workshop
    const { data: updatedWorkshop, error: updateError } = await supabase
      .from('workshops')
      .update(updateData)
      .eq('metier_id', id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ [API /api/metiers] Supabase update error:', updateError)
      return NextResponse.json(
        { error: `Update failed: ${updateError.message}` },
        { status: 500 }
      )
    }

    if (!updatedWorkshop) {
      console.error('❌ [API /api/metiers] Update returned no data')
      return NextResponse.json(
        { error: 'Update failed: no data returned' },
        { status: 500 }
      )
    }

    console.log(`✅ [API /api/metiers] Metier ${id} updated successfully:`, updatedWorkshop.metier_nom)

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
  } catch (error: any) {
    console.error('❌ [API /api/metiers] Unexpected error:', error)
    console.error('❌ [API /api/metiers] Error stack:', error.stack)
    return NextResponse.json(
      { error: `Failed to update metier block: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
