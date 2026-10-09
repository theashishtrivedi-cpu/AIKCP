-- ============================================================
-- AI-KCP Day 23
-- pgvector semantic-search security hardening
--
-- Purpose:
--   1. Prevent authenticated users from reading raw embeddings.
--   2. Keep semantic search available through the controlled RPC.
--   3. Execute the RPC with controlled SECURITY DEFINER privileges.
--   4. Use an explicit trusted search_path.
--
-- AI-KCP rule:
--   Embeddings are infrastructure data, not client-facing data.
-- ============================================================

DROP POLICY IF EXISTS content_embeddings_select_authenticated
    ON public.content_embeddings;

REVOKE SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
    ON public.content_embeddings
    FROM authenticated;

CREATE OR REPLACE FUNCTION public.semantic_search_current_affairs(
    query_embedding extensions.vector(768),
    match_threshold DOUBLE PRECISION DEFAULT 0.20,
    match_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    current_affair_id UUID,
    title TEXT,
    summary TEXT,
    source_title TEXT,
    source_url TEXT,
    language_code TEXT,
    similarity DOUBLE PRECISION
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, extensions
AS $function$
    SELECT
        ca.id,
        ca.title,
        ca.summary,
        ca.source_title,
        ca.source_url,
        ca.language_code,
        1 - (
            ce.embedding OPERATOR(extensions.<=>) query_embedding
        ) AS similarity
    FROM public.content_embeddings AS ce
    INNER JOIN public.current_affairs AS ca
        ON ca.id = ce.current_affair_id
    WHERE 1 - (
        ce.embedding OPERATOR(extensions.<=>) query_embedding
    ) >= match_threshold
    ORDER BY ce.embedding OPERATOR(extensions.<=>) query_embedding
    LIMIT LEAST(GREATEST(match_count, 1), 50);
$function$;

REVOKE ALL
    ON FUNCTION public.semantic_search_current_affairs(
        extensions.vector(768),
        DOUBLE PRECISION,
        INTEGER
    )
    FROM PUBLIC;

GRANT EXECUTE
    ON FUNCTION public.semantic_search_current_affairs(
        extensions.vector(768),
        DOUBLE PRECISION,
        INTEGER
    )
    TO authenticated;

ALTER FUNCTION public.semantic_search_current_affairs(
    extensions.vector(768),
    DOUBLE PRECISION,
    INTEGER
)
OWNER TO postgres;
