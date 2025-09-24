'use client'

import { motion } from 'framer-motion'
import { Brain, Video, BarChart3, Shield, Zap, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Brain,
    title: 'Quiz Interactifs',
    description: 'Évaluez vos connaissances avec des quiz personnalisés et obtenez un feedback détaillé.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Video,
    title: 'Vidéothèque TikTok-like',
    description: 'Parcourez des contenus vidéo courts et engageants pour apprendre efficacement.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BarChart3,
    title: 'Suivi de Progression',
    description: 'Visualisez votre évolution avec des statistiques détaillées et des rapports personnalisés.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Users,
    title: 'Dashboard Administrateur',
    description: 'Gérez les utilisateurs, analysez les performances et créez du contenu facilement.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Shield,
    title: 'Conformité RGPD',
    description: 'Protection complète des données personnelles selon la réglementation européenne.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Zap,
    title: 'Performance Optimale',
    description: 'Interface rapide et responsive, optimisée pour tous les appareils et connexions.',
    color: 'from-yellow-500 to-orange-500'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Une plateforme complète pour vos{' '}
            <span className="text-gradient bg-gradient-to-r from-ciprel-600 to-blue-600 bg-clip-text text-transparent">
              compétences
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez tous les outils nécessaires pour développer et évaluer
            les compétences de vos équipes de manière moderne et efficace.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-ciprel-200 group-hover:shadow-ciprel/20">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-ciprel-700 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '2rem' }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                      className={`h-1 bg-gradient-to-r ${feature.color} rounded-full mt-6 group-hover:w-12 transition-all duration-300`}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-ciprel-600">100%</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Sécurisé</div>
              <div className="text-gray-500">Données protégées et conformes RGPD</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-ciprel-600">24/7</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Accessible</div>
              <div className="text-gray-500">Plateforme disponible en permanence</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-ciprel-600">∞</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Évolutif</div>
              <div className="text-gray-500">Contenus mis à jour régulièrement</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}