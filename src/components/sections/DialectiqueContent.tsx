import { Target, TrendingUp, Users, Lightbulb, CheckCircle } from 'lucide-react'

export function DialectiqueContent() {
  return (
    <div className="space-y-10">
      {/* Définition */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="h-6 w-6 mr-3 text-blue-600" />
          Définition
        </h3>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-6">
          <p className="text-blue-900 leading-relaxed text-lg">
            <strong>"Un processus structuré et continu visant à identifier, évaluer, développer et mobiliser
            l'ensemble des compétences (savoirs, savoir-faire et savoir-être) individuelles et collectives
            nécessaires à l'atteinte des objectifs stratégiques de l'organisation."</strong>
          </p>
        </div>

        {/* Éléments clés */}
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Les éléments clés</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Processus structuré et continu</h5>
                <p className="text-gray-600 text-sm">Ce n'est pas une action ponctuelle, mais une approche systémique et pérenne</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Identification</h5>
                <p className="text-gray-600 text-sm">Définir les compétences critiques pour l'entreprise aujourd'hui et demain</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg mr-4">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Évaluation</h5>
                <p className="text-gray-600 text-sm">Mesurer les compétences actuelles des collaborateurs</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-lg mr-4">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Développement</h5>
                <p className="text-gray-600 text-sm">Actions pour acquérir ou renforcer les compétences</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-lg mr-4">
                <Users className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Mobilisation</h5>
                <p className="text-gray-600 text-sm">Utiliser les bonnes compétences au bon moment</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Compétences individuelles et collectives</h5>
                <p className="text-gray-600 text-sm">Capacités individuelles et synergie d'équipe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bénéfices */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-3 text-green-600" />
          Bénéfices et gains attendus
        </h3>

        <div className="space-y-6">
          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
            <h4 className="text-lg font-semibold text-green-900 mb-3">Adapter l'entreprise aux évolutions</h4>
            <p className="text-green-800 mb-2">
              <strong>Alignement Stratégique :</strong> S'assurer que les compétences disponibles correspondent aux objectifs de l'entreprise
            </p>
            <p className="text-green-700 text-sm">
              Exemple : transformation digitale, nouveaux marchés
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">Optimiser la gestion des talents</h4>
            <ul className="text-blue-800 space-y-2">
              <li><strong>Optimisation des Ressources :</strong> Identifier lacunes et forces</li>
              <li><strong>Développement :</strong> Perspectives d'évolution</li>
              <li><strong>Attractivité :</strong> Séduire nouveaux talents</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
            <h4 className="text-lg font-semibold text-purple-900 mb-3">Développer l'employabilité</h4>
            <p className="text-purple-800">
              Favoriser une culture d'apprentissage continu, stimuler la productivité et l'innovation.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}