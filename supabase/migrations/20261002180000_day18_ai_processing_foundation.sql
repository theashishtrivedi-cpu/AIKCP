-- ============================================================
-- AI-KCP Day 18
-- AI-assisted Current Affairs processing foundation
--
-- Purpose:
--   Establish a provider-neutral, auditable server-side AI
--   processing contract for Current Affairs.
--
-- Important:
--   - AI never publishes content.
--   - AI results remain subject to editorial review.
--   - No API credentials are stored in the database.
--   - Provider/model are recorded for provenance.
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.current_affair_ai_processing (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    current_affair_id uuid NOT NULL
        REFERENCES public.current_affairs(id)
        ON DELETE CASCADE,

    status text NOT NULL DEFAULT 'queued'
        CHECK (
            status IN (
                'queued',
                'processing',
                'completed',
                'failed'
            )
        ),

    provider text,
    model text,

    input_fingerprint text NOT NULL,
    prompt_version text NOT NULL DEFAULT 'v1',

    generated_title text,
    generated_summary text,

    generated_category_id uuid
        REFERENCES public.categories(id)
        ON DELETE SET NULL,

    generated_subcategory_id uuid
        REFERENCES public.subcategories(id)
        ON DELETE SET NULL,

    confidence numeric(5,4)
        CHECK (
            confidence IS NULL
            OR (
                confidence >= 0
                AND confidence <= 1
            )
        ),

    error_code text,
    error_message text,

    started_at timestamptz,
    completed_at timestamptz,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_current_affair_ai_processing_article
    ON public.current_affair_ai_processing (current_affair_id);

CREATE INDEX IF NOT EXISTS idx_current_affair_ai_processing_status
    ON public.current_affair_ai_processing (status);

CREATE INDEX IF NOT EXISTS idx_current_affair_ai_processing_fingerprint
    ON public.current_affair_ai_processing (input_fingerprint);

CREATE UNIQUE INDEX IF NOT EXISTS uq_current_affair_ai_processing_article_fingerprint
    ON public.current_affair_ai_processing (
        current_affair_id,
        input_fingerprint
    );

ALTER TABLE public.current_affair_ai_processing
    ENABLE ROW LEVEL SECURITY;

-- AI processing records are internal editorial infrastructure.
-- Ordinary authenticated users receive no direct access.
--
-- Moderators/admins may inspect processing records.
CREATE POLICY current_affair_ai_processing_select_moderator_admin
ON public.current_affair_ai_processing
FOR SELECT
TO authenticated
USING (public.is_moderator());

COMMIT;
