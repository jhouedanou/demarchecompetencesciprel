import type { Metadata } from 'next'
import { CompetencesNavbar } from '@/components/layout/CompetencesNavbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'CIPREL Compétences',
    template: '%s | CIPREL Compétences',
  },
}

interface CompetencesLayoutProps {
  children: React.ReactNode
}

export default function CompetencesLayout({ children }: CompetencesLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <CompetencesNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
