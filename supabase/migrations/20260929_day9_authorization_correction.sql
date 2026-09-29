-- AI-KCP Day 9 corrective migration
--
-- Question authoring remains temporarily disabled.
--
-- The previous Day 9 migration removed the legacy editor-based INSERT
-- policy. That state is intentionally retained until the centralized,
-- administrator-configurable authorization framework is implemented.
--
-- IMPORTANT:
-- Do not restore the legacy questions_insert_editor policy.
-- Question creation must not be re-enabled through a hard-coded role rule.
--
-- The centralized authorization implementation will introduce the
-- appropriate server-side permission path in a subsequent workstream.

COMMENT ON TABLE public.questions IS
'Question authoring is temporarily disabled pending centralized, administrator-configurable authorization. Existing question read/update/moderation controls remain governed by existing policies.';
