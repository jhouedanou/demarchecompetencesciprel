'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import QuestionPreview from './QuestionPreview'

import type { QuizQuestion } from '@/types'
import { QUIZ_CATEGORIES } from '@/lib/utils/constants'

interface QuestionsListResponse {
  questions: QuizQuestion[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function QuestionsList() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterQuizType, setFilterQuizType] = useState<string>('')
  const [filterActive, setFilterActive] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [previewQuestion, setPreviewQuestion] = useState<QuizQuestion | null>(null)

  const router = useRouter()

  const fetchQuestions = async (page = 1) => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })

      if (filterCategory) params.append('category', filterCategory)
      if (filterQuizType) params.append('quiz_type', filterQuizType)
      if (filterActive) params.append('active', filterActive)

      const response = await fetch(`/api/admin/questions?${params}`)

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des questions')
      }

      const data: QuestionsListResponse = await response.json()
      setQuestions(data.questions)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setCurrentPage(data.page)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement des questions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions(currentPage)
  }, [currentPage, filterCategory, filterQuizType, filterActive])

  const handleDelete = async (questionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      toast.success('Question supprimée avec succès')
      fetchQuestions(currentPage)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la suppression de la question')
    }
  }

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.question.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      DEFINITION: 'bg-blue-100 text-blue-800',
      RESPONSABILITE: 'bg-green-100 text-green-800',
      COMPETENCES: 'bg-purple-100 text-purple-800',
      ETAPES: 'bg-orange-100 text-orange-800',
      OPINION: 'bg-pink-100 text-pink-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getQuizTypeColor = (type: string) => {
    return type === 'INTRODUCTION'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-cyan-100 text-cyan-800'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec boutons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {total} question{total !== 1 ? 's' : ''} au total
        </div>
        <Button
          onClick={() => router.push('/admin/questions/new')}
          className="bg-ciprel-600 hover:bg-ciprel-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Question
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes</SelectItem>
              {Object.entries(QUIZ_CATEGORIES).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterQuizType} onValueChange={setFilterQuizType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              <SelectItem value="INTRODUCTION">Introduction</SelectItem>
              <SelectItem value="SONDAGE">Sondage</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterActive} onValueChange={setFilterActive}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              <SelectItem value="true">Actif</SelectItem>
              <SelectItem value="false">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Liste des questions */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {question.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {!question.active && (
                        <Badge variant="secondary" className="text-xs">
                          Inactif
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {question.points} pt{question.points !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-2">
                    {question.question}
                  </p>

                  <div className="flex items-center space-x-3">
                    <Badge className={getCategoryColor(question.category)}>
                      {QUIZ_CATEGORIES[question.category as keyof typeof QUIZ_CATEGORIES]}
                    </Badge>
                    <Badge className={getQuizTypeColor(question.quiz_type)}>
                      {question.quiz_type}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Ordre: {question.order_index}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewQuestion(question)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/questions/${question.id}/edit`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(question.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>

          <span className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Aucune question */}
      {filteredQuestions.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune question trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory || filterQuizType || filterActive
                ? 'Aucune question ne correspond aux critères de filtrage.'
                : 'Commencez par créer votre première question.'}
            </p>
            {!searchTerm && !filterCategory && !filterQuizType && !filterActive && (
              <Button
                onClick={() => router.push('/admin/questions/new')}
                className="bg-ciprel-600 hover:bg-ciprel-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer une question
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      {previewQuestion && (
        <QuestionPreview
          question={previewQuestion}
          onClose={() => setPreviewQuestion(null)}
        />
      )}
    </div>
  )
}