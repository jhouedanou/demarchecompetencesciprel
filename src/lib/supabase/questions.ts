/**
 * Supabase Questions Queries
 * Helper functions to retrieve questions by etape (stage/questionnaire type)
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export type Etape = 'INTRODUCTION' | 'SONDAGE' | 'WORKSHOP' | 'AUTRE'
export type QuizType = 'INTRODUCTION' | 'SONDAGE' | 'WORKSHOP'
export type Category = 'DEFINITION' | 'RESPONSABILITE' | 'COMPETENCES' | 'ETAPES' | 'OPINION'

export interface Question {
  id: string
  title: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string | null
  correct_answer: string[]
  category: Category
  quiz_type: QuizType
  etape: Etape
  points: number
  active: boolean
  order_index: number
  feedback: string | null
  explanation: string | null
  created_at: string
  updated_at: string
}

export interface QuestionsSummary {
  etape: Etape
  quiz_type: QuizType
  nombre_total: number
  nombre_actives: number
  nombre_inactives: number
  categories: Category[]
  premiere_creation: string
  derniere_modification: string
}

/**
 * Get all active questions ordered by etape
 */
export async function getAllQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('active', true)
    .order('etape', { ascending: true })
    .order('quiz_type', { ascending: false })
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching all questions:', error)
    return []
  }

  return data || []
}

/**
 * Get questions by specific etape
 */
export async function getQuestionsByEtape(etape: Etape): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('etape', etape)
    .eq('active', true)
    .order('quiz_type', { ascending: false })
    .order('order_index', { ascending: true })

  if (error) {
    console.error(`Error fetching questions for etape ${etape}:`, error)
    return []
  }

  return data || []
}

/**
 * Get introduction questionnaire questions
 */
export async function getIntroductionQuestions(): Promise<Question[]> {
  return getQuestionsByEtape('INTRODUCTION')
}

/**
 * Get opinion survey questions
 */
export async function getSurveyQuestions(): Promise<Question[]> {
  return getQuestionsByEtape('SONDAGE')
}

/**
 * Get workshop questions
 */
export async function getWorkshopQuestions(): Promise<Question[]> {
  return getQuestionsByEtape('WORKSHOP')
}

/**
 * Get questions by category
 */
export async function getQuestionsByCategory(
  category: Category,
  etape?: Etape
): Promise<Question[]> {
  let query = supabase
    .from('questions')
    .select('*')
    .eq('category', category)
    .eq('active', true)

  if (etape) {
    query = query.eq('etape', etape)
  }

  const { data, error } = await query
    .order('etape', { ascending: true })
    .order('order_index', { ascending: true })

  if (error) {
    console.error(`Error fetching questions for category ${category}:`, error)
    return []
  }

  return data || []
}

/**
 * Get questions summary grouped by etape
 */
export async function getQuestionsSummary(): Promise<QuestionsSummary[]> {
  const { data, error } = await supabase
    .rpc('get_questions_summary')

  if (error) {
    console.error('Error fetching questions summary:', error)
    return []
  }

  return data || []
}

/**
 * Get all questions including inactive (admin only)
 */
export async function getAllQuestionsIncludingInactive(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('etape', { ascending: true })
    .order('quiz_type', { ascending: false })
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching all questions:', error)
    return []
  }

  return data || []
}

/**
 * Get single question by id
 */
export async function getQuestionById(id: string): Promise<Question | null> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching question ${id}:`, error)
    return null
  }

  return data
}

/**
 * Create a new question
 */
export async function createQuestion(question: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<Question | null> {
  const { data, error } = await supabase
    .from('questions')
    .insert([question])
    .select()
    .single()

  if (error) {
    console.error('Error creating question:', error)
    return null
  }

  return data
}

/**
 * Update a question
 */
export async function updateQuestion(
  id: string,
  updates: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>
): Promise<Question | null> {
  const { data, error } = await supabase
    .from('questions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating question ${id}:`, error)
    return null
  }

  return data
}

/**
 * Delete a question
 */
export async function deleteQuestion(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting question ${id}:`, error)
    return false
  }

  return true
}

/**
 * Toggle question active status
 */
export async function toggleQuestionActive(id: string, active: boolean): Promise<Question | null> {
  return updateQuestion(id, { active })
}

/**
 * Get questions count by etape
 */
export async function getQuestionsCountByEtape(): Promise<Record<Etape, number>> {
  const { data, error } = await supabase
    .from('questions')
    .select('etape')
    .eq('active', true)

  if (error) {
    console.error('Error fetching questions count:', error)
    return {
      INTRODUCTION: 0,
      SONDAGE: 0,
      WORKSHOP: 0,
      AUTRE: 0
    }
  }

  const counts: Record<Etape, number> = {
    INTRODUCTION: 0,
    SONDAGE: 0,
    WORKSHOP: 0,
    AUTRE: 0
  }

  data?.forEach((q: { etape: Etape }) => {
    counts[q.etape]++
  })

  return counts
}
