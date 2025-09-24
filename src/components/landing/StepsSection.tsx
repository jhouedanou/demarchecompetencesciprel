'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Play, Award, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const steps = [
  {
    icon: Play,
    title: 'Commencez votre évaluation',
    description: 'Répondez aux quiz personnalisés pour identifier vos points forts et axes d\'amélioration.',
    color: 'from-blue-500 to-cyan-500',
    number: '01'
  },
  {
    icon: TrendingUp,
    title: 'Suivez votre progression',
    description: 'Visualisez vos résultats en temps réel et découvrez vos compétences développées.',
    color: 'from-green-500 to-emerald-500',
    number: '02'
  },
  {
    icon: CheckCircle,
    title: 'Validez vos acquis',
    description: 'Obtenez une certification reconnue de vos compétences développées.',
    color: 'from-purple-500 to-pink-500',
    number: '03'
  },
  {
    icon: Award,
    title: 'Excellez dans votre domaine',
    description: 'Utilisez vos nouvelles compétences pour atteindre vos objectifs professionnels.',
    color: 'from-orange-500 to-red-500',
    number: '04'
  }
]

export function StepsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment ça{' '}
            <span className="text-gradient bg-gradient-to-r from-ciprel-600 to-blue-600 bg-clip-text text-transparent">
              fonctionne
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Suivez ces étapes simples pour développer vos compétences et obtenir une reconnaissance officielle.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-ciprel-200 group-hover:shadow-ciprel/20 relative">
                  <CardContent className="p-6 text-center">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {step.number}
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 mx-auto mt-4 group-hover:shadow-lg transition-shadow duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-ciprel-700 transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-sm">
                      {step.description}
                    </p>

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '2rem' }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                      className={`h-1 bg-gradient-to-r ${step.color} rounded-full mt-4 mx-auto group-hover:w-12 transition-all duration-300`}
                    />
                  </CardContent>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-ciprel-200 to-transparent transform -translate-y-1/2 z-10"></div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}