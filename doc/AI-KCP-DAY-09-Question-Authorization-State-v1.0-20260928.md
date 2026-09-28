# AI-KCP Day 9 — Question Authorization State

## Current State

Question creation is intentionally disabled through the normal application/RLS path.

The Day-9 migration removes the questions_insert_editor policy from
public.questions.

## Frontend Authorization Contract

The frontend authorization contract defines the intended question-authoring
roles as:

- editor
- moderator
- admin

An authoring profile must also have status = active.

## Current Database Enforcement

The current database does not expose a normal INSERT policy for
public.questions.

Therefore:

- frontend authorization contract = intended authoring capability
- database INSERT authorization = currently disabled
- existing question moderation/update controls remain available
- no frontend question INSERT implementation currently exists

## Security Interpretation

The database remains the authoritative enforcement layer.

The frontend authorization contract must never be treated as a security
boundary.

Until the question-authoring workflow is implemented and explicitly enabled,
question creation remains unavailable through the normal application path.

## Validation Evidence

Day-9 authenticated INSERT testing produced HTTP 403 with PostgreSQL
SQLSTATE 42501 because the row violated the RLS policy for questions.

The frontend authorization behavior test passed for:

- unauthenticated user
- active registered user
- active editor
- active moderator
- active admin
- restricted editor
- suspended moderator
- blocked admin

## Next Planned State

When question authoring is implemented, the database INSERT policy and the
frontend authoring contract must be reviewed together before enabling
question creation.

No question INSERT policy should be restored solely to satisfy frontend
visibility.

## Status

Day 9 question authorization state is intentionally staged.

No additional authorization code change is required at this step.
