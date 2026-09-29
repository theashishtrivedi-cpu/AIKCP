-- AI-KCP Day 10.3
-- Move comment creation onto the centralized authorization framework.
--
-- Existing ownership and write-status protections are preserved.
-- PostgreSQL/RLS remains the authoritative enforcement boundary.

INSERT INTO public.authorization_permissions
  (role, resource, action, is_allowed)
VALUES
  ('user',      'comments', 'create', true),
  ('user',      'comments', 'edit',   false),
  ('editor',    'comments', 'create', true),
  ('editor',    'comments', 'edit',   true),
  ('moderator', 'comments', 'create', true),
  ('moderator', 'comments', 'edit',   true),
  ('admin',     'comments', 'create', true),
  ('admin',     'comments', 'edit',   true)
ON CONFLICT (role, resource, action)
DO UPDATE SET
  is_allowed = EXCLUDED.is_allowed,
  updated_at = now();

DROP POLICY IF EXISTS "comments_insert_user" ON public.comments;

CREATE POLICY "comments_insert_authorized"
ON public.comments
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_permission('comments', 'create')
  AND is_write_allowed()
  AND author_id = auth.uid()
);
