import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { withCache, cacheKeys, CACHE_TTL } from '@/lib/cache'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const workshops = await withCache(
      cacheKeys.workshops(),
      async () => {
        const supabase = createServerClient()
        
        const { data, error } = await supabase
          .from('workshops_metiers')
          .select('*')
          .eq('is_active', true)
          .order('ordre', { ascending: true })
        
        if (error) {
          throw new Error(error.message)
        }
        
        return data || []
      },
      CACHE_TTL.MEDIUM // Cache for 5 minutes
    )
    
    return NextResponse.json({
      success: true,
      data: workshops
    })
  } catch (error: any) {
    console.error('Erreur API workshops-metiers:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
