import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { cache, cacheKeys, CACHE_TTL } from '@/lib/cache'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Singleton pattern for Supabase client to reuse connections
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-connection-pool': 'true'
      }
    }
  })
  
  return supabaseInstance
}

// Helper to transform workshop to metier format
function transformWorkshopToMetier(workshop: any) {
  return {
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
    publication_date: workshop.publication_date || '',
    video_url: workshop.video_url || ''
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const onlyActive = searchParams.get('active') === 'true'
    
    // Generate cache key
    const cacheKey = onlyActive ? `${cacheKeys.metiers()}:active` : cacheKeys.metiers()
    
    // Try cache first
    const cachedMetiers = cache.get<any[]>(cacheKey)
    if (cachedMetiers !== null) {
      console.log(`📦 [API /api/metiers] Cache HIT for ${cacheKey}`)
      return NextResponse.json({
        success: true,
        count: cachedMetiers.length,
        data: cachedMetiers,
        cached: true
      })
    }

    const supabase = getSupabaseClient()

    // Optimized query - select only needed fields
    let query = supabase
      .from('workshops')
      .select('metier_id, metier_nom, is_active, onedrive_link, publication_date, video_url')
      .order('metier_id', { ascending: true })

    if (onlyActive) {
      query = query.eq('is_active', true)
    }

    const { data: workshops, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch metiers blocks' },
        { status: 500 }
      )
    }

    const metiers = workshops?.map(transformWorkshopToMetier) || []
    
    // Cache the result
    cache.set(cacheKey, metiers, CACHE_TTL.MEDIUM)
    console.log(`📦 [API /api/metiers] Cached ${metiers.length} metiers for ${cacheKey}`)

    return NextResponse.json({
      success: true,
      count: metiers.length,
      data: metiers
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metiers blocks' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    const { id, statut, ordre, onedrive_url, publication_date, video_url } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Build update object
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    if (statut !== undefined) {
      updateData.is_active = statut
    }

    if (onedrive_url !== undefined) {
      updateData.onedrive_link = onedrive_url
    }

    if (video_url !== undefined) {
      updateData.video_url = (video_url === '' || video_url === null) ? null : video_url
    }

    if (publication_date !== undefined) {
      updateData.publication_date = (publication_date === '' || publication_date === null) ? null : publication_date
    }

    // Single query: update and return in one operation
    const { data: updatedWorkshop, error: updateError } = await supabase
      .from('workshops')
      .update(updateData)
      .eq('metier_id', id)
      .select('metier_id, metier_nom, is_active, onedrive_link, publication_date, video_url')
      .single()

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: `Metier with ID ${id} not found` },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: `Update failed: ${updateError.message}` },
        { status: 500 }
      )
    }

    if (!updatedWorkshop) {
      return NextResponse.json(
        { error: `Metier with ID ${id} not found` },
        { status: 404 }
      )
    }

    // Invalidate cache after update
    cache.invalidatePattern('metiers:*')
    console.log('🗑️ [API /api/metiers] Cache invalidated after update')

    return NextResponse.json({
      success: true,
      message: 'Metier block updated successfully',
      data: transformWorkshopToMetier(updatedWorkshop)
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to update metier block: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
