-- Day 21: API privilege hardening
-- Forward-only migration. No application data is deleted.
-- Existing object privileges and future-object defaults are handled separately.

BEGIN;

-- 1. Existing public tables
REVOKE ALL PRIVILEGES
ON ALL TABLES IN SCHEMA public
FROM anon;

REVOKE TRUNCATE, REFERENCES, TRIGGER
ON ALL TABLES IN SCHEMA public
FROM authenticated;

-- 2. Existing public sequences (currently none were returned by the audit)
REVOKE ALL PRIVILEGES
ON ALL SEQUENCES IN SCHEMA public
FROM anon;

REVOKE UPDATE
ON ALL SEQUENCES IN SCHEMA public
FROM authenticated;

-- 3. Trigger functions: retain attached triggers, remove direct API execution.
REVOKE EXECUTE
ON FUNCTION public.handle_new_user()
FROM PUBLIC, anon, authenticated, service_role;

REVOKE EXECUTE
ON FUNCTION public.protect_question_status_changes()
FROM PUBLIC, anon, authenticated, service_role;

-- 4. Existing RLS/helper functions: explicitly retain required execution.
REVOKE EXECUTE ON FUNCTION public.current_user_role()
FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_role()
TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.current_user_status()
FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_status()
TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.has_permission(text, text)
FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_permission(text, text)
TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_admin()
FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin()
TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_authenticated_user()
FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_authenticated_user()
TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_moderator()
FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_moderator()
TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_write_allowed()
FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_write_allowed()
TO authenticated, service_role;

-- 5. Future tables created by postgres in public
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
REVOKE ALL ON TABLES FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
REVOKE TRUNCATE, REFERENCES, TRIGGER
ON TABLES FROM authenticated;

-- 6. Future sequences created by postgres in public
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
REVOKE ALL ON SEQUENCES FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
REVOKE UPDATE ON SEQUENCES FROM authenticated;

-- 7. Future functions created by postgres in public
-- Remove schema-specific default EXECUTE grants to API roles.
-- PostgreSQL's built-in global default still grants EXECUTE to PUBLIC.
-- Therefore each new function migration must explicitly revoke EXECUTE
-- from PUBLIC and grant execution only to the roles that require it.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated, service_role;
COMMIT;
