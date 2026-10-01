-- ============================================================
-- AI-KCP Day 14
-- Question moderation authorization and status protection
-- ============================================================

-- 1. Add explicit moderation capability to the centralized
--    authorization matrix.
INSERT INTO public.authorization_permissions
  (role, resource, action, is_allowed)
VALUES
  ('user',      'questions', 'moderate', false),
  ('editor',    'questions', 'moderate', false),
  ('moderator', 'questions', 'moderate', true),
  ('admin',     'questions', 'moderate', true)
ON CONFLICT (role, resource, action)
DO UPDATE SET
  is_allowed = EXCLUDED.is_allowed,
  updated_at = now();

-- 2. Prevent non-moderators from changing question status
--    through the generic questions UPDATE endpoint.
--
--    This is necessary because the existing question UPDATE
--    policy intentionally allows owners to edit their questions.
--    RLS cannot compare OLD and NEW row values, so a trigger is
--    required to protect the status column specifically.

CREATE OR REPLACE FUNCTION public.protect_question_status_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status
     AND NOT public.has_permission('questions', 'moderate')
  THEN
    RAISE EXCEPTION 'Only users with question moderation permission may change question status';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_protect_question_status_changes
ON public.questions;

CREATE TRIGGER trg_protect_question_status_changes
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION public.protect_question_status_changes();

REVOKE EXECUTE
ON FUNCTION public.protect_question_status_changes()
FROM PUBLIC;

COMMENT ON FUNCTION public.protect_question_status_changes()
IS 'Prevents users without questions.moderate permission from changing question status.';
