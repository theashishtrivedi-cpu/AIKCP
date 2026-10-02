-- AI-KCP Day 16.47
-- Editorial foundation: Current Affairs provenance and trusted sources
-- No ingestion execution or AI automation is implemented here.

ALTER TABLE public.news_sources
    ADD COLUMN IF NOT EXISTS is_trusted boolean NOT NULL DEFAULT false;

ALTER TABLE public.current_affairs
    ADD COLUMN IF NOT EXISTS source_published_at timestamptz;

ALTER TABLE public.current_affairs
    ADD COLUMN IF NOT EXISTS ingested_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.current_affairs
    ADD COLUMN IF NOT EXISTS author_byline text;

ALTER TABLE public.current_affairs
    ADD COLUMN IF NOT EXISTS source_language_code text;

ALTER TABLE public.current_affairs
    ADD COLUMN IF NOT EXISTS attribution text;

ALTER TABLE public.current_affairs
    ADD COLUMN IF NOT EXISTS content_fingerprint text;

CREATE INDEX IF NOT EXISTS idx_current_affairs_content_fingerprint
    ON public.current_affairs (content_fingerprint);

CREATE INDEX IF NOT EXISTS idx_current_affairs_ingested_at
    ON public.current_affairs (ingested_at);

CREATE INDEX IF NOT EXISTS idx_news_sources_trusted
    ON public.news_sources (is_trusted)
    WHERE is_trusted = true;
