import { Metadata } from 'next'
import { Suspense } from 'react'
import QuestionsList from '@/components/dashboard/QuestionsList'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Gestion des Questions - Admin CIPREL',
  description: 'Interface d\'administration pour gérer les questions des quiz',
}

function QuestionsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  )
}

export default function QuestionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Questions
          </h1>
          <p className="text-gray-600 mt-2">
            Créez, modifiez et organisez les questions des quiz
          </p>
        </div>
      </div>

      <Suspense fallback={<QuestionsListSkeleton />}>
        <QuestionsList />
      </Suspense>
    </div>
  )
}