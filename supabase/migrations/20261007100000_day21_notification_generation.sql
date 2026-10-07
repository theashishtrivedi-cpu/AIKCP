-- Day 21: Server-side notification generation.
-- Notifications are generated transactionally by database triggers.
-- Existing notification RLS policies remain unchanged.

BEGIN;

-- Notify the author of a question when another user answers it.
CREATE OR REPLACE FUNCTION public.notify_question_author_of_answer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_question_author_id uuid;
BEGIN
    SELECT q.author_id
      INTO v_question_author_id
      FROM public.questions AS q
     WHERE q.id = NEW.question_id;

    IF v_question_author_id IS NOT NULL
       AND v_question_author_id IS DISTINCT FROM NEW.author_id
    THEN
        INSERT INTO public.notifications (
            user_id,
            type,
            title,
            message,
            content_id,
            content_type
        )
        VALUES (
            v_question_author_id,
            'new_answer',
            'New answer to your question',
            'Someone has answered your question.',
            NEW.question_id,
            'question'::public.content_type
        );
    END IF;

    RETURN NEW;
END;
$function$;

-- Notify the question author when moderation changes its status
-- to published or rejected. Ignore unrelated updates and repeated
-- updates that do not change the status.
CREATE OR REPLACE FUNCTION public.notify_question_author_of_moderation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
        RETURN NEW;
    END IF;

    IF NEW.status NOT IN ('published', 'rejected') THEN
        RETURN NEW;
    END IF;

    IF NEW.author_id IS NULL THEN
        RETURN NEW;
    END IF;

    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        content_id,
        content_type
    )
    VALUES (
        NEW.author_id,
        CASE
            WHEN NEW.status = 'published' THEN 'question_approved'
            ELSE 'question_rejected'
        END,
        CASE
            WHEN NEW.status = 'published' THEN 'Your question was approved'
            ELSE 'Your question was rejected'
        END,
        CASE
            WHEN NEW.status = 'published'
                THEN 'Your question has been published.'
            ELSE 'Your question was rejected by a moderator.'
        END,
        NEW.id,
        'question'::public.content_type
    );

    RETURN NEW;
END;
$function$;

-- Trigger functions are invoked by their attached triggers.
-- Do not grant clients direct execution privileges.
REVOKE ALL ON FUNCTION public.notify_question_author_of_answer()
    FROM PUBLIC, anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.notify_question_author_of_moderation()
    FROM PUBLIC, anon, authenticated, service_role;

-- Replace only these Day 21 trigger names; preserve all existing triggers.
DROP TRIGGER IF EXISTS trg_notify_question_author_of_answer
    ON public.answers;

CREATE TRIGGER trg_notify_question_author_of_answer
AFTER INSERT ON public.answers
FOR EACH ROW
EXECUTE FUNCTION public.notify_question_author_of_answer();

DROP TRIGGER IF EXISTS trg_notify_question_author_of_moderation
    ON public.questions;

CREATE TRIGGER trg_notify_question_author_of_moderation
AFTER UPDATE OF status ON public.questions
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION public.notify_question_author_of_moderation();

COMMIT;