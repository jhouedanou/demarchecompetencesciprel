'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, User, Calendar, Filter, Download } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

interface QuizResult {
    id: string
    user_id: string
    quiz_type: string
    score: number
    max_score: number
    total_questions: number
    correct_answers: number
    responses: any
    duration: number
    percentage: number
    attempt_number: number
    completed_at: string
    started_at: string
    profiles: {
        id: string
        name: string
        email: string
    }
}

export default function AdminResultsPage() {
    const router = useRouter()
    const { isAdminAuthenticated } = useAdmin()

    const [results, setResults] = useState<QuizResult[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [filterQuizType, setFilterQuizType] = useState<string>('')
    const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null)
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
        loadResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdminAuthenticated, isHydrated, page, filterQuizType, router])

    const loadResults = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            })

            if (filterQuizType) {
                params.append('quiz_type', filterQuizType)
            }

            const response = await fetch(`/api/admin/results?${params}`)
            const data = await response.json()

            if (response.ok) {
                setResults(data.results || [])
                setTotal(data.total || 0)
                setTotalPages(data.totalPages || 1)
            }
        } catch (error) {
            console.error('Error loading results:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}m ${secs}s`
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getQuizTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'INTRODUCTION': 'Introduction',
            'SONDAGE': 'Sondage',
            'WORKSHOP': 'Atelier'
        }
        return labels[type] || type
    }

    const getScoreColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600 bg-green-50'
        if (percentage >= 60) return 'text-yellow-600 bg-yellow-50'
        return 'text-red-600 bg-red-50'
    }

    const exportResults = () => {
        // Convert results to CSV
        const headers = ['Utilisateur', 'Email', 'Type de Quiz', 'Score', 'Score Max', 'Pourcentage', 'Durée', 'Date']
        const rows = results.map(r => [
            r.profiles?.name || 'N/A',
            r.profiles?.email || 'N/A',
            getQuizTypeLabel(r.quiz_type),
            r.score.toString(),
            r.max_score.toString(),
            `${r.percentage}%`,
            formatDuration(r.duration),
            formatDate(r.completed_at)
        ])

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `resultats-quiz-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    if (!isAdminAuthenticated) return null

    if (loading && results.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ciprel-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des résultats...</p>
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
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Résultats des Quiz</h1>
                            <p className="text-gray-600 mt-1">{total} résultat(s) trouvé(s)</p>
                        </div>
                        <button
                            onClick={exportResults}
                            disabled={results.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-ciprel-green-600 text-white rounded-lg hover:bg-ciprel-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="h-5 w-5" />
                            Exporter CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                            value={filterQuizType}
                            onChange={(e) => {
                                setFilterQuizType(e.target.value)
                                setPage(1)
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ciprel-green-500 focus:border-transparent"
                        >
                            <option value="">Tous les types</option>
                            <option value="INTRODUCTION">Introduction</option>
                            <option value="SONDAGE">Sondage</option>
                            <option value="WORKSHOP">Atelier</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                {results.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500 text-lg">Aucun résultat trouvé</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {results.map((result) => (
                            <div
                                key={result.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <User className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {result.profiles?.name || 'Utilisateur inconnu'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{result.profiles?.email}</p>
                                                </div>
                                            </div>

                                            {/* Quiz Info */}
                                            <div className="flex flex-wrap items-center gap-4 mb-3">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                                    {getQuizTypeLabel(result.quiz_type)}
                                                </span>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    {formatDate(result.completed_at)}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDuration(result.duration)}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    Tentative #{result.attempt_number}
                                                </span>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 mb-1">Score</p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {result.score}/{result.max_score}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 mb-1">Réponses correctes</p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {result.correct_answers}/{result.total_questions}
                                                    </p>
                                                </div>
                                                <div className={`rounded-lg p-3 ${getScoreColor(result.percentage)}`}>
                                                    <p className="text-xs mb-1 opacity-75">Pourcentage</p>
                                                    <p className="text-lg font-bold">
                                                        {result.percentage.toFixed(1)}%
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 mb-1">Statut</p>
                                                    <div className="flex items-center gap-2">
                                                        {result.percentage >= 60 ? (
                                                            <>
                                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                                <span className="text-sm font-semibold text-green-600">Réussi</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="h-5 w-5 text-red-600" />
                                                                <span className="text-sm font-semibold text-red-600">Échoué</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* View Details Button */}
                                        <button
                                            onClick={() => setSelectedResult(result)}
                                            className="ml-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Précédent
                        </button>
                        <span className="px-4 py-2 text-gray-600">
                            Page {page} sur {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Détails des réponses</h2>
                            <button
                                onClick={() => setSelectedResult(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <XCircle className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <p className="text-lg font-semibold">{selectedResult.profiles?.name}</p>
                                <p className="text-gray-600">{selectedResult.profiles?.email}</p>
                            </div>
                            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                                {JSON.stringify(selectedResult.responses, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
