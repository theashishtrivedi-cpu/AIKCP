-- AI-KCP Day 10.7
-- Move Articles authorization onto the centralized permission framework.
--
-- Existing ownership, write-status, visibility, and moderation behavior
-- are preserved. PostgreSQL/RLS remains the authoritative enforcement boundary.

INSERT INTO public.authorization_permissions
  (role, resource, action, is_allowed)
VALUES
  ('user',      'articles', 'create', false),
  ('user',      'articles', 'edit',   false),
  ('editor',    'articles', 'create', true),
  ('editor',    'articles', 'edit',   true),
  ('moderator', 'articles', 'create', true),
  ('moderator', 'articles', 'edit',   true),
  ('admin',     'articles', 'create', true),
  ('admin',     'articles', 'edit',   true)
ON CONFLICT (role, resource, action)
DO UPDATE SET
  is_allowed = EXCLUDED.is_allowed,
  updated_at = now();

DROP POLICY IF EXISTS "articles_insert_editor"
ON public.articles;

CREATE POLICY "articles_insert_authorized"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_permission('articles', 'create')
  AND is_write_allowed()
  AND author_id = auth.uid()
);

DROP POLICY IF EXISTS "articles_update_owner_moderator_admin"
ON public.articles;

CREATE POLICY "articles_update_authorized"
ON public.articles
FOR UPDATE
TO authenticated
USING (
  (
    public.has_permission('articles', 'edit')
    AND author_id = auth.uid()
    AND is_write_allowed()
  )
  OR public.is_moderator()
)
WITH CHECK (
  (
    public.has_permission('articles', 'edit')
    AND author_id = auth.uid()
    AND is_write_allowed()
  )
  OR public.is_moderator()
);
