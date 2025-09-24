import { Key, Users, FileText, GraduationCap, MessageSquare, CheckCircle } from 'lucide-react'

export function LeviersContent() {
  const facteurs = [
    {
      title: 'Implication de toutes les parties prenantes',
      description: 'Les managers, collaborateurs, RH - chacun a un rôle important dans toutes les étapes',
      details: [
        'Engagement de la direction',
        'Participation des managers opérationnels',
        'Implication des collaborateurs',
        'Support continu des équipes RH'
      ],
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Formalisation de la démarche compétence',
      description: 'Centraliser, fiabiliser les données et fournir une information qualitative',
      details: [
        'Documentation claire des processus',
        'Référentiels de compétences structurés',
        'Outils d\'évaluation standardisés',
        'Système d\'information dédié'
      ],
      icon: FileText,
      color: 'green'
    },
    {
      title: 'Maîtrise des parties prenantes',
      description: 'Les acteurs doivent utiliser correctement les outils à disposition',
      details: [
        'Formation des managers aux outils',
        'Accompagnement dans l\'utilisation',
        'Support technique et méthodologique',
        'Montée en compétences progressive'
      ],
      icon: GraduationCap,
      color: 'purple'
    },
    {
      title: 'Communication et sensibilisation',
      description: 'Informer sur les objectifs, enjeux et bénéfices de la gestion des compétences',
      details: [
        'Communication sur les objectifs stratégiques',
        'Explication des bénéfices',
        'Transparence sur les processus',
        'Feedback régulier sur les avancées'
      ],
      icon: MessageSquare,
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getTextColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-800',
      green: 'text-green-800',
      purple: 'text-purple-800',
      orange: 'text-orange-800'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">Conditions de réussite</h3>
        <p className="text-purple-800">
          La mise en œuvre réussie repose sur 4 facteurs clés interdépendants.
          Chacun doit être actionné de manière coordonnée pour garantir le succès.
        </p>
      </div>

      {/* Les 4 facteurs */}
      <div className="space-y-6">
        {facteurs.map((facteur, index) => {
          const IconComponent = facteur.icon
          return (
            <div key={index} className={`border rounded-lg p-6 ${getColorClasses(facteur.color)}`}>
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full ${getIconColorClasses(facteur.color)} flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className={`text-xl font-bold mb-3 ${getTextColorClasses(facteur.color)}`}>
                    {index + 1}. {facteur.title}
                  </h4>

                  <p className={`mb-4 ${getTextColorClasses(facteur.color)}`}>
                    {facteur.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {facteur.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          facteur.color === 'blue' ? 'text-blue-500' :
                          facteur.color === 'green' ? 'text-green-500' :
                          facteur.color === 'purple' ? 'text-purple-500' : 'text-orange-500'
                        }`} />
                        <span className={`text-sm ${getTextColorClasses(facteur.color)}`}>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Synthèse */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center flex items-center justify-center">
          <Key className="h-5 w-5 mr-2" />
          Synergie des facteurs clés
        </h4>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-4">
          Ces 4 facteurs fonctionnent en synergie. Le succès dépend de leur activation simultanée
          et de leur maintien dans la durée.
        </p>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-6 w-6 text-blue-600 mb-1" />
              <span className="text-xs font-medium text-gray-700">Implication</span>
            </div>
            <div className="flex flex-col items-center">
              <FileText className="h-6 w-6 text-green-600 mb-1" />
              <span className="text-xs font-medium text-gray-700">Formalisation</span>
            </div>
            <div className="flex flex-col items-center">
              <GraduationCap className="h-6 w-6 text-purple-600 mb-1" />
              <span className="text-xs font-medium text-gray-700">Maîtrise</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageSquare className="h-6 w-6 text-orange-600 mb-1" />
              <span className="text-xs font-medium text-gray-700">Communication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}