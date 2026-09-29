# AI-KCP Day 9 — Authorization Correction & Closure

## Status

Day 9 question-authorization workstream is closed after corrective
reconciliation of the interim implementation.

## Correction

The Day 9 implementation was corrected so that Question authorization
does not contain a hard-coded list of operational roles.

The previous frontend role-based contract was replaced with a
permission-oriented authorization seam.

Question creation remains intentionally disabled through the normal
application/RLS path until the centralized, administrator-configurable
authorization framework is implemented.

## Database State

The historical `questions_insert_editor` policy is not restored.

After applying the Day 9 corrective migration, the active Question RLS
policies are:

- questions_delete_moderator_admin — DELETE
- questions_select_authenticated — SELECT
- questions_update_owner_moderator_admin — UPDATE

There is currently no Question INSERT policy.

This is an intentional interim security state and is not the final
authorization model.

## Architectural Direction

The subsequent authorization implementation will provide:

- administrator-configurable permissions;
- role-to-permission configuration;
- server-side authorization;
- RLS enforcement;
- ownership/scope evaluation;
- configurable contribution limits and quotas;
- account lifecycle/status enforcement.

No hard-coded Question-specific role list is to be introduced as the
final authorization mechanism.

The approved v1 architecture terminology remains authoritative:
User, Moderator and Admin are security roles; Contributor is a
capability/classification rather than a separate operational security
role.

## Validation Evidence

- Git working tree clean before correction.
- Supabase migration chain successfully applied.
- `npx supabase db lint` — PASS.
- `npx supabase db reset` — PASS.
- Second `npx supabase db lint` — PASS.
- `npm run build` — PASS.
- Final `pg_policies` inspection confirmed no Question INSERT policy.
- Existing Question SELECT, UPDATE and DELETE policies remain active.

## Closure Decision

Day 9 is considered technically complete.

The centralized configurable authorization framework is deferred to the
next implementation phase and must be established before Question
creation is re-enabled.

## Next Phase

Proceed to the centralized authorization/configuration foundation and
then apply it consistently across the Core Community modules.
