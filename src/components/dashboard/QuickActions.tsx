'use client'

import Link from 'next/link'
import { Plus, Upload, FileText, Users, Settings, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const quickActions = [
  {
    title: 'Ajouter un utilisateur',
    description: 'Créer un nouveau compte utilisateur',
    href: '/admin/users',
    icon: Plus,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: 'Ajouter une vidéo',
    description: 'Télécharger une nouvelle vidéo de formation',
    href: '/admin/videos/upload',
    icon: Upload,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    title: 'Créer une question',
    description: 'Ajouter une nouvelle question de quiz',
    href: '/admin/questions/new',
    icon: FileText,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    title: 'Gestion RGPD',
    description: 'Consulter les demandes et consentements',
    href: '/admin/gdpr',
    icon: Settings,
    color: 'bg-orange-500 hover:bg-orange-600',
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Actions rapides
          </h2>
          <Link href="/admin/reports">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Voir tous les rapports
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {action.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
