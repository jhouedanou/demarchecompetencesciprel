'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

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

interface QuestionFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: QuestionFormData) => Promise<void>
    metierId: number
    metierName: string
    initialData?: Partial<QuestionFormData>
}

export default function QuestionFormModal({
    isOpen,
    onClose,
    onSubmit,
    metierId,
    metierName,
    initialData
}: QuestionFormModalProps) {
    const [formData, setFormData] = useState<QuestionFormData>({
        title: '',
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: [],
        category: 'COMPETENCES',
        quiz_type: 'WORKSHOP',
        etape: 'ATELIER',
        points: 1,
        metier_id: metierId,
        active: true
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }))
        } else {
            setFormData({
                title: `Question ${metierName}`,
                question: '',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_answer: [],
                category: 'COMPETENCES',
                quiz_type: 'WORKSHOP',
                etape: 'ATELIER',
                points: 1,
                metier_id: metierId,
                active: true
            })
        }
    }, [initialData, metierId, metierName])

    const handleCheckboxChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            correct_answer: prev.correct_answer.includes(value)
                ? prev.correct_answer.filter(v => v !== value)
                : [...prev.correct_answer, value]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (formData.correct_answer.length === 0) {
            setError('Veuillez sélectionner au moins une réponse correcte')
            return
        }

        try {
            setSubmitting(true)
            await onSubmit(formData)
            onClose()
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la soumission')
        } finally {
            setSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {initialData ? 'Modifier la question' : 'Nouvelle question'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Métier */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Métier
                        </label>
                        <input
                            type="text"
                            value={metierName}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>

                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Question */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            required
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Options de réponse <span className="text-red-500">*</span>
                        </label>

                        {['A', 'B', 'C', 'D'].map((option) => (
                            <div key={option} className="flex items-start gap-3">
                                <div className="flex items-center h-10">
                                    <input
                                        type="checkbox"
                                        checked={formData.correct_answer.includes(option)}
                                        onChange={() => handleCheckboxChange(option)}
                                        className="h-5 w-5 text-ciprel-green-600 focus:ring-ciprel-green-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm text-gray-600 mb-1 block">
                                        Option {option} {option !== 'D' && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[`option_${option.toLowerCase()}` as keyof QuestionFormData] as string}
                                        onChange={(e) => setFormData({ ...formData, [`option_${option.toLowerCase()}`]: e.target.value })}
                                        required={option !== 'D'}
                                        placeholder={`Entrez l'option ${option}`}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        ))}
                        <p className="text-sm text-gray-500">
                            Cochez les cases pour indiquer les réponses correctes
                        </p>
                    </div>

                    {/* Category & Points */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catégorie <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
                            >
                                <option value="DEFINITION">Définition</option>
                                <option value="RESPONSABILITE">Responsabilité</option>
                                <option value="COMPETENCES">Compétences</option>
                                <option value="ETAPES">Étapes</option>
                                <option value="OPINION">Opinion</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Points <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                required
                                min="1"
                                max="10"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="h-5 w-5 text-ciprel-green-600 focus:ring-ciprel-green-500 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Question active
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700 transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Enregistrement...' : initialData ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
