-- Day 10.9: Authorization privilege hardening
--
-- Scope:
--   Harden direct table privileges on authorization_permissions.
--   Preserve existing admin-only RLS enforcement.
--
-- Design:
--   anon: no direct access
--   authenticated: DML only; RLS remains the effective authorization boundary
--   postgres/service_role: unchanged

REVOKE ALL PRIVILEGES
ON TABLE public.authorization_permissions
FROM anon;

REVOKE REFERENCES, TRIGGER, TRUNCATE
ON TABLE public.authorization_permissions
FROM authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.authorization_permissions
TO authenticated;
