'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ENV, ROUTES } from '@/lib/utils/constants'

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-ciprel-50 via-white to-ciprel-100">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ciprel-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-ciprel-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="container mx-auto px-6 py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-ciprel-100 text-ciprel-800 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                Développement des compétences
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Démarche{' '}
                <span className="text-gradient bg-gradient-to-r from-ciprel-600 to-ciprel-500 bg-clip-text text-transparent">
                  Compétences
                </span>
                <br />
                {ENV.COMPANY_NAME}
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-gray-600 leading-relaxed max-w-2xl"
              variants={itemVariants}
            >
              Développez vos compétences professionnelles avec notre plateforme interactive.
              Quiz personnalisés, contenus vidéo et suivi de progression pour une montée en
              compétences efficace et engageante.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Link href={ROUTES.QUIZ_INTRODUCTION}>
                <Button size="lg" className="group w-full sm:w-auto">
                  Commencer le quiz
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href={ROUTES.VIDEOS}>
                <Button variant="outline" size="lg" className="group w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  Découvrir les vidéos
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-6 pt-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-ciprel-600" />
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-900">500+</strong> employés formés
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-ciprel-600" />
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-900">85%</strong> de satisfaction
                </span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Cards */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={ROUTES.QUIZ_INTRODUCTION}>
                  <Card className="p-6 hover:shadow-ciprel cursor-pointer group border-2 hover:border-ciprel-300 transition-all duration-300">
                    <div className="w-12 h-12 bg-ciprel-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-ciprel-200 transition-colors">
                      <Award className="w-6 h-6 text-ciprel-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quiz Introduction</h3>
                    <p className="text-sm text-gray-600">
                      Testez vos connaissances sur la démarche compétences
                    </p>
                    <div className="mt-4 text-ciprel-600 group-hover:text-ciprel-700 text-sm font-medium">
                      Commencer →
                    </div>
                  </Card>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={ROUTES.SONDAGE}>
                  <Card className="p-6 hover:shadow-ciprel cursor-pointer group border-2 hover:border-ciprel-300 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sondage Opinion</h3>
                    <p className="text-sm text-gray-600">
                      Partagez votre point de vue et vos attentes
                    </p>
                    <div className="mt-4 text-blue-600 group-hover:text-blue-700 text-sm font-medium">
                      Participer →
                    </div>
                  </Card>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
                className="md:col-span-2"
              >
                <Link href={ROUTES.VIDEOS}>
                  <Card className="p-6 hover:shadow-ciprel cursor-pointer group border-2 hover:border-ciprel-300 transition-all duration-300 bg-gradient-to-r from-ciprel-50 to-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-ciprel-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Vidéothèque</h3>
                          <p className="text-sm text-gray-600">
                            Explorez nos contenus vidéo interactifs
                          </p>
                        </div>
                      </div>
                      <div className="text-ciprel-600 group-hover:text-ciprel-700">
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-ciprel-200 rounded-full opacity-20"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-300 rounded-full opacity-30"
              animate={{
                y: [0, 10, 0],
                rotate: [0, -3, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}