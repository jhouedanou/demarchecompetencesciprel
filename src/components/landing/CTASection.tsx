'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Sparkles, Rocket } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const benefits = [
  'Accès illimité à tous les modules de formation',
  'Suivi personnalisé de votre progression',
  'Certification reconnue de vos compétences',
  'Support technique et pédagogique 24/7'
]

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-ciprel-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-ciprel-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-100 rounded-full blur-2xl opacity-25 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center justify-center mb-6"
            >
              <div className="flex items-center space-x-2 bg-gradient-to-r from-ciprel-100 to-blue-100 px-4 py-2 rounded-full">
                <Sparkles className="w-5 h-5 text-ciprel-600" />
                <span className="text-ciprel-700 font-medium text-sm">
                  Offre de lancement
                </span>
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Prêt à transformer votre{' '}
              <span className="text-gradient bg-gradient-to-r from-ciprel-600 to-blue-600 bg-clip-text text-transparent">
                carrière ?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoignez des milliers de professionnels qui développent leurs compétences
              avec notre plateforme innovante. Commencez votre parcours dès aujourd'hui.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Ce que vous obtenez :
              </h3>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3 group"
                >
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-500 group-hover:text-green-600 transition-colors" />
                  </div>
                  <p className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    {benefit}
                  </p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="pt-6"
              >
                <div className="flex items-center space-x-2 text-sm text-ciprel-600">
                  <Rocket className="w-4 h-4" />
                  <span className="font-medium">Démarrage immédiat • Aucun engagement</span>
                </div>
              </motion.div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:pl-8"
            >
              <Card className="relative overflow-hidden border-2 border-ciprel-200 hover:border-ciprel-300 transition-all duration-300 hover:shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-ciprel-500/5 to-blue-500/5"></div>
                <CardContent className="p-8 relative">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-r from-ciprel-500 to-blue-500 flex items-center justify-center mb-6 group-hover:shadow-xl transition-shadow duration-300"
                  >
                    <Rocket className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Commencez gratuitement
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Essayez notre plateforme pendant 14 jours sans engagement.
                    Accédez à tous les modules et découvrez comment nous pouvons
                    vous aider à développer vos compétences.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-ciprel-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 hover:from-ciprel-600 hover:to-blue-600 transition-all duration-300 group-hover:shadow-xl"
                  >
                    <span>Démarrer maintenant</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Aucune carte de crédit requise • Annulation facile
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-gray-500 text-sm mb-6">
              Approuvé par des professionnels de confiance
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">CIPREL</div>
              <div className="w-1 h-6 bg-gray-300"></div>
              <div className="text-xl font-semibold text-gray-400">ISO 27001</div>
              <div className="w-1 h-6 bg-gray-300"></div>
              <div className="text-xl font-semibold text-gray-400">RGPD</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}