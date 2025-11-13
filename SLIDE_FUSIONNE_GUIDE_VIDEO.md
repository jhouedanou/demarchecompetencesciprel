# Slide Fusionné : Guide et Vidéo

## Instructions de remplacement

Dans `/src/app/page.tsx`, remplacer les slides 4 (GUIDE) et 5 (VIDÉO) par ce nouveau slide fusionné.

## Code du nouveau slide

```tsx
        <SwiperSlide>
          {/* GUIDE ET VIDÉO - Slide 4 - Fusionné */}
        <section className="h-full overflow-y-auto bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50">
          <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-12">

            {/* En-tête */}
            <div className="text-center mb-8">
              <div className="flex justify-center gap-3 mb-4">
                <span className="bg-ciprel-green-100 text-ciprel-green-800 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Guide
                </span>
                <span className="bg-ciprel-orange-100 text-ciprel-orange-800 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center">
                  📹 Vidéo
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
                Ressources et Présentation
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Téléchargez le guide complet et découvrez la démarche en vidéo
              </p>
            </div>

            {/* Contenu en 2 colonnes */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">

              {/* Colonne Gauche: Vidéo */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-ciprel-black mb-4 flex items-center">
                  <span className="bg-ciprel-orange-100 p-2 rounded-lg mr-3">
                    📹
                  </span>
                  Vidéo d'introduction (2 min)
                </h3>

                <div className="relative aspect-video bg-black rounded-xl shadow-lg overflow-hidden mb-4">
                  <iframe
                    src="https://www.youtube.com/embed/ScMzIvxBSi4"
                    title="Vidéo d'introduction - Démarche Compétence CIPREL"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                <p className="text-gray-600 text-sm">
                  Une présentation vidéo pour comprendre rapidement les enjeux et objectifs de notre démarche
                </p>
              </div>

              {/* Colonne Droite: Guide */}
              <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col">
                <h3 className="text-xl font-bold text-ciprel-black mb-4 flex items-center">
                  <span className="bg-ciprel-green-100 p-2 rounded-lg mr-3">
                    <BookOpen className="h-5 w-5 text-ciprel-green-600" />
                  </span>
                  Guide de la Démarche Compétence
                </h3>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      Le guide complet fournit une vue d'ensemble sur :
                    </p>

                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-ciprel-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Le processus de gestion des compétences</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-ciprel-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Les objectifs et bénéfices attendus</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-ciprel-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Le déploiement de la démarche</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-ciprel-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Les outils et ressources disponibles</span>
                      </li>
                    </ul>
                  </div>

                  <a
                    href="/Guide_démarche_compétence.pdf"
                    download
                    className="bg-ciprel-green-600 text-white px-6 py-4 rounded-lg hover:bg-ciprel-green-700 font-bold text-center shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Télécharger le guide (PDF)
                  </a>
                </div>
              </div>
            </div>

            {/* Sommaire en bas */}
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-bold text-ciprel-black mb-4 flex items-center">
                <BookOpen className="h-5 w-5 text-ciprel-orange-600 mr-2" />
                Sommaire du Guide
              </h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div>• Introduction à la démarche</div>
                <div>• Synoptique des étapes</div>
                <div>• Bénéfices pour l'entreprise</div>
                <div>• Facteurs clés de succès</div>
                <div>• Outils d'évaluation</div>
                <div>• Plan de développement</div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={goPrev}
                className="bg-ciprel-orange-600 text-white px-8 py-4 rounded-lg hover:bg-ciprel-orange-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              >
                <ChevronUp className="h-5 w-5 mr-2" />
                Précédent
              </button>
              <button
                type="button"
                onClick={goNext}
                className="bg-ciprel-green-600 text-white px-8 py-4 rounded-lg hover:bg-ciprel-green-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              >
                Suivant
                <ChevronDown className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </section>
        </SwiperSlide>
```

## Changements effectués

1. ✅ Fusionné les slides 4 (Guide) et 5 (Vidéo)
2. ✅ Layout à 2 colonnes côte à côte
3. ✅ Vidéo à gauche, Guide à droite
4. ✅ Sommaire en bas avec points clés
5. ✅ Thème CIPREL respecté (vert et orange)
6. ✅ Navigation conservée

## Avantages

- Design plus compact et efficace
- Utilisateur voit tout sur une même page
- Meilleure utilisation de l'espace
- Navigation plus fluide (6 slides au lieu de 7)
