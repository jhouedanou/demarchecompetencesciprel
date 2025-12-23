-- ============================================================================
-- INSERT SCRIPT: questions_quiz (workshop_id, question, reponse)
-- Generated from the provided JSON structure. Each INSERT links to the
-- workshops via the workshop_id values given in the mapping.
-- IMPORTANT: This script deletes existing questions for the targeted
-- workshop_ids before inserting the new ones to avoid duplicates.
-- Run in Supabase SQL editor connected to your project.
-- ============================================================================

BEGIN;

-- Delete existing workshop questions for the mapped workshop_ids
-- Cela supprime TOUTES les questions existantes dans la table questions_quiz
-- qui ont un workshop_id correspondant à l'un des 12 ateliers listés ci-dessous.
-- Objectif: éviter les doublons lors de la réinsertion.
DELETE FROM public.questions_quiz
WHERE workshop_id IN (
  'workshop_gestion_stock',
  'workshop_maintenance',
  'workshop_production',
  'workshop_qse_rse_surete',
  'workshop_sitd',
  'workshop_services_generaux',
  'workshop_rh_juridique',
  'workshop_achats_logistique',
  'workshop_controle_interne',
  'workshop_daf',
  'workshop_projets',
  'workshop_introduction'
);

-- ============================================================================
-- Gestion_des_Stocks -> workshop_gestion_stock
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_gestion_stock', 'Quel est le rôle stratégique principal de la Gestion des Stocks dans un environnement critique comme une centrale électrique ?', 'Être le premier rempart contre la défaillance et garantir la disponibilité immédiate des pièces vitales.'),
('workshop_gestion_stock', 'Quelle est la mission du pôle concernant l''immobilisation financière liée aux pièces ?', 'Optimiser le capital immobilisé en minimisant le surstockage coûteux tout en maximisant la sécurité.'),
('workshop_gestion_stock', 'Quelle fonction spécifique garantit la fiabilité des données de stock pour la Comptabilité et le Contrôle de Gestion ?', 'La réalisation des inventaires de stock (tournants et annuels).'),
('workshop_gestion_stock', 'Quel titre de fonction est chargé d''assurer la vision globale et l''intégration des méthodes au sein du pôle Gestion des Stocks ?', 'Le Coordinateur Gestion de Stock.'),
('workshop_gestion_stock', 'L''un des rapports ou états que le pôle est chargé de Rédiger sert à assurer la transparence et l''information des autres départements. De quel type de rapport s''agit-il ?', 'Les rapports et états liés à la gestion de son activité (performance des stocks, mouvements).'),
('workshop_gestion_stock', 'Quelle valeur est directement liée à la mission de ''veiller à l''Équité et à la justesse de chaque mouvement'' et de garantir l''information fiable pour les planificateurs ?', 'Équité.'),
('workshop_gestion_stock', 'Que signifie la mission de ''Suivre les paramètres de gestion de stocks'' ?', 'Définir les niveaux de stock (minimum, alerte, sécurité) et analyser les indicateurs (rotations, délais).'),
('workshop_gestion_stock', 'Quelle est la principale raison pour laquelle le Magasinage doit ''Gérer les mouvements physiques de stocks'' avec le plus grand ''Respect'' des procédures ?', 'Pour garantir la traçabilité des pièces, leur intégrité physique et la conformité des données enregistrées.'),
('workshop_gestion_stock', 'Le pôle Gestion des Stocks est qualifié de gardien du ''Stock de Sécurité''. Qu''est-ce que cela implique ?', 'Il assure la gestion et l''état des pièces uniques sans lesquelles la centrale pourrait s''arrêter, priorité absolue pour la Maîtrise des Risques.'),
('workshop_gestion_stock', 'Comment le pôle Gestion des Stocks utilise-t-il l''Innovation selon la présentation ?', 'En intégrant des systèmes de gestion des stocks WMS ou des méthodes d''inventaire dynamiques pour une vision précise et en temps réel.');

-- ============================================================================
-- Maintenance -> workshop_maintenance
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_maintenance', 'Le rôle principal de la Maintenance à CIPREL, c''est :', 'Prévenir, anticiper et maintenir les installations en bon état.'),
('workshop_maintenance', 'La part de la prévention dans l''activité de maintenance est estimée à :', '80 %.'),
('workshop_maintenance', 'La Maintenance préventive consiste à :', 'Planifier et réaliser des inspections régulières pour éviter les pannes.'),
('workshop_maintenance', 'La Maintenance corrective consiste à :', 'Réparer rapidement un dysfonctionnement signalé.'),
('workshop_maintenance', 'Parmi les acteurs suivants, qui coordonne les arrêts majeurs d''installation ?', 'Le Coordinateur Maintenance.'),
('workshop_maintenance', 'Le Préparateur Maintenance a pour mission principale de :', 'Définir les méthodes d''exécution des tâches et assurer la disponibilité des pièces de rechange.'),
('workshop_maintenance', 'Parmi ces qualités, laquelle est essentielle pour travailler en maintenance ?', 'Curiosité et sens de l''innovation.'),
('workshop_maintenance', 'Le savoir-faire en maintenance, c''est :', 'La rigueur, la précision et la rapidité de diagnostic.'),
('workshop_maintenance', 'Le savoir-être attendu des agents de maintenance inclut :', 'La responsabilité, la minutie et la rigueur.'),
('workshop_maintenance', 'Quelle est la fierté de l''équipe Maintenance ?', 'Voir la centrale fonctionner sans interruption grâce à leur travail.');

-- ============================================================================
-- Production -> workshop_production
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_production', 'La Production à CIPREL, c''est avant tout :', 'Le cœur opérationnel de la centrale électrique.'),
('workshop_production', 'Le Pôle Production est composé de :', 'La Conduite et la Chimie.'),
('workshop_production', 'Les techniciens Conduite ont pour rôle principal :', 'Veiller au bon fonctionnement des machines sur le terrain.'),
('workshop_production', 'Les conducteurs d''installation sont responsables de :', 'Le pilotage et la surveillance des installations depuis la salle de commande.'),
('workshop_production', 'Les chimistes ont pour mission :', 'Produire et contrôler la qualité de l''eau déminéralisée et de la vapeur.'),
('workshop_production', 'Le savoir-faire dans la Production, c''est :', 'La capacité à diagnostiquer, piloter et coordonner les installations.'),
('workshop_production', 'Le savoir-être attendu d''un opérateur de Conduite comprend :', 'La rigueur, la réactivité, la vigilance et l''esprit d''équipe.'),
('workshop_production', 'Les partenaires internes du Pôle Production sont :', 'Maintenance, QSE-RSE, RH, Projets, Achats & logistique.'),
('workshop_production', 'Le slogan du Pôle Production est :', '"Nos compétences, notre énergie."');

-- ============================================================================
-- QSE_RSE_Surete -> workshop_qse_rse_surete
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_qse_rse_surete', 'Le rôle principal du Pôle QSE-RSE & Sûreté, c''est :', 'Garantir la qualité, la sécurité, la sûreté et la responsabilité sociale dans toutes les activités.'),
('workshop_qse_rse_surete', 'La mission première du service QSE-RSE est de :', 'Intégrer la durabilité et la responsabilité dans chaque processus de l''entreprise.'),
('workshop_qse_rse_surete', 'Le service Sûreté a pour rôle de :', 'Protéger les installations et le personnel contre les risques internes et externes.'),
('workshop_qse_rse_surete', '"Agir responsable, opérer en sécurité, exceller en qualité" résume :', 'Le slogan du Pôle QSE-RSE & Sûreté.'),
('workshop_qse_rse_surete', 'Les métiers du QSE-RSE et de la Sûreté contribuent à :', 'La performance durable et la confiance interne et externe.'),
('workshop_qse_rse_surete', 'Pour exceller dans ce métier, il faut avant tout :', 'Connaître les lois et procédures applicables et anticiper les risques.'),
('workshop_qse_rse_surete', 'Parmi les valeurs FEERIC, laquelle illustre le mieux la culture QSE-RSE ?', 'Respect.'),
('workshop_qse_rse_surete', 'En matière de Sûreté, chaque employé de CIPREL est :', 'Le premier responsable de la sûreté au quotidien.'),
('workshop_qse_rse_surete', 'Les partenaires externes du Pôle QSE-RSE incluent :', 'Les autorités de régulation et organismes de certification.'),
('workshop_qse_rse_surete', 'La plus grande fierté des équipes QSE-RSE & Sûreté, c''est :', 'Garantir que chaque collaborateur rentre chez lui sain et sauf chaque jour.');

-- ============================================================================
-- SITD -> workshop_sitd
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_sitd', 'Le SIDT joue un rôle essentiel chez CIPREL. Quel est son objectif principal ?', 'A. Garantir la sécurité et la performance des systèmes d''information; C. Accompagner la transformation digitale de CIPREL; D. Assurer la disponibilité et la fiabilité des outils numériques.'),
('workshop_sitd', 'Quels sont les trois pôles/fonctions clés du SIDT chez CIPREL ?', 'A. Responsable Informatique & Veille Technologique; C. Ingénieur Informatique; D. Technicien Informatique.'),
('workshop_sitd', 'Le rôle de l''Ingénieur Informatique dans la cybersécurité se concentre principalement sur :', 'B. L''intégration de mécanismes techniques de protection dans les architectures SI.'),
('workshop_sitd', 'Le Technicien Informatique a pour rôle :', 'A. D''assurer un support de proximité auprès des collaborateurs; B. De maintenir et installer les équipements; D. De garantir la continuité opérationnelle au quotidien.'),
('workshop_sitd', 'Quels piliers structurent la mission globale du SIDT chez CIPREL ?', 'A. Moderniser et sécuriser les systèmes d''information; B. Améliorer la transformation digitale; D. Anticiper les évolutions technologiques.'),
('workshop_sitd', 'Quelle valeur CIPREL se traduit le plus directement dans la mise en place d''un plan de cybersécurité robuste ?', 'B. Intégrité.'),
('workshop_sitd', 'Dans la collaboration interne, le SIDT se distingue par :', 'A. Une forte complémentarité entre technicien, ingénieur et responsable; C. Un rôle stratégique pour faciliter le travail de tous; D. Une contribution directe à la fiabilité opérationnelle de la centrale.'),
('workshop_sitd', 'En matière de durabilité et d''ESG, le SIDT contribue à :', 'A. Renforcer la cybersécurité et protéger les données sensibles; B. Réduire l''empreinte environnementale grâce à la sobriété numérique; D. Intégrer des solutions technologiques responsables et conformes.'),
('workshop_sitd', 'Le SIDT se positionne comme :', 'B. Un partenaire stratégique de la performance; C. Un acteur clé de la sécurité technologique; D. Un moteur de la transformation digitale durable.');

-- ============================================================================
-- Services_Generaux -> workshop_services_generaux
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_services_generaux', 'La mission principale des Services Généraux est de :', 'Assurer un environnement de travail fonctionnel et sécurisé.'),
('workshop_services_generaux', 'Les Services Généraux interviennent principalement pour :', 'Gérer les installations et les besoins matériels du personnel.'),
('workshop_services_generaux', 'Parmi ces savoir-faire, lequel est essentiel aux Services Généraux ?', 'Planifier et suivre la maintenance des installations internes.'),
('workshop_services_generaux', 'Quel savoir-être est indispensable dans ce métier ?', 'La disponibilité et le sens du service.'),
('workshop_services_generaux', 'Quelle interaction est typique des Services Généraux ?', 'Coordination quotidienne avec tous les départements internes.'),
('workshop_services_generaux', 'La fierté principale du métier des Services Généraux réside dans :', 'Le fait que tout fonctionne, soit disponible et prêt pour les équipes.'),
('workshop_services_generaux', 'Quel type de savoir les Services Généraux doivent-ils maîtriser ?', 'Les normes d''hygiène, sécurité et gestion des infrastructures.');

-- ============================================================================
-- Ressources_Humaines_et_Juridique -> workshop_rh_juridique
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_rh_juridique', 'Quelle est la mission fondamentale du département RH ?', 'Transformer les talents en moteur de performance durable.'),
('workshop_rh_juridique', 'Quel est l''objectif principal du Développement RH ?', 'Préparer l''avenir en développant les compétences et les parcours.'),
('workshop_rh_juridique', 'L''Administration RH a pour rôle de :', 'Structurer, sécuriser et garantir la conformité RH.'),
('workshop_rh_juridique', 'Quelle activité appartient au Développement RH ?', 'Analyse des besoins en recrutement et sourcing.'),
('workshop_rh_juridique', 'Quel savoir-être est indispensable en RH ?', 'L''équité, l''écoute et la discrétion.'),
('workshop_rh_juridique', 'Quelle est la mission principale du pôle Juridique ?', 'Sécuriser les opérations et garantir la légalité des décisions.'),
('workshop_rh_juridique', 'Quel est un rôle clé du Juridique dans l''entreprise ?', 'Rédiger les contrats et protéger l''entreprise contre les risques juridiques.'),
('workshop_rh_juridique', 'Quelle valeur FEERIC est indispensable dans les fonctions RH & Juridique ?', 'L''Équité.'),
('workshop_rh_juridique', 'Quel lien unit le Développement RH et l''Administration RH ?', 'Leur complémentarité transforme les besoins opérationnels en solutions RH durables.'),
('workshop_rh_juridique', 'Le rôle du Juridique en matière d''éthique consiste à :', 'Garantir la transparence, la gouvernance, et prévenir la corruption.');

-- ============================================================================
-- Achats_et_Logistique -> workshop_achats_logistique
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_achats_logistique', 'Quel est le double rôle principal du Pôle Achats & Logistique ?', 'Être le levier de la performance durable et le garant de la continuité des opérations.'),
('workshop_achats_logistique', 'Quelle est la mission fondamentale du pôle Achats vis-à-vis des pratiques de l''entreprise, en lien avec les valeurs ?', 'Être le garant de l''éthique et de la loyauté des pratiques.'),
('workshop_achats_logistique', 'Dans le processus d''Achat, quelle mission est citée juste après le traitement des besoins et leur validation ?', 'Assurer le suivi des achats.'),
('workshop_achats_logistique', 'Qui est spécifiquement responsable de la gestion des mouvements physiques de stocks, selon la présentation ?', 'Cette fonction a été développée séparément (Gestion des Stocks).'),
('workshop_achats_logistique', 'Comment l''équipe Logistique garantit-elle la conformité de l''entreprise vis-à-vis des importations ?', 'En assurant le traitement et le suivi des dossiers transits et en traitant les contentieux douaniers.'),
('workshop_achats_logistique', 'Quelle valeur est mise en évidence par le fait de ''transformer l''engagement de nos partenaires en une valeur ajoutée tangible'' ?', 'Engagement.'),
('workshop_achats_logistique', 'L''évaluation des fournisseurs est une mission clé. En plus de la performance et de l''éthique, quelle valeur est assurée par l''évaluation ?', 'Équité.'),
('workshop_achats_logistique', 'Quel est le titre de la fonction qui assure la vision globale et la direction du pôle ?', 'Responsable Achat & Logistique.'),
('workshop_achats_logistique', 'Selon la présentation, comment la Force du Collectif s''applique-t-elle au sein du pôle ?', 'En favorisant la collaboration et la fluidité entre les fonctions Achat et Logistique et avec les clients internes.'),
('workshop_achats_logistique', 'Quel est l''un des critères RSE majeurs intégrés par le pôle Achats lors de la sélection des fournisseurs ?', 'L''intégration des critères environnementaux, sociaux et de gouvernance (ESG).');

-- ============================================================================
-- Controle_Interne -> workshop_controle_interne
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_controle_interne', 'Quelle métaphore est utilisée pour décrire le rôle du Contrôle Interne dans l''entreprise, en lien avec la confiance et la stabilité ?', 'L''Architecte de notre confiance et la Sentinelle de l''entreprise.'),
('workshop_controle_interne', 'Quelle est la mission fondamentale du Contrôle Interne vis-à-vis des processus de l''entreprise ?', 'Assurer que chaque processus est maîtrisé, fiable et conforme.'),
('workshop_controle_interne', 'L''équipe de Contrôle Interne ne se contente pas d''auditer. Quelle est leur action proactive et constructive mentionnée dans la présentation ?', 'Ils conçoivent et consolident les dispositifs de sécurité pour prévenir les risques.'),
('workshop_controle_interne', 'Comment le Contrôle Interne parvient-il à transformer la conformité en un avantage concurrentiel ?', 'Grâce à l''Innovation dans les méthodologies et les outils de cartographie des risques.'),
('workshop_controle_interne', 'Quelle valeur est spécifiquement renforcée par le Contrôle Interne en s''assurant que les responsabilités sont clairement définies et exercées dans tous les départements ?', 'L''Équité.'),
('workshop_controle_interne', 'En mettant en place des dispositifs qui minimisent les risques de fraude, d''erreur et de gaspillage, quel patrimoine du CIPREL le Contrôle Interne protège-t-il ?', 'Le patrimoine global de CIPREL (actifs, ressources, valeur).'),
('workshop_controle_interne', 'Quelle valeur est assurée par le Contrôle Interne en créant un ''environnement structuré et sécurisé pour tous'' ?', 'La Convivialité.'),
('workshop_controle_interne', 'Le Contrôle Interne est qualifié de ''partenaire transversal''. Quel est son but en travaillant avec les autres équipes ?', 'Pour améliorer les processus et renforcer la ''Force du Collectif''.'),
('workshop_controle_interne', 'Selon la conclusion, quel élément, fourni par le Contrôle Interne, est le socle de la performance future de l''entreprise ?', 'La rigueur de nos processus.');

-- ============================================================================
-- DAF -> workshop_daf
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_daf', 'Quel est le rôle principal de l''équipe Comptabilité (Adjoint/Comptable) au sein du pôle Finance ?', 'Traiter et consolider les opérations comptables et financières, et traiter les données fiscales.'),
('workshop_daf', 'Selon la présentation, quelle est la mission centrale du Contrôleur de Gestion ?', 'Élaborer le budget (plan financier) et effectuer le suivi rigoureux de sa mise en œuvre.'),
('workshop_daf', 'Quelle est l''une des principales responsabilités de la fonction Trésorerie ?', 'Gérer les flux de trésorerie et les relations bancaires.'),
('workshop_daf', 'Qui est principalement chargé de Piloter le système d''informations financières (SIF) et de Maîtriser les risques de contrôle interne ?', 'Le Leadership (Directeur / Responsable Financier).'),
('workshop_daf', 'Quelle est la valeur clé que la Comptabilité assure en garantissant la conformité et la rigueur des obligations fiscales ?', 'Respect.'),
('workshop_daf', 'En plus de l''élaboration du budget, quelle mission est essentielle pour le Contrôle de Gestion afin de s''assurer de la pertinence des outils d''aide à la décision ?', 'Améliorer la fiabilité des informations financières et comptables.'),
('workshop_daf', 'Comment la Trésorerie démontre-t-elle l''Équité et la transparence dans son rôle ?', 'En assurant un reporting régulier et transparent (hebdomadaire et mensuel) des flux.'),
('workshop_daf', 'Quel rôle au sein de la Finance est spécifiquement responsable de la coordination des opérations comptables et de la gestion globale de la trésorerie ?', 'Le Responsable Finance et Comptabilité.'),
('workshop_daf', 'La Force du Collectif en Finance repose sur quel principe ?', 'L''interdépendance des fonctions : la Comptabilité fournit, la Trésorerie sécurise, et le Contrôle de Gestion guide.'),
('workshop_daf', 'Quel est l''objectif final du Pôle Finance vis-à-vis de la Direction, en combinant toutes ses missions ?', 'Fournir le socle pour les décisions d''investissement futures et la Maîtrise des Risques.');

-- ============================================================================
-- Projets -> workshop_projets
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_projets', 'Le rôle stratégique du Responsable Projets :', 'Garantir l''alignement des projets avec les orientations stratégiques de la Direction Générale.'),
('workshop_projets', 'Le Directeur Développement assure la performance du pôle projets en :', 'Définissant les standards méthodologiques et outils de gestion de projets; Pilotant la feuille de route de développement et les investissements.'),
('workshop_projets', 'Le Superviseur Projets contribue directement à la performance énergétique de CIPREL en :', 'Réalisant le suivi technique et opérationnel de l''avancement des projets.'),
('workshop_projets', 'Dans une centrale électrique, la mission du Superviseur Projets inclut :', 'Le contrôle du respect des normes QHSE; L''identification des risques opérationnels et des mesures d''atténuation; La supervision des prestataires sur site.'),
('workshop_projets', 'Le rôle principal de l''Assistante Projets est :', 'Actualiser la documentation projet, préparer les dossiers et assurer la circulation des informations.'),
('workshop_projets', 'La Secrétaire Projets contribue à la conformité réglementaire du pôle en :', 'Organisant les réunions, comités et ateliers projets; Assurant l''archivage structuré pour garantir traçabilité et auditabilité; Rédigeant les procès-verbaux, comptes rendus et courriers.'),
('workshop_projets', 'Dans le pôle Projets, la valeur Intégrité se traduit particulièrement par :', 'La transparence dans les processus de contractualisation et reporting.'),
('workshop_projets', 'Un projet est considéré comme aligné avec les standards CIPREL lorsqu''il :', 'Renforce la continuité et la fiabilité de la production électrique; Respecte les normes QHSE à chaque étape; Intègre les critères ESG dans son approche (sécurité, éthique, environnement, impact social).'),
('workshop_projets', 'La collaboration efficace du pôle Projets repose avant tout sur :', 'Une synchronisation rigoureuse entre stratégie, supervision terrain et support administratif.'),
('workshop_projets', 'Dans la conduite d''un projet énergétique, les risques critiques à surveiller incluent :', 'Les risques techniques liés aux installations; Les risques opérationnels liés aux prestataires et à l''exécution; Les risques de conformité réglementaire et environnementale.');

-- ============================================================================
-- Phase_Introductive_Demarche_Competence -> workshop_introduction
-- ============================================================================
INSERT INTO public.questions_quiz (workshop_id, question, reponse) VALUES
('workshop_introduction', 'La démarche compétence c''est :', 'Un levier de performance.'),
('workshop_introduction', 'La démarche compétence est la responsabilité de :', 'Tous.'),
('workshop_introduction', 'Les compétences sont essentiellement :', 'Techniques et Comportementales.'),
('workshop_introduction', 'Le savoir-faire c''est :', 'La capacité à assurer des tâches techniques ou managériales.'),
('workshop_introduction', 'Le savoir être c''est :', 'L''ensemble des capacités cognitives et relationnelles.'),
('workshop_introduction', 'Quelles sont les étapes de la démarche compétence :', 'Identification des compétences requises; Développer les compétences; Cartographier et évaluer les compétences acquises; Evaluer et suivre les évolutions; Analyser les écarts en compétences et définir les besoins.');

COMMIT;

-- ============================================================================
-- VERIFICATION: Run this query after import to check results
-- ============================================================================
-- SELECT workshop_id, COUNT(*) AS nb_questions
-- FROM public.questions_quiz
-- GROUP BY workshop_id
-- ORDER BY workshop_id;
