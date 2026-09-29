# AI-KCP — Day 10.1 Engineering Record
## Centralized Authorization Framework Foundation

**Date:** 2026-09-29  
**Branch:** main  
**Status:** COMPLETE

---

## 1. Objective

Establish the centralized, administrator-configurable authorization foundation for AI-KCP and replace the removed Day-9 hard-coded question-creation authorization rule.

---

## 2. Database Implementation

Created:

`supabase/migrations/20260929143000_day10_authorization_framework.sql`

Implemented:

- `public.authorization_permissions`
- Unique `(role, resource, action)` authorization matrix
- Default-deny permission model
- `public.has_permission(resource, action)`
- `SECURITY DEFINER` permission resolution
- Active-profile requirement
- Administrator-only SELECT/INSERT/UPDATE/DELETE access to the permission matrix
- Initial question authorization configuration
- Replacement of the removed `questions_insert_editor` policy with `questions_insert_authorized`

Initial question configuration:

| Role | Create | Edit |
|---|---:|---:|
| user | false | false |
| editor | true | true |
| moderator | true | true |
| admin | true | true |

---

## 3. Frontend Authorization Integration

Updated:

`src/lib/questionAuthorization.ts`

The frontend authorization helper now resolves question permissions through the centralized PostgreSQL `has_permission()` RPC rather than embedding role-specific authorization rules.

The helper fails closed when the permission lookup returns an error.

Updated:

`src/lib/questionAuthorization.test.ts`

The previous Day-9 false-only contract was replaced with a lightweight dependency-free validation harness compatible with the project's existing tooling.

No new test framework or npm dependency was introduced.

---

## 4. Validation Evidence

### Database

- `npx supabase db lint` — PASS
- `npx supabase db reset` — PASS
- `npx supabase db diff` — no schema changes pending
- Authorization matrix query — PASS; 8 expected rows
- `has_permission(text,text)` verification — PASS
- Questions policy verification — PASS
- Legacy `questions_insert_editor` policy absent
- `questions_insert_authorized` present

### Frontend

- `npm run typecheck` — PASS
- `npm run build` — PASS
- Vite production build completed successfully

### Known unrelated issue

`npm run lint` currently reports an existing unused-variable error in:

`src/pages/ProfilePage.tsx`

This error is unrelated to Day-10.1 authorization changes and was not modified as part of this work.

The lint run also reports the existing TypeScript-version compatibility warning from `@typescript-eslint`.

---

## 5. Security Boundary

The frontend authorization helper is not treated as the security boundary.

The authoritative enforcement path is:

Frontend authorization check
→ PostgreSQL `has_permission()`
→ centralized permission configuration
→ PostgreSQL RLS policy

The `questions_insert_authorized` RLS policy independently enforces question creation authorization.

---

## 6. Scope Boundary

Day-10.1 establishes the centralized authorization framework foundation and wires question creation into it.

Other resource policies remain on their existing authorization model and will be migrated incrementally during the remaining Day-10 work.

A dedicated administrator-facing permission-management UI is not part of this closure and has not been claimed as complete.

---

## 7. Completion Decision

Day-10.1 is technically complete and ready for Git closure.

Next planned work:

**Day 10.2 — Answers authorization**
