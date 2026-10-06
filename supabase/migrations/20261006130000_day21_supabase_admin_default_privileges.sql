-- Day 21: Harden future public tables created by supabase_admin.
-- Forward-only migration. Does not modify existing application data.

BEGIN;

-- Anonymous API users must not receive default table privileges.
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public
REVOKE ALL ON TABLES FROM anon;

-- Keep authenticated table access limited to ordinary CRUD privileges.
-- In particular, remove TRUNCATE, REFERENCES, TRIGGER, and MAINTAIN.
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public
REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
ON TABLES FROM authenticated;

COMMIT;