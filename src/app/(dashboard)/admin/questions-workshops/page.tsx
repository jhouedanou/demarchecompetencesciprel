import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QuestionsManager } from '@/components/admin/QuestionsManager'
import { WorkshopsManager } from '@/components/admin/WorkshopsManager'

export const metadata: Metadata = {
  title: 'Gestion Questions et Workshops - Administration CIPREL',
  description: 'Gérez les questions des quiz et les workshops de la plateforme CIPREL',
}

export default function QuestionsWorkshopsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des Questions et Workshops
        </h1>
        <p className="text-gray-600 mt-2">
          Gérez les questions des quiz et les workshops des métiers depuis une interface centralisée
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="w-full border-b flex">
            <TabsTrigger value="questions" className="flex-1">
              Questions
            </TabsTrigger>
            <TabsTrigger value="workshops" className="flex-1">
              Workshops
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="p-6">
            <QuestionsManager />
          </TabsContent>

          <TabsContent value="workshops" className="p-6">
            <WorkshopsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
