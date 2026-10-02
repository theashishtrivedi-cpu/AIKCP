-- ============================================================
-- AI-KCP Day 16 — Fixed Role Correction
-- Remove obsolete editor role.
--
-- Target roles:
--   user
--   moderator
--   admin
--
-- This migration preserves:
--   - profiles.role
--   - authorization_permissions.role
--   - current_user_role()
--   - is_admin()
--   - is_moderator()
--   - existing RLS policies
--
-- The obsolete is_editor() capability is removed because
-- the fixed role model has no operational Editor role.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. Remove RLS policies that depend on obsolete is_editor()
-- ============================================================

DROP POLICY IF EXISTS board_content_insert_editor
    ON public.board_content;

DROP POLICY IF EXISTS board_translations_insert_editor
    ON public.board_translations;


-- ============================================================
-- 2. Remove obsolete is_editor() function
-- ============================================================

DROP FUNCTION IF EXISTS public.is_editor();


-- ============================================================
-- 3. Remove obsolete Editor authorization permissions
-- ============================================================

DELETE FROM public.authorization_permissions
WHERE role::text = 'editor';


-- ============================================================
-- 4. Preserve the existing enum temporarily
-- ============================================================

ALTER TYPE public.user_role
    RENAME TO user_role_legacy;


-- ============================================================
-- 5. current_user_role() must be recreated because its
--    return type is tied directly to the old enum.
-- ============================================================

DROP FUNCTION public.current_user_role();


-- ============================================================
-- 6. Create the fixed role enum
-- ============================================================

CREATE TYPE public.user_role AS ENUM (
    'user',
    'moderator',
    'admin'
);


-- ============================================================
-- 7. Convert profiles.role
-- ============================================================

ALTER TABLE public.profiles
    ALTER COLUMN role DROP DEFAULT;

ALTER TABLE public.profiles
    ALTER COLUMN role TYPE public.user_role
    USING role::text::public.user_role;


-- ============================================================
-- 8. Convert authorization_permissions.role
-- ============================================================

ALTER TABLE public.authorization_permissions
    ALTER COLUMN role TYPE public.user_role
    USING role::text::public.user_role;


-- ============================================================
-- 9. Restore profiles.role default
-- ============================================================

ALTER TABLE public.profiles
    ALTER COLUMN role
    SET DEFAULT 'user'::public.user_role;


-- ============================================================
-- 10. Recreate current_user_role()
-- ============================================================

CREATE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS 'SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;';


-- Preserve the pre-migration ACL.
-- Do not leave the PostgreSQL default PUBLIC EXECUTE grant.
REVOKE EXECUTE ON FUNCTION public.current_user_role()
    FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.current_user_role()
    TO anon, authenticated, service_role;


-- ============================================================
-- 11. Remove obsolete enum
-- ============================================================

DROP TYPE public.user_role_legacy;


-- ============================================================
-- 12. Replace Board INSERT policies with the fixed
--     moderator/admin authorization model.
-- ============================================================

CREATE POLICY board_content_insert_moderator_admin
ON public.board_content
FOR INSERT
TO authenticated
WITH CHECK (
    is_moderator()
    AND is_write_allowed()
    AND author_id = auth.uid()
);


CREATE POLICY board_translations_insert_moderator_admin
ON public.board_translations
FOR INSERT
TO authenticated
WITH CHECK (
    is_moderator()
    AND is_write_allowed()
    AND EXISTS (
        SELECT 1
        FROM public.board_content
        WHERE board_content.id = board_translations.content_id
          AND board_content.author_id = auth.uid()
    )
);


COMMIT;