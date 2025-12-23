import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth'
import questionsData from '@/../questions.json'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        // Authenticate and check admin permissions
        const { supabase, error: authError } = await requireAdmin(request)

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: authError.status })
        }

        let totalQuestions = 0
        let quizzesSynced = 0

        // Mapping from JSON workshop keys to workshop_id values in DB
        const workshopMap: Record<string, string> = {
            Gestion_des_Stocks: 'workshop_gestion_stock',
            Maintenance: 'workshop_maintenance',
            Production: 'workshop_production',
            QSE_RSE_Surete: 'workshop_qse_rse_surete',
            SITD: 'workshop_sitd',
            Services_Generaux: 'workshop_services_generaux',
            Ressources_Humaines_et_Juridique: 'workshop_rh_juridique',
            Achats_et_Logistique: 'workshop_achats_logistique',
            Controle_Interne: 'workshop_controle_interne',
            DAF: 'workshop_daf',
            Projets: 'workshop_projets',
            Phase_Introductive_Demarche_Competence: 'workshop_introduction'
        }

        // Support two JSON shapes:
        // 1) Existing format: { quizzes: [ { title, questions: [...] }, ... ] }
        //    -> inserts into 'questions' (existing behaviour)
        // 2) Workshop object format: { Gestion_des_Stocks: [ { question, reponse }, ... ], ... }
        //    -> inserts into 'questions_quiz' with workshop_id lookup

        if (Array.isArray((questionsData as any).quizzes)) {
            // Existing behaviour: keep inserting into 'questions' table
            for (const quiz of (questionsData as any).quizzes) {
                const quizType = quiz.title
                const questions = quiz.questions || []

                // 1. Delete existing questions for this quiz type to avoid duplicates
                const { error: deleteError } = await supabase
                    .from('questions')
                    .delete()
                    .eq('quiz_type', quizType)

                if (deleteError) {
                    console.error(`Error deleting questions for ${quizType}:`, deleteError)
                    continue
                }

                // 2. Prepare questions for insertion
                const questionsToInsert = questions.map((q: any) => ({
                    question: q.question,
                    options: q.options,
                    correct_answer: q.correct_answer,
                    source_ref: q.source_ref,
                    quiz_type: quizType
                }))

                // 3. Insert new questions
                const { error: insertError } = await supabase
                    .from('questions')
                    .insert(questionsToInsert)

                if (insertError) {
                    console.error(`Error inserting questions for ${quizType}:`, insertError)
                } else {
                    quizzesSynced++
                    totalQuestions += questions.length
                }
            }
        } else if (questionsData && typeof questionsData === 'object') {
            // New workshop-keyed JSON format
            for (const [workshopKey, questions] of Object.entries(questionsData as Record<string, any>)) {
                // Skip non-array entries
                if (!Array.isArray(questions)) continue

                const workshopId = workshopMap[workshopKey]
                if (!workshopId) {
                    console.warn(`No workshop_id mapping for key: ${workshopKey} — skipping.`)
                    continue
                }

                // Delete existing entries for this workshop
                const { error: deleteError } = await supabase
                    .from('questions_quiz')
                    .delete()
                    .eq('workshop_id', workshopId)

                if (deleteError) {
                    console.error(`Error deleting questions for workshop ${workshopId}:`, deleteError)
                    continue
                }

                const questionsToInsert = questions.map((q: any) => ({
                    workshop_id: workshopId,
                    question: q.question,
                    reponse: q.reponse
                }))

                const { error: insertError } = await supabase
                    .from('questions_quiz')
                    .insert(questionsToInsert)

                if (insertError) {
                    console.error(`Error inserting questions for workshop ${workshopId}:`, insertError)
                } else {
                    quizzesSynced++
                    totalQuestions += questions.length
                }
            }
        } else {
            console.warn('questions.json format not recognised by sync-questions route')
        }

        return NextResponse.json({
            success: true,
            message: `Synchronisation réussie : ${quizzesSynced} quiz traités, ${totalQuestions} questions importées.`
        })

    } catch (error) {
        console.error('Erreur dans POST /api/admin/sync-questions:', error)
        return NextResponse.json({
            error: 'Erreur serveur lors de la synchronisation: ' + (error instanceof Error ? error.message : String(error))
        }, { status: 500 })
    }
}
