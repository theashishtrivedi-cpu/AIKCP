-- Day 21: Correct MAINTAIN privileges on existing and future public tables.
-- Forward-only correction. Does not delete or modify application data.

BEGIN;

-- Remove MAINTAIN from the API-facing authenticated role on existing tables.
REVOKE MAINTAIN
ON ALL TABLES IN SCHEMA public
FROM authenticated;

-- Prevent future tables created by postgres from granting MAINTAIN
-- to authenticated through schema-specific default privileges.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
REVOKE MAINTAIN ON TABLES FROM authenticated;

COMMIT;