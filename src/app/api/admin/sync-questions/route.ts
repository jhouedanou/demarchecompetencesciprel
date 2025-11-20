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

        // Iterate through each quiz in the JSON file
        for (const quiz of questionsData.quizzes) {
            const quizType = quiz.title
            const questions = quiz.questions

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
            const questionsToInsert = questions.map(q => ({
                // We let Supabase generate the primary key 'id' if it's serial, 
                // OR we can use the id from JSON if we want to preserve it.
                // Let's try to preserve it but be careful about conflicts if IDs are global.
                // Usually it's safer to let DB handle IDs, but here we might want stability.
                // Let's omit 'id' and let DB generate it to be safe, unless we really need it.
                // But wait, the JSON has IDs like 1, 2, 3 for EACH quiz. 
                // If the DB 'id' is unique across the table, we CANNOT use these IDs.
                // So we MUST omit 'id'.
                question: q.question,
                options: q.options,
                correct_answer: q.correct_answer, // This is a string like "b" or "B" or "A, C, D"
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
