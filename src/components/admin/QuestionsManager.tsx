'use client'

import { useState, useCallback, useEffect } from 'react'
import { authFetch } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Loader2, Plus, Trash2, Edit2, Search, Filter } from 'lucide-react'

interface Question {
  id?: string
  title: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d?: string | null
  correct_answer: number[]
  category: string
  quiz_type: string
  points: number
  feedback?: string | null
  explanation?: string | null
  active: boolean
  created_at?: string
  updated_at?: string
}

const CATEGORIES = ['DEFINITION', 'RESPONSABILITE', 'COMPETENCES', 'ETAPES', 'OPINION']
const QUIZ_TYPES = ['INTRODUCTION', 'SONDAGE']

export function QuestionsManager() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [quizTypeFilter, setQuizTypeFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  const [formData, setFormData] = useState<Question>({
    title: '',
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: [],
    category: 'DEFINITION',
    quiz_type: 'INTRODUCTION',
    points: 1,
    feedback: '',
    explanation: '',
    active: true,
  })

  // Charger les questions
  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (categoryFilter) params.append('category', categoryFilter)
      if (quizTypeFilter) params.append('quiz_type', quizTypeFilter)
      if (activeFilter) params.append('active', activeFilter)

      const response = await authFetch(`/api/admin/questions?${params}`)

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des questions')
      }

      const data = await response.json()
      setQuestions(data.questions || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du chargement')
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }, [page, categoryFilter, quizTypeFilter, activeFilter])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validation
      if (!formData.question || !formData.option_a || !formData.option_b || !formData.option_c) {
        toast.error('Veuillez remplir les champs obligatoires')
        return
      }

      if (formData.correct_answer.length === 0) {
        toast.error('Veuillez sélectionner la/les bonne(s) réponse(s)')
        return
      }

      const isEditing = !!editingId
      const method = isEditing ? 'PUT' : 'POST'
      const endpoint = isEditing ? `/api/admin/questions/${editingId}` : '/api/admin/questions'

      const response = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'enregistrement')
      }

      toast.success(isEditing ? 'Question mise à jour' : 'Question créée')
      setIsFormOpen(false)
      setEditingId(null)
      setFormData({
        title: '',
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: [],
        category: 'DEFINITION',
        quiz_type: 'INTRODUCTION',
        points: 1,
        feedback: '',
        explanation: '',
        active: true,
      })
      loadQuestions()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement')
    }
  }

  const handleEdit = (question: Question) => {
    setFormData(question)
    setEditingId(question.id || null)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question?')) return

    try {
      const response = await authFetch(`/api/admin/questions/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      toast.success('Question supprimée')
      loadQuestions()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression')
    }
  }

  const toggleCorrectAnswer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      correct_answer: prev.correct_answer.includes(index)
        ? prev.correct_answer.filter(i => i !== index)
        : [...prev.correct_answer, index],
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      question: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: [],
      category: 'DEFINITION',
      quiz_type: 'INTRODUCTION',
      points: 1,
      feedback: '',
      explanation: '',
      active: true,
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Questions</h2>
          <p className="text-gray-600 mt-1">Créez et gérez les questions des quiz</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          {isFormOpen ? 'Annuler' : 'Nouvelle question'}
        </button>
      </div>

      {/* Formulaire */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Modifier la question' : 'Nouvelle question'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du quiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Quiz de la DAF"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de quiz <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.quiz_type}
                  onChange={e => setFormData(prev => ({ ...prev, quiz_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {QUIZ_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={e => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.question}
                onChange={e => setFormData(prev => ({ ...prev, question: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Saisissez la question"
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Réponses</label>
              {['option_a', 'option_b', 'option_c', 'option_d'].map((optionKey, index) => {
                const letterKey = String.fromCharCode(97 + index) // a, b, c, d
                return (
                  <div key={optionKey} className="flex gap-2 mb-2">
                    <label className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={formData.correct_answer.includes(index)}
                        onChange={() => toggleCorrectAnswer(index)}
                        className="w-4 h-4 text-green-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">{letterKey})</span>
                    </label>
                    <input
                      type="text"
                      value={formData[optionKey as keyof Question] as string || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          [optionKey]: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Réponse ${letterKey}`}
                      required={index < 3}
                    />
                  </div>
                )
              })}
              <p className="text-xs text-gray-500 mt-2">Cochez la/les bonne(s) réponse(s)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Explication (optionnel)
                </label>
                <textarea
                  value={formData.explanation || ''}
                  onChange={e => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Explication ou source"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback (optionnel)
                </label>
                <textarea
                  value={formData.feedback || ''}
                  onChange={e => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Feedback à afficher"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={e => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Actif</span>
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                {editingId ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={categoryFilter}
            onChange={e => {
              setCategoryFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes catégories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={quizTypeFilter}
            onChange={e => {
              setQuizTypeFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous types</option>
            {QUIZ_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={activeFilter}
            onChange={e => {
              setActiveFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous statuts</option>
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
        </div>
      </div>

      {/* Liste des questions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Aucune question trouvée</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Question</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {questions.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{q.question}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{q.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{q.quiz_type}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            q.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {q.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(q)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Modifier"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => q.id && handleDelete(q.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {page} sur {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
