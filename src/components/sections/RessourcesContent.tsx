import { Download, FileText, HelpCircle, BookOpen, Phone, Mail, MapPin, Clock } from 'lucide-react'

export function RessourcesContent() {
  const documents = [
    {
      title: 'Guide complet de la démarche compétence',
      description: 'Document PDF exhaustif présentant tous les aspects de la démarche compétence chez CIPREL',
      type: 'PDF',
      size: '2.4 MB',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Sondage d\'opinion',
      description: 'Document téléchargeable pour le sondage d\'opinion sur la démarche compétence',
      type: 'PDF',
      size: '450 KB',
      icon: HelpCircle,
      color: 'green'
    },
    {
      title: 'Quiz de la phase introductive',
      description: 'Questions et réponses du quiz d\'introduction à la démarche compétence',
      type: 'PDF',
      size: '320 KB',
      icon: BookOpen,
      color: 'purple'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      green: 'bg-green-50 border-green-200 hover:border-green-300',
      purple: 'bg-purple-50 border-purple-200 hover:border-purple-300'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-orange-900 mb-2">Documentation complète</h3>
        <p className="text-orange-800">
          Retrouvez ici l'ensemble des documents de référence pour approfondir votre compréhension
          de la démarche compétence CIPREL. Ces ressources sont disponibles en téléchargement libre.
        </p>
      </div>

      {/* Documents list */}
      <div className="space-y-6">
        <h4 className="text-2xl font-bold text-gray-900">Documents disponibles</h4>

        {documents.map((document, index) => {
          const IconComponent = document.icon
          return (
            <div
              key={index}
              className={`border rounded-lg p-6 transition-all duration-200 ${getColorClasses(document.color)}`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full ${getIconColorClasses(document.color)} flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">{document.title}</h5>
                  <p className="text-gray-600 mb-4">{document.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                        {document.type}
                      </span>
                      <span>{document.size}</span>
                    </div>

                    <button
                      onClick={() => alert('Téléchargement à implémenter')}
                      className="inline-flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Contact and support */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Contact et support
        </h4>

        <p className="text-gray-600 mb-6">
          Pour toute question concernant la démarche compétence ou pour obtenir de l'aide sur l'utilisation
          des ressources, contactez l'équipe RH responsable du projet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-blue-600" />
              Email de contact
            </h5>
            <p className="text-gray-600 text-sm">
              rh-competences@ciprel.ci
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Phone className="h-4 w-4 mr-2 text-green-600" />
              Téléphone
            </h5>
            <p className="text-gray-600 text-sm">
              +225 XX XX XX XX
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-red-600" />
              Adresse
            </h5>
            <p className="text-gray-600 text-sm">
              Direction des Ressources Humaines<br />
              CIPREL - Abidjan, Côte d'Ivoire
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-purple-600" />
              Horaires de support
            </h5>
            <p className="text-gray-600 text-sm">
              Lundi - Vendredi<br />
              08h00 - 17h00
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}