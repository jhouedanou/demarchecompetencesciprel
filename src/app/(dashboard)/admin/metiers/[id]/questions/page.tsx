'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import QuestionFormModal from '@/components/admin/QuestionFormModal'

interface Question {
    id: string
    title: string
    question: string
    option_a: string
    option_b: string
    option_c: string
    option_d: string | null
    correct_answer: string[]
    category: string
    quiz_type: string
    etape: string
    points: number
    active: boolean
    order_index: number
    metier_id: number | null
}

interface QuestionFormData {
    title: string
    question: string
    option_a: string
    option_b: string
    option_c: string
    option_d: string
    correct_answer: string[]
    category: string
    quiz_type: string
    etape: string
    points: number
    metier_id: number | null
    active: boolean
}

export default function MetierQuestionsPage() {
    const params = useParams()
    const metierId = parseInt(params.id as string)
    const router = useRouter()
    const { isAdminAuthenticated } = useAdmin()

    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [metierName, setMetierName] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isHydrated, setIsHydrated] = useState(false)

    // Mark component as hydrated after mount
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    useEffect(() => {
        // Wait for hydration before checking authentication
        if (!isHydrated) return
        
        if (!isAdminAuthenticated) {
            router.push('/admin')
            return
        }
        loadQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdminAuthenticated, isHydrated, metierId, router])

    const loadQuestions = async () => {
        try {
            setLoading(true)

            // Load metier info
            const metierRes = await fetch('/api/metiers')
            const metierData = await metierRes.json()
            const metier = metierData.data?.find((m: any) => m.id === metierId)
            if (metier) {
                setMetierName(metier.titre)
            }

            // Load questions
            const response = await fetch(`/api/quiz?metier_id=${metierId}`)
            const data = await response.json()

            if (data.questions) {
                setQuestions(data.questions.sort((a: Question, b: Question) => a.order_index - b.order_index))
            }
        } catch (error) {
            console.error('Error loading questions:', error)
            setMessage({ type: 'error', text: 'Erreur lors du chargement des questions' })
        } finally {
            setLoading(false)
        }
    }

    const handleToggleActive = async (questionId: string, currentActive: boolean) => {
        try {
            setSaving(true)
            const response = await fetch(`/api/admin/questions/${questionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    active: !currentActive
                })
            })

            if (response.ok) {
                setQuestions(prev => prev.map(q =>
                    q.id === questionId ? { ...q, active: !currentActive } : q
                ))
                setMessage({ type: 'success', text: 'Question mise à jour' })
                setTimeout(() => setMessage(null), 2000)
            }
        } catch (error) {
            console.error('Error toggling question:', error)
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' })
        } finally {
            setSaving(false)
        }
    }

    const handleCreateQuestion = async (data: QuestionFormData) => {
        try {
            const response = await fetch('/api/admin/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la création')
            }

            setMessage({ type: 'success', text: 'Question créée avec succès' })
            setTimeout(() => setMessage(null), 3000)
            loadQuestions()
        } catch (error: any) {
            console.error('Error creating question:', error)
            throw error
        }
    }

    const handleEditQuestion = async (data: QuestionFormData) => {
        if (!editingQuestion) return

        try {
            const response = await fetch(`/api/admin/questions/${editingQuestion.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la modification')
            }

            setMessage({ type: 'success', text: 'Question modifiée avec succès' })
            setTimeout(() => setMessage(null), 3000)
            setEditingQuestion(null)
            loadQuestions()
        } catch (error: any) {
            console.error('Error editing question:', error)
            throw error
        }
    }

    const handleDeleteQuestion = async (questionId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
            return
        }

        try {
            setDeletingId(questionId)
            const response = await fetch(`/api/admin/questions/${questionId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression')
            }

            setQuestions(prev => prev.filter(q => q.id !== questionId))
            setMessage({ type: 'success', text: 'Question supprimée avec succès' })
            setTimeout(() => setMessage(null), 3000)
        } catch (error) {
            console.error('Error deleting question:', error)
            setMessage({ type: 'error', text: 'Erreur lors de la suppression' })
        } finally {
            setDeletingId(null)
        }
    }

    const openCreateModal = () => {
        setEditingQuestion(null)
        setIsModalOpen(true)
    }

    const openEditModal = (question: Question) => {
        setEditingQuestion(question)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingQuestion(null)
    }

    if (!isAdminAuthenticated) return null

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ciprel-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des questions...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <button
                                onClick={() => router.push('/admin/metiers')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Questions - {metierName}</h1>
                                <p className="text-gray-600 mt-1">{questions.length} question(s) trouvée(s)</p>
                            </div>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-4 py-2 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Nouvelle question
                        </button>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {message.text}
                    </div>
                </div>
            )}

            {/* Questions List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {questions.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500 text-lg mb-4">Aucune question trouvée pour ce métier</p>
                        <p className="text-sm text-gray-400 mb-6">
                            Créez votre première question en cliquant sur le bouton "Nouvelle question" ci-dessus
                        </p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Créer une question
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-sm font-semibold text-gray-500">Q{index + 1}</span>
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{question.category}</span>
                                                <span className={`text-xs px-2 py-1 rounded ${question.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                    {question.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">{question.question}</h3>

                                            {/* Options */}
                                            <div className="space-y-2">
                                                <div className={`p-3 rounded border ${question.correct_answer.includes('A') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                                    <span className="font-medium">A:</span> {question.option_a}
                                                </div>
                                                <div className={`p-3 rounded border ${question.correct_answer.includes('B') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                                    <span className="font-medium">B:</span> {question.option_b}
                                                </div>
                                                <div className={`p-3 rounded border ${question.correct_answer.includes('C') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                                    <span className="font-medium">C:</span> {question.option_c}
                                                </div>
                                                {question.option_d && (
                                                    <div className={`p-3 rounded border ${question.correct_answer.includes('D') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                                        <span className="font-medium">D:</span> {question.option_d}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 text-sm text-gray-600">
                                                <span className="font-medium">Réponse(s) correcte(s):</span> {question.correct_answer.join(', ')} •
                                                <span className="ml-2"><span className="font-medium">Points:</span> {question.points}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => openEditModal(question)}
                                                disabled={saving || deletingId === question.id}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                                                title="Modifier"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteQuestion(question.id)}
                                                disabled={saving || deletingId === question.id}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(question.id, question.active)}
                                                disabled={saving || deletingId === question.id}
                                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${question.active
                                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                    } disabled:opacity-50`}
                                            >
                                                {question.active ? 'Désactiver' : 'Activer'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <QuestionFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={editingQuestion ? handleEditQuestion : handleCreateQuestion}
                metierId={metierId}
                metierName={metierName}
                initialData={editingQuestion ? {
                    title: editingQuestion.title,
                    question: editingQuestion.question,
                    option_a: editingQuestion.option_a,
                    option_b: editingQuestion.option_b,
                    option_c: editingQuestion.option_c,
                    option_d: editingQuestion.option_d || '',
                    correct_answer: editingQuestion.correct_answer,
                    category: editingQuestion.category,
                    quiz_type: editingQuestion.quiz_type,
                    etape: editingQuestion.etape,
                    points: editingQuestion.points,
                    metier_id: editingQuestion.metier_id,
                    active: editingQuestion.active
                } : undefined}
            />
        </div>
    )
}
