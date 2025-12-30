'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Edit, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { useAuthStore } from '@/stores/auth-store'
import { authFetch } from '@/lib/api/client'
import toast from 'react-hot-toast'

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
    workshop_id: string | null
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
    workshop_id: string | null
    active: boolean
}

export default function WorkshopQuestionsPage() {
    const params = useParams()
    const workshopId = params.id as string
    const router = useRouter()
    const { isAdminAuthenticated } = useAdmin()
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore()
    const [mounted, setMounted] = useState(false)

    // Support both local admin auth and Supabase auth
    const isSupabaseAdmin = isAuthenticated && user && ['ADMIN', 'MANAGER'].includes(user.role)
    const hasAdminAccess = isAdminAuthenticated || isSupabaseAdmin

    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [workshopName, setWorkshopName] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Wait for client-side hydration
    useEffect(() => {
        setMounted(true)
    }, [])

    const loadQuestions = useCallback(async () => {
        try {
            setLoading(true)

            // Load workshop info
            const workshopRes = await authFetch('/api/admin/workshops-metiers')
            const workshopData = await workshopRes.json()
            const workshop = workshopData.workshops?.find((w: any) => w.id === workshopId)
            if (workshop) {
                setWorkshopName(workshop.titre)
            }

            // Load questions by workshop_id
            const response = await fetch(`/api/quiz?workshop_id=${workshopId}`)
            const data = await response.json()

            if (data.questions) {
                setQuestions(data.questions.sort((a: Question, b: Question) => a.order_index - b.order_index))
            }
        } catch (error) {
            console.error('Error loading questions:', error)
            toast.error('Erreur lors du chargement des questions')
        } finally {
            setLoading(false)
        }
    }, [workshopId])

    useEffect(() => {
        // Wait for client-side hydration and auth loading to complete
        if (!mounted) return

        // If local admin auth is present, we're good - load immediately
        if (isAdminAuthenticated) {
            console.log('[WorkshopQuestions] Local admin auth detected, loading questions')
            loadQuestions()
            return
        }

        // If Supabase auth is still loading, wait
        if (isAuthLoading) {
            console.log('[WorkshopQuestions] Auth still loading, waiting...')
            return
        }

        // Check Supabase admin access
        if (isSupabaseAdmin) {
            console.log('[WorkshopQuestions] Supabase admin auth detected, loading questions')
            loadQuestions()
            return
        }

        // No valid auth found after loading complete
        console.log('[WorkshopQuestions] No admin access, redirecting...', {
            mounted,
            isAuthLoading,
            isAdminAuthenticated,
            isSupabaseAdmin,
            user: user?.email
        })
        router.push('/admin')
    }, [mounted, isAuthLoading, hasAdminAccess, isAdminAuthenticated, isSupabaseAdmin, workshopId, loadQuestions, router, user])

    const handleToggleActive = async (questionId: string, currentActive: boolean) => {
        try {
            setSaving(true)
            const response = await authFetch(`/api/admin/questions/${questionId}`, {
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
                toast.success('Question mise à jour')
            }
        } catch (error) {
            console.error('Error toggling question:', error)
            toast.error('Erreur lors de la mise à jour')
        } finally {
            setSaving(false)
        }
    }

    const handleCreateQuestion = async (data: QuestionFormData) => {
        try {
            const response = await authFetch('/api/admin/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    workshop_id: workshopId,
                    quiz_type: 'WORKSHOP'
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la création')
            }

            toast.success('Question créée avec succès')
            loadQuestions()
            setIsModalOpen(false)
        } catch (error: any) {
            console.error('Error creating question:', error)
            toast.error(error.message || 'Erreur lors de la création')
        }
    }

    const handleEditQuestion = async (data: QuestionFormData) => {
        if (!editingQuestion) return

        try {
            const response = await authFetch(`/api/admin/questions/${editingQuestion.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la modification')
            }

            toast.success('Question modifiée avec succès')
            setEditingQuestion(null)
            setIsModalOpen(false)
            loadQuestions()
        } catch (error: any) {
            console.error('Error editing question:', error)
            toast.error(error.message || 'Erreur lors de la modification')
        }
    }

    const handleDeleteQuestion = async (questionId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
            return
        }

        try {
            setDeletingId(questionId)
            const response = await authFetch(`/api/admin/questions/${questionId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression')
            }

            setQuestions(prev => prev.filter(q => q.id !== questionId))
            toast.success('Question supprimée avec succès')
        } catch (error) {
            console.error('Error deleting question:', error)
            toast.error('Erreur lors de la suppression')
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

    // Show loading while waiting for hydration or auth
    if (!mounted || isAuthLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-ciprel-green-600" />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.push('/admin/workshops-metiers')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Questions du workshop : {workshopName}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {questions.length} question(s) • ID: {workshopId}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle question
                </button>
            </div>

            {/* Questions List */}
            {questions.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500 mb-4">Aucune question pour ce workshop</p>
                    <button
                        onClick={openCreateModal}
                        className="text-ciprel-green-600 hover:underline"
                    >
                        Créer la première question
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                                question.active ? 'border-ciprel-green-500' : 'border-gray-300'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-medium text-gray-500">
                                            #{index + 1}
                                        </span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                                            question.active 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {question.active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                            {question.points} pts
                                        </span>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-1">
                                        {question.title || question.question.slice(0, 100)}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {question.question}
                                    </p>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                        <div className={`p-2 rounded ${question.correct_answer.includes('A') ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                            <strong>A:</strong> {question.option_a}
                                        </div>
                                        <div className={`p-2 rounded ${question.correct_answer.includes('B') ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                            <strong>B:</strong> {question.option_b}
                                        </div>
                                        <div className={`p-2 rounded ${question.correct_answer.includes('C') ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                            <strong>C:</strong> {question.option_c}
                                        </div>
                                        {question.option_d && (
                                            <div className={`p-2 rounded ${question.correct_answer.includes('D') ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                                <strong>D:</strong> {question.option_d}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handleToggleActive(question.id, question.active)}
                                        disabled={saving}
                                        className={`p-2 rounded-lg transition-colors ${
                                            question.active 
                                                ? 'text-green-600 hover:bg-green-50' 
                                                : 'text-gray-400 hover:bg-gray-50'
                                        }`}
                                        title={question.active ? 'Désactiver' : 'Activer'}
                                    >
                                        {question.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => openEditModal(question)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(question.id)}
                                        disabled={deletingId === question.id}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Supprimer"
                                    >
                                        {deletingId === question.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de création/édition */}
            {isModalOpen && (
                <QuestionModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setEditingQuestion(null)
                    }}
                    onSubmit={editingQuestion ? handleEditQuestion : handleCreateQuestion}
                    question={editingQuestion}
                    workshopId={workshopId}
                />
            )}
        </div>
    )
}

// Modal pour créer/éditer une question
interface QuestionModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: QuestionFormData) => void
    question: Question | null
    workshopId: string
}

function QuestionModal({ isOpen, onClose, onSubmit, question, workshopId }: QuestionModalProps) {
    const [formData, setFormData] = useState<QuestionFormData>({
        title: question?.title || '',
        question: question?.question || '',
        option_a: question?.option_a || '',
        option_b: question?.option_b || '',
        option_c: question?.option_c || '',
        option_d: question?.option_d || '',
        correct_answer: question?.correct_answer || [],
        category: question?.category || 'general',
        quiz_type: 'WORKSHOP',
        etape: question?.etape || '',
        points: question?.points || 10,
        workshop_id: workshopId,
        active: question?.active ?? true
    })
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.question || !formData.option_a || !formData.option_b || formData.correct_answer.length === 0) {
            toast.error('Veuillez remplir tous les champs obligatoires')
            return
        }
        setSaving(true)
        try {
            await onSubmit(formData)
        } finally {
            setSaving(false)
        }
    }

    const toggleCorrectAnswer = (option: string) => {
        setFormData(prev => ({
            ...prev,
            correct_answer: prev.correct_answer.includes(option)
                ? prev.correct_answer.filter(a => a !== option)
                : [...prev.correct_answer, option]
        }))
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">
                        {question ? 'Modifier la question' : 'Nouvelle question'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titre (optionnel)
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
                            placeholder="Titre de la question"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.question}
                            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
                            rows={3}
                            required
                            placeholder="Entrez la question..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Option A <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={formData.option_a}
                                    onChange={(e) => setFormData(prev => ({ ...prev, option_a: e.target.value }))}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleCorrectAnswer('A')}
                                    className={`px-3 py-2 rounded-lg font-medium ${
                                        formData.correct_answer.includes('A')
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    ✓
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Option B <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={formData.option_b}
                                    onChange={(e) => setFormData(prev => ({ ...prev, option_b: e.target.value }))}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleCorrectAnswer('B')}
                                    className={`px-3 py-2 rounded-lg font-medium ${
                                        formData.correct_answer.includes('B')
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    ✓
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Option C
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={formData.option_c}
                                    onChange={(e) => setFormData(prev => ({ ...prev, option_c: e.target.value }))}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleCorrectAnswer('C')}
                                    className={`px-3 py-2 rounded-lg font-medium ${
                                        formData.correct_answer.includes('C')
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    ✓
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Option D
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={formData.option_d}
                                    onChange={(e) => setFormData(prev => ({ ...prev, option_d: e.target.value }))}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleCorrectAnswer('D')}
                                    className={`px-3 py-2 rounded-lg font-medium ${
                                        formData.correct_answer.includes('D')
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    ✓
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
                        <strong>Réponses correctes :</strong>{' '}
                        {formData.correct_answer.length > 0 
                            ? formData.correct_answer.join(', ')
                            : 'Aucune sélectionnée - cliquez sur ✓ pour marquer les bonnes réponses'
                        }
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Points
                            </label>
                            <input
                                type="number"
                                value={formData.points}
                                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
                                min={1}
                                max={100}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catégorie
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ciprel-green-500"
                            >
                                <option value="general">Général</option>
                                <option value="technique">Technique</option>
                                <option value="savoir">Savoir</option>
                                <option value="savoir_faire">Savoir-faire</option>
                                <option value="savoir_etre">Savoir-être</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                            className="rounded border-gray-300 text-ciprel-green-600 focus:ring-ciprel-green-500"
                        />
                        <label htmlFor="active" className="text-sm text-gray-700">
                            Question active (visible dans le quiz)
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {question ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
