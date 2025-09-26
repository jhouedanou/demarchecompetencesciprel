'use client'

import Link from 'next/link'
import { Building2, Users, Zap, BookOpen, Award, TrendingUp } from 'lucide-react'

export function CiprelWelcomeSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header with logo and title */}
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white p-3 rounded-full">
              <Building2 className="h-8 w-8 text-blue-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Guide de la démarche compétence</h1>
              <p className="text-blue-100">CIPREL - 30 ans d'expérience</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <Zap className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-8">
        {/* Hero with logos */}
        <div className="mb-8">
          <div className="relative h-48 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg mb-6 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-8">
                <img
                  src="/images/logo.webp"
                  alt="Logo CIPREL"
                  className="h-20 w-auto object-contain drop-shadow"
                />
                <img
                  src="/images/30ans.png"
                  alt="30 ans CIPREL"
                  className="h-20 w-auto object-contain drop-shadow"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <div className="flex items-start">
              <Users className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Message d'accueil
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  <strong>Les collaborateurs de CIPREL sont mobilisés 24h/24, 365 jours par an pour la production d'électricité.</strong>
                  <br /><br />
                  Cette plateforme vous accompagne dans la découverte et la compréhension de notre démarche compétence,
                  un processus essentiel pour le développement de vos talents et la performance de notre organisation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center mb-3">
              <Award className="h-6 w-6 text-blue-600 mr-2" />
              <h4 className="font-semibold text-blue-900">30 ans</h4>
            </div>
            <p className="text-blue-700 text-sm">d'expérience en production électrique</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <div className="flex items-center mb-3">
              <Zap className="h-6 w-6 text-green-600 mr-2" />
              <h4 className="font-semibold text-green-900">24/7</h4>
            </div>
            <p className="text-green-700 text-sm">Production continue d'électricité</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center mb-3">
              <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
              <h4 className="font-semibold text-purple-900">Excellence</h4>
            </div>
            <p className="text-purple-700 text-sm">Engagement vers la performance</p>
          </div>
        </div>

        {/* Navigation to sections */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Découvrir la démarche compétence
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/demarche/dialectique"
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <h4 className="font-medium text-gray-900 mb-2">1. Dialectique de la démarche</h4>
              <p className="text-gray-600 text-sm">Découvrez la définition et les bénéfices</p>
            </Link>

            <Link
              href="/demarche/synoptique"
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <h4 className="font-medium text-gray-900 mb-2">2. Synoptique des étapes</h4>
              <p className="text-gray-600 text-sm">Les 5 étapes cycliques détaillées</p>
            </Link>

            <Link
              href="/demarche/leviers"
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <h4 className="font-medium text-gray-900 mb-2">3. Facteurs clés de succès</h4>
              <p className="text-gray-600 text-sm">Les 4 leviers essentiels</p>
            </Link>

            <Link
              href="/demarche/ressources"
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <h4 className="font-medium text-gray-900 mb-2">4. Ressources documentaires</h4>
              <p className="text-gray-600 text-sm">Guides et documents téléchargeables</p>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>📚 Important :</strong> Vous devez lire toutes les sections pour débloquer l'accès aux quiz et sondages.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}