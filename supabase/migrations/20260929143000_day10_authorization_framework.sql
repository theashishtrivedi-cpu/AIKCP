-- AI-KCP Day 10
-- Centralized, administrator-configurable authorization framework.
--
-- Default-deny model:
--   * A permission must explicitly exist and be enabled.
--   * User must have an active profile.
--   * Permission is resolved from the user's current role.
--   * Administrators manage the permission configuration.
--
-- This migration intentionally does not modify the existing is_* helpers.
-- It introduces the centralized permission path incrementally.

CREATE TABLE IF NOT EXISTS public.authorization_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.user_role NOT NULL,
  resource text NOT NULL,
  action text NOT NULL,
  is_allowed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT authorization_permissions_role_resource_action_key
    UNIQUE (role, resource, action),

  CONSTRAINT authorization_permissions_resource_check
    CHECK (length(trim(resource)) > 0),

  CONSTRAINT authorization_permissions_action_check
    CHECK (length(trim(action)) > 0)
);

ALTER TABLE public.authorization_permissions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_permission(
  p_resource text,
  p_action text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(
    (
      SELECT ap.is_allowed
      FROM public.authorization_permissions ap
      JOIN public.profiles p
        ON p.role = ap.role
      WHERE p.id = auth.uid()
        AND p.status = 'active'::public.user_status
        AND ap.resource = p_resource
        AND ap.action = p_action
      LIMIT 1
    ),
    false
  );
$function$;

REVOKE EXECUTE ON FUNCTION public.has_permission(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_permission(text, text) TO authenticated;

CREATE POLICY "authorization_permissions_select_admin"
ON public.authorization_permissions
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "authorization_permissions_insert_admin"
ON public.authorization_permissions
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "authorization_permissions_update_admin"
ON public.authorization_permissions
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "authorization_permissions_delete_admin"
ON public.authorization_permissions
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Initial question-authoring configuration.
-- This replaces the old hard-coded role rule with administrator-configurable data.
INSERT INTO public.authorization_permissions
  (role, resource, action, is_allowed)
VALUES
  ('user',      'questions', 'create', false),
  ('user',      'questions', 'edit',   false),
  ('editor',    'questions', 'create', true),
  ('editor',    'questions', 'edit',   true),
  ('moderator', 'questions', 'create', true),
  ('moderator', 'questions', 'edit',   true),
  ('admin',     'questions', 'create', true),
  ('admin',     'questions', 'edit',   true)
ON CONFLICT (role, resource, action)
DO UPDATE SET
  is_allowed = EXCLUDED.is_allowed,
  updated_at = now();

-- Replace the removed Day-9 hard-coded question INSERT rule.
DROP POLICY IF EXISTS "questions_insert_editor" ON public.questions;

CREATE POLICY "questions_insert_authorized"
ON public.questions
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_permission('questions', 'create')
  AND author_id = auth.uid()
);

COMMENT ON TABLE public.authorization_permissions IS
'Centralized administrator-configurable authorization matrix. Permissions default to deny when no matching active permission exists.';

COMMENT ON FUNCTION public.has_permission(text, text) IS
'Returns whether the authenticated active user has the configured permission for a resource/action pair.';
