'use client'

import { motion } from 'framer-motion'
import { 
  Search,
  Map,
  BarChart,
  Zap,
  TrendingUp,
  ArrowRight,
  Clock,
  Users,
  FileText
} from 'lucide-react'
import { Card } from '@/components/ui/card'

const etapesData = [
  {
    numero: 1,
    titre: "Identification des compétences requises",
    questionCle: "Quelles sont les compétences essentielles aujourd'hui et demain pour l'entreprise ?",
    responsables: "Ressources humaines + Managers",
    outils: "Fiches métier, Référentiels de compétences",
    frequence: "Ponctuelle, Mise à jour en cas de besoin",
    icon: Search,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    numero: 2,
    titre: "Cartographier et évaluer les compétences acquises (actuelles)",
    questionCle: "Évaluer les compétences des collaborateurs par rapport au référentiel défini",
    responsables: "Ressources humaines + Managers",
    outils: "Entretien d'évaluation de la performance, Évaluation des compétences",
    frequence: "Annuelle, Trisannuelle",
    icon: Map,
    color: "from-ciprel-green-500 to-ciprel-green-600",
    bgColor: "bg-ciprel-green-50",
    borderColor: "border-ciprel-green-200"
  },
  {
    numero: 3,
    titre: "Analyser les écarts en compétences et définir les besoins",
    questionCle: "Identifier les écarts en compétence et leur cause pour définir les actions idoines",
    responsables: "Managers + Ressources humaines",
    outils: "Évaluation des compétences et des performances, Picking des évaluations",
    frequence: "Annuelle, Trisannuelle",
    icon: BarChart,
    color: "from-ciprel-orange-500 to-ciprel-orange-600",
    bgColor: "bg-ciprel-orange-50",
    borderColor: "border-ciprel-orange-200"
  },
  {
    numero: 4,
    titre: "Développer les compétences",
    questionCle: "Offrir des opportunités de développement en ciblant les compétences manquantes et développer de nouvelles compétences",
    responsables: "Ressources humaines + Managers + Collaborateurs",
    outils: "Plan de formation, Coaching, Mentorat, Projet",
    frequence: "Tout au long de l'année",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    numero: 5,
    titre: "Évaluer et suivre les évolutions",
    questionCle: "Mettre en place un suivi de l'évolution et apporter des ajustements en cas de besoin",
    responsables: "Ressources humaines + Managers + Collaborateurs",
    outils: "Évaluation des compétences et des performances",
    frequence: "Tout au long de l'année",
    icon: TrendingUp,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200"
  }
]

export function SynoptiqueContent() {
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
            <Map className="w-4 h-4" />
            Processus cyclique
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ciprel-black mb-6">
            Synoptique de la{' '}
            <span className="text-gradient bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-500 bg-clip-text text-transparent">
              Démarche Compétence
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un processus en 5 étapes cycliques pour une gestion optimale des compétences
          </p>
        </motion.div>

        {/* Cycle visuel */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            {/* Cercle central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 rounded-full flex items-center justify-center text-white shadow-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">5 ÉTAPES</div>
                  <div className="text-sm opacity-90">CYCLIQUES</div>
                </div>
              </div>
            </div>

            {/* Étapes en cercle */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8">
              {etapesData.map((etape, index) => {
                const Icon = etape.icon
                return (
                  <motion.div
                    key={index}
                    className={`p-4 ${etape.bgColor} ${etape.borderColor} border-2 rounded-xl text-center`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${etape.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xl font-bold text-gray-800 mb-1">{etape.numero}</div>
                    <div className="text-sm font-medium text-gray-600">Étape {etape.numero}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Détails des étapes */}
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ciprel-black mb-4">Détails des 5 étapes</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 rounded-full mx-auto"></div>
          </div>

          {etapesData.map((etape, index) => {
            const Icon = etape.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className={`p-8 ${etape.bgColor} border-2 ${etape.borderColor} hover:shadow-xl transition-all duration-300`}>
                  <div className="flex items-start gap-6">
                    {/* Numéro et icône */}
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 bg-gradient-to-r ${etape.color} rounded-2xl flex items-center justify-center mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">0{etape.numero}</div>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-ciprel-black mb-4">{etape.titre}</h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span className="font-semibold text-gray-800">Question clé</span>
                          </div>
                          <p className="text-gray-700 italic mb-4">"{etape.questionCle}"</p>

                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-ciprel-green-600" />
                            <span className="font-semibold text-gray-800">Responsables</span>
                          </div>
                          <p className="text-gray-700 mb-4">{etape.responsables}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-ciprel-orange-600" />
                            <span className="font-semibold text-gray-800">Outils</span>
                          </div>
                          <p className="text-gray-700 mb-4">{etape.outils}</p>

                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-gray-800">Fréquence</span>
                          </div>
                          <p className="text-gray-700">{etape.frequence}</p>
                        </div>
                      </div>
                    </div>

                    {/* Flèche vers l'étape suivante */}
                    {index < etapesData.length - 1 && (
                      <div className="flex-shrink-0 hidden lg:flex items-center">
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Message de continuité */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="p-8 bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-600 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Processus Continu et Cyclique</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              La démarche compétence n'est pas linéaire mais cyclique. Après l'étape 5, 
              le processus reprend avec l'identification des nouvelles compétences requises, 
              créant ainsi une amélioration continue des compétences organisationnelles.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
