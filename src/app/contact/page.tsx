import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'
import { ContactContent } from '@/components/ciprel/ContactContent'

export const metadata = {
  title: 'Contact et Support | CIPREL',
  description: 'Contactez l\'équipe RH CIPREL pour toute question sur la démarche compétence',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CiprelNavigation />
      <ContactContent />
    </div>
  )
}
