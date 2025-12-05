-- =====================================================
-- SCRIPT DE CRÉATION ET IMPORT DES WORKSHOPS MÉTIERS V2
-- Structure avec colonnes séparées pour faciliter l'édition
-- Pour Supabase / PostgreSQL
-- =====================================================

-- Supprimer la table si elle existe (attention en production !)
DROP TABLE IF EXISTS workshops_metiers CASCADE;

-- Créer la table workshops_metiers avec colonnes séparées
CREATE TABLE workshops_metiers (
    id TEXT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    departement VARCHAR(255) NOT NULL,
    type TEXT NOT NULL DEFAULT 'job_focus', -- 'strategic' ou 'job_focus'
    video TEXT DEFAULT '',
    icon TEXT DEFAULT '📋',
    color TEXT DEFAULT 'from-gray-500 to-gray-600',
    ordre INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Introduction
    intro_objectifs TEXT[] DEFAULT '{}',
    intro_mission TEXT DEFAULT '',
    
    -- Présentation métier
    presentation_definition TEXT DEFAULT '',
    presentation_piliers TEXT[] DEFAULT '{}',
    
    -- Rôles (stocké en JSONB car structure complexe)
    roles JSONB DEFAULT '[]',
    
    -- Compétences
    competences_savoirs TEXT[] DEFAULT '{}',
    competences_savoir_faire TEXT[] DEFAULT '{}',
    competences_savoir_etre TEXT[] DEFAULT '{}',
    
    -- Interactions
    interactions_internes TEXT[] DEFAULT '{}',
    interactions_externes TEXT[] DEFAULT '{}',
    
    -- Témoignage
    temoignage TEXT DEFAULT '',
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_workshops_metiers_ordre ON workshops_metiers(ordre);
CREATE INDEX idx_workshops_metiers_is_active ON workshops_metiers(is_active);
CREATE INDEX idx_workshops_metiers_type ON workshops_metiers(type);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_workshops_metiers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_workshops_metiers_updated_at
    BEFORE UPDATE ON workshops_metiers
    FOR EACH ROW
    EXECUTE FUNCTION update_workshops_metiers_updated_at();

-- =====================================================
-- INSERTION DES DONNÉES
-- =====================================================

-- 1. RH & Juridique
INSERT INTO workshops_metiers (
    id, titre, departement, type, video, icon, color, ordre, is_active,
    intro_objectifs, intro_mission,
    presentation_definition, presentation_piliers,
    roles,
    competences_savoirs, competences_savoir_faire, competences_savoir_etre,
    interactions_internes, interactions_externes,
    temoignage
) VALUES (
    'rh-juridique',
    'Workshop Métier RH & Juridique',
    'Ressources Humaines et Juridique',
    'job_focus',
    '',
    '⚖️',
    'from-indigo-500 to-indigo-600',
    1,
    true,
    ARRAY['Comprendre le métier des RH et Juridique', 'Identifier les compétences clés techniques, comportementales et organisationnelles', 'Valoriser le métier et renforcer la reconnaissance interne', 'Favoriser les échanges inter-services'],
    '',
    'L''Humain n''est pas une ressource, c''est notre raison d''avancer. Le Juridique transforme les règles en sécurité et la conformité en performance durable.',
    ARRAY['Développement RH (Préparer l''avenir)', 'Administration RH (Garantir la conformité)', 'Sécurisation des engagements contractuels', 'Protection des données et prévention des risques'],
    '[{"poste": "Chargé développement RH", "mission": "Recrute les talents, pilote la formation, développe les parcours professionnels et anticipe les besoins en compétences."}, {"poste": "Responsable administration RH", "mission": "Gère le cycle de vie du collaborateur (contrats, paie, intégration), assure la veille sociale et la conformité."}, {"poste": "Assistant juridique", "mission": "Sécurise les contrats, pilote la conformité des Données à Caractère Personnel (DCP), gère le contentieux et assure la veille réglementaire."}]'::jsonb,
    ARRAY['Droit du travail et réglementation sociale', 'Droit des contrats et législation commerciale', 'Législation sur les Données à Caractère Personnel (DCP)', 'Techniques de recrutement et d''évaluation', 'Processus CIPREL'],
    ARRAY['Recruter et intégrer les talents', 'Piloter le plan de formation', 'Rédaction et révision contractuelle', 'Analyse légale et évaluation des risques', 'Gestion de la paie et administration du personnel', 'Préparation des dossiers de contentieux'],
    ARRAY['Confidentialité absolue et intégrité', 'Écoute et diplomatie', 'Rigueur et sens du détail', 'Analyse critique', 'Vigilance réglementaire'],
    ARRAY['Direction Générale', 'Tous les départements (support, conseil, recrutement)', 'Managers et collaborateurs'],
    ARRAY['Cabinets d''avocats et experts juridiques', 'Institutionnels (CNPS, Inspection du Travail)', 'Organismes de formation et cabinets de recrutement', 'Autorités de régulation'],
    'Nous faisons grandir l''Humain... Nous protégeons CIPREL en garantissant la conformité, l''intégrité et la sécurité juridique.'
);

-- 2. QSE-RSE & Sûreté
INSERT INTO workshops_metiers (
    id, titre, departement, type, video, icon, color, ordre, is_active,
    intro_objectifs, intro_mission,
    presentation_definition, presentation_piliers,
    roles,
    competences_savoirs, competences_savoir_faire, competences_savoir_etre,
    interactions_internes, interactions_externes,
    temoignage
) VALUES (
    'qse-rse-surete',
    'Workshop Métier QSE-RSE & Sûreté',
    'QSE-RSE & Sûreté',
    'job_focus',
    '',
    '🛡️',
    'from-green-500 to-green-600',
    2,
    true,
    ARRAY['Comprendre les enjeux stratégiques QSE-RSE & Sûreté', 'Identifier les compétences techniques et réglementaires', 'Favoriser la culture sécurité et la performance durable'],
    '',
    'Veille à ce que chaque personne, installation et processus contribue à une énergie fiable, durable et sécurisée.',
    ARRAY['QSE (Gardien de la sécurité et conformité)', 'RSE (Moteur de l''impact positif)', 'Sûreté (Forteresse protégeant les opérations)'],
    '[{"poste": "Responsable QSE–RSE", "mission": "Pilote le système de management intégré et la démarche RSE, coordonne les activités et garantit les engagements."}, {"poste": "Ingénieur QSE", "mission": "Met en œuvre les exigences, assure la conformité réglementaire, pilote les audits et prévient les risques SST."}, {"poste": "Coordinateur HSE", "mission": "Acteur terrain, veille à l''application des consignes, accompagne les équipes techniques."}, {"poste": "Ingénieur RSE / Chef de projet DD", "mission": "Pilote les actions RSE, intègre les critères ESG, anime le dialogue avec les parties prenantes."}, {"poste": "Responsable Sûreté", "mission": "Protège les personnes et infrastructures, anticipe les menaces et garantit la continuité."}]'::jsonb,
    ARRAY['Normes QSE (ISO) et exigences réglementaires', 'Risques industriels et plans d''urgence', 'Réglementation environnementale et sécurité', 'Procédures HSE'],
    ARRAY['Analyse des risques et prévention', 'Pilotage du système QSE et audits', 'Coordination terrain et inspections', 'Reporting et gestion documentaire'],
    ARRAY['Vigilance et rigueur', 'Courage d''alerter', 'Exemplarité comportementale', 'Éthique et sens de la responsabilité'],
    ARRAY['Production', 'Maintenance', 'RH', 'Projets', 'Achats & Logistique', 'Direction Générale'],
    ARRAY['Organismes de contrôle et régulation', 'Cabinets d''audit', 'ONG et collectivités locales', 'Prestataires sécurité'],
    'Notre plus grande fierté est de garantir que chaque collaborateur rentre chez lui en toute sécurité tous les jours.'
);

-- 3. Projets
INSERT INTO workshops_metiers (
    id, titre, departement, type, video, icon, color, ordre, is_active,
    intro_objectifs, intro_mission,
    presentation_definition, presentation_piliers,
    roles,
    competences_savoirs, competences_savoir_faire, competences_savoir_etre,
    interactions_internes, interactions_externes,
    temoignage
) VALUES (
    'projets',
    'Workshop Métier Projets',
    'Projets',
    'job_focus',
    '',
    '🎯',
    'from-cyan-500 to-cyan-600',
    3,
    true,
    ARRAY['Mieux comprendre le métier Projets et ses enjeux stratégiques', 'Identifier les compétences de réussite des projets structurants', 'Valoriser ce métier pivot de la transformation'],
    '',
    'Chef d''orchestre qui transforme la vision stratégique en réalisations tangibles. Moteur de la modernisation et de l''innovation.',
    ARRAY['Planification', 'Pilotage', 'Livraison de projets structurants'],
    '[{"poste": "Directeur Développement", "mission": "Stratège, pilote la feuille de route d''investissements, structure les méthodes et supervise les équipes."}, {"poste": "Superviseur Projets", "mission": "Contrôle l''avancement physique et technique, assure le respect QHSE et coordonne les prestataires."}, {"poste": "Assistante Projets", "mission": "Prépare les dossiers, plannings, reportings et assure la traçabilité documentaire."}, {"poste": "Secrétaire Projets", "mission": "Gestion administrative, courriers, PV de réunions et archivage."}]'::jsonb,
    ARRAY['Gestion de projets et outils de planification', 'Normes QHSE et réglementation', 'Connaissance équipements et infrastructures', 'Méthodes d''audit'],
    ARRAY['Planification et pilotage de projets', 'Gestion des risques et suivi technique', 'Gestion documentaire et reporting', 'Coordination des prestataires'],
    ARRAY['Rigueur et organisation', 'Anticipation', 'Esprit d''équipe', 'Communication claire'],
    ARRAY['Production', 'Maintenance', 'QSE-RSE', 'Achats & Logistique', 'Finance', 'Direction Générale'],
    ARRAY['Bureaux d''études et ingénierie', 'Prestataires techniques', 'Fournisseurs d''équipements', 'Autorités réglementaires'],
    'Nous construisons l''avenir de CIPREL, projet après projet. Chaque réalisation est une pierre de plus à l''édifice.'
);

-- 4. Achats & Logistique
INSERT INTO workshops_metiers (
    id, titre, departement, type, video, icon, color, ordre, is_active,
    intro_objectifs, intro_mission,
    presentation_definition, presentation_piliers,
    roles,
    competences_savoirs, competences_savoir_faire, competences_savoir_etre,
    interactions_internes, interactions_externes,
    temoignage
) VALUES (
    'achats-logistique',
    'Workshop Métier Achats & Logistique',
    'Achats & Logistique',
    'job_focus',
    '',
    '📦',
    'from-amber-500 to-amber-600',
    4,
    true,
    ARRAY['Comprendre les enjeux stratégiques des achats et logistique', 'Identifier les compétences clés de la supply chain', 'Valoriser le rôle d''optimisation des ressources'],
    '',
    'Maillon essentiel qui garantit la disponibilité des ressources au bon moment, au bon endroit et au meilleur coût.',
    ARRAY['Achats (Sourcing et négociation)', 'Approvisionnement (Flux et stocks)', 'Logistique (Distribution et transport)'],
    '[{"poste": "Responsable Achats", "mission": "Pilote la stratégie achats, négocie les contrats cadres, optimise les coûts et sécurise les approvisionnements."}, {"poste": "Acheteur", "mission": "Gère les commandes, compare les offres, suit les livraisons et entretient les relations fournisseurs."}, {"poste": "Gestionnaire de stocks", "mission": "Optimise les niveaux de stock, anticipe les besoins et minimise les ruptures."}, {"poste": "Responsable Logistique", "mission": "Coordonne les flux entrants et sortants, optimise le transport et la manutention."}]'::jsonb,
    ARRAY['Techniques d''achats et négociation', 'Gestion des stocks et approvisionnements', 'Logistique et transport', 'Réglementation douanière', 'Outils ERP (SAP, X3)'],
    ARRAY['Négociation et gestion fournisseurs', 'Optimisation des coûts', 'Planification des approvisionnements', 'Gestion des flux logistiques'],
    ARRAY['Rigueur et organisation', 'Sens de la négociation', 'Réactivité', 'Éthique et transparence'],
    ARRAY['Production', 'Maintenance', 'Projets', 'Finance', 'QSE-RSE'],
    ARRAY['Fournisseurs', 'Transporteurs', 'Transitaires', 'Douanes'],
    'Nous sommes les garants de la continuité opérationnelle. Sans nous, pas de production possible.'
);

-- 5. Finance
INSERT INTO workshops_metiers (
    id, titre, departement, type, video, icon, color, ordre, is_active,
    intro_objectifs, intro_mission,
    presentation_definition, presentation_piliers,
    roles,
    competences_savoirs, competences_savoir_faire, competences_savoir_etre,
    interactions_internes, interactions_externes,
    temoignage
) VALUES (
    'finance',
    'Workshop Métier Finance',
    'Direction Financière & Comptabilité',
    'job_focus',
    '',
    '💰',
    'from-emerald-500 to-emerald-600',
    5,
    true,
    ARRAY['Comprendre le rôle stratégique de la finance', 'Identifier les compétences comptables et financières', 'Valoriser la fonction de pilotage économique'],
    '',
    'Gardien de la santé financière, pilote la performance économique et éclaire les décisions stratégiques.',
    ARRAY['Comptabilité (Fiabilité des comptes)', 'Contrôle de gestion (Pilotage)', 'Trésorerie (Liquidités)', 'Fiscalité (Conformité)'],
    '[{"poste": "Directeur Financier", "mission": "Pilote la stratégie financière, supervise les équipes, dialogue avec les parties prenantes et garantit la conformité."}, {"poste": "Contrôleur de gestion", "mission": "Élabore les budgets, analyse les écarts, produit les tableaux de bord et accompagne les managers."}, {"poste": "Comptable", "mission": "Enregistre les opérations, prépare les clôtures et assure la fiabilité des comptes."}, {"poste": "Trésorier", "mission": "Gère les flux de trésorerie, optimise les placements et sécurise les paiements."}]'::jsonb,
    ARRAY['Normes comptables (SYSCOHADA, IFRS)', 'Fiscalité et réglementation', 'Contrôle de gestion et analyse financière', 'Outils de gestion (SAP, Excel avancé)'],
    ARRAY['Production des états financiers', 'Analyse et reporting', 'Élaboration budgétaire', 'Gestion de trésorerie'],
    ARRAY['Rigueur et précision', 'Intégrité et éthique', 'Esprit d''analyse', 'Sens de la confidentialité'],
    ARRAY['Direction Générale', 'Tous les départements (budget, achats)', 'Contrôle Interne'],
    ARRAY['Commissaires aux comptes', 'Banques', 'Administration fiscale', 'Groupe ERANOVE'],
    'Nous éclairons les décisions stratégiques par des chiffres fiables. La performance durable passe par nous.'
);

-- 6. Production
INSERT INTO workshops_metiers (
    id, titre, departement, type, video, icon, color, ordre, is_active,
    intro_objectifs, intro_mission,
    presentation_definition, presentation_piliers,
    roles,
    competences_savoirs, competences_savoir_faire, competences_savoir_etre,
    interactions_internes, interactions_externes,
    temoignage
) VALUES (
    'production',
    'Workshop Métier Production',
    'Production',
    'job_focus',
    '',
    '⚡',
    'from-yellow-500 to-yellow-600',
    6,
    true,
    ARRAY['Comprendre les métiers de la Production et ses enjeux', 'Identifier les compétences clés techniques et comportementales', 'Valoriser les métiers et renforcer la reconnaissance interne'],
    '',
    'Chef d''orchestre qui s''assure que chaque note est jouée parfaitement. Elle se compose de la Conduite et de la Chimie.',
    ARRAY['Conduite (Pilotage des installations)', 'Chimie (Qualité eau/vapeur)', 'Performance (Optimisation)'],
    '[{"poste": "Opérateurs de Conduite", "mission": "Cœur de l''équipe, présence terrain, veille machines et application rigoureuse des procédures."}, {"poste": "Chefs de Bloc et Contremaîtres Exploitation", "mission": "Pilotage des installations depuis la salle de commande, surveillance des paramètres."}, {"poste": "Appuis Conduite", "mission": "Gestion des consommables, outillages et combustibles."}, {"poste": "Préparateurs Conduite", "mission": "Rédaction des rapports, gammes de conduite et préparation des données d''exploitation."}, {"poste": "Chimistes", "mission": "Production d''eau déminéralisée, contrôle qualité eau/vapeur, respect des normes environnementales."}, {"poste": "Management (Chefs de Quart, Ingénieurs, Responsable)", "mission": "Supervision, gestion des urgences, coordination, pilotage de la performance et développement des compétences."}]'::jsonb,
    ARRAY['Procédés de production', 'Équipements', 'Consignes de sécurité'],
    ARRAY['Pilotage', 'Diagnostic', 'Coordination', 'Analyse de performance'],
    ARRAY['Rigueur', 'Réactivité', 'Vigilance', 'Esprit d''équipe', 'Respect des règles'],
    ARRAY['Maintenance', 'QSE-RSE', 'RH', 'Projets', 'Achats', 'Gestion des stocks', 'DFC'],
    ARRAY['Autorités du réseau électrique', 'Fournisseurs de combustibles'],
    'Nous produisons l''énergie qui éclaire la Côte d''Ivoire. Chaque MW compte.'
);

-- 7. Maintenance
INSERT INTO workshops_metiers (
    id, titre, departement, type, video, icon, color, ordre, is_active,
    intro_objectifs, intro_mission,
    presentation_definition, presentation_piliers,
    roles,
    competences_savoirs, competences_savoir_faire, competences_savoir_etre,
    interactions_internes, interactions_externes,
    temoignage
) VALUES (
    'maintenance',
    'Workshop Métier Maintenance',
    'Maintenance',
    'job_focus',
    '',
    '🔧',
    'from-blue-500 to-blue-600',
    7,
    true,
    ARRAY['Comprendre les enjeux de la maintenance industrielle', 'Identifier les compétences techniques et organisationnelles', 'Valoriser le rôle de garant de la disponibilité'],
    '',
    'Garant de la disponibilité et de la fiabilité des équipements. Sans maintenance, pas de production.',
    ARRAY['Préventif (Anticiper)', 'Correctif (Réparer)', 'Amélioratif (Optimiser)'],
    '[{"poste": "Responsable Maintenance", "mission": "Pilote la stratégie maintenance, optimise les ressources et garantit la disponibilité."}, {"poste": "Ingénieurs Maintenance", "mission": "Expertise technique, amélioration continue et support aux équipes."}, {"poste": "Techniciens", "mission": "Interventions terrain, diagnostic et réparation."}, {"poste": "Préparateurs", "mission": "Planification, documentation et coordination."}]'::jsonb,
    ARRAY['Équipements industriels', 'Techniques de maintenance', 'GMAO', 'Normes et procédures'],
    ARRAY['Diagnostic et dépannage', 'Planification d''interventions', 'Gestion des pièces de rechange', 'Amélioration continue'],
    ARRAY['Rigueur technique', 'Réactivité', 'Esprit d''analyse', 'Travail en équipe'],
    ARRAY['Production', 'QSE-RSE', 'Achats', 'Projets', 'Finance'],
    ARRAY['Fournisseurs OEM', 'Sous-traitants spécialisés', 'Bureaux d''études'],
    'Nous maintenons les équipements en état optimal. La fiabilité, c''est notre signature.'
);

-- 8. Services Généraux
INSERT INTO workshops_metiers (
    id, titre, departement, type, video, icon, color, ordre, is_active,
    intro_objectifs, intro_mission,
    presentation_definition, presentation_piliers,
    roles,
    competences_savoirs, competences_savoir_faire, competences_savoir_etre,
    interactions_internes, interactions_externes,
    temoignage
) VALUES (
    'services-generaux',
    'Workshop Métier Services Généraux',
    'Services Généraux',
    'job_focus',
    '',
    '🏢',
    'from-purple-500 to-purple-600',
    8,
    true,
    ARRAY['Comprendre les métiers des services généraux et ses enjeux', 'Identifier les compétences clés techniques et comportementales', 'Valoriser les métiers et renforcer la reconnaissance interne'],
    'Garantir un environnement de travail sûr, propre et fonctionnel. Assurer la disponibilité des infrastructures.',
    'Support essentiel qui garantit le confort et la fonctionnalité de l''environnement de travail.',
    ARRAY['Facilities Management', 'Maintenance bâtiments', 'Services aux occupants'],
    '[{"poste": "Technicien Services Généraux", "mission": "Maintenance 1er niveau (bâtiments/équipements), suivi prestataires, gestion consommables."}, {"poste": "Contremaître Services Généraux", "mission": "Planification et contrôle des interventions, gestion des urgences, application QSE."}, {"poste": "Coordinateur Services Généraux", "mission": "Pilotage global, élaboration budgets, négociation contrats prestataires, stratégie infrastructures."}]'::jsonb,
    ARRAY['Logiciel X3 SAGE', 'Procédures de gestion de prestataires', 'Techniques budgétaires', 'Connaissance des installations et équipements'],
    ARRAY['Pilotage et planification', 'Exécution d''interventions techniques fiables', 'Suivi des prestataires et contrôle qualité', 'Gestion des urgences'],
    ARRAY['Rigueur & sens de l''organisation', 'Sens du service et de la communication', 'Éthique, transparence et exemplarité', 'Réactivité & anticipation'],
    ARRAY['Maintenance', 'QSE-RSE', 'RH', 'Projets', 'Achats', 'Stocks', 'DFC (Tous services)'],
    ARRAY['Prestataires techniques', 'Entreprises de nettoyage/sécurité', 'Entreprises de construction', 'Fournisseurs mobilier/climatisation'],
    'Nous créons les conditions optimales pour que chacun puisse travailler efficacement.'
);

-- 9. Contrôle Interne
INSERT INTO workshops_metiers (
    id, titre, departement, type, video, icon, color, ordre, is_active,
    intro_objectifs, intro_mission,
    presentation_definition, presentation_piliers,
    roles,
    competences_savoirs, competences_savoir_faire, competences_savoir_etre,
    interactions_internes, interactions_externes,
    temoignage
) VALUES (
    'controle-interne',
    'Workshop Métier Contrôle Interne',
    'Contrôle Interne',
    'job_focus',
    '',
    '📊',
    'from-red-500 to-red-600',
    9,
    true,
    ARRAY['Comprendre la maîtrise des risques', 'Identifier les compétences d''audit et de conformité', 'Valoriser le rôle de tiers de confiance'],
    '',
    'Garantit la fiabilité des processus, prévient les risques et sécurise la performance collective.',
    ARRAY['Prévention des risques', 'Conformité', 'Fiabilité des opérations'],
    '[{"poste": "Directrice Contrôle Interne", "mission": "Pilote la fonction, cartographie les risques, mène les audits, vérifie l''application des procédures et recommande des améliorations."}]'::jsonb,
    ARRAY['Méthodologie d''audit et de contrôle', 'Cartographie des risques', 'Procédures internes et normes', 'Réglementation'],
    ARRAY['Analyse de processus', 'Conduite d''audit et diagnostic', 'Rédaction de rapports', 'Suivi des plans d''action'],
    ARRAY['Objectivité et indépendance', 'Rigueur', 'Discrétion', 'Sens critique et diplomatie'],
    ARRAY['Direction Générale', 'Tous les processus métiers (Audit)', 'Juridique', 'Finance'],
    ARRAY['Auditeurs externes', 'Commissaires aux comptes', 'Organismes de certification'],
    'Garantir que l''entreprise évolue dans un environnement sûr, transparent et maîtrisé. Créer la confiance.'
);

-- =====================================================
-- ACTIVATION DES POLITIQUES RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur la table
ALTER TABLE workshops_metiers ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "workshops_metiers_select_public" ON workshops_metiers
    FOR SELECT
    USING (true);

-- Politique pour permettre l'insertion/modification aux admins authentifiés
CREATE POLICY "workshops_metiers_all_admin" ON workshops_metiers
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier que toutes les données ont été insérées
SELECT id, titre, departement, icon, ordre, is_active 
FROM workshops_metiers 
ORDER BY ordre;
