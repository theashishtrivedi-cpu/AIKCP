-- Day 23 — Controlled embedding persistence RPC
--
-- Purpose:
--   Allow the application to persist validated embeddings without
--   granting direct INSERT privileges on public.content_embeddings.
--
-- Security:
--   SECURITY DEFINER
--   Controlled search_path
--   Explicit provider/model/dimension validation
--   Authenticated users receive EXECUTE only.

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
AS $$
DECLARE
    v_id uuid;
BEGIN
    IF p_provider <> 'google-gemini' THEN
        RAISE EXCEPTION 'Unsupported embedding provider';
    END IF;

    IF p_model <> 'gemini-embedding-2' THEN
        RAISE EXCEPTION 'Unsupported embedding model';
    END IF;

    IF p_dimensions <> 768 THEN
        RAISE EXCEPTION 'Embedding dimensions must be 768';
    END IF;

    IF p_embedding IS NULL THEN
        RAISE EXCEPTION 'Embedding vector cannot be null';
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
    RETURNING id
    INTO v_id;

    RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.persist_content_embedding(
    uuid,
    text,
    text,
    integer,
    text,
    text,
    extensions.vector
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.persist_content_embedding(
    uuid,
    text,
    text,
    integer,
    text,
    text,
    extensions.vector
) FROM anon;

GRANT EXECUTE ON FUNCTION public.persist_content_embedding(
    uuid,
    text,
    text,
    integer,
    text,
    text,
    extensions.vector
) TO authenticated;

ALTER FUNCTION public.persist_content_embedding(
    uuid,
    text,
    text,
    integer,
    text,
    text,
    extensions.vector
) OWNER TO postgres;
