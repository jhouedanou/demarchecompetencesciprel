'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import {
  getQuestionsByEtape,
  getAllQuestions,
  getQuestionsCountByEtape,
  toggleQuestionActive,
  deleteQuestion,
  type Etape,
  type Question
} from '@/lib/supabase/questions'

const ETAPES = [
  { value: 'INTRODUCTION' as Etape, label: 'Questionnaire Introduction', color: 'bg-blue-100 text-blue-800' },
  { value: 'SONDAGE' as Etape, label: 'Sondage Opinion', color: 'bg-green-100 text-green-800' },
  { value: 'WORKSHOP' as Etape, label: 'Workshops Métiers', color: 'bg-purple-100 text-purple-800' },
  { value: 'AUTRE' as Etape, label: 'Autres', color: 'bg-gray-100 text-gray-800' }
]

const CATEGORIES = {
  DEFINITION: 'Définition',
  RESPONSABILITE: 'Responsabilité',
  COMPETENCES: 'Compétences',
  ETAPES: 'Étapes',
  OPINION: 'Opinion'
}

interface QuestionsListByEtapeProps {
  adminOnly?: boolean
}

export default function QuestionsListByEtape({ adminOnly = false }: QuestionsListByEtapeProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [counts, setCounts] = useState<Record<Etape, number>>({} as Record<Etape, number>)
  const [loading, setLoading] = useState(true)
  const [activeEtape, setActiveEtape] = useState<Etape>('INTRODUCTION')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const allQuestions = adminOnly ? await getAllQuestions() : await getAllQuestions()
      setQuestions(allQuestions)

      const counts = await getQuestionsCountByEtape()
      setCounts(counts)
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await toggleQuestionActive(id, !currentActive)
      loadQuestions()
    } catch (error) {
      console.error('Error toggling question:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return

    setDeleteLoading(id)
    try {
      await deleteQuestion(id)
      loadQuestions()
    } catch (error) {
      console.error('Error deleting question:', error)
    } finally {
      setDeleteLoading(null)
    }
  }

  const getEtapeInfo = (etape: Etape) => {
    return ETAPES.find(e => e.value === etape)
  }

  const questionsByEtape = questions.reduce((acc, q) => {
    if (!acc[q.etape]) acc[q.etape] = []
    acc[q.etape].push(q)
    return acc
  }, {} as Record<Etape, Question[]>)

  const handleLoadQuestions = useCallback(() => {
    loadQuestions()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-ciprel-green-600 mb-2" />
          <p className="text-gray-600">Chargement des questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with add button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Questions par Étape</h2>
          <p className="text-gray-600 mt-1">
            Gérez les questions de chaque questionnaire
          </p>
        </div>
        <Link href="/admin/questions/new">
          <Button className="bg-ciprel-green-600 hover:bg-ciprel-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Question
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {ETAPES.map((etape) => (
          <Card key={etape.value}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{etape.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {counts[etape.value] || 0}
                  </p>
                </div>
                <Badge className={etape.color}>
                  {etape.value}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Questions management by etape */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Questions</CardTitle>
          <CardDescription>
            Sélectionnez une étape pour voir et gérer les questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Navigation buttons */}
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b">
            {ETAPES.map((etape) => (
              <Button
                key={etape.value}
                onClick={() => setActiveEtape(etape.value)}
                variant={activeEtape === etape.value ? 'default' : 'outline'}
                className={activeEtape === etape.value ? 'bg-ciprel-green-600 hover:bg-ciprel-green-700' : ''}
              >
                {etape.label}
                <span className="ml-2 bg-gray-200 px-2 py-0.5 rounded text-xs font-semibold">
                  {counts[etape.value] || 0}
                </span>
              </Button>
            ))}
          </div>

          {/* Questions list for active etape */}
          {questionsByEtape[activeEtape] && questionsByEtape[activeEtape].length > 0 ? (
            <div className="space-y-3">
              {questionsByEtape[activeEtape].map((question) => (
                <Card key={question.id} className={!question.active ? 'opacity-60 bg-gray-50' : ''}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {question.title}
                            </h3>
                            <Badge variant="outline">
                              {CATEGORIES[question.category as keyof typeof CATEGORIES]}
                            </Badge>
                            {!question.active && (
                              <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {question.question}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                            <div className="text-gray-600">
                              <span className="font-medium">A:</span> {question.option_a}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">B:</span> {question.option_b}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">C:</span> {question.option_c}
                            </div>
                            {question.option_d && (
                              <div className="text-gray-600">
                                <span className="font-medium">D:</span> {question.option_d}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(question.id, question.active)}
                            title={question.active ? 'Désactiver' : 'Activer'}
                          >
                            {question.active ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Link href={`/admin/questions/${question.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(question.id)}
                            disabled={deleteLoading === question.id}
                          >
                            {deleteLoading === question.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 pt-2 border-t">
                        <span>Ordre: {question.order_index}</span>
                        <span className="mx-2">•</span>
                        <span>Points: {question.points}</span>
                        <span className="mx-2">•</span>
                        <span>{question.active ? 'Actif' : 'Inactif'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>Aucune question pour cette étape</p>
              <Link href="/admin/questions/new">
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une question
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
