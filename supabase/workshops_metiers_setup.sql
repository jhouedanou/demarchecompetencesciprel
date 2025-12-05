-- =====================================================
-- SCRIPT DE CRÉATION ET IMPORT DES WORKSHOPS MÉTIERS
-- Pour Supabase / PostgreSQL
-- Structure basée sur le JSON complet des workshops CIPREL 2025
-- =====================================================

-- =====================================================
-- 1. CONFIGURATION GLOBALE DES WORKSHOPS
-- =====================================================

-- Supprimer les tables si elles existent
DROP TABLE IF EXISTS workshops_metiers CASCADE;
DROP TABLE IF EXISTS workshops_config CASCADE;

-- Table pour la configuration globale (métadonnées, structure commune, valeurs FEERIC)
CREATE TABLE workshops_config (
    id TEXT PRIMARY KEY DEFAULT 'global_config',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    structure_commune JSONB NOT NULL DEFAULT '{}'::jsonb,
    valeurs_feeric JSONB NOT NULL DEFAULT '{}'::jsonb,
    application_web JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table principale pour les workshops métiers
CREATE TABLE workshops_metiers (
    id TEXT PRIMARY KEY,
    titre TEXT NOT NULL,
    fichier TEXT DEFAULT '',
    nombre_slides INTEGER DEFAULT 10,
    type TEXT DEFAULT 'job_focus',
    contenu JSONB NOT NULL DEFAULT '{}'::jsonb,
    icon TEXT DEFAULT '📋',
    color TEXT DEFAULT 'from-gray-500 to-gray-600',
    ordre INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_workshops_metiers_ordre ON workshops_metiers(ordre);
CREATE INDEX idx_workshops_metiers_is_active ON workshops_metiers(is_active);
CREATE INDEX idx_workshops_metiers_type ON workshops_metiers(type);
CREATE INDEX idx_workshops_config_is_active ON workshops_config(is_active);

-- Triggers pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_workshops_metiers_updated_at
    BEFORE UPDATE ON workshops_metiers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_workshops_config_updated_at
    BEFORE UPDATE ON workshops_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 2. INSERTION DE LA CONFIGURATION GLOBALE
-- =====================================================

INSERT INTO workshops_config (id, metadata, structure_commune, valeurs_feeric, application_web)
VALUES (
    'global_config',
    '{
        "organisation": "CIPREL",
        "type": "Démarche Compétence - Workshops Métiers",
        "lieu": "Abidjan",
        "annee": 2025,
        "contexte": "Valorisation des compétences métiers après les valeurs FEERIC"
    }'::jsonb,
    '{
        "sections": [
            {
                "id": 1,
                "titre": "Page de titre",
                "contenu_type": "titre_workshop",
                "elements": ["titre_principal", "sous_titre_metier", "lieu_date"]
            },
            {
                "id": 2,
                "titre": "Sommaire / Introduction",
                "contenu_type": "navigation",
                "elements": ["liste_sections_numerotees"]
            },
            {
                "id": 3,
                "titre": "Introduction",
                "contenu_type": "contexte",
                "elements": ["contexte_demarche_competence", "objectifs_workshop"],
                "objectifs_types": [
                    "Comprendre les métiers et enjeux",
                    "Identifier les compétences clés (techniques, comportementales, organisationnelles)",
                    "Valoriser les métiers et renforcer la reconnaissance interne",
                    "Favoriser les échanges inter-services autour de la performance collective"
                ]
            },
            {
                "id": 4,
                "titre": "Présentation du métier/pôle",
                "contenu_type": "description",
                "elements": ["description_generale", "entites_composantes", "mission_principale", "phrase_cle_metier"]
            },
            {
                "id": 5,
                "titre": "Organisation et Rôles",
                "contenu_type": "organigramme",
                "elements": ["liste_fonctions", "description_role_par_fonction", "hierarchie_implicite"]
            },
            {
                "id": 6,
                "titre": "Référentiel de compétences",
                "contenu_type": "competences",
                "elements": {
                    "savoir": "Connaissances théoriques et techniques",
                    "savoir_faire": "Compétences pratiques et opérationnelles",
                    "savoir_etre": "Qualités comportementales et relationnelles"
                }
            },
            {
                "id": 7,
                "titre": "Interactions et Partenariats",
                "contenu_type": "reseau",
                "elements": {
                    "partenaires_internes": "Services et directions CIPREL",
                    "partenaires_externes": "Fournisseurs, prestataires, autorités"
                }
            },
            {
                "id": 8,
                "titre": "Témoignage",
                "contenu_type": "valorisation",
                "elements": ["citation_fierte", "points_cles_contribution", "phrase_signature"]
            },
            {
                "id": 9,
                "titre": "Conclusion et perspectives",
                "contenu_type": "cloture",
                "elements": [
                    "Diffusion du référentiel complet",
                    "Evaluations et plans de formation",
                    "Capsules vidéo métiers à venir",
                    "Remerciements"
                ]
            },
            {
                "id": 10,
                "titre": "Page de fin",
                "contenu_type": "cloture_visuelle",
                "elements": ["logo", "image_illustration"]
            }
        ]
    }'::jsonb,
    '{
        "F": "Force du collectif",
        "E": "Engagement",
        "E2": "Équité",
        "R": "Respect",
        "I": "Innovation",
        "C": "Convivialité"
    }'::jsonb,
    '{
        "suggestions_composants": {
            "navigation": {
                "type": "sidebar",
                "elements": ["liste_workshops", "recherche", "filtres_par_competence"]
            },
            "slides": {
                "type": "carousel_ou_tabs",
                "interactions": ["navigation_fleches", "miniatures", "progression"]
            },
            "referentiel": {
                "type": "accordeon_ou_cards",
                "sections": ["savoir", "savoir_faire", "savoir_etre"]
            },
            "partenariats": {
                "type": "diagramme_interactif",
                "visualisation": ["organigramme", "reseau", "liste_groupee"]
            },
            "recherche_competences": {
                "type": "filtre_multicriteres",
                "criteres": ["metier", "type_competence", "mot_cle"]
            }
        },
        "fonctionnalites_recommandees": [
            "Quiz interactif après chaque workshop",
            "Capsules vidéo intégrées",
            "Téléchargement PDF du référentiel",
            "Système d''évaluation des compétences",
            "Tableau de bord des formations",
            "Recherche transversale par compétence"
        ]
    }'::jsonb
);

-- =====================================================
-- 3. INSERTION DES WORKSHOPS MÉTIERS
-- =====================================================

-- Workshop 1: Introduction
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_introduction',
    'Workshop Introductif de la Démarche Compétence',
    'Workshop_Introduction__de_marche_compe_tence_-_ok.pptx',
    11,
    'introduction_generale',
    '{
        "sections_specifiques": [
            {
                "titre": "Mot de la Direction Générale",
                "slide": 2
            },
            {
                "titre": "Dialectique de la démarche compétence",
                "slide": 4,
                "contenu": {
                    "definition": "Un processus structuré et continu visant à identifier, évaluer, développer et mobiliser l''ensemble des compétences (savoirs, savoir-faire et savoir-être) individuelles et collectives nécessaires à l''atteinte des objectifs stratégiques de l''organisation.",
                    "elements_cles": [
                        "Processus structuré et continu",
                        "Identification des compétences critiques",
                        "Évaluation des compétences actuelles",
                        "Développement via formation, tutorat, mobilité, projets",
                        "Mobilisation des bonnes compétences au bon moment",
                        "Compétences individuelles et collectives",
                        "Alignement sur les objectifs stratégiques"
                    ],
                    "benefices": [
                        "Adaptation aux évolutions technologiques et économiques",
                        "Alignement stratégique",
                        "Optimisation de la gestion des talents",
                        "Optimisation des ressources",
                        "Développement des collaborateurs",
                        "Attractivité employeur",
                        "Employabilité et engagement",
                        "Performance globale et innovation"
                    ]
                }
            },
            {
                "titre": "Synoptique de la démarche compétence",
                "slide": 7,
                "etapes": [
                    "Identifier les compétences essentielles aujourd''hui et demain",
                    "Évaluer les compétences des collaborateurs par rapport au référentiel",
                    "Identifier les écarts et définir les actions",
                    "Offrir des opportunités de développement",
                    "Mettre en place un suivi et ajustements"
                ]
            },
            {
                "titre": "Synthèse de la démarche compétence",
                "slide": 9,
                "tableau": {
                    "colonnes": ["Initiative", "Rôles et responsabilités", "Outils", "Fréquences"],
                    "lignes": [
                        {
                            "initiative": "Identification des compétences requises",
                            "responsables": ["RH", "Managers"],
                            "outils": ["Fiches métier", "Référentiels de compétences"],
                            "frequence": "Mise à jour en cas de besoin"
                        },
                        {
                            "initiative": "Cartographier et évaluer les compétences acquises",
                            "responsables": ["RH", "Managers"],
                            "outils": ["Evaluation des compétences et des performances"],
                            "frequence": "Annuelle / Trisannuelle"
                        },
                        {
                            "initiative": "Analyser les écarts et définir les besoins",
                            "responsables": ["Managers", "RH"],
                            "outils": ["Evaluation des compétences et des performances", "Picking des évaluations"],
                            "frequence": "Annuelle / Trisannuelle / Ponctuelle"
                        },
                        {
                            "initiative": "Développer les compétences",
                            "responsables": ["RH", "Managers", "Collaborateurs"],
                            "outils": ["Plan de formation", "Coaching", "Mentorat", "Projet"],
                            "frequence": "Tout au long de l''année"
                        },
                        {
                            "initiative": "Evaluer et suivre les évolutions",
                            "responsables": ["RH", "Managers", "Collaborateurs"],
                            "outils": ["Entretien d''évaluation de la performance", "Evaluation des compétences"],
                            "frequence": "Tout au long de l''année"
                        }
                    ]
                }
            },
            {
                "titre": "Leviers et Facteurs clés de succès",
                "slide": 10,
                "facteurs": [
                    "Sponsoring de la DG",
                    "Implication des managers",
                    "Disponibilité des outils",
                    "Implication des collaborateurs"
                ]
            }
        ]
    }'::jsonb,
    '🎓',
    'from-blue-500 to-blue-600',
    1,
    true
);

-- Workshop 2: Production
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_production',
    'Workshop Métier - Production',
    'Workshop_Referentiel_-_Production_-_ok.pptx',
    10,
    'job_focus',
    '{
        "presentation": {
            "description": "La Production est le chef d''orchestre qui s''assure que chaque note est jouée parfaitement et au bon moment.",
            "entites": ["CONDUITE", "CHIMIE"]
        },
        "organisation": {
            "fonctions": [
                {
                    "titre": "Techniciens Conduite",
                    "role": "Opérateurs sur le terrain, veillent sur les machines et appliquent les procédures avec rigueur"
                },
                {
                    "titre": "Conducteurs d''Installation",
                    "role": "Pilotent les installations en surveillant les paramètres d''exploitation depuis la salle de commande"
                },
                {
                    "titre": "Préparateurs Conduite",
                    "role": "Assurent la disponibilité des consommables, outillages et combustibles"
                },
                {
                    "titre": "Appuis Conduite",
                    "role": "Rédigent les rapports, élaborent les gammes de conduite et consignation, préparent les données d''exploitation"
                },
                {
                    "titre": "Coordinateurs Conduite",
                    "role": "Supervisent les équipes et activités de pilotage, gèrent les urgences et imprévus"
                },
                {
                    "titre": "Chimistes",
                    "role": "Production de l''eau déminéralisée, surveillance et contrôle qualité de l''eau et vapeur, normes environnementales"
                },
                {
                    "titre": "Managers",
                    "role": "Pilotent les opérations, organisent le travail, suivent les performances, mettent à jour les procédures"
                }
            ]
        },
        "referentiel": {
            "savoir": ["Procédés de production", "Équipements", "Consignes de sécurité"],
            "savoir_faire": ["Pilotage", "Diagnostic", "Coordination", "Analyse de performance"],
            "savoir_etre": ["Rigueur", "Réactivité", "Vigilance", "Esprit d''équipe", "Respect des règles"]
        },
        "partenariats": {
            "internes": ["Maintenance", "QSE-RSE", "RH", "Projets", "Achats & logistique", "Gestion des stocks", "DFC"],
            "externes": ["Autorités réseau électrique", "Fournisseurs de combustibles"]
        },
        "temoignage": {
            "citation": "Ma fierté, c''est de voir les lumières s''allumer dans les villes de Côte d''Ivoire grâce à notre travail.",
            "signature": "Nos compétences, notre énergie."
        }
    }'::jsonb,
    '⚡',
    'from-yellow-500 to-yellow-600',
    2,
    true
);

-- Workshop 3: SITD
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_sitd',
    'Workshop Métier - Système d''Information et Transformation Digitale (SITD)',
    'Workshop_Referentiel_-_SITD_-_ok.pptx',
    10,
    'job_focus',
    '{
        "presentation": {
            "description": "Deux fonctions principales pour un même engagement"
        },
        "organisation": {
            "fonctions": [
                {
                    "titre": "Responsable SITD",
                    "role": "Définit la stratégie technologique, identifie les solutions innovantes, veille à la cybersécurité, pilote les évolutions des infrastructures, garantit la conformité et maîtrise des risques IT"
                },
                {
                    "titre": "Technicien Informatique",
                    "role": "Support utilisateur quotidien, installation et maintenance des équipements, résolution des incidents, continuité des opérations"
                }
            ]
        },
        "referentiel": {
            "savoir": ["Architecture et systèmes informatiques", "Administration et bases de données", "Méthodes et outils techniques", "Démarche documentaire et projet", "Veille et innovation"],
            "savoir_faire": ["Support et assistance utilisateurs", "Gestion du SI", "Traitement des dysfonctionnements", "Maintenance préventive", "Déploiement des solutions", "Administration serveurs et virtualisation", "Veille technologique", "Pilotage projets informatiques"],
            "savoir_etre": ["Sens de la responsabilité", "Valeurs FEERIC"]
        },
        "partenariats": {
            "internes": ["Maintenance", "QSE-RSE", "RH", "Projets", "Achats & logistique", "Gestion des stocks", "DFC"],
            "externes": ["Autorités réseau", "Prestataires"]
        },
        "temoignage": {
            "citation": "Notre fierté, c''est d''être la colonne vertébrale numérique de l''entreprise, celle qui permet à chaque pôle de fonctionner efficacement, du terrain jusqu''à la direction",
            "signature": "Des systèmes d''information efficaces et sécurisés pour une performance sereine."
        }
    }'::jsonb,
    '💻',
    'from-purple-500 to-purple-600',
    3,
    true
);

-- Workshop 4: Services Généraux
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_services_generaux',
    'Workshop Métier - Services Généraux',
    'Workshop_Referentiel_-_Services_ge_ne_raux-_ok.pptx',
    10,
    'job_focus',
    '{
        "presentation": {
            "mission": [
                "Assurer la disponibilité, la sécurité et la qualité des infrastructures, services et équipements",
                "Garantir un environnement propice au travail, propre, fonctionnel et conforme",
                "Coordonner les services supports clés"
            ]
        },
        "organisation": {
            "fonctions": [
                {
                    "titre": "Technicien Services Généraux",
                    "role": "Interventions de première maintenance, suivi des prestataires, distribution et gestion des consommables, veille au bon fonctionnement"
                },
                {
                    "titre": "Contremaître Services Généraux",
                    "role": "Planifie et contrôle les interventions, élabore les rapports, gère les urgences, garantit l''application des procédures QSE"
                },
                {
                    "titre": "Coordinateur Services Généraux",
                    "role": "Pilote l''ensemble des activités, élabore les budgets, contractualise et supervise les prestataires, plans à moyen terme, amélioration continue"
                }
            ]
        },
        "referentiel": {
            "savoir": ["Logiciel X3 SAGE", "Procédures de gestion de prestataires", "Techniques budgétaires", "Rédaction de cahier de charge", "Reporting et contrôle", "Connaissance des installations"],
            "savoir_faire": ["Pilotage", "Exécution d''interventions techniques", "Planification & coordination", "Suivi des prestataires", "Gestion des urgences", "Analyse des besoins"],
            "savoir_etre": ["Rigueur & sens de l''organisation", "Réactivité & anticipation", "Sens du service et communication", "Esprit d''équipe", "Éthique, transparence, exemplarité"]
        },
        "partenariats": {
            "internes": ["Maintenance", "QSE-RSE", "RH", "Projets", "Achats & logistique", "Gestion des stocks", "DFC"],
            "externes": ["Prestataires techniques", "Entreprises de nettoyage, sécurité, hygiène", "Entreprises de construction et aménagement", "Fournisseurs spécialisés"]
        },
        "temoignage": {
            "points_fierte": [
                "Garantir un environnement de travail sûr, propre et fonctionnel",
                "Gardiens de la continuité",
                "Faciliter la vie de chaque collaborateur"
            ]
        }
    }'::jsonb,
    '🏢',
    'from-slate-500 to-slate-600',
    4,
    true
);

-- Workshop 5: Maintenance
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_maintenance',
    'Workshop Métier - Maintenance',
    'Workshop_Referentiel_de_compe_tences_-Maintenance_-_ok.pptx',
    10,
    'job_focus',
    '{
        "presentation": {
            "description": "La Maintenance : gardienne de la continuité énergétique, garante de la performance durable.",
            "piliers": {
                "maintenance_preventive": {
                    "part": "80%",
                    "activites": ["Inspections régulières", "Contrôles de précision", "Détection précoce des anomalies", "Mise en conformité des équipements"]
                },
                "maintenance_corrective": {
                    "activites": ["Intervention rapide en cas d''alerte", "Diagnostic précis", "Remise en fonctionnement immédiate", "Sécurisation de la production"]
                }
            }
        },
        "organisation": {
            "fonctions": [
                {
                    "titre": "Technicien de Maintenance",
                    "role": "Maîtrise chaque composant, interventions avec rigueur, expertise et précision"
                },
                {
                    "titre": "Contremaître de Maintenance",
                    "role": "Coordonne les équipes, gère les priorités, veille au respect QHSE et sécurité terrain"
                },
                {
                    "titre": "Préparateur Maintenance",
                    "role": "Disponibilité des pièces et consommables, planification des interventions, soutien technique"
                },
                {
                    "titre": "Coordinateur Maintenance (Ingénieurs)",
                    "role": "Planifie les arrêts majeurs, optimise les processus, pilote les performances, résout les problèmes complexes"
                },
                {
                    "titre": "Manager des Activités de Maintenance",
                    "role": "Dirige la stratégie, coordination des activités, supervision des équipes, conformité QHSE, performance globale"
                }
            ]
        },
        "referentiel": {
            "savoir": ["Équipements mécaniques, électriques et d''instrumentation", "Procédures de maintenance préventive et corrective", "Règles de sécurité et standards QHSE"],
            "savoir_faire": ["Diagnostic et dépannage", "Lecture de plans et schémas techniques", "Utilisation d''outils spécialisés", "Planification et exécution d''interventions", "Analyse de performance et optimisation"],
            "savoir_etre": ["Rigueur", "Réactivité", "Esprit d''analyse", "Vigilance", "Travail en équipe", "Sens des priorités", "Discipline", "FEERIC"]
        },
        "partenariats": {
            "internes": ["Production (collaboration 24/7)", "QSE-RSE", "Projets", "Achats & Logistique", "Gestion des stocks", "DFC", "SITD"],
            "externes": ["Fournisseurs d''équipements", "Prestataires techniques spécialisés", "Fabricants de pièces", "Organismes de contrôle", "Experts internationaux"]
        },
        "temoignage": {
            "citation": "Notre plus grande fierté ? Voir la centrale fonctionner sans interruption grâce à notre travail.",
            "signature": "L''équipe de la maintenance gage de fiabilité et de pérennité de notre production d''énergie !"
        }
    }'::jsonb,
    '🔧',
    'from-orange-500 to-orange-600',
    5,
    true
);

-- Workshop 6: Achats & Logistique
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_achats_logistique',
    'Workshop Métier - Achats & Logistique',
    'Workshop_Referentiel_de_compe_tences_-_Achats___logIstique_-_ok.pptx',
    10,
    'job_focus',
    '{
        "presentation": {
            "description": "Achats & Logistique est la passerelle stratégique qui relie les besoins des équipes à la disponibilité réelle des ressources.",
            "axes": ["ACHATS", "LOGISTIQUE & TRANSIT"]
        },
        "organisation": {
            "fonctions": [
                {
                    "titre": "Responsable Achat & Logistique",
                    "role": "Pilote la stratégie d''achat, sécurise la chaîne d''approvisionnement, garantit la conformité, encadre l''équipe, assure l''éthique et la performance"
                },
                {
                    "titre": "Coordonnateur Achat",
                    "role": "Supervise le traitement des besoins, valide la cohérence budgétaire, accompagne les acheteurs, garantit la conformité éthique"
                },
                {
                    "titre": "Acheteurs",
                    "role": "Traitent les besoins, négocient, sélectionnent les fournisseurs, suivent les commandes, évaluent les performances"
                },
                {
                    "titre": "Coordonnateur Logistique & Transit",
                    "role": "Gère les dossiers d''importation, transit international, dédouanement, mise à disposition, contentieux douaniers"
                }
            ]
        },
        "referentiel": {
            "savoir": ["Procédures d''achat, techniques de négociation", "Réglementation douanière et transit international", "Gestion des fournisseurs, contrats et évaluation", "Processus logistiques et chaîne d''approvisionnement", "Exigences ESG & critères de conformité"],
            "savoir_faire": ["Analyser les besoins, lancer les appels d''offres, négocier", "Suivre les commandes et évaluer les fournisseurs", "Gérer les flux logistiques et dossiers import/export", "Assurer la traçabilité et conformité douanière", "Optimiser les processus pour réduire risques et coûts"],
            "savoir_etre": ["Rigueur, intégrité, équité", "Réactivité et sens du service interne", "Esprit d''analyse, pragmatisme", "Communication claire, diplomatie", "Esprit d''équipe et collaboration inter-pôles"]
        },
        "partenariats": {
            "internes": ["Production", "Maintenance", "RH", "Juridique", "QSE-RSE", "Projets", "SITD", "Direction Générale", "DFC"],
            "externes": ["Fournisseurs locaux & internationaux", "Transitaires", "Douanes", "Transporteurs", "Autorités réglementaires", "Banques", "Prestataires spécialisés"]
        },
        "temoignage": {
            "citation": "Notre fierté, c''est simple : lorsqu''une machine redémarre, lorsqu''une turbine tourne, lorsqu''une pièce critique arrive juste à temps… nous savons que nous avons rendu cela possible.",
            "signature": "Nous sommes le maillon qui relie le monde à la centrale."
        }
    }'::jsonb,
    '🚚',
    'from-lime-500 to-lime-600',
    6,
    true
);

-- Workshop 7: Contrôle Interne
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_controle_interne',
    'Workshop Métier - Contrôle Interne',
    'Workshop_Referentiel_de_compe_tences_-_Contro_le_Interne_-_ok.pptx',
    10,
    'job_focus',
    '{
        "presentation": {
            "description": "Le Contrôle Interne, c''est la rigueur qui protège, la transparence qui rassure et la structure qui fait grandir l''entreprise.",
            "missions": [
                "Garantir la fiabilité des processus",
                "Prévenir les risques et renforcer la conformité",
                "Sécuriser la performance collective"
            ]
        },
        "organisation": {
            "fonctions": [
                {
                    "titre": "Directrice Contrôle Interne",
                    "role": "Pilote de la fonction, analyse les processus, identifie les risques, propose les actions correctives, garantit la conformité"
                },
                {
                    "titre": "Auditeur (implicite)",
                    "role": "Mène des audits terrain, vérifie l''application des procédures, détecte les écarts, recommande des améliorations"
                },
                {
                    "titre": "Assistant (implicite)",
                    "role": "Accompagne les équipes, facilite la bonne application des procédures, assure la traçabilité"
                }
            ]
        },
        "referentiel": {
            "savoir": ["Procédures internes", "Normes & conformité", "Cartographie des risques", "Contrôles financiers", "Réglementation"],
            "savoir_faire": ["Analyse des risques", "Audit", "Diagnostic", "Reporting", "Amélioration continue"],
            "savoir_etre": ["Rigueur", "Intégrité", "Objectivité", "Discrétion", "Sens critique"]
        },
        "partenariats": {
            "internes": ["Direction Générale", "Finance et Contrôle de Gestion", "RH", "Achats & Logistique", "SITD", "Production", "Maintenance", "QSE-RSE", "Juridique"],
            "externes": ["Commissaires aux comptes", "Auditeurs externes", "Organismes de contrôle", "Cabinets spécialisés", "Institutionnels"]
        },
        "temoignage": {
            "citation": "Le Contrôle Interne est fier de contribuer à la crédibilité de CIPREL, à son exemplarité, à sa conformité et à sa performance durable."
        }
    }'::jsonb,
    '📊',
    'from-red-500 to-red-600',
    7,
    true
);

-- Workshop 8: DAF
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_daf',
    'Workshop Métier - Direction Administrative et Financière (DAF)',
    'Workshop_Referentiel_de_compe_tences_-_DAF_-_ok.pptx',
    10,
    'job_focus',
    '{
        "presentation": {
            "description": "La direction DAF est le moteur et le compas de CIPREL.",
            "domaines": ["COMPTABILITÉ", "CONTRÔLE DE GESTION", "TRÉSORERIE", "LEADERSHIP"]
        },
        "organisation": {
            "fonctions": [
                {
                    "titre": "La Comptabilité (Adjoint / Comptable)",
                    "role": "Assure la fidélité de l''image financière, traite les opérations comptables et fiscales, consolide les données, prépare les états pour la trésorerie"
                },
                {
                    "titre": "Le Contrôle de Gestion (Responsable / Contrôleur)",
                    "role": "Pilote la performance économique, élabore le budget, suit les écarts, analyse les coûts et rentabilité, fournit les rapports de pilotage stratégique"
                },
                {
                    "titre": "La Trésorerie (Trésorier / Assistant)",
                    "role": "Gère les flux financiers, sécurise les liquidités, optimise les relations bancaires, élabore les prévisions, assure le reporting"
                },
                {
                    "titre": "Leadership financier (Directeur / Responsable)",
                    "role": "Pilotent la stratégie financière globale, maîtrise des risques, optimisation des processus, supervision du SIF, coordination"
                }
            ]
        },
        "referentiel": {
            "savoir": ["Normes comptables, fiscalité", "Outils d''analyse financière", "Élaboration budgétaire", "Procédures internes", "Réglementation bancaire", "Processus financiers", "Reporting", "Gestion des risques"],
            "savoir_faire": ["Traitement et consolidation des données financières", "Élaboration et suivi budgétaire, analyse des écarts", "Gestion des flux financiers et prévisions de trésorerie", "Reporting stratégique et outils d''aide à la décision", "Optimisation et contrôle des processus financiers"],
            "savoir_etre": ["Rigueur", "Intégrité", "Sens de l''analyse", "Réactivité", "Précision", "Organisation", "Confidentialité", "Éthique professionnelle", "Esprit collaboratif", "Communication claire"]
        },
        "partenariats": {
            "internes": ["Production", "Maintenance", "RH", "Juridique", "QSE-RSE", "Achats & Logistique", "Projets", "SITD", "Direction Générale"],
            "externes": ["Banques", "Cabinets comptables et fiscaux", "Auditeurs", "Autorités financières", "Organismes de contrôle", "Fournisseurs", "Prestataires spécialisés"]
        },
        "temoignage": {
            "citation": "La Finance est le partenaire stratégique de tous les pôles de l''entreprise."
        }
    }'::jsonb,
    '💰',
    'from-teal-500 to-teal-600',
    8,
    true
);

-- Workshop 9: Gestion de Stock
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_gestion_stock',
    'Workshop Métier - Gestion de Stock',
    'Workshop_Referentiel_de_compe_tences_-_GESTION_DE_STOCK_-_ok.pptx',
    10,
    'job_focus',
    '{
        "presentation": {
            "description": "La Gestion des Stocks transforme la logistique en service client interne, au service de la Maintenance, des Achats et de la Production.",
            "mission": "Garantir que chaque pièce, consommable et matériel essentiel soit disponible au bon moment, en bonne quantité, et en parfait état"
        },
        "organisation": {
            "fonctions": [
                {
                    "titre": "Coordinateur Gestion des Stocks",
                    "role": "Supervise l''organisation globale du magasin, gère les paramètres de stock, pilote les inventaires, assure la qualité des données"
                },
                {
                    "titre": "Gestionnaires de Stock",
                    "role": "Assurent les mouvements physiques (réception, rangement, préparation, distribution), effectuent les contrôles qualité, réalisent les inventaires"
                }
            ]
        },
        "referentiel": {
            "savoir": ["Stock & approvisionnement", "Produits techniques", "Sécurité & conservation"],
            "savoir_faire": ["Réception & contrôle", "Inventaire", "Saisie & suivi des données", "Analyse des mouvements", "Mise à jour des seuils", "Rédaction de rapports"],
            "savoir_etre": ["Rigueur", "Organisation", "Fiabilité", "FEERIC"]
        },
        "partenariats": {
            "internes": ["Maintenance (priorité absolue)", "Achats & Logistique", "Conduite", "Projets", "Finance & Comptabilité"],
            "externes": ["Fournisseurs nationaux & internationaux", "Transitaires / transporteurs", "Prestataires spécialisés stock & logistique"]
        },
        "temoignage": {
            "citation": "Assurer en silence la continuité des opérations de la centrale. Savoir qu''aucune turbine ne s''arrête faute de pièces..."
        }
    }'::jsonb,
    '📦',
    'from-amber-500 to-amber-600',
    9,
    true
);

-- Workshop 10: Projets
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_projets',
    'Workshop Métier - Projets',
    'Workshop_Referentiel_de_compe_tences_-_Projet_-_ok.pptx',
    10,
    'job_focus',
    '{
        "presentation": {
            "description": "Le pôle Projets est le chef d''orchestre qui transforme la vision stratégique en réalisations tangibles, fiables et durables.",
            "mission": "Planifier, piloter et livrer les projets structurants indispensables à la modernisation, à l''innovation et à la performance énergétique"
        },
        "organisation": {
            "fonctions": [
                {
                    "titre": "Directeur Développement",
                    "role": "Pilote la feuille de route d''investissements, structure les méthodes et outils, supervise les équipes, garantit le respect des engagements QHSE"
                },
                {
                    "titre": "Superviseur Projets",
                    "role": "Contrôle l''avancement physique et technique, assure le respect des normes QHSE, identifie les risques, coordonne prestataires et équipes"
                },
                {
                    "titre": "Assistante Projets",
                    "role": "Prépare les dossiers, plannings et reportings, met à jour la documentation technique, coordonne les flux d''information"
                },
                {
                    "titre": "Secrétaire Projets",
                    "role": "Gestion des courriers, procès-verbaux, comptes rendus, organisation des réunions, archivage conforme"
                }
            ]
        },
        "referentiel": {
            "savoir": ["Gestion de projets", "Normes QHSE", "Réglementation", "Équipements et infrastructures", "Méthodes d''audit", "Outils de planification"],
            "savoir_faire": ["Planification", "Pilotage", "Coordination", "Gestion documentaire", "Gestion des risques", "Suivi technique", "Analyse de performance"],
            "savoir_etre": ["Rigueur", "Organisation", "Anticipation", "Vigilance", "Esprit d''équipe", "Communication claire", "Responsabilité"]
        },
        "partenariats": {
            "internes": ["Production", "Maintenance", "QSE-RSE", "RH", "SITD", "Achats & Logistique", "Finance & Contrôle de Gestion", "Sûreté", "Communication", "Juridique", "Direction Générale"],
            "externes": ["Bureaux d''études", "Cabinets d''ingénierie", "Prestataires techniques", "Fournisseurs d''équipements", "Organismes de contrôle", "Autorités réglementaires", "Communautés locales"]
        },
        "temoignage": {
            "points_impact": [
                "Préparer l''avenir énergétique en intégrant les innovations technologiques",
                "Faire évoluer l''infrastructure de production de manière responsable",
                "Garantir que les investissements servent à la performance durable",
                "Intégrer les critères ESG dans chaque étape",
                "Protéger la réputation et la pérennité de l''entreprise"
            ]
        }
    }'::jsonb,
    '🎯',
    'from-cyan-500 to-cyan-600',
    10,
    true
);

-- Workshop 11: QSE-RSE & Sûreté
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_qse_rse_surete',
    'Workshop Métier - QSE-RSE & Sûreté',
    'Workshop_Referentiel_de_compe_tences_-_QSE_RSE___SURETE_-_ok.pptx',
    10,
    'job_focus',
    '{
        "presentation": {
            "description": "QSE est le gardien de la sécurité et conformité. RSE est le moteur de l''impact positif. La sûreté est la forteresse qui protège nos opérations.",
            "piliers": ["QSE–RSE : Leadership et pilotage stratégique", "Ingénierie QSE : Prévention des risques", "Ingénierie RSE : Durabilité & ancrage sociétal", "Sûreté : Protection du site et du personnel"]
        },
        "organisation": {
            "fonctions": [
                {
                    "titre": "Responsable QSE–RSE",
                    "role": "Pilote le système de management intégré QSE et la démarche RSE, coordonne les activités, veille au respect des engagements"
                },
                {
                    "titre": "Ingénieur QSE",
                    "role": "Met en œuvre les exigences du management QSE, assure la conformité réglementaire, pilote les audits, identifie les impacts environnementaux"
                },
                {
                    "titre": "Coordinateur HSE",
                    "role": "Veille à l''application quotidienne des consignes de sécurité, prévient les risques, accompagne les équipes techniques"
                },
                {
                    "titre": "Ingénieur RSE",
                    "role": "Conçoit et pilote les actions RSE, intègre les critères ESG, mobilise les partenaires pour des solutions innovantes"
                },
                {
                    "titre": "Coordinateur Projet Développement Durable",
                    "role": "Mise en œuvre des projets RSE, anime le dialogue avec les parties prenantes, renforce la cohésion"
                },
                {
                    "titre": "Responsable Sûreté",
                    "role": "Protège les personnes et infrastructures, anticipe les menaces, coordonne les dispositifs de sûreté"
                }
            ]
        },
        "referentiel": {
            "savoir": ["Normes QSE", "Exigences ISO", "Réglementation sécurité", "Réglementation environnementale", "Risques industriels", "Plans d''urgence", "Procédures HSE", "Audits et conformité"],
            "savoir_faire": ["Analyse des risques", "Prévention HSE", "Pilotage du système QSE", "Audits", "Inspections", "Reporting", "Coordination terrain", "Gestion documentaire", "Sensibilisation des équipes"],
            "savoir_etre": ["Vigilance", "Rigueur", "Courage d''alerter", "Sens de la responsabilité", "Esprit d''équipe", "Communication claire", "Éthique", "Discipline", "Exemplarité"]
        },
        "partenariats": {
            "internes": ["Production", "Maintenance", "RH", "Projets", "SITD", "Achats & Logistique", "Contrôle de Gestion", "Direction Générale", "Communication", "Juridique", "Partenaires sociaux"],
            "externes": ["Organismes de contrôle", "Autorités de régulation", "Cabinets d''audit", "Prestataires HSE", "ONG locales", "Collectivités", "Fournisseurs d''équipements de sécurité"]
        },
        "temoignage": {
            "citation": "Notre plus grande fierté est de garantir que chaque collaborateur rentre chez lui en toute sécurité tous les jours."
        }
    }'::jsonb,
    '🛡️',
    'from-green-500 to-green-600',
    11,
    true
);

-- Workshop 12: RH & Juridique
INSERT INTO workshops_metiers (id, titre, fichier, nombre_slides, type, contenu, icon, color, ordre, is_active)
VALUES (
    'workshop_rh_juridique',
    'Workshop Référentiel - RH et Juridique',
    'Workshop_Referentiel_de_compe_tences_-_RH___Juridique_-_ok.pptx',
    14,
    'job_focus',
    '{
        "presentation": {
            "rh": {
                "description": "Chez CIPREL, l''Humain n''est pas une ressource. C''est notre raison d''avancer.",
                "piliers": [
                    {
                        "titre": "Développement RH – Préparer l''avenir",
                        "activites": ["Attirer, intégrer, développer et fidéliser les talents", "Construire les parcours professionnels", "Évaluer et analyser", "Concevoir et déployer les outils RH"]
                    },
                    {
                        "titre": "Administration RH – Garantir la conformité",
                        "activites": ["Gérer l''embauche, les contrats et l''intégration", "Constituer et sécuriser les dossiers du personnel", "Garantir la paie", "Assurer la veille réglementaire"]
                    }
                ]
            },
            "juridique": {
                "description": "Nous transformons les règles en sécurité, et la conformité en performance durable.",
                "missions": ["Sécurisation des engagements contractuels", "Gestion des données personnelles", "Prévention des risques juridiques", "Veille réglementaire", "Soutien juridique interne"]
            }
        },
        "organisation": {
            "fonctions_rh": [
                {
                    "titre": "Chargé développement RH",
                    "role": "Accompagne la croissance humaine, recrute, pilote le plan de formation, analyse les évaluations, développe les parcours professionnels"
                },
                {
                    "titre": "Responsable administration RH",
                    "role": "Assure la stabilité, conformité et gestion quotidienne du cycle de vie du collaborateur"
                }
            ],
            "fonctions_juridique": [
                {
                    "titre": "Assistant juridique",
                    "role": "Sécurise les engagements, élabore et suit les contrats, pilote la mise en conformité DCP, prépare les dossiers de contentieux, veille réglementaire"
                }
            ]
        },
        "referentiel": {
            "rh": {
                "savoir": ["Droit du travail, réglementation sociale", "Techniques de recrutement, formation, évaluation", "Gestion administrative et outils RH", "Connaissance des métiers et processus CIPREL"],
                "savoir_faire": ["Recruter et accompagner l''intégration", "Piloter le plan de formation et les évaluations", "Développer les parcours professionnels", "Concevoir les outils RH", "Gérer les contrats, dossiers, paie"],
                "savoir_etre": ["Confidentialité, intégrité, équité", "Écoute, diplomatie, communication claire", "Rigueur, organisation, sens du service", "Esprit d''équipe et adaptabilité"]
            },
            "juridique": {
                "savoir": ["Droit des contrats", "Textes légaux nationaux", "Législation sur les Données à Caractère Personnel", "Processus contractuels internes", "Procédures de contentieux"],
                "savoir_faire": ["Rédaction et révision contractuelle", "Analyse légale et évaluation des risques", "Mise en conformité DCP", "Tenue de registre de traitement", "Préparation de dossiers de contentieux", "Communication juridique"],
                "savoir_etre": ["Rigueur et sens du détail", "Confidentialité absolue", "Analyse critique", "Vigilance réglementaire", "Sens du service interne", "Intégrité & éthique", "Organisation & méthode"]
            }
        },
        "partenariats": {
            "rh": {
                "internes": ["Direction Générale", "Tous les départements", "Managers & collaborateurs"],
                "externes": ["Cabinets spécialisés", "Organismes de formation", "Institutionnels (CNPS, Inspection du Travail)", "Partenaires légaux"]
            },
            "juridique": {
                "internes": ["Direction Générale", "Tous les départements métiers", "RH", "QSE/RSE", "SITD", "Finance & achats"],
                "externes": ["Cabinets d''avocats", "Autorités administratives", "Institutions de régulation", "Prestataires", "Organismes de protection des données"]
            }
        },
        "temoignage": {
            "rh": [
                "Nous faisons grandir l''Humain, en révélant les talents",
                "Nous créons un environnement de confiance",
                "Nous sommes les artisans de la cohésion"
            ],
            "juridique": [
                "Nous protégeons CIPREL",
                "Nous transformons la loi en stratégie",
                "Nous portons l''éthique et la transparence"
            ]
        }
    }'::jsonb,
    '⚖️',
    'from-indigo-500 to-indigo-600',
    12,
    true
);

-- =====================================================
-- 4. ACTIVATION DES POLITIQUES RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur les tables
ALTER TABLE workshops_metiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops_config ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des workshops actifs
CREATE POLICY "workshops_metiers_select_public" ON workshops_metiers
    FOR SELECT
    USING (is_active = true);

-- Politique pour permettre aux admins authentifiés de voir tous les workshops
CREATE POLICY "workshops_metiers_select_admin" ON workshops_metiers
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Politique pour permettre l'insertion/modification aux admins authentifiés
CREATE POLICY "workshops_metiers_all_admin" ON workshops_metiers
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Politique pour permettre la lecture publique de la configuration
CREATE POLICY "workshops_config_select_public" ON workshops_config
    FOR SELECT
    USING (true);

-- Politique pour permettre l'insertion/modification de la config aux admins
CREATE POLICY "workshops_config_all_admin" ON workshops_config
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- 5. VÉRIFICATION
-- =====================================================

-- Vérifier la configuration globale
SELECT id,
       metadata->>'organisation' as organisation,
       metadata->>'annee' as annee,
       is_active
FROM workshops_config;

-- Vérifier que tous les workshops ont été insérés
SELECT id,
       titre,
       type,
       nombre_slides,
       icon,
       ordre,
       is_active
FROM workshops_metiers
ORDER BY ordre;

-- Compter les workshops par type
SELECT type, COUNT(*) as nombre
FROM workshops_metiers
GROUP BY type
ORDER BY type;

-- Afficher un aperçu du contenu d'un workshop
SELECT id,
       titre,
       jsonb_pretty(contenu) as contenu_formate
FROM workshops_metiers
WHERE id = 'workshop_introduction'
LIMIT 1;
