import { CheckCircle, ArrowRight, Download } from 'lucide-react'

export function IntroductionContent() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div>
        <h3 className="text-2xl font-semibold text-ciprel-green-700 mb-4">
          Bienvenue dans la démarche compétence CIPREL
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          La Démarche Compétence est une approche stratégique qui place le développement
          des compétences au cœur de la performance et de l'évolution professionnelle.
          Chez CIPREL, cette démarche vise à :
        </p>
        <ul className="space-y-2 text-gray-700 mb-6">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-ciprel-green-600 mr-3 mt-1 flex-shrink-0" />
            <span>Identifier et valoriser les compétences de chaque collaborateur</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-ciprel-green-600 mr-3 mt-1 flex-shrink-0" />
            <span>Accompagner le développement professionnel continu</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-ciprel-green-600 mr-3 mt-1 flex-shrink-0" />
            <span>Aligner les compétences avec les objectifs stratégiques de l'entreprise</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-ciprel-green-600 mr-3 mt-1 flex-shrink-0" />
            <span>Favoriser la mobilité interne et l'évolution de carrière</span>
          </li>
        </ul>
      </div>

      {/* Guide Highlight Section */}
      <div className="bg-gradient-to-br from-ciprel-orange-50 to-ciprel-green-50 rounded-xl p-6 border-2 border-ciprel-orange-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 bg-white rounded-lg shadow-md">
              <Download className="h-10 w-10 text-ciprel-orange-600" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Le Guide de la Démarche Compétence
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ce guide constitue votre référentiel complet pour comprendre et mettre en œuvre
              la démarche compétence au sein de CIPREL. Il présente :
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-ciprel-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Les principes fondamentaux de la gestion par compétences</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-ciprel-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Les outils et méthodologies d'évaluation</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-ciprel-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Les processus de développement des compétences</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-ciprel-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Les parcours d'évolution professionnelle</span>
              </li>
            </ul>
            <a
              href="/Guide_démarche_compétence.pdf"
              download
              className="inline-flex items-center gap-2 bg-ciprel-orange-600 text-white px-6 py-3 rounded-lg hover:bg-ciprel-orange-700 transition-colors shadow-md hover:shadow-lg font-semibold"
            >
              <Download className="h-5 w-5" />
              Télécharger le guide complet
            </a>
          </div>
        </div>
      </div>

      {/* Key Concepts */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Concepts clés
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-ciprel-green-50 rounded-lg p-6 border border-ciprel-green-200">
            <h4 className="font-semibold text-lg text-ciprel-green-700 mb-3">
              Qu'est-ce qu'une compétence ?
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Une compétence est la combinaison de savoirs (connaissances), savoir-faire
              (pratiques) et savoir-être (comportements) mis en œuvre dans une situation
              professionnelle donnée.
            </p>
          </div>
          <div className="bg-ciprel-orange-50 rounded-lg p-6 border border-ciprel-orange-200">
            <h4 className="font-semibold text-lg text-ciprel-orange-700 mb-3">
              Objectifs de la démarche
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Créer une culture d'apprentissage continu, faciliter l'adaptation aux
              changements, et garantir l'excellence opérationnelle par le développement
              des talents.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps Preview */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h4 className="font-semibold text-lg text-gray-900 mb-3">
          Dans les prochaines sections
        </h4>
        <p className="text-gray-700 text-sm mb-4">
          Vous découvrirez en détail les différentes dimensions de la démarche compétence :
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• L'approche dialectique : comprendre les interactions entre compétences</li>
          <li>• La vision synoptique : avoir une vue d'ensemble du système</li>
          <li>• Les leviers d'action : les outils pour développer les compétences</li>
          <li>• Les ressources disponibles : supports et accompagnement</li>
        </ul>
      </div>
    </div>
  )
}
