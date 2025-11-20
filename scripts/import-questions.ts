#!/usr/bin/env node

/**
 * Script pour importer les questions de questions.json vers Supabase
 * Usage: npx ts-node scripts/import-questions.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer: string
  source_ref?: string
}

interface QuizData {
  title: string
  questions: Question[]
}

interface QuestionsJson {
  quizzes: QuizData[]
}

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: Variables d\'environnement SUPABASE manquantes')
  console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Mapper les titres de quiz aux catégories et types
const quizTypeMap: Record<string, { category: string; quiz_type: string }> = {
  'Quiz de la DAF': { category: 'DEFINITION', quiz_type: 'INTRODUCTION' },
  'QUIZ – Ressources Humaines & Juridique': { category: 'DEFINITION', quiz_type: 'INTRODUCTION' },
  'QUIZ GESTION DES STOCK': { category: 'DEFINITION', quiz_type: 'INTRODUCTION' },
  'Quiz PROJETS': { category: 'DEFINITION', quiz_type: 'INTRODUCTION' },
  'QUIZ SUR SITD': { category: 'DEFINITION', quiz_type: 'INTRODUCTION' },
  'Quiz Achats et Logistique': { category: 'DEFINITION', quiz_type: 'INTRODUCTION' },
  'QUIZ – Services Généraux': { category: 'DEFINITION', quiz_type: 'INTRODUCTION' },
  'QUIZ SUR QSE RSE SURETE': { category: 'DEFINITION', quiz_type: 'INTRODUCTION' },
  'QUIZ SUR LA PRODUCTION': { category: 'DEFINITION', quiz_type: 'INTRODUCTION' },
  'QUIZ SUR LA PHASE INTRODUCTIVE': { category: 'DEFINITION', quiz_type: 'INTRODUCTION' },
}

async function importQuestions() {
  try {
    console.log('📚 Début de l\'import des questions...\n')

    // Lire le fichier questions.json
    const questionsPath = path.join(process.cwd(), 'questions.json')
    if (!fs.existsSync(questionsPath)) {
      console.error(`❌ Fichier non trouvé: ${questionsPath}`)
      process.exit(1)
    }

    const questionsData: QuestionsJson = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'))

    let totalQuestionsImported = 0
    let totalQuestionsSkipped = 0

    // Traiter chaque quiz
    for (const quiz of questionsData.quizzes) {
      const quizConfig = quizTypeMap[quiz.title] || {
        category: 'DEFINITION',
        quiz_type: 'INTRODUCTION',
      }

      console.log(`📖 Traitement du quiz: ${quiz.title}`)
      console.log(`   Type: ${quizConfig.quiz_type}, Catégorie: ${quizConfig.category}`)

      // Traiter chaque question du quiz
      for (const q of quiz.questions) {
        try {
          // Parser les options (elles sont formatées comme "a) Option" ou "A. Option")
          const options = q.options
            .map((opt: string) => opt.replace(/^[a-dA-D][).]\s*/, '').trim())

          // Déterminer la bonne réponse (convertir en index tableau)
          const correctAnswerLetter = String(q.correct_answer).toLowerCase()
          const correctAnswerIndex = correctAnswerLetter.charCodeAt(0) - 97 // Convert 'a' to 0, 'b' to 1, etc.

          if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
            console.warn(
              `⚠️  Réponse incorrecte pour: "${q.question.substring(0, 50)}..." (réponse: ${q.correct_answer})`
            )
            totalQuestionsSkipped++
            continue
          }

          const questionData = {
            title: quiz.title,
            question: q.question,
            option_a: options[0] || '',
            option_b: options[1] || '',
            option_c: options[2] || '',
            option_d: options[3] || null,
            correct_answer: [correctAnswerIndex], // Stocker comme tableau
            category: quizConfig.category,
            quiz_type: quizConfig.quiz_type,
            points: 1,
            feedback: null,
            explanation: q.source_ref || null,
            order_index: q.id,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          // Insérer la question
          const { error } = await supabase
            .from('questions')
            .insert([questionData])

          if (error) {
            console.error(`❌ Erreur lors de l'insertion: ${error.message}`)
            totalQuestionsSkipped++
          } else {
            totalQuestionsImported++
            console.log(
              `   ✅ Question ${q.id}: "${q.question.substring(0, 60)}${q.question.length > 60 ? '...' : ''}"`
            )
          }
        } catch (err) {
          console.error(`❌ Erreur lors du traitement de la question ${q.id}:`, err)
          totalQuestionsSkipped++
        }
      }

      console.log(`   ✨ ${quiz.questions.length} questions traitées\n`)
    }

    console.log('\n✅ Import terminé!')
    console.log(`📊 Résumé:`)
    console.log(`   - Questions importées: ${totalQuestionsImported}`)
    console.log(`   - Questions ignorées: ${totalQuestionsSkipped}`)
    console.log(`   - Total: ${totalQuestionsImported + totalQuestionsSkipped}`)
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error)
    process.exit(1)
  }
}

// Lancer l'import
importQuestions()
