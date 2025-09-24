import { Metadata } from 'next'
import { UsersList } from '@/components/dashboard/UsersList'
import { CreateUserDialog } from '@/components/dashboard/CreateUserDialog'

export const metadata: Metadata = {
  title: 'Gestion des utilisateurs - Administration CIPREL',
  description: 'Gérez les utilisateurs de la plateforme CIPREL Compétences',
}

export default function UsersManagement() {
  return (
    <div className="space-y-6">
      {/* Header avec action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600 mt-2">
            Créez, modifiez et gérez les comptes utilisateurs
          </p>
        </div>
        
        <CreateUserDialog />
      </div>

      {/* Liste des utilisateurs */}
      <UsersList />
    </div>
  )
}
