import { Metadata } from 'next'
import { Hero } from '@/components/landing/Hero'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { StepsSection } from '@/components/landing/StepsSection'
import { CTASection } from '@/components/landing/CTASection'
import { StatsSection } from '@/components/landing/StatsSection'

export const metadata: Metadata = {
  title: 'CIPREL Compétences - Développez vos compétences professionnelles',
  description: 'Plateforme de formation et d\'évaluation des compétences CIPREL avec quiz interactifs, vidéos et suivi personnalisé.',
}

export default function CompetencesPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturesSection />
      <StepsSection />
      <StatsSection />
      <CTASection />
    </div>
  )
}
