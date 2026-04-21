import { UsersList } from '@/components/dashboard/UsersList'
import { CreateUserDialog } from '@/components/dashboard/CreateUserDialog'

export default function UsersManagement() {
  return (
    <div className="space-y-6">
      {/* Header avec action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600 mt-2">
            Créez, modifiez et gérez les comptes utilisateurs
          </p>
        </div>

        <div className="flex-shrink-0">
          <CreateUserDialog />
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <UsersList />
    </div>
  )
}
