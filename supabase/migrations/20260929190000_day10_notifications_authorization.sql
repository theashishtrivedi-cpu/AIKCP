-- AI-KCP Day 10.6
-- Move notification creation onto the centralized authorization framework.
--
-- Notifications remain an administrator/system-generated resource.
-- Existing recipient SELECT/UPDATE/DELETE behavior is preserved.
-- PostgreSQL/RLS remains the authoritative enforcement boundary.

INSERT INTO public.authorization_permissions
  (role, resource, action, is_allowed)
VALUES
  ('user',      'notifications', 'create', false),
  ('user',      'notifications', 'edit',   false),
  ('editor',    'notifications', 'create', false),
  ('editor',    'notifications', 'edit',   false),
  ('moderator', 'notifications', 'create', false),
  ('moderator', 'notifications', 'edit',   false),
  ('admin',     'notifications', 'create', true),
  ('admin',     'notifications', 'edit',   true)
ON CONFLICT (role, resource, action)
DO UPDATE SET
  is_allowed = EXCLUDED.is_allowed,
  updated_at = now();

DROP POLICY IF EXISTS "notifications_insert_system_admin"
ON public.notifications;

CREATE POLICY "notifications_insert_authorized"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_permission('notifications', 'create')
  AND public.is_admin()
);
