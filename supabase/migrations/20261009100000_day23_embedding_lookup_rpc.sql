CREATE OR REPLACE FUNCTION public.get_latest_content_embedding_fingerprint(
    p_current_affair_id uuid,
    p_provider text,
    p_model text
)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, extensions
AS $function$
    SELECT ce.content_fingerprint
    FROM public.content_embeddings AS ce
    INNER JOIN public.current_affairs AS ca
        ON ca.id = ce.current_affair_id
    WHERE ca.id = p_current_affair_id
      AND ca.status = 'published'
      AND ce.provider = p_provider
      AND ce.model = p_model
    ORDER BY ce.created_at DESC, ce.id DESC
    LIMIT 1;
$function$;

ALTER FUNCTION public.get_latest_content_embedding_fingerprint(
    uuid, text, text
) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.get_latest_content_embedding_fingerprint(
    uuid, text, text
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.get_latest_content_embedding_fingerprint(
    uuid, text, text
) FROM anon;

GRANT EXECUTE ON FUNCTION public.get_latest_content_embedding_fingerprint(
    uuid, text, text
) TO authenticated;
