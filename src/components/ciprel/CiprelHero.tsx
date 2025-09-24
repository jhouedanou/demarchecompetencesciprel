'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CiprelHero() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 opacity-10"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#36A24C" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
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
            {/* Badge CIPREL 30 ans */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-ciprel-green-100 border border-ciprel-green-200 rounded-full">
              <div className="w-8 h-8 bg-ciprel-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-ciprel-green-800 font-semibold">CIPREL - 30 ans d'expérience</span>
            </div>

            {/* Titre principal */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-ciprel-black leading-tight mb-4">
                Guide de la{' '}
                <span className="text-gradient bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-500 bg-clip-text text-transparent">
                  Démarche Compétence
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 rounded-full"></div>
            </div>

            {/* Message d'accueil */}
            <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
              Les collaborateurs de <strong className="text-ciprel-green-600">CIPREL</strong> sont mobilisés{' '}
              <strong className="text-ciprel-orange-600">24h/24, 365 jours par an</strong>{' '}
              pour la production d'électricité
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dialectique">
                <Button size="lg" className="group w-full sm:w-auto bg-ciprel-green-600 hover:bg-ciprel-green-700">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Découvrir la démarche
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/quiz">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group w-full sm:w-auto border-ciprel-orange-500 text-ciprel-orange-600 hover:bg-ciprel-orange-50"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Commencer le quiz
                </Button>
              </Link>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-ciprel-green-600 mb-2">30+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Années d'expertise</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ciprel-orange-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Production continue</div>
              </div>
            </div>
          </motion.div>

          {/* Image de la centrale */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Placeholder pour l'image de la centrale CIPREL */}
              <div className="absolute inset-0 bg-gradient-to-br from-ciprel-green-400 to-ciprel-orange-400">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <svg 
                        className="w-12 h-12" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.5 5.16-.76 9-4.95 9-10.5V7l-10-5z"/>
                        <path d="M8 11h8v2H8z"/>
                        <path d="M8 15h8v2H8z"/>
                        <path d="M10 7h4v2h-4z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Centrale CIPREL</h3>
                    <p className="text-sm opacity-90">Production d'électricité en Côte d'Ivoire</p>
                  </div>
                </div>
              </div>
              
              {/* Overlay décoratif */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Éléments décoratifs */}
            <motion.div
              className="absolute -top-4 -left-4 w-16 h-16 bg-ciprel-green-200 rounded-full opacity-60"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 w-12 h-12 bg-ciprel-orange-300 rounded-full opacity-70"
              animate={{
                y: [0, 10, 0],
                scale: [1, 0.9, 1]
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
      </div>
    </div>
  )
}
