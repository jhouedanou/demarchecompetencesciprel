'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp,
  Building2,
  Globe,
  Clock,
  Shield,
  Award,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CiprelHeroCorporate() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-ciprel-green-50">
      {/* Background Pattern Corporate */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-ciprel-green-500/3 to-ciprel-orange-500/3"></div>
        {/* Grid corporate subtil */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="corporate-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#36A24C" strokeWidth="0.3"/>
              <circle cx="40" cy="40" r="0.8" fill="#36A24C" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#corporate-grid)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Contenu textuel */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge CIPREL Corporate */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-ciprel-green-200 rounded-full shadow-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-ciprel-black font-semibold">Leader Énergétique • 30 ans d'expertise</span>
            </div>

            {/* Titre principal corporate */}
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold text-ciprel-black leading-tight mb-6">
                Excellence &
                <br />
                <span className="text-gradient bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-500 bg-clip-text text-transparent">
                  Compétences
                </span>
              </h1>
              <div className="w-32 h-1.5 bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 rounded-full mb-6"></div>
            </div>

            {/* Description professionnelle */}
            <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mb-8">
              Leader de la production d'énergie en Côte d'Ivoire depuis 30 ans, CIPREL développe l'excellence opérationnelle
              à travers une démarche compétences innovante et structurée.
            </p>

            {/* Boutons d'action corporate */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/competences/quiz-introduction">
                <Button size="lg" className="group w-full sm:w-auto bg-gradient-to-r from-ciprel-green-600 to-ciprel-green-700 hover:from-ciprel-green-700 hover:to-ciprel-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Évaluer mes compétences
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/competences/videos">
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full sm:w-auto border-2 border-ciprel-orange-500 text-ciprel-orange-600 hover:bg-ciprel-orange-50 hover:border-ciprel-orange-600 transition-all duration-300"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Explorer les formations
                </Button>
              </Link>
            </div>

            {/* KPIs Corporates - Style tableau de bord */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-ciprel-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-ciprel-green-600" />
                    </div>
                  </div>
                  <motion.div
                    className="text-3xl font-bold text-ciprel-green-600 mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    573
                  </motion.div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">MW Installés</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-ciprel-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-ciprel-orange-600" />
                    </div>
                  </div>
                  <motion.div
                    className="text-3xl font-bold text-ciprel-orange-600 mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                  >
                    24/7
                  </motion.div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Production</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <motion.div
                    className="text-3xl font-bold text-blue-600 mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                  >
                    1,200+
                  </motion.div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Collaborateurs</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Globe className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <motion.div
                    className="text-3xl font-bold text-purple-600 mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                  >
                    15%
                  </motion.div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Production Nationale</div>
                </div>
              </div>

              {/* Barre de progression pour la formation */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-ciprel-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Formations complétées cette année</span>
                  </div>
                  <span className="text-lg font-bold text-ciprel-green-600">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-ciprel-green-500 to-ciprel-green-600 h-3 rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: "87%" }}
                    transition={{ duration: 2, delay: 2 }}
                  />
                </div>
              </div>

              {/* Certifications */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-ciprel-green-50 rounded-full">
                  <Shield className="h-4 w-4 text-ciprel-green-600" />
                  <span className="text-xs font-medium text-ciprel-green-700">ISO 45001</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-ciprel-blue/10 rounded-full">
                  <Shield className="h-4 w-4 text-ciprel-blue" />
                  <span className="text-xs font-medium text-ciprel-blue">ISO 14001</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-ciprel-orange-50 rounded-full">
                  <Shield className="h-4 w-4 text-ciprel-orange-600" />
                  <span className="text-xs font-medium text-ciprel-orange-700">ISO 9001</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visualisation Corporate */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-ciprel-green-100 to-ciprel-orange-100">
              {/* Graphique de production stylisé */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Zap className="w-10 h-10 text-ciprel-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-ciprel-black mb-2">Production Énergétique</h3>
                  <p className="text-ciprel-green-700 font-medium">Côte d'Ivoire</p>
                </div>

                {/* Barres de données animées */}
                <div className="flex items-end justify-center gap-3 h-40">
                  {[65, 80, 92, 73, 88, 95, 78].map((height, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-t from-ciprel-green-500 to-ciprel-green-400 rounded-t-md"
                      style={{ width: '20px' }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: 2.5 + index * 0.1 }}
                    />
                  ))}
                </div>

                <div className="text-center text-sm text-gray-600 font-medium">
                  Performance mensuelle 2024
                </div>
              </div>

              {/* Overlay décoratif */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>

            {/* Éléments décoratifs animés */}
            <motion.div
              className="absolute -top-6 -left-6 w-20 h-20 bg-ciprel-green-200 rounded-full opacity-60"
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-6 -right-6 w-16 h-16 bg-ciprel-orange-300 rounded-full opacity-70"
              animate={{
                y: [0, 15, 0],
                scale: [1, 0.9, 1],
                rotate: [360, 180, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
