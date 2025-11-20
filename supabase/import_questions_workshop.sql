-- ============================================================================
-- AUTO-GENERATED SQL IMPORT FOR WORKSHOP QUESTIONS
-- Generated from questions.json
-- ============================================================================
--
-- USAGE:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify with: SELECT quiz_type, COUNT(*) FROM questions WHERE etape='WORKSHOP' GROUP BY quiz_type;
--
-- ============================================================================

-- Start transaction
BEGIN;

-- Delete existing workshop questions to avoid duplicates
DELETE FROM public.questions WHERE etape = 'WORKSHOP';


-- ============================================================================
-- Quiz de la DAF (10 questions)
-- ============================================================================

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel est le rôle principal de l''équipe Comptabilité (Adjoint/Comptable) au sein du pôle Finance ?',  -- Truncate title
    'Quel est le rôle principal de l''équipe Comptabilité (Adjoint/Comptable) au sein du pôle Finance ?',
    'Gérer les relations bancaires.',
    'Traiter et consolider les opérations comptables et financières, et traiter les données fiscales.',
    'Élaborer le budget prévisionnel de l''entreprise.',
    'Optimiser les processus d''achat.',
    ARRAY['B'],
    'OPINION',
    'Quiz de la DAF',
    'WORKSHOP',
    1,
    true,
    1,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Selon la présentation, quelle est la mission centrale du Contrôleur de Gestion ?',  -- Truncate title
    'Selon la présentation, quelle est la mission centrale du Contrôleur de Gestion ?',
    'Assurer le reporting hebdomadaire des soldes bancaires.',
    'Élaborer le budget (plan financier) et effectuer le suivi rigoureux de sa mise en œuvre.',
    'Piloter le système d''informations financières (SIF).',
    'Gérer les contentieux douaniers.',
    ARRAY['B'],
    'OPINION',
    'Quiz de la DAF',
    'WORKSHOP',
    1,
    true,
    2,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle est l''une des principales responsabilités de la fonction Trésorerie ?',  -- Truncate title
    'Quelle est l''une des principales responsabilités de la fonction Trésorerie ?',
    'Réaliser les inventaires de stock annuels.',
    'Gérer les flux de trésorerie et les relations bancaires.',
    'Coordonner les activités de RSE.',
    'Assurer la sécurité physique des infrastructures.',
    ARRAY['B'],
    'OPINION',
    'Quiz de la DAF',
    'WORKSHOP',
    1,
    true,
    3,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Qui est principalement chargé de Piloter le système d''informations financières (SIF) et de Maîtriser',  -- Truncate title
    'Qui est principalement chargé de Piloter le système d''informations financières (SIF) et de Maîtriser les risques de contrôle interne ?',
    'Le Contrôleur de Gestion.',
    'Le Trésorier.',
    'L''Adjoint en charge de la comptabilité.',
    'Le Leadership (Directeur / Responsable Financier).',
    ARRAY['D'],
    'OPINION',
    'Quiz de la DAF',
    'WORKSHOP',
    1,
    true,
    4,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle est la valeur clé que la Comptabilité assure en garantissant la conformité et la rigueur des ',  -- Truncate title
    'Quelle est la valeur clé que la Comptabilité assure en garantissant la conformité et la rigueur des obligations fiscales ?',
    'Convivialité.',
    'Innovation.',
    'Respect.',
    'Force du Collectif.',
    ARRAY['C'],
    'OPINION',
    'Quiz de la DAF',
    'WORKSHOP',
    1,
    true,
    5,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'En plus de l''élaboration du budget, quelle mission est essentielle pour le Contrôle de Gestion afin ',  -- Truncate title
    'En plus de l''élaboration du budget, quelle mission est essentielle pour le Contrôle de Gestion afin de s''assurer de la pertinence des outils d''aide à la décision ?',
    'Améliorer la fiabilité des informations financières et comptables.',
    'Traiter les opérations de décaissement.',
    'Gérer les placements à long terme.',
    'Coordonner la logistique.',
    ARRAY['A'],
    'OPINION',
    'Quiz de la DAF',
    'WORKSHOP',
    1,
    true,
    6,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Comment la Trésorerie démontre-t-elle l''Équité et la transparence dans son rôle ?',  -- Truncate title
    'Comment la Trésorerie démontre-t-elle l''Équité et la transparence dans son rôle ?',
    'En s''engageant à ne jamais avoir de dettes.',
    'En ne travaillant qu''avec une seule banque.',
    'En assurant un reporting régulier et transparent (hebdomadaire et mensuel) des flux.',
    'En élaborant les contrats clients.',
    ARRAY['C'],
    'OPINION',
    'Quiz de la DAF',
    'WORKSHOP',
    1,
    true,
    7,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel rôle au sein de la Finance est spécifiquement responsable de la coordination des opérations com',  -- Truncate title
    'Quel rôle au sein de la Finance est spécifiquement responsable de la coordination des opérations comptables et de la gestion globale de la trésorerie ?',
    'Le Comptable.',
    'Le Contrôleur de Gestion.',
    'Le Responsable Finance et Comptabilité.',
    'Le Coordinateur Logistique.',
    ARRAY['C'],
    'OPINION',
    'Quiz de la DAF',
    'WORKSHOP',
    1,
    true,
    8,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'La Force du Collectif en Finance repose sur quel principe ?',  -- Truncate title
    'La Force du Collectif en Finance repose sur quel principe ?',
    'L''indépendance totale de chaque fonction pour minimiser les risques.',
    'L''interdépendance des fonctions : la Comptabilité fournit, la Trésorerie sécurise, et le Contrôle de Gestion guide.',
    'La fusion des rôles de Comptable et de Trésorier.',
    'La délégation de la gestion fiscale à un cabinet externe.',
    ARRAY['B'],
    'OPINION',
    'Quiz de la DAF',
    'WORKSHOP',
    1,
    true,
    9,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel est l''objectif final du Pôle Finance vis-à-vis de la Direction, en combinant toutes ses mission',  -- Truncate title
    'Quel est l''objectif final du Pôle Finance vis-à-vis de la Direction, en combinant toutes ses missions ?',
    'Simplement enregistrer les transactions passées.',
    'Réduire les effectifs du département.',
    'Fournir le socle pour les décisions d''investissement futures et la Maîtrise des Risques.',
    'Gérer uniquement les relations avec les actionnaires.',
    ARRAY['C'],
    'OPINION',
    'Quiz de la DAF',
    'WORKSHOP',
    1,
    true,
    10,
    NOW(),
    NOW()
);


-- ============================================================================
-- QUIZ – Ressources Humaines & Juridique (10 questions)
-- ============================================================================

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle est la mission fondamentale du département RH ?',  -- Truncate title
    'Quelle est la mission fondamentale du département RH ?',
    'A. Gérer uniquement les dossiers administratifs',
    'B. Transformer les talents en moteur de performance durable',
    'C. Surveiller les installations techniques',
    'D. Contrôler la qualité de la production',
    ARRAY['B'],
    'OPINION',
    'QUIZ – Ressources Humaines & Juridique',
    'WORKSHOP',
    1,
    true,
    1,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel est l’objectif principal du Développement RH ?',  -- Truncate title
    'Quel est l’objectif principal du Développement RH ?',
    'A. Rédiger les contrats de travail',
    'B. Préparer l’avenir en développant les compétences et les parcours',
    'C. Gérer les paies et absences',
    'D. Assurer la conformité réglementaire exclusivement',
    ARRAY['B'],
    'OPINION',
    'QUIZ – Ressources Humaines & Juridique',
    'WORKSHOP',
    1,
    true,
    2,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'L’Administration RH a pour rôle de :',  -- Truncate title
    'L’Administration RH a pour rôle de :',
    'A. Produire l’énergie électrique',
    'B. Structurer, sécuriser et garantir la conformité RH',
    'C. Définir les objectifs de production',
    'D. Gérer les achats de combustibles',
    ARRAY['B'],
    'OPINION',
    'QUIZ – Ressources Humaines & Juridique',
    'WORKSHOP',
    1,
    true,
    3,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle activité appartient au Développement RH ?',  -- Truncate title
    'Quelle activité appartient au Développement RH ?',
    'A. Élaboration de la paie',
    'B. Constitution des dossiers du personnel',
    'C. Analyse des besoins en recrutement et sourcing',
    'D. Gestion des visites médicales',
    ARRAY['C'],
    'OPINION',
    'QUIZ – Ressources Humaines & Juridique',
    'WORKSHOP',
    1,
    true,
    4,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel savoir-être est indispensable en RH ?',  -- Truncate title
    'Quel savoir-être est indispensable en RH ?',
    'A. La distance et la froideur',
    'B. L’équité, l’écoute et la discrétion',
    'C. La rigidité totale',
    'D. L’absence de contact humain',
    ARRAY['B'],
    'OPINION',
    'QUIZ – Ressources Humaines & Juridique',
    'WORKSHOP',
    1,
    true,
    5,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle est la mission principale du pôle Juridique ?',  -- Truncate title
    'Quelle est la mission principale du pôle Juridique ?',
    'A. Piloter les turbines',
    'B. Produire l’eau déminéralisée',
    'C. Sécuriser les opérations et garantir la légalité des décisions',
    'D. Superviser les formations',
    ARRAY['C'],
    'OPINION',
    'QUIZ – Ressources Humaines & Juridique',
    'WORKSHOP',
    1,
    true,
    6,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel est un rôle clé du Juridique dans l’entreprise ?',  -- Truncate title
    'Quel est un rôle clé du Juridique dans l’entreprise ?',
    'A. Évaluer les collaborateurs',
    'B. Rédiger les contrats et protéger l’entreprise contre les risques juridiques',
    'C. Organiser les plannings de production',
    'D. Superviser les achats techniques',
    ARRAY['B'],
    'OPINION',
    'QUIZ – Ressources Humaines & Juridique',
    'WORKSHOP',
    1,
    true,
    7,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle valeur FEERIC est indispensable dans les fonctions RH & Juridique ?',  -- Truncate title
    'Quelle valeur FEERIC est indispensable dans les fonctions RH & Juridique ?',
    'A. L’individualisme',
    'B. La précipitation',
    'C. L’Équité',
    'D. L’agressivité',
    ARRAY['C'],
    'OPINION',
    'QUIZ – Ressources Humaines & Juridique',
    'WORKSHOP',
    1,
    true,
    8,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel lien unit le Développement RH et l’Administration RH ?',  -- Truncate title
    'Quel lien unit le Développement RH et l’Administration RH ?',
    'A. Ils travaillent chacun de leur côté',
    'B. Ils sont en opposition permanente',
    'C. Leur complémentarité transforme les besoins opérationnels en solutions RH durables',
    'D. Ils gèrent uniquement les formations',
    ARRAY['C'],
    'OPINION',
    'QUIZ – Ressources Humaines & Juridique',
    'WORKSHOP',
    1,
    true,
    9,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le rôle du Juridique en matière d’éthique consiste à :',  -- Truncate title
    'Le rôle du Juridique en matière d’éthique consiste à :',
    'A. Assurer la production électrique de nuit',
    'B. Se concentrer uniquement sur les procès',
    'C. Garantir la transparence, la gouvernance, et prévenir la corruption',
    'D. Gérer les congés du personnel',
    ARRAY['C'],
    'OPINION',
    'QUIZ – Ressources Humaines & Juridique',
    'WORKSHOP',
    1,
    true,
    10,
    NOW(),
    NOW()
);


-- ============================================================================
-- QUIZ GESTION DES STOCK (10 questions)
-- ============================================================================

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel est le rôle stratégique principal de la Gestion des Stocks dans un environnement critique comme',  -- Truncate title
    'Quel est le rôle stratégique principal de la Gestion des Stocks dans un environnement critique comme une centrale électrique ?',
    'Négocier les prix avec les fournisseurs de pièces.',
    'Assurer la sécurité physique du site dans son ensemble.',
    'Être le premier rempart contre la défaillance et garantir la disponibilité immédiate des pièces vitales.',
    'Calculer les amortissements des actifs stockés.',
    ARRAY['C'],
    'OPINION',
    'QUIZ GESTION DES STOCK',
    'WORKSHOP',
    1,
    true,
    1,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle est la mission du pôle concernant l''immobilisation financière liée aux pièces ?',  -- Truncate title
    'Quelle est la mission du pôle concernant l''immobilisation financière liée aux pièces ?',
    'Maximiser le volume de stock pour prévenir toute éventualité.',
    'Éliminer tous les stocks pour réduire le capital immobilisé.',
    'Optimiser le capital immobilisé en minimisant le surstockage coûteux tout en maximisant la sécurité.',
    'Négocier les taux d''intérêt sur le stock avec la banque.',
    ARRAY['C'],
    'OPINION',
    'QUIZ GESTION DES STOCK',
    'WORKSHOP',
    1,
    true,
    2,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle fonction spécifique garantit la fiabilité des données de stock pour la Comptabilité et le Con',  -- Truncate title
    'Quelle fonction spécifique garantit la fiabilité des données de stock pour la Comptabilité et le Contrôle de Gestion ?',
    'Le contrôle qualitatif à la réception uniquement.',
    'La distribution interne des pièces.',
    'La gestion des mouvements physiques de stocks.',
    'La réalisation des inventaires de stock (tournants et annuels).',
    ARRAY['D'],
    'OPINION',
    'QUIZ GESTION DES STOCK',
    'WORKSHOP',
    1,
    true,
    3,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel titre de fonction est chargé d''assurer la vision globale et l''intégration des méthodes au sein ',  -- Truncate title
    'Quel titre de fonction est chargé d''assurer la vision globale et l''intégration des méthodes au sein du pôle Gestion des Stocks ?',
    'Le Gestionnaire de Stock.',
    'Le Responsable Achat & Logistique.',
    'Le Coordinateur Gestion de Stock.',
    'L''Acheteur.',
    ARRAY['B'],
    'OPINION',
    'QUIZ GESTION DES STOCK',
    'WORKSHOP',
    1,
    true,
    4,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'De quel type de rapport s''agit-il pour assurer la transparence et l''information des autres départeme',  -- Truncate title
    'De quel type de rapport s''agit-il pour assurer la transparence et l''information des autres départements ?',
    'Les rapports d''évaluation des fournisseurs.',
    'Les états financiers annuels.',
    'Les rapports et états liés à la gestion de son activité (performance des stocks, mouvements).',
    'Les études de marché sur les prix des matières premières.',
    ARRAY['C'],
    'OPINION',
    'QUIZ GESTION DES STOCK',
    'WORKSHOP',
    1,
    true,
    5,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle valeur est directement liée à la mission de ''veiller à l''Équité et à la justesse de chaque mo',  -- Truncate title
    'Quelle valeur est directement liée à la mission de ''veiller à l''Équité et à la justesse de chaque mouvement'' ?',
    'Innovation.',
    'Convivialité.',
    'Force du Collectif.',
    'Équité.',
    ARRAY['D'],
    'OPINION',
    'QUIZ GESTION DES STOCK',
    'WORKSHOP',
    1,
    true,
    6,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Que signifie la mission de ''Suivre les paramètres de gestion de stocks'' ?',  -- Truncate title
    'Que signifie la mission de ''Suivre les paramètres de gestion de stocks'' ?',
    'Mémoriser l''emplacement exact de chaque pièce.',
    'Définir les niveaux de stock (minimum, alerte, sécurité) et analyser les indicateurs (rotations, délais).',
    'Vérifier la validité des licences logicielles utilisées par le pôle.',
    'Organiser des réunions de ''Convivialité'' avec les fournisseurs.',
    ARRAY['B'],
    'OPINION',
    'QUIZ GESTION DES STOCK',
    'WORKSHOP',
    1,
    true,
    7,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle est la principale raison pour laquelle le Magasinage doit ''Gérer les mouvements physiques de ',  -- Truncate title
    'Quelle est la principale raison pour laquelle le Magasinage doit ''Gérer les mouvements physiques de stocks'' avec le plus grand ''Respect'' des procédures ?',
    'Pour garantir que les camions de livraison aient assez d''espace pour manœuvrer.',
    'Pour minimiser l''usure des équipements de manutention.',
    'Pour garantir la traçabilité des pièces, leur intégrité physique et la conformité des données enregistrées.',
    'Pour prouver la ''Force du Collectif'' à la Direction Générale.',
    ARRAY['C'],
    'OPINION',
    'QUIZ GESTION DES STOCK',
    'WORKSHOP',
    1,
    true,
    8,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le pôle Gestion des Stocks est qualifié de gardien du ''Stock de Sécurité''. Qu''est-ce que cela impliq',  -- Truncate title
    'Le pôle Gestion des Stocks est qualifié de gardien du ''Stock de Sécurité''. Qu''est-ce que cela implique ?',
    'Il gère uniquement les stocks de fournitures de bureau.',
    'Il contrôle le niveau de stock en fonction de la demande du marché de l''électricité.',
    'Il assure la gestion et l''état des pièces uniques sans lesquelles la centrale pourrait s''arrêter, priorité absolue pour la Maîtrise des Risques.',
    'Il est responsable de la protection des données informatiques de l''entreprise.',
    ARRAY['C'],
    'OPINION',
    'QUIZ GESTION DES STOCK',
    'WORKSHOP',
    1,
    true,
    9,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Comment le pôle Gestion des Stocks utilise-t-il l''Innovation selon la présentation ?',  -- Truncate title
    'Comment le pôle Gestion des Stocks utilise-t-il l''Innovation selon la présentation ?',
    'En inventant de nouvelles pièces de rechange.',
    'En utilisant uniquement des méthodes de gestion de stock manuelles (papier et stylo).',
    'En développant des partenariats avec des banques d''investissement.',
    'En intégrant des systèmes de gestion des stocks WMS ou des méthodes d''inventaire dynamiques pour une vision précise et en temps réel.',
    ARRAY['D'],
    'OPINION',
    'QUIZ GESTION DES STOCK',
    'WORKSHOP',
    1,
    true,
    10,
    NOW(),
    NOW()
);


-- ============================================================================
-- Quiz PROJETS (10 questions)
-- ============================================================================

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le rôle stratégique du Responsable Projets',  -- Truncate title
    'Le rôle stratégique du Responsable Projets',
    'A. Superviser le travail administratif du pôle projets',
    'B. Garantir l’alignement des projets avec les orientations stratégiques de la Direction Générale',
    'C. Assurer la maintenance des installations électriques',
    'D. Réaliser les tâches de suivi quotidien des prestataires',
    ARRAY['B'],
    'OPINION',
    'Quiz PROJETS',
    'WORKSHOP',
    1,
    true,
    1,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le Directeur Développement assure la performance du pôle projets en :',  -- Truncate title
    'Le Directeur Développement assure la performance du pôle projets en :',
    'A. Définissant les standards méthodologiques et outils de gestion de projets',
    'B. Coordonnant uniquement les recrutements liés au département',
    'C. Pilotant la feuille de route de développement et les investissements',
    'D. Supervisant les rôles : Superviseur Projets, Assistante Projets, Secrétaire',
    ARRAY['C'],
    'OPINION',
    'Quiz PROJETS',
    'WORKSHOP',
    1,
    true,
    2,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le Superviseur Projets contribue directement à la performance énergétique de CIPREL en :',  -- Truncate title
    'Le Superviseur Projets contribue directement à la performance énergétique de CIPREL en :',
    'A. Réalisant le suivi technique et opérationnel de l’avancement des projets',
    'B. Rédigeant les contrats fournisseurs',
    'C. Formant les opérateurs de production',
    'D. Gérant les archives administratives du pôle',
    ARRAY['A'],
    'OPINION',
    'Quiz PROJETS',
    'WORKSHOP',
    1,
    true,
    3,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Dans une centrale électrique, la mission du Superviseur Projets inclut :',  -- Truncate title
    'Dans une centrale électrique, la mission du Superviseur Projets inclut :',
    'A. Le contrôle du respect des normes QHSE',
    'B. L’identification des risques opérationnels et des mesures d’atténuation',
    'C. La coordination des plannings de paie',
    'D. La supervision des prestataires sur site',
    ARRAY['B'],
    'OPINION',
    'Quiz PROJETS',
    'WORKSHOP',
    1,
    true,
    4,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le rôle principal de l’Assistante Projets est :',  -- Truncate title
    'Le rôle principal de l’Assistante Projets est :',
    'A. Réaliser les audits QHSE',
    'B. Actualiser la documentation projet, préparer les dossiers et assurer la circulation des informations',
    'C. Gérer les interventions techniques sur les installations',
    'D. Élaborer les stratégies d’investissement',
    ARRAY['B'],
    'OPINION',
    'Quiz PROJETS',
    'WORKSHOP',
    1,
    true,
    5,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'La Secrétaire Projets contribue à la conformité réglementaire du pôle en :',  -- Truncate title
    'La Secrétaire Projets contribue à la conformité réglementaire du pôle en :',
    'A. Organisant les réunions, comités et ateliers projets',
    'B. Assurant l’archivage structuré pour garantir traçabilité et auditabilité',
    'C. Rédigeant les procès-verbaux, comptes rendus et courriers',
    'D. Supervisant les installations électriques basse tension',
    ARRAY['B'],
    'OPINION',
    'Quiz PROJETS',
    'WORKSHOP',
    1,
    true,
    6,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Dans le pôle Projets, la valeur Intégrité se traduit particulièrement par :',  -- Truncate title
    'Dans le pôle Projets, la valeur Intégrité se traduit particulièrement par :',
    'A. Le strict respect des délais de production électrique',
    'B. La transparence dans les processus de contractualisation et reporting',
    'C. L’innovation permanente dans les solutions techniques',
    'D. La gestion exclusive de la communication interne',
    ARRAY['B'],
    'OPINION',
    'Quiz PROJETS',
    'WORKSHOP',
    1,
    true,
    7,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Un projet est considéré comme aligné avec les standards CIPREL lorsqu’il :',  -- Truncate title
    'Un projet est considéré comme aligné avec les standards CIPREL lorsqu’il :',
    'A. Renforce la continuité et la fiabilité de la production électrique',
    'B. Respecte les normes QHSE à chaque étape',
    'C. Est livré systématiquement avant la date prévue, même si certaines étapes sont écourtées',
    'D. Intègre les critères ESG dans son approche (sécurité, éthique, environnement, impact social)',
    ARRAY['D'],
    'OPINION',
    'Quiz PROJETS',
    'WORKSHOP',
    1,
    true,
    8,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'La collaboration efficace du pôle Projets repose avant tout sur :',  -- Truncate title
    'La collaboration efficace du pôle Projets repose avant tout sur :',
    'A. Une autonomie complète de chaque rôle sans coordination',
    'B. Une synchronisation rigoureuse entre stratégie, supervision terrain et support administratif',
    'C. Une délégation totale des responsabilités à des prestataires externes',
    'D. Un reporting annuel unique',
    ARRAY['B'],
    'OPINION',
    'Quiz PROJETS',
    'WORKSHOP',
    1,
    true,
    9,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Dans la conduite d’un projet énergétique, les risques critiques à surveiller incluent :',  -- Truncate title
    'Dans la conduite d’un projet énergétique, les risques critiques à surveiller incluent :',
    'A. Les risques techniques liés aux installations',
    'B. Les risques opérationnels liés aux prestataires et à l’exécution',
    'C. Les risques administratifs liés à l’archivage des CV',
    'D. Les risques de conformité réglementaire et environnementale',
    ARRAY['D'],
    'OPINION',
    'Quiz PROJETS',
    'WORKSHOP',
    1,
    true,
    10,
    NOW(),
    NOW()
);


-- ============================================================================
-- QUIZ SUR SITD (9 questions)
-- ============================================================================

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le SIDT joue un rôle essentiel chez CIPREL. Quel est son objectif principal ?',  -- Truncate title
    'Le SIDT joue un rôle essentiel chez CIPREL. Quel est son objectif principal ?',
    'A. Garantir la sécurité et la performance des systèmes d’information',
    'B. Gérer exclusivement les contrats de prestation externe',
    'C. Accompagner la transformation digitale de CIPREL',
    'D. Assurer la disponibilité et la fiabilité des outils numériques',
    ARRAY['D'],
    'OPINION',
    'QUIZ SUR SITD',
    'WORKSHOP',
    1,
    true,
    1,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quels sont les trois pôles/fonctions clés du SIDT chez CIPREL ?',  -- Truncate title
    'Quels sont les trois pôles/fonctions clés du SIDT chez CIPREL ?',
    'A. Responsable Informatique & Veille Technologique',
    'B. Responsable Maintenance Industrielle',
    'C. Ingénieur Informatique',
    'D. Technicien Informatique',
    ARRAY['A','C','D'],
    'OPINION',
    'QUIZ SUR SITD',
    'WORKSHOP',
    1,
    true,
    2,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le rôle de l’Ingénieur Informatique dans la cybersécurité se concentre principalement sur :',  -- Truncate title
    'Le rôle de l’Ingénieur Informatique dans la cybersécurité se concentre principalement sur :',
    'A. La sensibilisation des utilisateurs aux bonnes pratiques',
    'B. L’intégration de mécanismes techniques de protection dans les architectures SI',
    'C. La rédaction des chartes et politiques de sécurité',
    'D. Le contrôle de la qualité du support de niveau 1',
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR SITD',
    'WORKSHOP',
    1,
    true,
    3,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le Technicien Informatique a pour rôle :',  -- Truncate title
    'Le Technicien Informatique a pour rôle :',
    'A. D’assurer un support de proximité auprès des collaborateurs',
    'B. De maintenir et installer les équipements',
    'C. De rédiger les politiques de cybersécurité',
    'D. De garantir la continuité opérationnelle au quotidien',
    ARRAY['A'],
    'OPINION',
    'QUIZ SUR SITD',
    'WORKSHOP',
    1,
    true,
    4,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quels piliers structurent la mission globale du SIDT chez CIPREL ?',  -- Truncate title
    'Quels piliers structurent la mission globale du SIDT chez CIPREL ?',
    'A. Moderniser et sécuriser les systèmes d’information',
    'B. Améliorer la transformation digitale',
    'C. Optimiser les lignes de production électriques',
    'D. Anticiper les évolutions technologiques',
    ARRAY['A'],
    'OPINION',
    'QUIZ SUR SITD',
    'WORKSHOP',
    1,
    true,
    5,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle valeur CIPREL se traduit le plus directement dans la mise en place d’un plan de cybersécurité',  -- Truncate title
    'Quelle valeur CIPREL se traduit le plus directement dans la mise en place d’un plan de cybersécurité robuste ?',
    'A. Innovation',
    'B. Intégrité',
    'C. Excellence',
    'D. Convivialité',
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR SITD',
    'WORKSHOP',
    1,
    true,
    6,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Dans la collaboration interne, le SIDT se distingue par :',  -- Truncate title
    'Dans la collaboration interne, le SIDT se distingue par :',
    'A. Une forte complémentarité entre technicien, ingénieur et responsable',
    'B. Un travail isolé sans contact avec les autres départements',
    'C. Un rôle stratégique pour faciliter le travail de tous',
    'D. Une contribution directe à la fiabilité opérationnelle de la centrale',
    ARRAY['C'],
    'OPINION',
    'QUIZ SUR SITD',
    'WORKSHOP',
    1,
    true,
    7,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'En matière de durabilité et d’ESG, le SIDT contribue à :',  -- Truncate title
    'En matière de durabilité et d’ESG, le SIDT contribue à :',
    'A. Renforcer la cybersécurité et protéger les données sensibles',
    'B. Réduire l’empreinte environnementale grâce à la sobriété numérique',
    'C. Concevoir la politique RH de l’entreprise',
    'D. Intégrer des solutions technologiques responsables et conformes',
    ARRAY['D'],
    'OPINION',
    'QUIZ SUR SITD',
    'WORKSHOP',
    1,
    true,
    8,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le SIDT se positionne comme :',  -- Truncate title
    'Le SIDT se positionne comme :',
    'A. Un simple support technique',
    'B. Un partenaire stratégique de la performance',
    'C. Un acteur clé de la sécurité technologique',
    'D. Un moteur de la transformation digitale durable',
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR SITD',
    'WORKSHOP',
    1,
    true,
    9,
    NOW(),
    NOW()
);


-- ============================================================================
-- Quiz Achats et Logistique (10 questions)
-- ============================================================================

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel est le double rôle principal du Pôle Achats & Logistique ?',  -- Truncate title
    'Quel est le double rôle principal du Pôle Achats & Logistique ?',
    'Gérer les ressources humaines et la communication.',
    'Être le levier de la performance durable et le garant de la continuité des opérations.',
    'Assurer le marketing et les ventes à l''international.',
    'Définir la stratégie d''entreprise et les politiques RSE.',
    ARRAY['B'],
    'OPINION',
    'Quiz Achats et Logistique',
    'WORKSHOP',
    1,
    true,
    1,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle est la mission fondamentale du pôle Achats vis-à-vis des pratiques de l''entreprise, en lien a',  -- Truncate title
    'Quelle est la mission fondamentale du pôle Achats vis-à-vis des pratiques de l''entreprise, en lien avec les valeurs ?',
    'Simplement obtenir le prix le plus bas.',
    'Être le garant de l''éthique et de la loyauté des pratiques.',
    'Rédiger tous les contrats légaux.',
    'Assurer uniquement le sourcing local.',
    ARRAY['B'],
    'OPINION',
    'Quiz Achats et Logistique',
    'WORKSHOP',
    1,
    true,
    2,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Dans le processus d''Achat, quelle mission est citée juste après le traitement des besoins et leur va',  -- Truncate title
    'Dans le processus d''Achat, quelle mission est citée juste après le traitement des besoins et leur validation ?',
    'Le traitement des contentieux douaniers.',
    'La gestion des stocks de sécurité.',
    'Assurer le suivi des achats.',
    'Négocier les budgets avec la Finance.',
    ARRAY['C'],
    'OPINION',
    'Quiz Achats et Logistique',
    'WORKSHOP',
    1,
    true,
    3,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Qui est spécifiquement responsable de la gestion des mouvements physiques de stocks, selon la présen',  -- Truncate title
    'Qui est spécifiquement responsable de la gestion des mouvements physiques de stocks, selon la présentation ?',
    'L''Acheteur.',
    'Le Responsable Achat & Logistique.',
    'Le Coordinateur Logistique et Transit.',
    'Cette fonction a été développée séparément (Gestion des Stocks).',
    ARRAY['D'],
    'OPINION',
    'Quiz Achats et Logistique',
    'WORKSHOP',
    1,
    true,
    4,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Comment l''équipe Logistique garantit-elle la conformité de l''entreprise vis-à-vis des importations ?',  -- Truncate title
    'Comment l''équipe Logistique garantit-elle la conformité de l''entreprise vis-à-vis des importations ?',
    'En s''occupant uniquement du transport maritime ?',
    'En déléguant les responsabilités douanières aux fournisseurs.',
    'En assurant le traitement et le suivi des dossiers transits et en traitant les contentieux douaniers.',
    'En évaluant les fournisseurs.',
    ARRAY['C'],
    'OPINION',
    'Quiz Achats et Logistique',
    'WORKSHOP',
    1,
    true,
    5,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle valeur est mise en évidence par le fait de "transformer l''engagement de nos partenaires en un',  -- Truncate title
    'Quelle valeur est mise en évidence par le fait de "transformer l''engagement de nos partenaires en une valeur ajoutée tangible" ?',
    'Innovation.',
    'Respect.',
    'Engagement.',
    'Équité.',
    ARRAY['C'],
    'OPINION',
    'Quiz Achats et Logistique',
    'WORKSHOP',
    1,
    true,
    6,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'L''évaluation des fournisseurs est une mission clé. En plus de la performance et de l''éthique, quelle',  -- Truncate title
    'L''évaluation des fournisseurs est une mission clé. En plus de la performance et de l''éthique, quelle valeur est assurée par l''évaluation ?',
    'Convivialité.',
    'Force du collectif.',
    'Équité.',
    'Logistique.',
    ARRAY['C'],
    'OPINION',
    'Quiz Achats et Logistique',
    'WORKSHOP',
    1,
    true,
    7,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel est le titre de la fonction qui assure la vision globale et la direction du pôle ?',  -- Truncate title
    'Quel est le titre de la fonction qui assure la vision globale et la direction du pôle ?',
    'Acheteur.',
    'Responsable Achat & Logistique.',
    'Coordinateur Achat.',
    'Coordinateur Logistique et Transit.',
    ARRAY['B'],
    'OPINION',
    'Quiz Achats et Logistique',
    'WORKSHOP',
    1,
    true,
    8,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Selon la présentation, comment la Force du Collectif s''applique-t-elle au sein du pôle ?',  -- Truncate title
    'Selon la présentation, comment la Force du Collectif s''applique-t-elle au sein du pôle ?',
    'En minimisant les interactions avec les autres départements.',
    'En favorisant la collaboration et la fluidité entre les fonctions Achat et Logistique et avec les clients internes.',
    'En négociant individuellement avec chaque fournisseur.',
    'En se concentrant uniquement sur l''optimisation des coûts.',
    ARRAY['B'],
    'OPINION',
    'Quiz Achats et Logistique',
    'WORKSHOP',
    1,
    true,
    9,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel est l''un des critères RSE majeurs intégrés par le pôle Achats lors de la sélection des fourniss',  -- Truncate title
    'Quel est l''un des critères RSE majeurs intégrés par le pôle Achats lors de la sélection des fournisseurs ?',
    'L''ancienneté du fournisseur sur le marché.',
    'La capacité à ne fournir qu''un seul type de bien.',
    'L''intégration des critères environnementaux, sociaux et de gouvernance (ESG).',
    'La rapidité de réponse aux emails.',
    ARRAY['C'],
    'OPINION',
    'Quiz Achats et Logistique',
    'WORKSHOP',
    1,
    true,
    10,
    NOW(),
    NOW()
);


-- ============================================================================
-- QUIZ – Services Généraux (7 questions)
-- ============================================================================

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'La mission principale des Services Généraux est de :',  -- Truncate title
    'La mission principale des Services Généraux est de :',
    'A. Produire de l’énergie',
    'B. Assurer un environnement de travail fonctionnel et sécurisé',
    'C. Former les nouveaux collaborateurs',
    'D. Garantir la qualité de l’eau déminéralisée',
    ARRAY['B'],
    'OPINION',
    'QUIZ – Services Généraux',
    'WORKSHOP',
    1,
    true,
    1,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Les Services Généraux interviennent principalement pour :',  -- Truncate title
    'Les Services Généraux interviennent principalement pour :',
    'A. Gérer les installations et les besoins matériels du personnel',
    'B. Superviser les turbines et la salle de commande',
    'C. Assurer la conformité financière des opérations',
    'D. Piloter la production d’énergie du site',
    ARRAY['A'],
    'OPINION',
    'QUIZ – Services Généraux',
    'WORKSHOP',
    1,
    true,
    2,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Parmi ces savoir-faire, lequel est essentiel aux Services Généraux ?',  -- Truncate title
    'Parmi ces savoir-faire, lequel est essentiel aux Services Généraux ?',
    'A. Réaliser des analyses chimiques',
    'B. Ajuster la puissance électrique du réseau',
    'C. Planifier et suivre la maintenance des installations internes',
    'D. Diagnostiquer les moteurs de turbines',
    ARRAY['C'],
    'OPINION',
    'QUIZ – Services Généraux',
    'WORKSHOP',
    1,
    true,
    3,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel savoir-être est indispensable dans ce métier ?',  -- Truncate title
    'Quel savoir-être est indispensable dans ce métier ?',
    'A. L’individualisme',
    'B. La disponibilité et le sens du service',
    'C. L’agressivité',
    'D. La distanciation totale',
    ARRAY['B'],
    'OPINION',
    'QUIZ – Services Généraux',
    'WORKSHOP',
    1,
    true,
    4,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelle interaction est typique des Services Généraux ?',  -- Truncate title
    'Quelle interaction est typique des Services Généraux ?',
    'A. Dialogue avec la salle de commande pour ajuster la production',
    'B. Coordination quotidienne avec tous les départements internes',
    'C. Intervention pour calibrer les équipements de laboratoire chimique',
    'D. Relation avec les autorités du réseau électrique',
    ARRAY['B'],
    'OPINION',
    'QUIZ – Services Généraux',
    'WORKSHOP',
    1,
    true,
    5,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'La fierté principale du métier des Services Généraux réside dans :',  -- Truncate title
    'La fierté principale du métier des Services Généraux réside dans :',
    'A. La gestion du réseau électrique national',
    'B. L’optimisation de la production d’énergie',
    'C. Le fait que tout fonctionne, soit disponible et prêt pour les équipes',
    'D. Le pilotage des installations de la centrale',
    ARRAY['C'],
    'OPINION',
    'QUIZ – Services Généraux',
    'WORKSHOP',
    1,
    true,
    6,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quel type de savoir les Services Généraux doivent-ils maîtriser ?',  -- Truncate title
    'Quel type de savoir les Services Généraux doivent-ils maîtriser ?',
    'A. Les normes d’hygiène, sécurité et gestion des infrastructures',
    'B. Les algorithmes d’ajustement de tension électrique',
    'C. Les procédures de mise en service des turbines',
    'D. Le fonctionnement chimique de l’eau déminéralisée',
    ARRAY['A'],
    'OPINION',
    'QUIZ – Services Généraux',
    'WORKSHOP',
    1,
    true,
    7,
    NOW(),
    NOW()
);


-- ============================================================================
-- QUIZ SUR QSE RSE SURETE (10 questions)
-- ============================================================================

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le rôle principal du Pôle QSE-RSE & Sûreté, c’est :',  -- Truncate title
    'Le rôle principal du Pôle QSE-RSE & Sûreté, c’est :',
    'A. Superviser uniquement la qualité des produits finis',
    'B. Garantir la qualité, la sécurité, la sûreté et la responsabilité sociale dans toutes les activités',
    'C. Gérer les stocks et l’approvisionnement',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR QSE RSE SURETE',
    'WORKSHOP',
    1,
    true,
    1,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'La mission première du service QSE-RSE est de :',  -- Truncate title
    'La mission première du service QSE-RSE est de :',
    'A. Faire respecter la réglementation environnementale',
    'B. Intégrer la durabilité et la responsabilité dans chaque processus de l’entreprise',
    'C. Établir des statistiques sur les incidents',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR QSE RSE SURETE',
    'WORKSHOP',
    1,
    true,
    2,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le service Sûreté a pour rôle de :',  -- Truncate title
    'Le service Sûreté a pour rôle de :',
    'A. Protéger les installations et le personnel contre les risques internes et externes',
    'B. Gérer la propreté du site',
    'C. Surveiller uniquement la centrale',
    NULL,
    ARRAY['A'],
    'OPINION',
    'QUIZ SUR QSE RSE SURETE',
    'WORKSHOP',
    1,
    true,
    3,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    '“Agir responsable, opérer en sécurité, exceller en qualité” résume :',  -- Truncate title
    '“Agir responsable, opérer en sécurité, exceller en qualité” résume :',
    'A. Le slogan de la Démarche Compétence',
    'B. Le slogan du Pôle QSE-RSE & Sûreté',
    'C. Le plan d’urgence interne',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR QSE RSE SURETE',
    'WORKSHOP',
    1,
    true,
    4,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Les métiers du QSE-RSE et de la Sûreté contribuent à :',  -- Truncate title
    'Les métiers du QSE-RSE et de la Sûreté contribuent à :',
    'A. La performance économique uniquement',
    'B. La performance durable et la confiance interne et externe',
    'C. L’optimisation des budgets',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR QSE RSE SURETE',
    'WORKSHOP',
    1,
    true,
    5,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Pour exceller dans ce métier, il faut avant tout :',  -- Truncate title
    'Pour exceller dans ce métier, il faut avant tout :',
    'A. Connaître les lois et procédures applicables et anticiper les risques',
    'B. Avoir un goût prononcé pour le risque',
    'C. Être indifférent aux normes',
    NULL,
    ARRAY['A'],
    'OPINION',
    'QUIZ SUR QSE RSE SURETE',
    'WORKSHOP',
    1,
    true,
    6,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Parmi les valeurs FEERIC, laquelle illustre le mieux la culture QSE-RSE ?',  -- Truncate title
    'Parmi les valeurs FEERIC, laquelle illustre le mieux la culture QSE-RSE ?',
    'A. Force du collectif',
    'B. Innovation',
    'C. Respect',
    NULL,
    ARRAY['C'],
    'OPINION',
    'QUIZ SUR QSE RSE SURETE',
    'WORKSHOP',
    1,
    true,
    7,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'En matière de Sûreté, chaque employé de CIPREL est :',  -- Truncate title
    'En matière de Sûreté, chaque employé de CIPREL est :',
    'A. Un acteur passif qui suit les ordres',
    'B. Le premier responsable de la sûreté au quotidien',
    'C. Exempté des consignes de sécurité',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR QSE RSE SURETE',
    'WORKSHOP',
    1,
    true,
    8,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Les partenaires externes du Pôle QSE-RSE incluent :',  -- Truncate title
    'Les partenaires externes du Pôle QSE-RSE incluent :',
    'A. Les autorités de régulation et organismes de certification',
    'B. Les fournisseurs d’énergie',
    'C. Les médias',
    NULL,
    ARRAY['A'],
    'OPINION',
    'QUIZ SUR QSE RSE SURETE',
    'WORKSHOP',
    1,
    true,
    9,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'La plus grande fierté des équipes QSE-RSE & Sûreté, c’est :',  -- Truncate title
    'La plus grande fierté des équipes QSE-RSE & Sûreté, c’est :',
    'A. Ne pas avoir de rapports à rédiger',
    'B. Garantir que chaque collaborateur rentre chez lui sain et sauf chaque jour',
    'C. Gérer la logistique du site',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR QSE RSE SURETE',
    'WORKSHOP',
    1,
    true,
    10,
    NOW(),
    NOW()
);


-- ============================================================================
-- QUIZ SUR LA PRODUCTION (9 questions)
-- ============================================================================

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'La Production à CIPREL, c’est avant tout :',  -- Truncate title
    'La Production à CIPREL, c’est avant tout :',
    'A. Une fonction administrative',
    'B. Le cœur opérationnel de la centrale électrique',
    'C. Une activité de maintenance préventive',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR LA PRODUCTION',
    'WORKSHOP',
    1,
    true,
    1,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le Pôle Production est composé de :',  -- Truncate title
    'Le Pôle Production est composé de :',
    'A. La Conduite et la Maintenance',
    'B. La Conduite et la Chimie',
    'C. La Maintenance et le QSE-RSE',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR LA PRODUCTION',
    'WORKSHOP',
    1,
    true,
    2,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Les techniciens Conduite ont pour rôle principal :',  -- Truncate title
    'Les techniciens Conduite ont pour rôle principal :',
    'A. Réaliser des audits de sécurité',
    'B. Veiller au bon fonctionnement des machines sur le terrain',
    'C. Élaborer les plans de communication interne',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR LA PRODUCTION',
    'WORKSHOP',
    1,
    true,
    3,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Les conducteurs d’installation sont responsables de :',  -- Truncate title
    'Les conducteurs d’installation sont responsables de :',
    'A. L’animation des ateliers RH',
    'B. Le pilotage et la surveillance des installations depuis la salle de commande',
    'C. La maintenance des systèmes électriques',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR LA PRODUCTION',
    'WORKSHOP',
    1,
    true,
    4,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Les chimistes ont pour mission :',  -- Truncate title
    'Les chimistes ont pour mission :',
    'A. Produire et contrôler la qualité de l’eau déminéralisée et de la vapeur',
    'B. Surveiller les stocks de combustibles',
    'C. Vérifier les comptes de production',
    NULL,
    ARRAY['A'],
    'OPINION',
    'QUIZ SUR LA PRODUCTION',
    'WORKSHOP',
    1,
    true,
    5,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le savoir-faire dans la Production, c’est :',  -- Truncate title
    'Le savoir-faire dans la Production, c’est :',
    'A. La capacité à diagnostiquer, piloter et coordonner les installations',
    'B. L’attitude positive en équipe',
    'C. La connaissance des consignes de sécurité',
    NULL,
    ARRAY['A'],
    'OPINION',
    'QUIZ SUR LA PRODUCTION',
    'WORKSHOP',
    1,
    true,
    6,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le savoir-être attendu d’un opérateur de Conduite comprend :',  -- Truncate title
    'Le savoir-être attendu d’un opérateur de Conduite comprend :',
    'A. L’autonomie, la créativité et la curiosité scientifique',
    'B. La rigueur, la réactivité, la vigilance et l’esprit d’équipe',
    'C. L’ambition et le goût du risque',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR LA PRODUCTION',
    'WORKSHOP',
    1,
    true,
    7,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Les partenaires internes du Pôle Production sont :',  -- Truncate title
    'Les partenaires internes du Pôle Production sont :',
    'A. Les autorités électriques',
    'B. Maintenance, QSE-RSE, RH, Projets, Achats & logistique',
    'C. Les fournisseurs de combustibles',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR LA PRODUCTION',
    'WORKSHOP',
    1,
    true,
    8,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le slogan du Pôle Production est :',  -- Truncate title
    'Le slogan du Pôle Production est :',
    'A. “Nos installations, notre réussite.”',
    'B. “Nos compétences, notre énergie.”',
    'C. “Produire mieux, dépenser moins.”',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR LA PRODUCTION',
    'WORKSHOP',
    1,
    true,
    9,
    NOW(),
    NOW()
);


-- ============================================================================
-- QUIZ SUR LA PHASE INTRODUCTIVE (6 questions)
-- ============================================================================

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'La démarche compétence c’est :',  -- Truncate title
    'La démarche compétence c’est :',
    'Un moyen de retenir les potentiels et les talents',
    'Un levier de performance',
    'Un levier de certification qualité',
    NULL,
    ARRAY['B'],
    'OPINION',
    'QUIZ SUR LA PHASE INTRODUCTIVE',
    'WORKSHOP',
    1,
    true,
    1,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'La démarche compétence est la responsabilité de :',  -- Truncate title
    'La démarche compétence est la responsabilité de :',
    'Tous',
    'La direction générale',
    'Le groupe ERANOVE',
    NULL,
    ARRAY['A'],
    'OPINION',
    'QUIZ SUR LA PHASE INTRODUCTIVE',
    'WORKSHOP',
    1,
    true,
    2,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Les compétences sont essentiellement :',  -- Truncate title
    'Les compétences sont essentiellement :',
    'Techniques',
    'Comportementales',
    'Fondamentales',
    NULL,
    ARRAY['A ET B'],
    'OPINION',
    'QUIZ SUR LA PHASE INTRODUCTIVE',
    'WORKSHOP',
    1,
    true,
    3,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le savoir-faire c’est :',  -- Truncate title
    'Le savoir-faire c’est :',
    'La capacité à assurer des tâches techniques ou managériales.',
    'L’ensemble des capacités cognitives et relationnelles',
    'La capacité à bien faire les choses',
    NULL,
    ARRAY['A'],
    'OPINION',
    'QUIZ SUR LA PHASE INTRODUCTIVE',
    'WORKSHOP',
    1,
    true,
    4,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Le savoir être c’est',  -- Truncate title
    'Le savoir être c’est',
    'L’ensemble des connaissances cumulées grâce à l’expérience',
    'La capacité à agir dans son environnement',
    'L’ensemble des capacités cognitives et relationnelles',
    NULL,
    ARRAY['C'],
    'OPINION',
    'QUIZ SUR LA PHASE INTRODUCTIVE',
    'WORKSHOP',
    1,
    true,
    5,
    NOW(),
    NOW()
);

INSERT INTO public.questions (
    title,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category,
    quiz_type,
    etape,
    points,
    active,
    order_index,
    created_at,
    updated_at
) VALUES (
    'Quelles sont les étapes de la démarche compétence :',  -- Truncate title
    'Quelles sont les étapes de la démarche compétence :',
    'Identification des compétences requises',
    'Développer les compétences',
    'Challenger les plus méritants',
    'Cartographier et évaluer les compétences acquises',
    ARRAY['A','B','D','E','G'],
    'OPINION',
    'QUIZ SUR LA PHASE INTRODUCTIVE',
    'WORKSHOP',
    1,
    true,
    6,
    NOW(),
    NOW()
);

-- ============================================================================
-- Summary: Imported 91 questions from 10 quizzes
-- ============================================================================

COMMIT;

-- Verify the import
SELECT quiz_type, COUNT(*) as count FROM public.questions WHERE etape = 'WORKSHOP' GROUP BY quiz_type ORDER BY quiz_type;
