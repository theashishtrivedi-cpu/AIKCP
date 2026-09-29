-- AI-KCP Day 10.5
-- Move report creation onto the centralized authorization framework.
--
-- Existing reporter ownership/null-target behavior and write-status
-- enforcement are preserved.
-- PostgreSQL/RLS remains the authoritative enforcement boundary.

INSERT INTO public.authorization_permissions
  (role, resource, action, is_allowed)
VALUES
  ('user',      'reports', 'create', true),
  ('user',      'reports', 'edit',   false),
  ('editor',    'reports', 'create', true),
  ('editor',    'reports', 'edit',   false),
  ('moderator', 'reports', 'create', true),
  ('moderator', 'reports', 'edit',   true),
  ('admin',     'reports', 'create', true),
  ('admin',     'reports', 'edit',   true)
ON CONFLICT (role, resource, action)
DO UPDATE SET
  is_allowed = EXCLUDED.is_allowed,
  updated_at = now();

DROP POLICY IF EXISTS "reports_insert_user" ON public.reports;

CREATE POLICY "reports_insert_authorized"
ON public.reports
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_permission('reports', 'create')
  AND is_write_allowed()
  AND (
    reporter_id = auth.uid()
    OR reporter_id IS NULL
  )
);
