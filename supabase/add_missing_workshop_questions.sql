-- ============================================================================
-- SCRIPT COMBINÉ - Ajout des questions manquantes pour les workshops actifs
-- À exécuter dans Supabase SQL Editor
-- ============================================================================
-- Ce script ajoute des questions pour :
-- 1. workshop_maintenance (10 questions)
-- 2. workshop_controle_interne (10 questions)
-- ============================================================================

-- ============================================================================
-- PARTIE 1: QUESTIONS WORKSHOP MAINTENANCE
-- ============================================================================

INSERT INTO questions (
  title, question, option_a, option_b, option_c, option_d,
  correct_answer, category, quiz_type, etape, points, active, order_index,
  workshop_id, feedback, explanation
) VALUES
(
  'Mission principale de la Maintenance',
  'Quelle est la mission principale du département Maintenance chez CIPREL ?',
  'Assurer la disponibilité et la fiabilité des équipements de production',
  'Gérer les achats de pièces détachées uniquement',
  'Former les nouveaux employés',
  'Superviser la production',
  ARRAY['A'], 'DEFINITION', 'WORKSHOP', 'WORKSHOP', 10, true, 1, 'workshop_maintenance',
  'La maintenance vise principalement à garantir la disponibilité des équipements.',
  'Le département Maintenance a pour mission essentielle d''assurer la disponibilité et la fiabilité des équipements pour garantir une production continue.'
),
(
  'Types de maintenance',
  'Quels sont les deux principaux types de maintenance pratiqués chez CIPREL ?',
  'Maintenance préventive et maintenance corrective',
  'Maintenance externe et maintenance interne',
  'Maintenance rapide et maintenance lente',
  'Maintenance manuelle et maintenance automatique',
  ARRAY['A'], 'COMPETENCES', 'WORKSHOP', 'WORKSHOP', 10, true, 2, 'workshop_maintenance',
  'La maintenance préventive (80%) et corrective sont les deux piliers.',
  'CIPREL pratique principalement la maintenance préventive (inspections, contrôles réguliers) représentant 80% des activités, et la maintenance corrective (diagnostic, remise en état).'
),
(
  'Maintenance préventive',
  'Quel pourcentage représente la maintenance préventive dans les activités de maintenance chez CIPREL ?',
  '80%', '50%', '20%', '100%',
  ARRAY['A'], 'COMPETENCES', 'WORKSHOP', 'WORKSHOP', 10, true, 3, 'workshop_maintenance',
  'La maintenance préventive représente 80% des activités.',
  'La maintenance préventive, incluant les inspections et contrôles réguliers, représente environ 80% des activités du département.'
),
(
  'Rôle du Technicien de Maintenance',
  'Quel est le rôle principal du Technicien de Maintenance ?',
  'Réaliser les interventions techniques préventives et correctives',
  'Uniquement superviser les sous-traitants',
  'Gérer le budget du département',
  'Former les opérateurs de production',
  ARRAY['A'], 'RESPONSABILITE', 'WORKSHOP', 'WORKSHOP', 10, true, 4, 'workshop_maintenance',
  'Le technicien réalise les interventions techniques.',
  'Le Technicien de Maintenance est responsable de la réalisation des interventions techniques, qu''elles soient préventives ou correctives.'
),
(
  'Compétences techniques requises',
  'Quelles compétences techniques sont essentielles pour un agent de maintenance ?',
  'Électricité, mécanique, hydraulique et pneumatique',
  'Comptabilité et gestion financière',
  'Marketing et communication',
  'Ressources humaines',
  ARRAY['A'], 'COMPETENCES', 'WORKSHOP', 'WORKSHOP', 10, true, 5, 'workshop_maintenance',
  'Les compétences techniques multidisciplinaires sont essentielles.',
  'Un agent de maintenance doit maîtriser plusieurs domaines techniques : électricité, mécanique, hydraulique et pneumatique pour intervenir efficacement.'
),
(
  'GMAO',
  'Que signifie GMAO dans le contexte de la maintenance ?',
  'Gestion de Maintenance Assistée par Ordinateur',
  'Gestion des Matériaux et Achats Opérationnels',
  'Guide des Méthodes et Applications Opérationnelles',
  'Gestion du Matériel et des Approvisionnements',
  ARRAY['A'], 'DEFINITION', 'WORKSHOP', 'WORKSHOP', 10, true, 6, 'workshop_maintenance',
  'GMAO = Gestion de Maintenance Assistée par Ordinateur.',
  'La GMAO (Gestion de Maintenance Assistée par Ordinateur) est un outil informatique essentiel pour planifier et suivre les activités de maintenance.'
),
(
  'Savoir-être en maintenance',
  'Quel savoir-être est particulièrement important pour un professionnel de la maintenance ?',
  'Rigueur, réactivité et travail en équipe',
  'Créativité artistique',
  'Compétences commerciales',
  'Capacité de négociation',
  ARRAY['A'], 'COMPETENCES', 'WORKSHOP', 'WORKSHOP', 10, true, 7, 'workshop_maintenance',
  'Rigueur et réactivité sont essentielles en maintenance.',
  'La rigueur dans l''exécution, la réactivité face aux pannes et la capacité à travailler en équipe sont des qualités indispensables.'
),
(
  'Arrêts programmés',
  'Pourquoi les arrêts programmés sont-ils importants en maintenance ?',
  'Pour effectuer des interventions préventives sans impacter la production',
  'Pour permettre aux employés de prendre des vacances',
  'Pour réduire la consommation d''énergie',
  'Pour former de nouveaux employés',
  ARRAY['A'], 'RESPONSABILITE', 'WORKSHOP', 'WORKSHOP', 10, true, 8, 'workshop_maintenance',
  'Les arrêts programmés permettent la maintenance préventive.',
  'Les arrêts programmés permettent de réaliser des interventions de maintenance préventive de manière planifiée, minimisant ainsi l''impact sur la production.'
),
(
  'Documentation technique',
  'Pourquoi la documentation technique est-elle importante en maintenance ?',
  'Pour assurer la traçabilité et le partage des connaissances',
  'Pour décorer les bureaux',
  'Uniquement pour les audits externes',
  'Elle n''est pas importante',
  ARRAY['A'], 'COMPETENCES', 'WORKSHOP', 'WORKSHOP', 10, true, 9, 'workshop_maintenance',
  'La documentation assure traçabilité et partage de connaissances.',
  'Une bonne documentation technique permet d''assurer la traçabilité des interventions, de partager les connaissances et de faciliter les futures interventions.'
),
(
  'Sécurité en maintenance',
  'Quel est le premier réflexe avant toute intervention de maintenance ?',
  'Consigner et sécuriser l''équipement',
  'Commencer immédiatement le travail',
  'Appeler un collègue',
  'Vérifier ses emails',
  ARRAY['A'], 'RESPONSABILITE', 'WORKSHOP', 'WORKSHOP', 10, true, 10, 'workshop_maintenance',
  'La consignation et la sécurisation sont prioritaires.',
  'Avant toute intervention, il est impératif de consigner (mettre hors énergie) et de sécuriser l''équipement pour éviter tout accident.'
);

-- ============================================================================
-- PARTIE 2: QUESTIONS WORKSHOP CONTRÔLE INTERNE
-- ============================================================================

INSERT INTO questions (
  title, question, option_a, option_b, option_c, option_d,
  correct_answer, category, quiz_type, etape, points, active, order_index,
  workshop_id, feedback, explanation
) VALUES
(
  'Mission du Contrôle Interne',
  'Quelle est la mission principale du Contrôle Interne chez CIPREL ?',
  'Garantir la fiabilité des processus et la conformité aux règles',
  'Gérer les ressources humaines',
  'Superviser la production',
  'Développer la stratégie commerciale',
  ARRAY['A'], 'DEFINITION', 'WORKSHOP', 'WORKSHOP', 10, true, 1, 'workshop_controle_interne',
  'Le contrôle interne garantit fiabilité et conformité.',
  'Le Contrôle Interne a pour mission principale de garantir la fiabilité des processus, la conformité aux règles internes et externes, et la maîtrise des risques.'
),
(
  'Les 3 lignes de défense',
  'Quel modèle de gouvernance est généralement utilisé en contrôle interne ?',
  'Le modèle des 3 lignes de défense',
  'Le modèle PDCA',
  'Le modèle 5S',
  'Le modèle Lean',
  ARRAY['A'], 'COMPETENCES', 'WORKSHOP', 'WORKSHOP', 10, true, 2, 'workshop_controle_interne',
  'Le modèle des 3 lignes de défense structure la gouvernance.',
  'Le modèle des 3 lignes de défense définit les rôles : 1) Opérationnels, 2) Fonctions de contrôle, 3) Audit interne.'
),
(
  'Première ligne de défense',
  'Qui constitue la première ligne de défense dans le modèle de contrôle interne ?',
  'Les managers opérationnels et leurs équipes',
  'L''audit interne',
  'Le comité de direction',
  'Les auditeurs externes',
  ARRAY['A'], 'RESPONSABILITE', 'WORKSHOP', 'WORKSHOP', 10, true, 3, 'workshop_controle_interne',
  'Les opérationnels sont la première ligne de défense.',
  'La première ligne de défense est constituée des managers opérationnels qui sont responsables de l''identification et de la gestion des risques au quotidien.'
),
(
  'Objectifs du contrôle interne',
  'Quels sont les principaux objectifs du contrôle interne ?',
  'Efficacité des opérations, fiabilité des informations, conformité',
  'Uniquement la réduction des coûts',
  'La satisfaction client uniquement',
  'L''augmentation du chiffre d''affaires',
  ARRAY['A'], 'DEFINITION', 'WORKSHOP', 'WORKSHOP', 10, true, 4, 'workshop_controle_interne',
  'Efficacité, fiabilité et conformité sont les 3 objectifs.',
  'Les trois objectifs principaux du contrôle interne sont : l''efficacité et l''efficience des opérations, la fiabilité des informations financières, et la conformité aux lois et règlements.'
),
(
  'Cartographie des risques',
  'Qu''est-ce qu''une cartographie des risques ?',
  'Un outil permettant d''identifier et évaluer les risques de l''entreprise',
  'Une carte géographique des sites de l''entreprise',
  'Un organigramme du personnel',
  'Un plan de formation',
  ARRAY['A'], 'COMPETENCES', 'WORKSHOP', 'WORKSHOP', 10, true, 5, 'workshop_controle_interne',
  'La cartographie identifie et évalue les risques.',
  'La cartographie des risques est un outil essentiel permettant d''identifier, d''évaluer et de hiérarchiser les risques auxquels l''entreprise est exposée.'
),
(
  'Séparation des fonctions',
  'Pourquoi la séparation des fonctions est-elle importante en contrôle interne ?',
  'Pour éviter les fraudes et les erreurs en répartissant les responsabilités',
  'Pour augmenter le nombre d''employés',
  'Pour compliquer les processus',
  'Elle n''est pas importante',
  ARRAY['A'], 'COMPETENCES', 'WORKSHOP', 'WORKSHOP', 10, true, 6, 'workshop_controle_interne',
  'La séparation des fonctions prévient fraudes et erreurs.',
  'La séparation des fonctions (autorisation, exécution, contrôle, enregistrement) est un principe fondamental pour prévenir les fraudes et détecter les erreurs.'
),
(
  'Audit interne vs Contrôle interne',
  'Quelle est la différence entre audit interne et contrôle interne ?',
  'Le contrôle interne est un dispositif permanent, l''audit interne évalue ce dispositif',
  'Ce sont exactement la même chose',
  'L''audit interne est quotidien, le contrôle interne est annuel',
  'Le contrôle interne est externe à l''entreprise',
  ARRAY['A'], 'DEFINITION', 'WORKSHOP', 'WORKSHOP', 10, true, 7, 'workshop_controle_interne',
  'Le contrôle est permanent, l''audit évalue le dispositif.',
  'Le contrôle interne est un dispositif permanent mis en place par l''organisation, tandis que l''audit interne est une fonction indépendante qui évalue l''efficacité de ce dispositif.'
),
(
  'Procédures de contrôle',
  'Qu''est-ce qu''une procédure de contrôle ?',
  'Un ensemble de règles et d''actions pour maîtriser les risques',
  'Un document administratif sans importance',
  'Une sanction disciplinaire',
  'Un logiciel informatique',
  ARRAY['A'], 'COMPETENCES', 'WORKSHOP', 'WORKSHOP', 10, true, 8, 'workshop_controle_interne',
  'Les procédures définissent les règles de maîtrise des risques.',
  'Une procédure de contrôle est un ensemble de règles, d''instructions et d''actions mises en place pour maîtriser les risques identifiés et atteindre les objectifs.'
),
(
  'Indicateurs de contrôle',
  'À quoi servent les indicateurs de contrôle (KRI - Key Risk Indicators) ?',
  'À détecter de manière précoce les anomalies et les risques',
  'À décorer les tableaux de bord',
  'Uniquement à satisfaire les auditeurs',
  'À remplacer les contrôles manuels',
  ARRAY['A'], 'RESPONSABILITE', 'WORKSHOP', 'WORKSHOP', 10, true, 9, 'workshop_controle_interne',
  'Les KRI permettent la détection précoce des risques.',
  'Les indicateurs de risque (KRI) permettent de détecter de manière précoce les anomalies, les tendances négatives et les risques émergents.'
),
(
  'Culture du contrôle',
  'Qu''est-ce que la culture du contrôle dans une entreprise ?',
  'L''ensemble des valeurs et comportements favorisant la maîtrise des risques',
  'La peur des sanctions',
  'La méfiance entre collaborateurs',
  'L''absence de confiance',
  ARRAY['A'], 'COMPETENCES', 'WORKSHOP', 'WORKSHOP', 10, true, 10, 'workshop_controle_interne',
  'La culture du contrôle repose sur des valeurs partagées.',
  'La culture du contrôle désigne l''ensemble des valeurs, attitudes et comportements partagés qui favorisent la prise en compte des risques et le respect des règles.'
);

-- ============================================================================
-- VÉRIFICATION FINALE
-- ============================================================================

SELECT 
  workshop_id,
  COUNT(*) as nombre_questions
FROM questions 
WHERE workshop_id IN ('workshop_maintenance', 'workshop_controle_interne')
GROUP BY workshop_id
ORDER BY workshop_id;
