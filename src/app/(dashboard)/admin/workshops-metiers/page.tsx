import type { Metadata } from 'next'
import { WorkshopsMetiersAdminUnified } from '@/components/admin/WorkshopsMetiersAdminUnified'

export const metadata: Metadata = {
  title: 'Gestion Workshops Métiers - Administration CIPREL',
  description: 'Gérez les workshops métiers affichés sur la page d\'accueil',
}

export default function WorkshopsMetiersPage() {
  return (
    <div className="p-6">
      <WorkshopsMetiersAdminUnified />
    </div>
  )
}
