-- AI-KCP Day 9
-- Disable question creation through the normal application/RLS path.
--
-- Question creation is intentionally restricted at this stage.
-- Moderation/update policies remain intact so authorized moderators/admins
-- can continue to manage existing questions.

DROP POLICY IF EXISTS "questions_insert_editor" ON public.questions;
