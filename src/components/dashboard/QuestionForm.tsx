'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Save, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import QuestionPreview from './QuestionPreview'

import type { QuizQuestion } from '@/types'
import { QUIZ_CATEGORIES } from '@/lib/utils/constants'

const questionSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut dépasser 200 caractères'),
  question: z.string().min(1, 'La question est requise').max(1000, 'La question ne peut dépasser 1000 caractères'),
  option_a: z.string().min(1, 'L\'option A est requise').max(200, 'L\'option A ne peut dépasser 200 caractères'),
  option_b: z.string().min(1, 'L\'option B est requise').max(200, 'L\'option B ne peut dépasser 200 caractères'),
  option_c: z.string().min(1, 'L\'option C est requise').max(200, 'L\'option C ne peut dépasser 200 caractères'),
  option_d: z.string().max(200, 'L\'option D ne peut dépasser 200 caractères').optional(),
  correct_answer: z.array(z.enum(['A', 'B', 'C', 'D'])).min(1, 'Au moins une réponse correcte est requise'),
  category: z.enum(['DEFINITION', 'RESPONSABILITE', 'COMPETENCES', 'ETAPES', 'OPINION']),
  quiz_type: z.enum(['INTRODUCTION', 'SONDAGE']),
  points: z.number().min(1, 'Au moins 1 point est requis').max(100, 'Maximum 100 points'),
  feedback: z.string().max(500, 'Le feedback ne peut dépasser 500 caractères').optional(),
  explanation: z.string().max(1000, 'L\'explication ne peut dépasser 1000 caractères').optional(),
  order_index: z.number().min(0, 'L\'ordre doit être positif').optional(),
  active: z.boolean()
})

type QuestionFormData = z.infer<typeof questionSchema>

interface QuestionFormProps {
  mode: 'create' | 'edit'
  questionId?: string
}

export default function QuestionForm({ mode, questionId }: QuestionFormProps) {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [previewQuestion, setPreviewQuestion] = useState<QuizQuestion | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      active: true,
      points: 10,
      correct_answer: [],
      order_index: 1
    }
  })

  // Charger les données de la question en mode édition
  useEffect(() => {
    if (mode === 'edit' && questionId) {
      const fetchQuestion = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/admin/questions/${questionId}`)

          if (!response.ok) {
            throw new Error('Question non trouvée')
          }

          const { question } = await response.json()

          // Pré-remplir le formulaire
          setValue('title', question.title)
          setValue('question', question.question)
          setValue('option_a', question.option_a)
          setValue('option_b', question.option_b)
          setValue('option_c', question.option_c)
          setValue('option_d', question.option_d || '')
          setValue('correct_answer', question.correct_answer)
          setValue('category', question.category)
          setValue('quiz_type', question.quiz_type)
          setValue('points', question.points)
          setValue('feedback', question.feedback || '')
          setValue('explanation', question.explanation || '')
          setValue('order_index', question.order_index)
          setValue('active', question.active)
        } catch (error) {
          console.error('Erreur:', error)
          toast.error('Erreur lors du chargement de la question')
          router.push('/admin/questions')
        } finally {
          setLoading(false)
        }
      }

      fetchQuestion()
    }
  }, [mode, questionId, setValue, router])

  const onSubmit = async (data: QuestionFormData) => {
    try {
      setSubmitting(true)

      const url = mode === 'create'
        ? '/api/admin/questions'
        : `/api/admin/questions/${questionId}`

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          option_d: data.option_d || null,
          feedback: data.feedback || null,
          explanation: data.explanation || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde')
      }

      toast.success(
        mode === 'create'
          ? 'Question créée avec succès'
          : 'Question mise à jour avec succès'
      )

      router.push('/admin/questions')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(error.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCorrectAnswerToggle = (option: 'A' | 'B' | 'C' | 'D') => {
    const currentAnswers = watch('correct_answer') || []
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter(a => a !== option)
      : [...currentAnswers, option]

    setValue('correct_answer', newAnswers)
  }

  const handlePreview = () => {
    const formData = getValues()

    // Créer un objet question temporaire pour la prévisualisation
    const previewData: QuizQuestion = {
      id: 'preview',
      title: formData.title || 'Titre de la question',
      question: formData.question || 'Votre question ici...',
      option_a: formData.option_a || 'Option A',
      option_b: formData.option_b || 'Option B',
      option_c: formData.option_c || 'Option C',
      option_d: formData.option_d || undefined,
      correct_answer: formData.correct_answer || [],
      category: formData.category || 'DEFINITION',
      quiz_type: formData.quiz_type || 'INTRODUCTION',
      points: formData.points || 10,
      feedback: formData.feedback || undefined,
      explanation: formData.explanation || undefined,
      order_index: formData.order_index || 1
    }

    setPreviewQuestion(previewData)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const watchedCorrectAnswers = watch('correct_answer') || []

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Titre court et descriptif de la question"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="question">Question *</Label>
                  <Textarea
                    id="question"
                    {...register('question')}
                    placeholder="Énoncé complet de la question"
                    className="min-h-20"
                  />
                  {errors.question && (
                    <p className="text-sm text-red-600 mt-1">{errors.question.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Options de réponse */}
            <Card>
              <CardHeader>
                <CardTitle>Options de réponse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(['A', 'B', 'C', 'D'] as const).map((option) => (
                  <div key={option} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={watchedCorrectAnswers.includes(option)}
                        onChange={() => handleCorrectAnswerToggle(option)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <Label className="text-sm font-medium">
                        {option} {watchedCorrectAnswers.includes(option) && '✓'}
                      </Label>
                    </div>
                    <div className="flex-1">
                      <Input
                        {...register(`option_${option.toLowerCase()}` as any)}
                        placeholder={`Option ${option}${option === 'D' ? ' (optionnelle)' : ''}`}
                      />
                      {errors[`option_${option.toLowerCase()}` as keyof typeof errors] && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors[`option_${option.toLowerCase()}` as keyof typeof errors]?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {errors.correct_answer && (
                  <p className="text-sm text-red-600 mt-2">{errors.correct_answer.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Feedback et explication */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback et explication (optionnel)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea
                    id="feedback"
                    {...register('feedback')}
                    placeholder="Message affiché après la réponse"
                    className="min-h-16"
                  />
                  {errors.feedback && (
                    <p className="text-sm text-red-600 mt-1">{errors.feedback.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="explanation">Explication détaillée</Label>
                  <Textarea
                    id="explanation"
                    {...register('explanation')}
                    placeholder="Explication détaillée de la réponse"
                    className="min-h-20"
                  />
                  {errors.explanation && (
                    <p className="text-sm text-red-600 mt-1">{errors.explanation.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Paramètres */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={watch('category') || ''}
                    onValueChange={(value) => setValue('category', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(QUIZ_CATEGORIES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="quiz_type">Type de quiz *</Label>
                  <Select
                    value={watch('quiz_type') || ''}
                    onValueChange={(value) => setValue('quiz_type', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de quiz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INTRODUCTION">Introduction</SelectItem>
                      <SelectItem value="SONDAGE">Sondage</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.quiz_type && (
                    <p className="text-sm text-red-600 mt-1">{errors.quiz_type.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="points">Points *</Label>
                  <Input
                    id="points"
                    type="number"
                    {...register('points', { valueAsNumber: true })}
                    placeholder="10"
                    min="1"
                    max="100"
                  />
                  {errors.points && (
                    <p className="text-sm text-red-600 mt-1">{errors.points.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="order_index">Ordre</Label>
                  <Input
                    id="order_index"
                    type="number"
                    {...register('order_index', { valueAsNumber: true })}
                    placeholder="1"
                    min="0"
                  />
                  {errors.order_index && (
                    <p className="text-sm text-red-600 mt-1">{errors.order_index.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={watch('active')}
                    onCheckedChange={(checked) => setValue('active', checked)}
                  />
                  <Label htmlFor="active">Question active</Label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Prévisualiser
                </Button>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-ciprel-600 hover:bg-ciprel-700"
                >
                  {submitting ? (
                    'Sauvegarde en cours...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {mode === 'create' ? 'Créer la question' : 'Sauvegarder'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

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