import { Hero } from '@/components/landing/Hero'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { StepsSection } from '@/components/landing/StepsSection'
import { CTASection } from '@/components/landing/CTASection'
import { StatsSection } from '@/components/landing/StatsSection'

export default function HomePage() {
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