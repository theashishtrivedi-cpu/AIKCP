-- AI-KCP Day 23 — Publication eligibility guards
-- Local corrective migration; preserve existing embedding records.

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
    WHERE ca.status = 'published'
      AND 1 - (
          ce.embedding OPERATOR(extensions.<=>) query_embedding
      ) >= match_threshold
    ORDER BY ce.embedding OPERATOR(extensions.<=>) query_embedding
    LIMIT LEAST(GREATEST(match_count, 1), 50);
$function$;

ALTER FUNCTION public.semantic_search_current_affairs(
    extensions.vector(768),
    DOUBLE PRECISION,
    INTEGER
) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.semantic_search_current_affairs(
    extensions.vector(768),
    DOUBLE PRECISION,
    INTEGER
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.semantic_search_current_affairs(
    extensions.vector(768),
    DOUBLE PRECISION,
    INTEGER
) FROM anon;

GRANT EXECUTE ON FUNCTION public.semantic_search_current_affairs(
    extensions.vector(768),
    DOUBLE PRECISION,
    INTEGER
) TO authenticated;


CREATE OR REPLACE FUNCTION public.persist_content_embedding(
    p_current_affair_id uuid,
    p_provider text,
    p_model text,
    p_dimensions integer,
    p_content_fingerprint text,
    p_text_snapshot text,
    p_embedding extensions.vector(768)
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, extensions
AS $function$
DECLARE
    v_id uuid;
    v_status text;
BEGIN
    IF p_provider IS DISTINCT FROM 'google-gemini' THEN
        RAISE EXCEPTION 'Unsupported embedding provider';
    END IF;

    IF p_model IS DISTINCT FROM 'gemini-embedding-2' THEN
        RAISE EXCEPTION 'Unsupported embedding model';
    END IF;

    IF p_dimensions IS DISTINCT FROM 768 THEN
        RAISE EXCEPTION 'Embedding dimensions must be 768';
    END IF;

    IF p_embedding IS NULL THEN
        RAISE EXCEPTION 'Embedding vector cannot be null';
    END IF;

    IF p_content_fingerprint IS NULL OR btrim(p_content_fingerprint) = '' THEN
        RAISE EXCEPTION 'Content fingerprint cannot be empty';
    END IF;

    IF p_text_snapshot IS NULL OR btrim(p_text_snapshot) = '' THEN
        RAISE EXCEPTION 'Text snapshot cannot be empty';
    END IF;

    SELECT ca.status::text
      INTO v_status
      FROM public.current_affairs AS ca
     WHERE ca.id = p_current_affair_id
     FOR SHARE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Current affair does not exist';
    END IF;

    IF v_status IS DISTINCT FROM 'published' THEN
        RAISE EXCEPTION 'Embeddings may only be persisted for published current affairs';
    END IF;

    INSERT INTO public.content_embeddings (
        current_affair_id,
        provider,
        model,
        dimensions,
        content_fingerprint,
        text_snapshot,
        embedding
    )
    VALUES (
        p_current_affair_id,
        p_provider,
        p_model,
        p_dimensions,
        p_content_fingerprint,
        p_text_snapshot,
        p_embedding
    )
    ON CONFLICT (
        current_affair_id,
        provider,
        model,
        content_fingerprint
    )
    DO UPDATE
        SET updated_at = pg_catalog.now()
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$function$;

ALTER FUNCTION public.persist_content_embedding(
    uuid, text, text, integer, text, text, extensions.vector
) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.persist_content_embedding(
    uuid, text, text, integer, text, text, extensions.vector
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.persist_content_embedding(
    uuid, text, text, integer, text, text, extensions.vector
) FROM anon;

GRANT EXECUTE ON FUNCTION public.persist_content_embedding(
    uuid, text, text, integer, text, text, extensions.vector
) TO authenticated;
