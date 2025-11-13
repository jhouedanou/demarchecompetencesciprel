-- ============================================
-- SCRIPT SQL POUR LES WORKSHOPS MÉTIERS CIPREL
-- ============================================
-- Ce script crée les tables nécessaires pour gérer les workshops métiers
-- dans Supabase pour la plateforme de démarche compétences CIPREL

-- Désactiver temporairement les vérifications de clés étrangères
BEGIN;

-- ============================================
-- 1. TABLE: workshops
-- ============================================
-- Stocke les informations des workshops par métier
CREATE TABLE IF NOT EXISTS public.workshops (
    id SERIAL PRIMARY KEY,
    metier_id INTEGER NOT NULL UNIQUE,
    metier_nom VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    publication_date TIMESTAMPTZ,
    onedrive_link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_workshops_metier_id ON public.workshops(metier_id);
CREATE INDEX IF NOT EXISTS idx_workshops_is_active ON public.workshops(is_active);

-- Commentaires pour documentation
COMMENT ON TABLE public.workshops IS 'Contient les workshops métiers avec leurs liens OneDrive et statut de publication';
COMMENT ON COLUMN public.workshops.metier_id IS 'Identifiant unique du métier (1-12)';
COMMENT ON COLUMN public.workshops.metier_nom IS 'Nom du métier CIPREL';
COMMENT ON COLUMN public.workshops.is_active IS 'Statut d''activation du workshop';
COMMENT ON COLUMN public.workshops.publication_date IS 'Date de publication du workshop';
COMMENT ON COLUMN public.workshops.onedrive_link IS 'Lien vers le dossier OneDrive du workshop';

-- ============================================
-- 2. TABLE: workshop_resources
-- ============================================
-- Stocke les ressources documentaires associées à chaque workshop
CREATE TABLE IF NOT EXISTS public.workshop_resources (
    id SERIAL PRIMARY KEY,
    workshop_id INTEGER NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- 'document', 'video', 'presentation', 'guide'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_size INTEGER, -- Taille en bytes
    file_format VARCHAR(20), -- 'pdf', 'docx', 'pptx', 'mp4', etc.
    display_order INTEGER DEFAULT 0,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_workshop_resources_workshop_id ON public.workshop_resources(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_resources_type ON public.workshop_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_workshop_resources_public ON public.workshop_resources(is_public);

-- Commentaires pour documentation
COMMENT ON TABLE public.workshop_resources IS 'Ressources documentaires et médias associées aux workshops';
COMMENT ON COLUMN public.workshop_resources.resource_type IS 'Type de ressource: document, video, presentation, guide';
COMMENT ON COLUMN public.workshop_resources.display_order IS 'Ordre d''affichage des ressources (0 = premier)';

-- ============================================
-- 3. TABLE: workshop_access_logs
-- ============================================
-- Enregistre les accès aux workshops pour analytics
CREATE TABLE IF NOT EXISTS public.workshop_access_logs (
    id SERIAL PRIMARY KEY,
    workshop_id INTEGER NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    access_type VARCHAR(50) NOT NULL DEFAULT 'view', -- 'view', 'download', 'share'
    resource_id INTEGER REFERENCES public.workshop_resources(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT
);

-- Index pour optimiser les recherches analytics
CREATE INDEX IF NOT EXISTS idx_workshop_access_workshop_id ON public.workshop_access_logs(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_access_user_id ON public.workshop_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_access_date ON public.workshop_access_logs(accessed_at);

-- Commentaires pour documentation
COMMENT ON TABLE public.workshop_access_logs IS 'Logs d''accès aux workshops pour analytics et suivi';
COMMENT ON COLUMN public.workshop_access_logs.access_type IS 'Type d''action: view, download, share';

-- ============================================
-- 4. FONCTION: Mise à jour automatique du timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_workshops_updated_at ON public.workshops;
CREATE TRIGGER update_workshops_updated_at
    BEFORE UPDATE ON public.workshops
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_workshop_resources_updated_at ON public.workshop_resources;
CREATE TRIGGER update_workshop_resources_updated_at
    BEFORE UPDATE ON public.workshop_resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. POLITIQUES RLS (Row Level Security)
-- ============================================

-- Activer RLS sur les tables
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_access_logs ENABLE ROW LEVEL SECURITY;

-- ===== WORKSHOPS POLICIES =====

-- Tous peuvent voir les workshops actifs
DROP POLICY IF EXISTS "Tous peuvent voir les workshops actifs" ON public.workshops;
CREATE POLICY "Tous peuvent voir les workshops actifs"
    ON public.workshops
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Les admins peuvent tout voir et modifier
DROP POLICY IF EXISTS "Les admins peuvent tout gérer" ON public.workshops;
CREATE POLICY "Les admins peuvent tout gérer"
    ON public.workshops
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ===== WORKSHOP RESOURCES POLICIES =====

-- Tous peuvent voir les ressources publiques des workshops actifs
DROP POLICY IF EXISTS "Voir ressources publiques des workshops actifs" ON public.workshop_resources;
CREATE POLICY "Voir ressources publiques des workshops actifs"
    ON public.workshop_resources
    FOR SELECT
    TO authenticated
    USING (
        is_public = true
        AND EXISTS (
            SELECT 1 FROM public.workshops
            WHERE workshops.id = workshop_resources.workshop_id
            AND workshops.is_active = true
        )
    );

-- Les admins peuvent tout gérer
DROP POLICY IF EXISTS "Les admins peuvent gérer les ressources" ON public.workshop_resources;
CREATE POLICY "Les admins peuvent gérer les ressources"
    ON public.workshop_resources
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ===== WORKSHOP ACCESS LOGS POLICIES =====

-- Les utilisateurs peuvent créer leurs propres logs
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer des logs" ON public.workshop_access_logs;
CREATE POLICY "Les utilisateurs peuvent créer des logs"
    ON public.workshop_access_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Les utilisateurs peuvent voir leurs propres logs
DROP POLICY IF EXISTS "Les utilisateurs voient leurs logs" ON public.workshop_access_logs;
CREATE POLICY "Les utilisateurs voient leurs logs"
    ON public.workshop_access_logs
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Les admins peuvent tout voir
DROP POLICY IF EXISTS "Les admins voient tous les logs" ON public.workshop_access_logs;
CREATE POLICY "Les admins voient tous les logs"
    ON public.workshop_access_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- 6. INSERTION DES DONNÉES INITIALES
-- ============================================
-- Insertion des 12 métiers CIPREL avec workshops inactifs par défaut

INSERT INTO public.workshops (metier_id, metier_nom, is_active, publication_date, onedrive_link)
VALUES
    (1, 'Production', false, NULL, NULL),
    (2, 'SIDT', false, NULL, NULL),
    (3, 'Maintenance', false, NULL, NULL),
    (4, 'QSE-RSE/Sûreté', false, NULL, NULL),
    (5, 'Contrôle Interne', false, NULL, NULL),
    (6, 'Stocks', false, NULL, NULL),
    (7, 'RH/Juridique', false, NULL, NULL),
    (8, 'Services Généraux', false, NULL, NULL),
    (9, 'DFC', false, NULL, NULL),
    (10, 'Projets', false, NULL, NULL),
    (11, 'Achats & Logistique', false, NULL, NULL),
    (12, 'Direction', false, NULL, NULL)
ON CONFLICT (metier_id) DO NOTHING;

-- ============================================
-- 7. VUES UTILES POUR L'ADMINISTRATION
-- ============================================

-- Vue pour statistiques des workshops
CREATE OR REPLACE VIEW public.workshop_stats AS
SELECT
    w.id,
    w.metier_nom,
    w.is_active,
    w.publication_date,
    COUNT(DISTINCT wr.id) as total_resources,
    COUNT(DISTINCT wal.user_id) as unique_visitors,
    COUNT(wal.id) as total_views,
    MAX(wal.accessed_at) as last_access
FROM public.workshops w
LEFT JOIN public.workshop_resources wr ON w.id = wr.workshop_id
LEFT JOIN public.workshop_access_logs wal ON w.id = wal.workshop_id
GROUP BY w.id, w.metier_nom, w.is_active, w.publication_date
ORDER BY w.metier_id;

-- Commentaire sur la vue
COMMENT ON VIEW public.workshop_stats IS 'Statistiques consolidées des workshops pour le tableau de bord admin';

-- ============================================
-- 8. FONCTIONS UTILES
-- ============================================

-- Fonction pour enregistrer un accès au workshop
CREATE OR REPLACE FUNCTION public.log_workshop_access(
    p_workshop_id INTEGER,
    p_access_type VARCHAR(50) DEFAULT 'view',
    p_resource_id INTEGER DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.workshop_access_logs (
        workshop_id,
        user_id,
        access_type,
        resource_id,
        accessed_at
    )
    VALUES (
        p_workshop_id,
        auth.uid(),
        p_access_type,
        p_resource_id,
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaire sur la fonction
COMMENT ON FUNCTION public.log_workshop_access IS 'Enregistre un accès utilisateur à un workshop pour analytics';

-- ============================================
-- 9. GRANTS ET PERMISSIONS
-- ============================================

-- Permissions pour les utilisateurs authentifiés
GRANT SELECT, INSERT ON public.workshops TO authenticated;
GRANT SELECT, INSERT ON public.workshop_resources TO authenticated;
GRANT SELECT, INSERT ON public.workshop_access_logs TO authenticated;
GRANT SELECT ON public.workshop_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_workshop_access TO authenticated;

-- Permissions pour les admins (via les policies RLS)
-- Les permissions complètes sont gérées par les policies RLS ci-dessus

COMMIT;

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Pour vérifier que tout s'est bien passé :
-- SELECT * FROM public.workshops;
-- SELECT * FROM public.workshop_stats;
