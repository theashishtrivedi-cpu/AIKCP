# AI-KCP Day 24 — Public Question Search and Security Closure

**Document version:** 1.0
**Date:** 2026-10-09
**Repository:** AI-KCP
**Environment:** Windows PowerShell 5.1, local Supabase, PostgreSQL 17.6
**Status:** Local implementation and verification complete; migration-history reconciliation and remote deployment pending.

## 1. Objective

Implement public search for published questions without granting anonymous clients direct table access. Route search requests through a Supabase Edge Function and a constrained PostgreSQL RPC, preserve row-level security, validate request input, and integrate results into the existing search page.

This record covers local implementation and verification only. It does not authorize production deployment, remote database changes, Git staging, commits, or pushes.

## 2. Implementation scope

### 2.1 Frontend

Files:
- `src/lib/questionService.ts`
- `src/pages/SearchPage.tsx`

The question service adds `PublicQuestionSearchResult` and `searchPublishedQuestions()`. It trims the query, rejects terms longer than 100 characters, bounds the requested result limit, invokes `search-published-questions`, and handles invocation or response errors.

The search page uses the URL query parameter `q`, supports submitting a search form, and displays loading, error, empty-result, and result states for published questions. Search results link to `/questions/:questionId`.

Route verification confirmed:
- `/search` is registered.
- `/questions/:questionId` is registered and resolves to `RealQuestionDetailPage`.

### 2.2 Edge Function

Files:
- `supabase/functions/search-published-questions/index.ts`
- `supabase/functions/search-published-questions/deno.json`
- `supabase/config.toml`

The function:
- Accepts POST requests and handles OPTIONS preflight requests.
- Rejects unsupported HTTP methods and malformed or invalid request bodies.
- Requires a string `searchTerm`, trims it, and rejects terms longer than 100 characters.
- Validates the type of an explicitly supplied limit and bounds the effective limit to 1–50.
- Calls `search_published_questions_public` through `ctx.supabaseAdmin.rpc`.
- Returns a generic search-unavailable error instead of exposing database error details.

The local configuration enables the function with `verify_jwt = false`, consistent with the intended public search endpoint. The endpoint is public; its data access is constrained by the database RPC and policy rather than client authentication.

The referenced `deno.json` exists and matches the import configuration used by `generate-embedding`.

## 3. Database security design

Migration file:
- `supabase/migrations/20261009150000_day24_public_question_search.sql`

The migration creates the dedicated role `aikcp_public_search_executor` with `NOLOGIN`, `NOINHERIT`, and `NOBYPASSRLS`.

The role receives only the column-level SELECT privileges required for question search. The policy `questions_select_public_search_executor` limits this role to rows whose status is `published`.

The function `public.search_published_questions_public(text, integer)`:
- Is `SECURITY DEFINER`.
- Is owned by the dedicated executor role rather than the questions table owner.
- Uses the fixed search path `pg_catalog, pg_temp`.
- Qualifies database objects explicitly.
- Escapes backslash, percent, and underscore characters in the search term.
- Filters for published questions.
- Orders by creation time and applies a bounded result limit.

Function execution is granted to `anon`, `authenticated`, and `service_role`; execution is revoked from `PUBLIC`. Temporary role membership and schema CREATE permission used during function creation are revoked in the migration.

### Verified local privilege state

The recorded local inspection reported:
- Dedicated executor role: cannot log in and does not bypass RLS.
- RPC owner: `aikcp_public_search_executor`.
- RPC: `SECURITY DEFINER` with the expected fixed search path.
- RLS policy: published-only SELECT for the dedicated role.
- Direct anonymous SELECT on `public.questions`: false.
- Anonymous RPC execution: true.
- Anonymous usage of the `public` schema: true.

These results describe the inspected local database state, not a remote deployment.

## 4. Verification results

### 4.1 HTTP validation

The local endpoint was served at:

`http://127.0.0.1:54321/functions/v1/search-published-questions`

The following tests passed:

| Test | Expected | Observed |
|---|---:|---:|
| GET request | 405 | 405 |
| Invalid JSON | 400 | 400 |
| Missing `searchTerm` | 400 | 400 |
| Blank search term | 200 with empty data | 200 with empty data |
| Search term longer than 100 characters | 400 | 400 |
| Non-numeric limit | 400 | 400 |

### 4.2 Published-only integration test

Five temporary question records were created with a unique test marker, one each with `published`, `draft`, `pending`, `rejected`, and `archived` status.

The HTTP search returned exactly one matching record: the published fixture. The four non-published fixtures were not returned. A request with `limit = 1` returned one result.

The response contract does not include a status field, so the integration assertion checked the result count and published fixture title. The database function and RLS policy enforce the published-only restriction.

All five temporary fixtures were then deleted. Verification reported:
- Remaining records matching the test marker: `0`.
- Total rows in `public.questions` after cleanup: `0`.

The table was empty before fixture creation and returned to that baseline afterward.

### 4.3 Frontend and repository checks

The following checks passed against the current working tree:

- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`

The production build emitted an advisory that `caniuse-lite` is outdated; the build still completed successfully.

Git emitted LF-to-CRLF line-ending warnings for some working files. `git diff --check` returned successfully with no whitespace errors.

## 5. Local runtime recovery

The first attempt to serve the function reported that the `supabase_edge_runtime_AIKCP` container did not exist. A subsequent retry started the runtime successfully and reported Supabase Edge Runtime 1.74.3, compatible with Deno 2.1.4.

The runtime then served:
- `current-affair-ai-process`
- `generate-embedding`
- `search-published-questions`

The HTTP tests above were executed against the running local endpoint.

## 6. Migration-history caveat — required before future migration pushes

The Day 24 migration was applied directly to the local database through `psql`. The recorded workflow did not add a corresponding migration-history entry through the Supabase CLI.

Before any future `npx supabase db push`, inspect local migration history and reconcile the applied migration using the supported Supabase migration-repair workflow. Do not blindly reapply this migration: it creates a role and function that already exist in the local database.

Remote migration history already contained multiple pending migrations in earlier inspections. Therefore, do not use `supabase db push` as a shortcut for Day 24 deployment. Review and authorize the complete pending migration plan first.

## 7. Change-control and outstanding work

The following were not performed:
- No remote migration push or production deployment.
- No Git staging, commit, or push.
- No database reset.
- No cleanup of retained backup files.
- No broad cleanup or replacement of unrelated working-tree changes.

`supabase/config.toml` contains unrelated local configuration changes, including the database port, analytics setting, auth redirect allowlist, and existing encoding/line-ending changes. These must be preserved and reviewed separately. Do not replace the entire file with a committed baseline merely to isolate the Day 24 function entry.

Before staging or committing, review the Day 24 files individually and ensure unrelated changes, temporary backups, and other pending migrations are excluded.

## 8. Day 24 outcome

The local public question search implementation passed TypeScript validation, production build, whitespace validation, HTTP input checks, the published-only integration test, result-limit verification, and test-fixture cleanup.

**Day 24 local implementation is functionally verified. Overall operational closure remains conditional on migration-history reconciliation before any future CLI migration push. Remote deployment and Git operations remain pending and unauthorized by this record.**
