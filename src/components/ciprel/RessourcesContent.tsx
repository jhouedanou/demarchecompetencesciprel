'use client'

import { motion } from 'framer-motion'
import { 
  FileText,
  Download,
  BookOpen,
  ClipboardList,
  BarChart3,
  Calendar,
  FileCheck,
  ArrowRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ressourcesData = [
  {
    id: 1,
    titre: "Guide de la démarche compétence",
    type: "PDF complet",
    description: "Document de référence complet expliquant la démarche compétence chez CIPREL : définitions, processus, étapes et bénéfices.",
    taille: "2.8 MB",
    pages: "45 pages",
    icon: BookOpen,
    color: "from-ciprel-green-500 to-ciprel-green-600",
    bgColor: "bg-ciprel-green-50",
    dateUpdate: "Mars 2024"
  },
  {
    id: 2,
    titre: "Sondage d'opinion",
    type: "Document téléchargeable",
    description: "Questionnaire pour recueillir les avis et attentes des collaborateurs sur la mise en place de la démarche compétence.",
    taille: "450 KB",
    pages: "8 pages",
    icon: BarChart3,
    color: "from-ciprel-orange-500 to-ciprel-orange-600",
    bgColor: "bg-ciprel-orange-50",
    dateUpdate: "Mars 2024"
  },
  {
    id: 3,
    titre: "Quiz de la phase introductive",
    type: "Document téléchargeable",
    description: "Questions d'évaluation pour tester la compréhension des concepts de base de la démarche compétence.",
    taille: "320 KB",
    pages: "12 pages",
    icon: ClipboardList,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    dateUpdate: "Mars 2024"
  },
  {
    id: 4,
    titre: "Référentiel des compétences",
    type: "PDF détaillé",
    description: "Catalogue des compétences techniques, comportementales et fondamentales identifiées pour CIPREL.",
    taille: "1.9 MB",
    pages: "32 pages",
    icon: FileCheck,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    dateUpdate: "Avril 2024"
  },
  {
    id: 5,
    titre: "Planning de déploiement",
    type: "Calendrier détaillé",
    description: "Feuille de route et calendrier de mise en œuvre de la démarche compétence par service et étape.",
    taille: "680 KB",
    pages: "15 pages",
    icon: Calendar,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    dateUpdate: "Avril 2024"
  }
]

const categoriesData = [
  {
    categorie: "Guides et Documentation",
    description: "Documents de référence et guides méthodologiques",
    ressources: [1, 4]
  },
  {
    categorie: "Outils d'Évaluation",
    description: "Quiz, sondages et grilles d'évaluation",
    ressources: [2, 3]
  },
  {
    categorie: "Planification",
    description: "Calendriers et outils de suivi",
    ressources: [5]
  }
]

export function RessourcesContent() {
  const handleDownload = (ressourceId: number) => {
    // Simulation du téléchargement
    console.log(`Téléchargement de la ressource ${ressourceId}`)
    // Dans un vrai projet, cela déclencherait le téléchargement du fichier
  }

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
            <FileText className="w-4 h-4" />
            Centre de ressources
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ciprel-black mb-6">
            Ressources{' '}
            <span className="text-gradient bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-500 bg-clip-text text-transparent">
              Documentaires
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Téléchargez tous les documents, guides et outils nécessaires pour comprendre 
            et mettre en œuvre la démarche compétence chez CIPREL
          </p>
        </motion.div>

        {/* Statistiques des ressources */}
        <motion.div 
          className="grid md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-ciprel-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-ciprel-green-600" />
            </div>
            <div className="text-2xl font-bold text-ciprel-green-600">{ressourcesData.length}</div>
            <div className="text-sm text-gray-600">Documents</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-ciprel-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6 text-ciprel-orange-600" />
            </div>
            <div className="text-2xl font-bold text-ciprel-orange-600">100%</div>
            <div className="text-sm text-gray-600">Gratuits</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">112</div>
            <div className="text-sm text-gray-600">Pages total</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">2024</div>
            <div className="text-sm text-gray-600">Mise à jour</div>
          </Card>
        </motion.div>

        {/* Ressources par catégorie */}
        <div className="space-y-12">
          {categoriesData.map((categorie, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-ciprel-black mb-2">{categorie.categorie}</h2>
                <p className="text-gray-600">{categorie.description}</p>
                <div className="w-16 h-1 bg-gradient-to-r from-ciprel-green-500 to-ciprel-orange-500 rounded-full mt-3"></div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorie.ressources.map((ressourceId) => {
                  const ressource = ressourcesData.find(r => r.id === ressourceId)!
                  const Icon = ressource.icon
                  
                  return (
                    <motion.div
                      key={ressource.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * ressource.id }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className={`p-6 h-full ${ressource.bgColor} border-2 hover:shadow-xl transition-all duration-300 group`}>
                        <div className={`w-14 h-14 bg-gradient-to-r ${ressource.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-ciprel-black mb-2 group-hover:text-ciprel-green-600 transition-colors">
                          {ressource.titre}
                        </h3>
                        
                        <div className="text-sm text-gray-500 mb-3">
                          <span className="font-medium">{ressource.type}</span>
                          <span className="mx-2">•</span>
                          <span>{ressource.dateUpdate}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                          {ressource.description}
                        </p>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                          <span>{ressource.taille}</span>
                          <span>{ressource.pages}</span>
                        </div>
                        
                        <Button 
                          onClick={() => handleDownload(ressource.id)}
                          className={`w-full bg-gradient-to-r ${ressource.color} text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Informations complémentaires */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="p-8 bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-600 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Besoin d'aide ?</h3>
                <p className="text-lg opacity-90 mb-6">
                  L'équipe RH CIPREL est disponible pour vous accompagner dans l'utilisation 
                  de ces ressources et répondre à toutes vos questions sur la démarche compétence.
                </p>
                <Button 
                  onClick={() => window.location.href = '/contact'}
                  className="bg-white text-ciprel-green-600 hover:bg-gray-100"
                >
                  Contacter l'équipe RH
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <div className="text-sm opacity-75">
                  Toutes les ressources sont régulièrement mises à jour
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
