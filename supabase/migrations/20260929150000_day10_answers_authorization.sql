-- AI-KCP Day 10.2
-- Move answer creation onto the centralized authorization framework.
--
-- Existing ownership and write-status protections are preserved.
-- PostgreSQL/RLS remains the authoritative enforcement boundary.

INSERT INTO public.authorization_permissions
  (role, resource, action, is_allowed)
VALUES
  ('user',      'answers', 'create', true),
  ('user',      'answers', 'edit',   false),
  ('editor',    'answers', 'create', true),
  ('editor',    'answers', 'edit',   true),
  ('moderator', 'answers', 'create', true),
  ('moderator', 'answers', 'edit',   true),
  ('admin',     'answers', 'create', true),
  ('admin',     'answers', 'edit',   true)
ON CONFLICT (role, resource, action)
DO UPDATE SET
  is_allowed = EXCLUDED.is_allowed,
  updated_at = now();

DROP POLICY IF EXISTS "answers_insert_user" ON public.answers;

CREATE POLICY "answers_insert_authorized"
ON public.answers
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_permission('answers', 'create')
  AND is_write_allowed()
  AND author_id = auth.uid()
);
