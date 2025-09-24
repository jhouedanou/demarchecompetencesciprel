'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '2,500+',
    label: 'Utilisateurs actifs',
    description: 'Professionnels qui développent leurs compétences',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BookOpen,
    value: '150+',
    label: 'Modules de formation',
    description: 'Contenus pédagogiques certifiés',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Award,
    value: '98%',
    label: 'Taux de satisfaction',
    description: 'Utilisateurs satisfaits de leur progression',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: TrendingUp,
    value: '+40%',
    label: 'Amélioration moyenne',
    description: 'Progression des compétences constatée',
    color: 'from-orange-500 to-red-500'
  }
]

export function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-ciprel-green-600 to-ciprel-orange-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-ciprel-green-600/90 to-ciprel-orange-600/90"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Des résultats qui{' '}
            <span className="text-yellow-300">
              parlent d'eux-mêmes
            </span>
          </h2>
          <p className="text-xl text-ciprel-green-100 max-w-3xl mx-auto">
            Rejoignez des milliers de professionnels qui ont déjà transformé leur carrière
            grâce à notre plateforme de développement des compétences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="group"
              >
                <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:border-white/30">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 mx-auto group-hover:shadow-2xl transition-shadow duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-white mb-2"
                  >
                    {stat.value}
                  </motion.div>

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                    {stat.label}
                  </h3>

                  <p className="text-ciprel-green-100 text-sm leading-relaxed">
                    {stat.description}
                  </p>

                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '3rem' }}
                    transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    className={`h-1 bg-gradient-to-r ${stat.color} rounded-full mt-4 mx-auto group-hover:w-16 transition-all duration-300`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-ciprel-green-100 text-lg mb-6">
            Prêt à rejoindre cette communauté de professionnels ambitieux ?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-ciprel-green-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:bg-ciprel-orange-50"
          >
            Commencer maintenant
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}