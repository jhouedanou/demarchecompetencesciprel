'use client'

import { motion } from 'framer-motion'
import { 
  Target, 
  Users, 
  TrendingUp, 
  Lightbulb, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Award,
  UserCheck
} from 'lucide-react'
import { Card } from '@/components/ui/card'

const beneficesData = [
  {
    icon: Target,
    title: "Alignement Stratégique",
    description: "S'assurer que les compétences disponibles correspondent aux objectifs de l'entreprise (ex: transformation digitale, nouveaux marchés)",
    color: "from-ciprel-green-500 to-ciprel-green-600"
  },
  {
    icon: Users,
    title: "Optimisation des Ressources", 
    description: "Identifier les lacunes et les forces pour une meilleure allocation des talents et des investissements en formation",
    color: "from-ciprel-orange-500 to-ciprel-orange-600"
  },
  {
    icon: UserCheck,
    title: "Développement des Collaborateurs",
    description: "Offrir des perspectives d'évolution et de montée en compétences, augmentant l'engagement et la fidélisation",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Award,
    title: "Attractivité",
    description: "Rendre l'entreprise plus attractive pour les nouveaux talents en démontrant un engagement envers le développement professionnel",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: TrendingUp,
    title: "Performance Globale",
    description: "Favoriser une culture de l'apprentissage continu et de l'amélioration, stimulant la productivité et la capacité d'innovation",
    color: "from-emerald-500 to-emerald-600"
  }
]

const elementsData = [
  {
    title: "Processus structuré et continu",
    description: "Ce n'est pas une action ponctuelle, mais une approche systémique et pérenne"
  },
  {
    title: "Identification",
    description: "Définir les compétences critiques pour l'entreprise aujourd'hui et demain (référentiels de compétences)"
  },
  {
    title: "Évaluation", 
    description: "Mesurer les compétences actuelles des collaborateurs par rapport aux besoins identifiés"
  },
  {
    title: "Développement",
    description: "Mettre en œuvre des actions (formation, tutorat, mobilité, projets) pour acquérir ou renforcer les compétences manquantes"
  },
  {
    title: "Mobilisation",
    description: "S'assurer que les bonnes compétences sont utilisées au bon endroit et au bon moment pour la performance"
  },
  {
    title: "Compétences individuelles et collectives",
    description: "La démarche concerne à la fois les capacités de chaque salarié et la synergie des compétences au sein des équipes"
  },
  {
    title: "Objectifs stratégiques de l'organisation",
    description: "La finalité est toujours de soutenir la vision, les projets et la performance globale de l'entreprise"
  }
]

export function DialectiqueContent() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        {/* En-tête */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ciprel-green-100 text-ciprel-green-800 rounded-full text-sm font-medium mb-6">
            <Lightbulb className="w-4 h-4" />
            Comprendre la démarche
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ciprel-black mb-6">
            Dialectique de la{' '}
            <span className="text-gradient bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-500 bg-clip-text text-transparent">
              Démarche Compétence
            </span>
          </h1>
        </motion.div>

        {/* Définition */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 bg-gradient-to-br from-ciprel-green-50 to-ciprel-orange-50 border-2 border-ciprel-green-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ciprel-black mb-4">Définition</h2>
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "Un processus structuré et continu visant à identifier, évaluer, développer et mobiliser 
                  l'ensemble des compétences (savoirs, savoir-faire et savoir-être) individuelles et collectives 
                  nécessaires à l'atteinte des objectifs stratégiques de l'organisation."
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Éléments clés */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ciprel-black mb-4">Les éléments clés</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {elementsData.map((element, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-ciprel-green-500">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ciprel-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-ciprel-black mb-2">{element.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{element.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bénéfices et gains attendus */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ciprel-black mb-4">
              Bénéfices et gains attendus
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              La démarche compétence apporte des gains concrets à tous les niveaux de l'organisation
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 rounded-full mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficesData.map((benefice, index) => {
              const Icon = benefice.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-ciprel-green-300">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${benefice.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-ciprel-black mb-3 group-hover:text-ciprel-green-600 transition-colors">
                      {benefice.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {benefice.description}
                    </p>
                    <div className="flex items-center text-ciprel-green-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Objectifs principaux */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="p-8 bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-600 text-white">
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Objectifs principaux de la démarche</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="font-semibold mb-2">Adapter l'entreprise</h4>
                  <p className="text-sm opacity-90">aux évolutions de son environnement (technologiques, économiques, marché)</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Optimiser la gestion</h4>
                  <p className="text-sm opacity-90">des talents et des ressources humaines</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Développer l'employabilité</h4>
                  <p className="text-sm opacity-90">des collaborateurs et leur engagement</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
