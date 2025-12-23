import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Client Supabase admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workshopId = searchParams.get('workshop_id')

    console.log('🔍 [API /api/quiz/debug] Diagnostic des questions')

    // 1. Lister tous les workshop_id uniques dans la table questions
    const { data: allWorkshopIds, error: error1 } = await supabaseAdmin
      .from('questions')
      .select('workshop_id, quiz_type, metier_id')
      .eq('quiz_type', 'WORKSHOP')
    
    if (error1) {
      console.error('Erreur lors de la récupération des workshop_ids:', error1)
    }

    // Extraire les workshop_ids uniques
    const uniqueWorkshopIds = allWorkshopIds 
      ? Array.from(new Set(allWorkshopIds.map(q => q.workshop_id).filter(Boolean)))
      : []
    
    // Extraire les metier_ids uniques
    const uniqueMetierIds = allWorkshopIds 
      ? Array.from(new Set(allWorkshopIds.map(q => q.metier_id).filter(Boolean)))
      : []

    // 2. Compter les questions par workshop_id
    const questionsByWorkshop: Record<string, number> = {}
    if (allWorkshopIds) {
      allWorkshopIds.forEach(q => {
        const wid = q.workshop_id || 'NULL'
        questionsByWorkshop[wid] = (questionsByWorkshop[wid] || 0) + 1
      })
    }

    // 3. Lister les workshops_metiers disponibles
    const { data: workshops, error: error2 } = await supabaseAdmin
      .from('workshops_metiers')
      .select('id, titre, is_active')
      .order('ordre')

    // 4. Si un workshop_id spécifique est demandé, chercher ses questions
    interface QuestionInfo {
      id: string
      title: string
      workshop_id: string | null
      metier_id: number | null
      active: boolean
    }
    
    interface SpecificQuestionsResult {
      workshopId: string
      count: number
      questions: QuestionInfo[]
      alternativeByMetierId?: {
        metierId: number
        count: number
        questions: QuestionInfo[]
      }
    }
    
    let specificQuestions: SpecificQuestionsResult | null = null
    if (workshopId) {
      const { data: questions } = await supabaseAdmin
        .from('questions')
        .select('id, title, question, workshop_id, metier_id, quiz_type, active')
        .eq('workshop_id', workshopId)
      
      specificQuestions = {
        workshopId,
        count: questions?.length || 0,
        questions: questions?.map(q => ({
          id: q.id,
          title: q.title,
          workshop_id: q.workshop_id,
          metier_id: q.metier_id,
          active: q.active
        })) || []
      }

      // Essayer aussi avec metier_id si pas de résultat
      if (!questions || questions.length === 0) {
        // Chercher le metier_id correspondant
        const metierIdMap: Record<string, number> = {
          'production': 2,
          'qse': 3,
          'maintenance': 4,
          'rh-juridique': 5,
          'finances': 6,
          'achats-stocks': 7,
          'systemes-information': 8
        }
        
        const metierId = metierIdMap[workshopId]
        if (metierId) {
          const { data: questionsByMetier } = await supabaseAdmin
            .from('questions')
            .select('id, title, question, workshop_id, metier_id, quiz_type, active')
            .eq('metier_id', metierId)
          
          specificQuestions.alternativeByMetierId = {
            metierId,
            count: questionsByMetier?.length || 0,
            questions: questionsByMetier?.map(q => ({
              id: q.id,
              title: q.title,
              workshop_id: q.workshop_id,
              metier_id: q.metier_id,
              active: q.active
            })) || []
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      diagnostic: {
        totalWorkshopQuestions: allWorkshopIds?.length || 0,
        uniqueWorkshopIds,
        uniqueMetierIds,
        questionsByWorkshop,
        availableWorkshops: workshops?.map(w => ({
          id: w.id,
          titre: w.titre,
          is_active: w.is_active,
          hasQuestions: uniqueWorkshopIds.includes(w.id)
        })) || [],
        specificQuestions
      }
    })
  } catch (error: any) {
    console.error('❌ [API /api/quiz/debug] Erreur:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
