-- ============================================================
-- AI-KCP DAY 23
-- PostgreSQL + pgvector Semantic Search Foundation
--
-- Architecture:
--   Current Affairs
--        ↓
--   content_embeddings
--        ↓
--   vector(768)
--        ↓
--   HNSW cosine index
--        ↓
--   semantic search RPC
--
-- Embedding contract:
--   Provider   : google-gemini
--   Model      : gemini-embedding-2
--   Dimensions : 768
--   Similarity : cosine
--
-- AI does not publish content.
-- Embeddings are search infrastructure only.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS vector
WITH SCHEMA extensions;

-- ------------------------------------------------------------
-- Embedding storage
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.content_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    current_affair_id UUID NOT NULL
        REFERENCES public.current_affairs(id)
        ON DELETE CASCADE,

    provider TEXT NOT NULL,
    model TEXT NOT NULL,

    dimensions INTEGER NOT NULL
        CHECK (dimensions = 768),

    content_fingerprint TEXT NOT NULL,

    text_snapshot TEXT NOT NULL,

    embedding extensions.vector(768) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT content_embeddings_provider_model_check
        CHECK (
            provider = 'google-gemini'
            AND model = 'gemini-embedding-2'
        ),

    CONSTRAINT content_embeddings_unique_source
        UNIQUE (
            current_affair_id,
            provider,
            model,
            content_fingerprint
        )
);

-- ------------------------------------------------------------
-- Operational indexes
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_content_embeddings_current_affair
    ON public.content_embeddings(current_affair_id);

CREATE INDEX IF NOT EXISTS idx_content_embeddings_fingerprint
    ON public.content_embeddings(content_fingerprint);

CREATE INDEX IF NOT EXISTS idx_content_embeddings_model
    ON public.content_embeddings(provider, model);

-- ------------------------------------------------------------
-- Vector similarity index
--
-- HNSW + cosine distance.
-- The operator <=> calculates cosine distance.
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_content_embeddings_hnsw_cosine
    ON public.content_embeddings
    USING hnsw (embedding extensions.vector_cosine_ops);

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------

ALTER TABLE public.content_embeddings ENABLE ROW LEVEL SECURITY;

-- Embeddings are search infrastructure. They are not directly
-- writable by normal application users.
--
-- Search access is provided through the controlled RPC below.

DROP POLICY IF EXISTS content_embeddings_select_authenticated
    ON public.content_embeddings;

CREATE POLICY content_embeddings_select_authenticated
    ON public.content_embeddings
    FOR SELECT
    TO authenticated
    USING (true);

-- Explicitly prevent normal authenticated users from writing
-- embeddings directly through the REST API.

REVOKE INSERT, UPDATE, DELETE, TRUNCATE
    ON public.content_embeddings
    FROM authenticated;

-- ------------------------------------------------------------
-- Semantic search function
--
-- Returns Current Affairs ordered by cosine similarity.
-- The function deliberately does NOT generate embeddings.
-- The caller supplies the already-generated 768-dimensional
-- query embedding.
-- ------------------------------------------------------------

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
AS $function$
    SELECT
        ca.id AS current_affair_id,
        ca.title,
        ca.summary,
        ca.source_title,
        ca.source_url,
        ca.language_code,
        1 - (ce.embedding <=> query_embedding) AS similarity
    FROM public.content_embeddings AS ce
    INNER JOIN public.current_affairs AS ca
        ON ca.id = ce.current_affair_id
    WHERE
        1 - (ce.embedding <=> query_embedding) >= match_threshold
    ORDER BY
        ce.embedding <=> query_embedding
    LIMIT LEAST(GREATEST(match_count, 1), 50);
$function$;

-- ------------------------------------------------------------
-- Function privileges
-- ------------------------------------------------------------

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

-- ------------------------------------------------------------
-- Documentation
-- ------------------------------------------------------------

COMMENT ON TABLE public.content_embeddings IS
    'AI-KCP semantic-search embeddings. Embeddings are generated server-side and never publish content.';

COMMENT ON COLUMN public.content_embeddings.embedding IS
    'Gemini Embedding 2 vector with 768 dimensions. Cosine similarity is used for retrieval.';

COMMENT ON FUNCTION public.semantic_search_current_affairs(
    extensions.vector(768),
    DOUBLE PRECISION,
    INTEGER
) IS
    'Returns Current Affairs ranked by cosine similarity against a 768-dimensional query embedding.';
