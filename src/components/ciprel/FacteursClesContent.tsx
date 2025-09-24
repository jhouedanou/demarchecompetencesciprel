'use client'

import { motion } from 'framer-motion'
import { 
  Users,
  FileText,
  Target,
  MessageSquare,
  Key,
  CheckCircle
} from 'lucide-react'
import { Card } from '@/components/ui/card'

const facteursData = [
  {
    id: 1,
    titre: "Implication de toutes les parties prenantes",
    description: "Les managers, les collaborateurs, les ressources humaines, chacun a un rôle important à jouer dans toutes les étapes de la démarche",
    icon: Users,
    color: "from-ciprel-green-500 to-ciprel-green-600",
    bgColor: "bg-ciprel-green-50",
    details: [
      "Managers : pilotage et évaluation des compétences",
      "Collaborateurs : engagement et développement personnel", 
      "RH : coordination et support méthodologique",
      "Direction : validation stratégique et ressources"
    ]
  },
  {
    id: 2,
    titre: "Formalisation de la démarche compétence",
    description: "Permet de centraliser les données, les fiabiliser et fournir ainsi une information qualitative aux différentes parties prenantes",
    icon: FileText,
    color: "from-ciprel-orange-500 to-ciprel-orange-600",
    bgColor: "bg-ciprel-orange-50",
    details: [
      "Référentiels de compétences standardisés",
      "Processus documentés et clairs",
      "Outils d'évaluation harmonisés",
      "Système de suivi et reporting"
    ]
  },
  {
    id: 3,
    titre: "Maîtrise des parties prenantes",
    description: "Qui ont la responsabilité de déployer la démarche en utilisant correctement les outils à disposition",
    icon: Target,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    details: [
      "Formation des managers aux outils d'évaluation",
      "Accompagnement des collaborateurs",
      "Montée en compétence des équipes RH",
      "Support technique et méthodologique continu"
    ]
  },
  {
    id: 4,
    titre: "Communication et sensibilisation",
    description: "Sur l'importance de la démarche compétence pour informer les employés des objectifs, des enjeux et des bénéfices de la gestion des compétences",
    icon: MessageSquare,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    details: [
      "Campagnes de sensibilisation régulières",
      "Présentation des objectifs et bénéfices",
      "Retours d'expérience et success stories",
      "Canaux de communication diversifiés"
    ]
  }
]

export function FacteursClesContent() {
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
            <Key className="w-4 h-4" />
            Facteurs de réussite
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ciprel-black mb-6">
            Leviers et{' '}
            <span className="text-gradient bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-500 bg-clip-text text-transparent">
              Facteurs Clés de Succès
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            4 facteurs essentiels identifiés pour garantir le succès de la démarche compétence chez CIPREL
          </p>
        </motion.div>

        {/* Vue d'ensemble */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 bg-gradient-to-br from-ciprel-green-50 to-ciprel-orange-50 border-2 border-ciprel-green-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ciprel-black mb-6">
                Les 4 piliers du succès
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {facteursData.map((facteur, index) => {
                  const Icon = facteur.icon
                  return (
                    <motion.div
                      key={facteur.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="text-center"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-r ${facteur.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-ciprel-black">0{facteur.id}</div>
                      <div className="text-sm text-gray-600 mt-1">Facteur {facteur.id}</div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Détails des facteurs */}
        <div className="space-y-12">
          {facteursData.map((facteur, index) => {
            const Icon = facteur.icon
            return (
              <motion.div
                key={facteur.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className={`p-8 ${facteur.bgColor} border-2 hover:shadow-xl transition-all duration-300`}>
                  <div className="grid lg:grid-cols-3 gap-8 items-center">
                    {/* Numéro et icône */}
                    <div className="text-center lg:text-left">
                      <div className={`w-20 h-20 bg-gradient-to-r ${facteur.color} rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-4`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-gray-800 mb-2">
                        Facteur 0{facteur.id}
                      </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="lg:col-span-2">
                      <h3 className="text-2xl font-bold text-ciprel-black mb-4">
                        {facteur.titre}
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        {facteur.description}
                      </p>

                      {/* Points clés */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-ciprel-black mb-3">Points clés :</h4>
                        {facteur.details.map((detail, detailIndex) => (
                          <motion.div
                            key={detailIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * detailIndex }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="w-5 h-5 text-ciprel-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Message de synthèse */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="p-8 bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-600 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Synergie des 4 Facteurs</h3>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Ces 4 facteurs clés sont interdépendants et doivent être développés de manière coordonnée. 
              Leur synergie garantit une mise en œuvre réussie de la démarche compétence, 
              créant un cercle vertueux d'amélioration continue des compétences à tous les niveaux de CIPREL.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
