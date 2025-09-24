import { Search, MapPin, BarChart3, TrendingUp, Eye, Calendar, Users } from 'lucide-react'

export function SynoptiqueContent() {
  const etapes = [
    {
      number: '01',
      title: 'Identification des compétences requises',
      question: '"Quelles sont les compétences essentielles aujourd\'hui et demain ?"',
      responsables: 'Ressources humaines + Managers',
      outils: 'Fiches métier, Référentiels de compétences',
      frequence: 'Ponctuelle, Mise à jour si besoin',
      icon: Search,
      color: 'blue'
    },
    {
      number: '02',
      title: 'Cartographier et évaluer les compétences acquises',
      question: '"Évaluer les compétences par rapport au référentiel défini"',
      responsables: 'Ressources humaines + Managers',
      outils: 'Entretien d\'évaluation, Évaluation des compétences',
      frequence: 'Annuelle, Trisannuelle',
      icon: MapPin,
      color: 'green'
    },
    {
      number: '03',
      title: 'Analyser les écarts et définir les besoins',
      question: '"Identifier les écarts et définir les actions idoines"',
      responsables: 'Managers + Ressources humaines',
      outils: 'Évaluation des compétences et performances',
      frequence: 'Annuelle, Trisannuelle',
      icon: BarChart3,
      color: 'yellow'
    },
    {
      number: '04',
      title: 'Développer les compétences',
      question: '"Offrir des opportunités de développement ciblées"',
      responsables: 'RH + Managers + Collaborateurs',
      outils: 'Formation, Coaching, Mentorat, Projets',
      frequence: 'Tout au long de l\'année',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      number: '05',
      title: 'Évaluer et suivre les évolutions',
      question: '"Suivi et ajustements en cas de besoin"',
      responsables: 'RH + Managers + Collaborateurs',
      outils: 'Évaluation des compétences et performances',
      frequence: 'Tout au long de l\'année',
      icon: Eye,
      color: 'red'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      red: 'bg-red-50 border-red-200 text-red-800'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Processus cyclique et continu</h3>
        <p className="text-green-800">
          La démarche compétence suit un cycle de 5 étapes interconnectées qui se répètent et s'enrichissent
          au fil du temps pour assurer une amélioration continue.
        </p>
      </div>

      {/* Les étapes */}
      <div className="space-y-6">
        {etapes.map((etape, index) => {
          const IconComponent = etape.icon
          return (
            <div key={etape.number} className="relative">
              {/* Connector line */}
              {index < etapes.length - 1 && (
                <div className="absolute left-6 top-20 w-0.5 h-16 bg-gray-200 z-0"></div>
              )}

              <div className={`border rounded-lg p-6 ${getColorClasses(etape.color)}`}>
                <div className="flex items-start space-x-4">
                  {/* Step number and icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full ${getIconColorClasses(etape.color)} flex items-center justify-center relative z-10`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm font-bold text-gray-600">{etape.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-3">{etape.title}</h4>

                    <div className="mb-4">
                      <h5 className="font-semibold mb-2 flex items-center">
                        <span className="text-sm">❓</span>
                        <span className="ml-2">Question clé :</span>
                      </h5>
                      <p className="text-sm italic pl-6">{etape.question}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h6 className="font-semibold mb-1 flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Responsables
                        </h6>
                        <p className="pl-5">{etape.responsables}</p>
                      </div>

                      <div>
                        <h6 className="font-semibold mb-1 flex items-center">
                          <span className="text-sm mr-1">🛠️</span>
                          Outils
                        </h6>
                        <p className="pl-5">{etape.outils}</p>
                      </div>

                      <div>
                        <h6 className="font-semibold mb-1 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Fréquence
                        </h6>
                        <p className="pl-5">{etape.frequence}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cycle visual */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          🔄 Cycle continu d'amélioration
        </h4>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Ces 5 étapes forment un cycle qui se répète régulièrement, permettant une adaptation continue
          aux évolutions de l'entreprise et un perfectionnement permanent des compétences.
        </p>
      </div>
    </div>
  )
}