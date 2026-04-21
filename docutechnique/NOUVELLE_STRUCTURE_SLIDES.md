# Réorganisation des Slides - Démarche Compétence CIPREL

## ✅ Modifications déjà effectuées

1. ✅ **Mise à jour des titres de slides** (`SLIDE_TITLES`)
   - 7 slides au total (au lieu de 10)
   - Nouveaux titres : Présentation, Définitions/concepts, Objectifs, Workshops métiers, Guide et ressources, Vidéo, Quiz

2. ✅ **Ajout de la constante METIERS**
   - 12 métiers avec icônes et couleurs
   - Production, SIDT, Maintenance, QSE-RSE/Sûreté, Contrôle Interne, Stocks, RH/Juridique, Services Généraux, DFC, Projets, Achats & Logistique, Direction

3. ✅ **Bouton sondage fixe global**
   - Positionné en bas à droite (fixed)
   - Visible sur toutes les pages
   - Z-index 50 pour être toujours au-dessus
   - Supprimé l'ancien bouton de la Slide 0

4. ✅ **Mise à jour de `totalSlides = 7`**

## ⏳ Modifications restantes à effectuer

### Structure finale souhaitée :
1. **Slide 0**: Présentation de la démarche compétences ✅
2. **Slide 1**: Définitions, concepts (ancienne "Définition & Concept") ⏳ À adapter
3. **Slide 2**: Objectifs ⏳ À déplacer/adapter
4. **Slide 3**: Workshops métiers ❌ **À CRÉER** avec swiper horizontal
5. **Slide 4**: Guide et ressources ⏳ À créer/fusionner
6. **Slide 5**: Vidéo ⏳ À créer (vidéo intro)
7. **Slide 6**: Quiz ⏳ À adapter

### Actions prioritaires

#### 1. Slide 3: Workshops métiers (À CRÉER) - PRIORITAIRE

**Fonctionnalités requises:**
- Titre en-tête: "La déclinaison de la DC dans nos métiers"
- Swiper horizontal avec les 12 métiers (METIERS constant)
- Chaque carte métier cliquable
- Lien "Afficher le workshop" ouvrant une popup
- **Popup contenant:**
  - Lien vers OneDrive (paramétrable depuis l'admin)
  - Bouton de fermeture
  
**Gestion admin requise:**
- Interface admin pour:
  - Activer/désactiver chaque workshop
  - Définir la date de publication
  - Configurer le lien OneDrive
- Les métiers désactivés apparaissent grisés sur le front

**Code à créer:**
```tsx
<SwiperSlide>
  {/* WORKSHOPS MÉTIERS - Slide 3 */}
  <section className="h-full overflow-y-auto bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50">
    <div className="max-w-7xl mx-auto flex h-full flex-col justify-center px-4 py-16">
      
      {/* En-tête */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-ciprel-black mb-4">
          La déclinaison de la DC dans nos métiers
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Découvrez comment la démarche compétence s'applique à chaque métier de CIPREL
        </p>
      </div>

      {/* Swiper horizontal des métiers */}
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="w-full mb-12"
      >
        {METIERS.map((metier) => (
          <SwiperSlide key={metier.id}>
            <button
              onClick={() => handleMetierClick(metier)}
              className={`relative p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br ${metier.color} text-white h-64 w-full flex flex-col items-center justify-center`}
            >
              <div className="text-6xl mb-4">{metier.icon}</div>
              <h3 className="text-xl font-bold text-center">{metier.nom}</h3>
              <div className="mt-4 bg-white/20 px-4 py-2 rounded-full text-sm">
                Afficher le workshop
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <button onClick={goPrev} className="...">Précédent</button>
        <button onClick={goNext} className="...">Suivant</button>
      </div>
    </div>
  </section>
</SwiperSlide>
```

#### 2. Slide 4: Guide et ressources (À créer)

Fusionner le contenu de :
- L'ancienne slide "Guide complet"
- L'ancienne slide "Ressources"
- Supprimer "Supports téléchargeables"

#### 3. Slide 5: Vidéo (À créer)

Réutiliser le contenu de l'ancienne "Vidéo intro" mais adapter pour être en Slide 5

#### 4. Slide 6: Quiz (À adapter)

Adapter le contenu de l'ancienne slide "Plateforme" et "Quiz & Révision"

### Fonctionnalités admin à développer

1. **Table `workshops` dans Supabase:**
```sql
CREATE TABLE workshops (
  id SERIAL PRIMARY KEY,
  metier_id INT NOT NULL,
  metier_nom VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT false,
  publication_date TIMESTAMP,
  onedrive_link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

2. **Interface admin:**
   - Page `/ciprel-admin/workshops`
   - Liste des 12 métiers
   - Pour chaque métier:
     - Toggle actif/inactif
     - Date picker pour publication
     - Input pour lien OneDrive
     - Bouton "Sauvegarder"

3. **Hook `useWorkshops`:**
```typescript
export const useWorkshops = () => {
  const [workshops, setWorkshops] = useState([])
  
  const getWorkshops = async () => {
    // Fetch from Supabase
  }
  
  const updateWorkshop = async (id, data) => {
    // Update in Supabase
  }
  
  return { workshops, getWorkshops, updateWorkshop }
}
```

## Ordre de développement recommandé

1. ✅ Bouton sondage fixe (FAIT)
2. ⏳ Créer la table `workshops` dans Supabase
3. ⏳ Créer l'interface admin workshops
4. ⏳ Créer la Slide 3 Workshops avec swiper
5. ⏳ Créer la popup workshop avec lien OneDrive
6. ⏳ Fusionner les slides pour créer "Guide et ressources"
7. ⏳ Adapter la slide Vidéo en position 5
8. ⏳ Adapter la slide Quiz en position 6
9. ⏳ Supprimer les anciennes slides inutilisées
10. ⏳ Tester la navigation complète

## Notes importantes

- Le bouton sondage est maintenant global et visible sur toutes les slides
- Les workshops désactivés doivent apparaître grisés (opacity-50 + cursor-not-allowed)
- Le lien OneDrive dans la popup doit s'ouvrir dans un nouvel onglet
- La date de publication contrôle la visibilité du workshop

LE LIEN DE LA PUTAIN DE VIDEO PUBLIC/VIDEO/video1.mp4
