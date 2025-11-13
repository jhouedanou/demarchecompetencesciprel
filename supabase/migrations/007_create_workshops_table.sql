-- Créer la table workshops pour gérer les workshops métiers
-- Cette table permet de configurer et publier les workshops par métier

CREATE TABLE IF NOT EXISTS public.workshops (
  id BIGSERIAL PRIMARY KEY,
  metier_id INTEGER NOT NULL,
  metier_nom VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT false NOT NULL,
  publication_date TIMESTAMP WITH TIME ZONE,
  onedrive_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT workshops_unique_metier UNIQUE(metier_id)
);

-- Ajouter un commentaire sur la table
COMMENT ON TABLE public.workshops IS 'Gestion des workshops métiers avec liens OneDrive et configuration de publication';
COMMENT ON COLUMN public.workshops.metier_id IS 'ID unique du métier';
COMMENT ON COLUMN public.workshops.metier_nom IS 'Nom du métier';
COMMENT ON COLUMN public.workshops.is_active IS 'Indique si le workshop est actif';
COMMENT ON COLUMN public.workshops.publication_date IS 'Date de publication du workshop';
COMMENT ON COLUMN public.workshops.onedrive_link IS 'Lien OneDrive vers les ressources du workshop';

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_workshops_metier_id ON public.workshops(metier_id);
CREATE INDEX IF NOT EXISTS idx_workshops_is_active ON public.workshops(is_active);
CREATE INDEX IF NOT EXISTS idx_workshops_publication_date ON public.workshops(publication_date);

-- Activer RLS (Row Level Security)
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous les utilisateurs authentifiés de voir les workshops actifs
CREATE POLICY "Anyone can view active workshops" ON public.workshops
  FOR SELECT
  USING (is_active = true);

-- Politique pour permettre aux administrateurs de gérer tous les workshops
CREATE POLICY "Admins can manage workshops" ON public.workshops
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- Fonction pour mettre à jour la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_workshops_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour la colonne updated_at automatiquement
CREATE TRIGGER workshops_update_timestamp
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_workshops_updated_at();
