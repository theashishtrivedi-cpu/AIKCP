-- Day 23: Restrict embedding persistence to trusted server-side callers.
-- Browser clients must not be able to submit arbitrary embedding vectors.

REVOKE ALL PRIVILEGES
ON FUNCTION public.persist_content_embedding(
    uuid, text, text, integer, text, text, extensions.vector
)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE
ON FUNCTION public.persist_content_embedding(
    uuid, text, text, integer, text, text, extensions.vector
)
TO service_role;
