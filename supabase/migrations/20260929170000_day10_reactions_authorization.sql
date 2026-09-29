-- AI-KCP Day 10.4
-- Move reaction creation onto the centralized authorization framework.
--
-- Existing ownership and write-status protections are preserved.
-- PostgreSQL/RLS remains the authoritative enforcement boundary.

INSERT INTO public.authorization_permissions
  (role, resource, action, is_allowed)
VALUES
  ('user',      'reactions', 'create', true),
  ('user',      'reactions', 'edit',   false),
  ('editor',    'reactions', 'create', true),
  ('editor',    'reactions', 'edit',   true),
  ('moderator', 'reactions', 'create', true),
  ('moderator', 'reactions', 'edit',   true),
  ('admin',     'reactions', 'create', true),
  ('admin',     'reactions', 'edit',   true)
ON CONFLICT (role, resource, action)
DO UPDATE SET
  is_allowed = EXCLUDED.is_allowed,
  updated_at = now();

DROP POLICY IF EXISTS "reactions_insert_user" ON public.reactions;

CREATE POLICY "reactions_insert_authorized"
ON public.reactions
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_permission('reactions', 'create')
  AND is_write_allowed()
  AND user_id = auth.uid()
);
