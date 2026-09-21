SET local check_function_bodies = off;

CREATE TABLE "public"."answers" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "question_id"   uuid                     NOT NULL,
  "author_id"     uuid,
  "body"          text                     NOT NULL,
  "language_code" text                     NOT NULL DEFAULT 'en'::text,
  "is_accepted"   boolean                  NOT NULL DEFAULT false,
  "created_at"    timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"    timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "answers_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."answers"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."articles" (
  "id"              uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "author_id"       uuid,
  "category_id"     uuid                     NOT NULL,
  "subcategory_id"  uuid,
  "title"           text                     NOT NULL,
  "body"            text                     NOT NULL,
  "excerpt"         text,
  "cover_image_url" text,
  "language_code"   text                     NOT NULL DEFAULT 'en'::text,
  "is_featured"     boolean                  NOT NULL DEFAULT false,
  "created_at"      timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"      timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "articles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."articles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."audit_logs" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "actor_id"    uuid,
  "action"      text                     NOT NULL,
  "entity_type" text                     NOT NULL,
  "entity_id"   uuid,
  "details"     jsonb,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."audit_logs"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."board_content" (
  "id"                  uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "section_id"          uuid,
  "author_id"           uuid,
  "title"               text                     NOT NULL,
  "body"                text                     NOT NULL,
  "language_code"       text                     NOT NULL DEFAULT 'en'::text,
  "source_url"          text,
  "original_content_id" uuid,
  "created_at"          timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"          timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "board_content_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."board_content"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."board_sections" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"        text                     NOT NULL,
  "slug"        text                     NOT NULL,
  "parent_id"   uuid,
  "description" text,
  "sort_order"  integer                  NOT NULL DEFAULT 0,
  "is_active"   boolean                  NOT NULL DEFAULT true,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "board_sections_pkey" PRIMARY KEY (id),
  CONSTRAINT "board_sections_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."board_sections"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."board_translations" (
  "id"              uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "content_id"      uuid                     NOT NULL,
  "language_code"   text                     NOT NULL,
  "title"           text                     NOT NULL,
  "body"            text                     NOT NULL,
  "is_ai_generated" boolean                  NOT NULL DEFAULT true,
  "created_at"      timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"      timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "board_translations_content_id_language_code_key" UNIQUE (content_id, language_code),
  CONSTRAINT "board_translations_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."board_translations"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."bookmarks" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    uuid                     NOT NULL,
  "content_id" uuid                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "bookmarks_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."bookmarks"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."categories" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"        text                     NOT NULL,
  "slug"        text                     NOT NULL,
  "description" text,
  "icon"        text,
  "sort_order"  integer                  NOT NULL DEFAULT 0,
  "is_active"   boolean                  NOT NULL DEFAULT true,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "categories_name_key" UNIQUE (name),
  CONSTRAINT "categories_pkey" PRIMARY KEY (id),
  CONSTRAINT "categories_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."categories"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."comments" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "content_id"    uuid                     NOT NULL,
  "parent_id"     uuid,
  "author_id"     uuid,
  "body"          text                     NOT NULL,
  "language_code" text                     NOT NULL DEFAULT 'en'::text,
  "created_at"    timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"    timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "comments_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."comments"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."current_affairs" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "source_id"        uuid,
  "category_id"      uuid,
  "subcategory_id"   uuid,
  "title"            text                     NOT NULL,
  "source_title"     text,
  "source_url"       text                     NOT NULL,
  "original_content" text,
  "summary"          text,
  "image_url"        text,
  "language_code"    text                     NOT NULL DEFAULT 'en'::text,
  "published_at"     timestamp with time zone,
  "created_at"       timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"       timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "current_affairs_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."current_affairs"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."moderation_results" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "content_id"     uuid                     NOT NULL,
  "confidence"     numeric(5,4),
  "reason"         text,
  "model_name"     text,
  "prompt_version" text,
  "overridden"     boolean                  NOT NULL DEFAULT false,
  "overridden_by"  uuid,
  "created_at"     timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "moderation_results_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."moderation_results"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."news_sources" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"        text                     NOT NULL,
  "url"         text                     NOT NULL,
  "feed_url"    text,
  "is_approved" boolean                  NOT NULL DEFAULT false,
  "is_active"   boolean                  NOT NULL DEFAULT true,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "news_sources_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."news_sources"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."notifications" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    uuid                     NOT NULL,
  "type"       text                     NOT NULL,
  "title"      text                     NOT NULL,
  "message"    text,
  "content_id" uuid,
  "is_read"    boolean                  NOT NULL DEFAULT false,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "notifications_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."notifications"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"                uuid                     NOT NULL,
  "display_name"      text                     NOT NULL,
  "avatar_url"        text,
  "phone_verified"    boolean                  NOT NULL DEFAULT false,
  "restriction_until" timestamp with time zone,
  "bio"               text,
  "language_code"     text                     NOT NULL DEFAULT 'en'::text,
  "created_at"        timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"        timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."questions" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "author_id"      uuid,
  "category_id"    uuid                     NOT NULL,
  "subcategory_id" uuid,
  "title"          text                     NOT NULL,
  "body"           text,
  "language_code"  text                     NOT NULL DEFAULT 'en'::text,
  "is_featured"    boolean                  NOT NULL DEFAULT false,
  "is_trending"    boolean                  NOT NULL DEFAULT false,
  "view_count"     integer                  NOT NULL DEFAULT 0,
  "created_at"     timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"     timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "questions_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."questions"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."reactions" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    uuid                     NOT NULL,
  "content_id" uuid                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "reactions_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."reactions"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."reports" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "reporter_id" uuid,
  "content_id"  uuid                     NOT NULL,
  "reason"      text                     NOT NULL,
  "details"     text,
  "reviewed_by" uuid,
  "reviewed_at" timestamp with time zone,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "reports_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."reports"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."subcategories" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "category_id" uuid                     NOT NULL,
  "name"        text                     NOT NULL,
  "slug"        text                     NOT NULL,
  "description" text,
  "sort_order"  integer                  NOT NULL DEFAULT 0,
  "is_active"   boolean                  NOT NULL DEFAULT true,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "subcategories_category_id_slug_key" UNIQUE (category_id, slug),
  CONSTRAINT "subcategories_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."subcategories"
  ENABLE ROW LEVEL SECURITY;

CREATE TYPE "public"."board_level" AS ENUM (
  'national',
  'state',
  'district',
  'provisional'
);

ALTER TABLE "public"."board_sections"
  ADD COLUMN "level" public.board_level NOT NULL;

CREATE TYPE "public"."content_status" AS ENUM (
  'draft',
  'pending',
  'published',
  'rejected',
  'archived'
);

ALTER TABLE "public"."answers"
  ADD COLUMN "status" public.content_status NOT NULL DEFAULT 'pending'::public.content_status;

ALTER TABLE "public"."articles"
  ADD COLUMN "status" public.content_status NOT NULL DEFAULT 'pending'::public.content_status;

ALTER TABLE "public"."board_content"
  ADD COLUMN "status" public.content_status NOT NULL DEFAULT 'published'::public.content_status;

ALTER TABLE "public"."comments"
  ADD COLUMN "status" public.content_status NOT NULL DEFAULT 'pending'::public.content_status;

ALTER TABLE "public"."current_affairs"
  ADD COLUMN "status" public.content_status NOT NULL DEFAULT 'pending'::public.content_status;

ALTER TABLE "public"."questions"
  ADD COLUMN "status" public.content_status NOT NULL DEFAULT 'pending'::public.content_status;

CREATE TYPE "public"."content_type" AS ENUM (
  'question',
  'answer',
  'article',
  'current_affair',
  'board_content',
  'comment'
);

ALTER TABLE "public"."bookmarks"
  ADD COLUMN "content_type" public.content_type NOT NULL;

ALTER TABLE "public"."comments"
  ADD COLUMN "content_type" public.content_type NOT NULL;

ALTER TABLE "public"."moderation_results"
  ADD COLUMN "content_type" public.content_type NOT NULL;

ALTER TABLE "public"."notifications"
  ADD COLUMN "content_type" public.content_type;

ALTER TABLE "public"."reactions"
  ADD COLUMN "content_type" public.content_type NOT NULL;

ALTER TABLE "public"."reports"
  ADD COLUMN "content_type" public.content_type NOT NULL;

CREATE TYPE "public"."moderation_decision" AS ENUM (
  'allow',
  'flag',
  'hold',
  'block'
);

ALTER TABLE "public"."moderation_results"
  ADD COLUMN "decision" public.moderation_decision NOT NULL;

ALTER TABLE "public"."moderation_results"
  ADD COLUMN "overridden_decision" public.moderation_decision;

CREATE TYPE "public"."news_source_type" AS ENUM (
  'rss',
  'api',
  'web'
);

ALTER TABLE "public"."news_sources"
  ADD COLUMN "source_type" public.news_source_type NOT NULL DEFAULT 'rss'::public.news_source_type;

CREATE TYPE "public"."reaction_type" AS ENUM (
  'like',
  'dislike'
);

ALTER TABLE "public"."reactions"
  ADD COLUMN "reaction" public.reaction_type NOT NULL;

CREATE TYPE "public"."report_status" AS ENUM (
  'open',
  'reviewing',
  'resolved',
  'dismissed'
);

ALTER TABLE "public"."reports"
  ADD COLUMN "status" public.report_status NOT NULL DEFAULT 'open'::public.report_status;

CREATE TYPE "public"."user_role" AS ENUM (
  'user',
  'editor',
  'moderator',
  'admin'
);

ALTER TABLE "public"."profiles"
  ADD COLUMN "role" public.user_role NOT NULL DEFAULT 'user'::public.user_role;

CREATE TYPE "public"."user_status" AS ENUM (
  'active',
  'restricted',
  'suspended',
  'blocked'
);

ALTER TABLE "public"."profiles"
  ADD COLUMN "status" public.user_status NOT NULL DEFAULT 'restricted'::public.user_status;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
begin
  insert into public.profiles (id, display_name, phone_verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'New User'),
    coalesce(new.phone_confirmed_at is not null, false)
  );
  return new;
end;
$function$;

ALTER TABLE "public"."board_content"
  ADD CONSTRAINT "board_content_original_content_id_fkey" FOREIGN KEY (original_content_id) REFERENCES public.board_content(id) ON DELETE SET NULL;

ALTER TABLE "public"."board_content"
  ADD CONSTRAINT "board_content_section_id_fkey" FOREIGN KEY (section_id) REFERENCES public.board_sections(id) ON DELETE SET NULL;

ALTER TABLE "public"."board_sections"
  ADD CONSTRAINT "board_sections_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.board_sections(id) ON DELETE CASCADE;

ALTER TABLE "public"."board_translations"
  ADD CONSTRAINT "board_translations_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.board_content(id) ON DELETE CASCADE;

ALTER TABLE "public"."bookmarks"
  ADD CONSTRAINT "bookmarks_user_id_content_type_content_id_key" UNIQUE (user_id, content_type, content_id);

ALTER TABLE "public"."articles"
  ADD CONSTRAINT "articles_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE "public"."comments"
  ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.comments(id) ON DELETE CASCADE;

ALTER TABLE "public"."current_affairs"
  ADD CONSTRAINT "current_affairs_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE "public"."current_affairs"
  ADD CONSTRAINT "current_affairs_source_fk" FOREIGN KEY (source_id) REFERENCES public.news_sources(id) ON DELETE SET NULL;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."answers"
  ADD CONSTRAINT "answers_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE "public"."articles"
  ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE "public"."audit_logs"
  ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE "public"."board_content"
  ADD CONSTRAINT "board_content_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE "public"."bookmarks"
  ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."comments"
  ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE "public"."moderation_results"
  ADD CONSTRAINT "moderation_results_overridden_by_fkey" FOREIGN KEY (overridden_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE "public"."notifications"
  ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."questions"
  ADD CONSTRAINT "questions_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE "public"."questions"
  ADD CONSTRAINT "questions_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE "public"."answers"
  ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE "public"."reactions"
  ADD CONSTRAINT "reactions_user_id_content_type_content_id_key" UNIQUE (user_id, content_type, content_id);

ALTER TABLE "public"."reactions"
  ADD CONSTRAINT "reactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."reports"
  ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY (reporter_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE "public"."reports"
  ADD CONSTRAINT "reports_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE "public"."subcategories"
  ADD CONSTRAINT "subcategories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;

ALTER TABLE "public"."articles"
  ADD CONSTRAINT "articles_subcategory_id_fkey" FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(id);

ALTER TABLE "public"."current_affairs"
  ADD CONSTRAINT "current_affairs_subcategory_id_fkey" FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(id);

ALTER TABLE "public"."questions"
  ADD CONSTRAINT "questions_subcategory_id_fkey" FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(id);

CREATE INDEX idx_answers_author ON public.answers USING btree (author_id);

CREATE INDEX idx_answers_question ON public.answers USING btree (question_id);

CREATE INDEX idx_articles_category ON public.articles USING btree (category_id);

CREATE INDEX idx_audit_logs_actor ON public.audit_logs USING btree (actor_id);

CREATE INDEX idx_board_content_section ON public.board_content USING btree (section_id);

CREATE INDEX idx_board_translations_content ON public.board_translations USING btree (content_id);

CREATE INDEX idx_comments_content ON public.comments USING btree (content_type, content_id);

CREATE INDEX idx_comments_parent ON public.comments USING btree (parent_id);

CREATE INDEX idx_current_affairs_category ON public.current_affairs USING btree (category_id);

CREATE INDEX idx_current_affairs_source ON public.current_affairs USING btree (source_id);

CREATE INDEX idx_current_affairs_status ON public.current_affairs USING btree (status);

CREATE INDEX idx_moderation_content ON public.moderation_results USING btree (content_type, content_id);

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id, is_read);

CREATE INDEX idx_questions_author ON public.questions USING btree (author_id);

CREATE INDEX idx_questions_category ON public.questions USING btree (category_id);

CREATE INDEX idx_questions_status ON public.questions USING btree (status);

CREATE INDEX idx_questions_subcategory ON public.questions USING btree (subcategory_id);

CREATE INDEX idx_reactions_content ON public.reactions USING btree (content_type, content_id);

CREATE INDEX idx_reports_status ON public.reports USING btree (status);

CREATE INDEX idx_subcategories_category ON public.subcategories USING btree (category_id);

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."answers" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."articles" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."audit_logs" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."board_content" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."board_sections" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."board_translations" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."bookmarks" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."comments" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."current_affairs" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."moderation_results" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."news_sources" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."notifications" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."questions" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."reactions" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."reports" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."subcategories" TO "anon", "authenticated", "postgres", "service_role";

GRANT USAGE ON TYPE "public"."board_level" TO "postgres";

GRANT USAGE ON TYPE "public"."content_status" TO "postgres";

GRANT USAGE ON TYPE "public"."content_type" TO "postgres";

GRANT USAGE ON TYPE "public"."moderation_decision" TO "postgres";

GRANT USAGE ON TYPE "public"."news_source_type" TO "postgres";

GRANT USAGE ON TYPE "public"."reaction_type" TO "postgres";

GRANT USAGE ON TYPE "public"."report_status" TO "postgres";

GRANT USAGE ON TYPE "public"."user_role" TO "postgres";

GRANT USAGE ON TYPE "public"."user_status" TO "postgres";

