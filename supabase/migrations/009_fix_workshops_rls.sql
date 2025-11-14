-- Migration 009: Amélioration des politiques RLS pour workshops
-- Cette migration corrige et améliore les politiques de sécurité

-- D'abord, supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Anyone can view active workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can manage workshops" ON public.workshops;

-- 1. Politique de lecture : Tout le monde peut voir les workshops actifs
-- Les utilisateurs authentifiés et non authentifiés peuvent voir les workshops actifs
CREATE POLICY "Public can view active workshops" ON public.workshops
  FOR SELECT
  USING (is_active = true);

-- 2. Politique de lecture pour les admins : Ils peuvent voir TOUS les workshops
-- Les admins peuvent voir même les workshops inactifs
CREATE POLICY "Admins can view all workshops" ON public.workshops
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ADMIN', 'MANAGER')
    )
  );

-- 3. Politique d'insertion : Seuls les admins peuvent créer des workshops
CREATE POLICY "Admins can insert workshops" ON public.workshops
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ADMIN', 'MANAGER')
    )
  );

-- 4. Politique de mise à jour : Seuls les admins peuvent modifier des workshops
CREATE POLICY "Admins can update workshops" ON public.workshops
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ADMIN', 'MANAGER')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ADMIN', 'MANAGER')
    )
  );

-- 5. Politique de suppression : Seuls les admins peuvent supprimer des workshops
CREATE POLICY "Admins can delete workshops" ON public.workshops
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ADMIN', 'MANAGER')
    )
  );

-- Vérifier que RLS est activé
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- Afficher les politiques créées
DO $$
BEGIN
  RAISE NOTICE 'RLS Policies for workshops table have been updated successfully';
  RAISE NOTICE '- Public users can view active workshops';
  RAISE NOTICE '- Admins can view all workshops (active and inactive)';
  RAISE NOTICE '- Only admins can insert, update, and delete workshops';
END $$;
