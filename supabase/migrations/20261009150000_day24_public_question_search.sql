BEGIN;

CREATE ROLE aikcp_public_search_executor
    NOLOGIN
    NOINHERIT
    NOBYPASSRLS;

GRANT USAGE ON SCHEMA public TO aikcp_public_search_executor;

GRANT SELECT (id, title, body, language_code, created_at, status)
    ON TABLE public.questions
    TO aikcp_public_search_executor;

CREATE POLICY questions_select_public_search_executor
    ON public.questions
    FOR SELECT
    TO aikcp_public_search_executor
    USING (status = 'published'::public.content_status);

-- Membership is needed temporarily so the migration owner can SET ROLE.
-- Do not grant ADMIN OPTION.
GRANT aikcp_public_search_executor TO postgres;

-- Permit creation only while the function is being created under its owner.
GRANT CREATE ON SCHEMA public TO aikcp_public_search_executor;

SET ROLE aikcp_public_search_executor;

CREATE FUNCTION public.search_published_questions_public(
    p_search_term text,
    p_limit integer DEFAULT 20
)
RETURNS TABLE (
    id uuid,
    title text,
    body text,
    language_code text,
    created_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE
    v_term text;
    v_pattern text;
    v_limit integer;
BEGIN
    v_term := pg_catalog.btrim(p_search_term);

    IF v_term IS NULL OR v_term = '' THEN
        RETURN;
    END IF;

    IF pg_catalog.char_length(v_term) > 100 THEN
        RAISE EXCEPTION 'Search term must not exceed 100 characters'
            USING ERRCODE = '22023';
    END IF;

    v_pattern :=
        '%' ||
        pg_catalog.replace(
            pg_catalog.replace(
                pg_catalog.replace(v_term, E'\\', E'\\\\'),
                '%', E'\\%'
            ),
            '_', E'\\_'
        ) ||
        '%';

    v_limit := GREATEST(1, LEAST(COALESCE(p_limit, 20), 50));

    RETURN QUERY
    SELECT q.id, q.title, q.body, q.language_code, q.created_at
    FROM public.questions AS q
    WHERE q.status = 'published'::public.content_status
      AND q.title ILIKE v_pattern ESCAPE E'\\'
    ORDER BY q.created_at DESC, q.id
    LIMIT v_limit;
END;
$function$;

RESET ROLE;

REVOKE CREATE ON SCHEMA public FROM aikcp_public_search_executor;

-- Change the function ACL while postgres still has membership in its owner role.
REVOKE ALL PRIVILEGES
    ON FUNCTION public.search_published_questions_public(text, integer)
    FROM PUBLIC;

GRANT EXECUTE
    ON FUNCTION public.search_published_questions_public(text, integer)
    TO anon, authenticated, service_role;

-- Remove temporary membership only after all owner-dependent operations.
REVOKE aikcp_public_search_executor FROM postgres;

COMMIT;
