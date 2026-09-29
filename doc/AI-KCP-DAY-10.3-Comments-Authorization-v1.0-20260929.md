# AI-KCP — Day 10.3 Engineering Record
## Comments Authorization

**Date:** 2026-09-29  
**Branch:** main  
**Status:** COMPLETE

---

## 1. Objective

Move Comments creation onto the centralized authorization framework established in Day 10.1 while preserving the existing ownership and write-status controls.

---

## 2. Database Implementation

Created:

`supabase/migrations/20260929160000_day10_comments_authorization.sql`

Implemented centralized permissions for the `comments` resource:

| Role | Create | Edit |
|---|---:|---:|
| user | true | false |
| editor | true | true |
| moderator | true | true |
| admin | true | true |

Replaced the previous `comments_insert_user` policy with:

`comments_insert_authorized`

The new policy requires all of:

1. Centralized `comments/create` permission
2. Existing `is_write_allowed()` condition
3. `author_id = auth.uid()`

---

## 3. Existing Policy Preservation

The following Comments policies were intentionally preserved:

- `comments_select_authenticated`
- `comments_update_owner_moderator_admin`
- `comments_delete_owner_moderator_admin`

Only the INSERT authorization path was migrated.

---

## 4. Frontend Scope

No active Comments authorization helper or Comments submission implementation was identified in the current frontend code during discovery.

The existing frontend references are UI/mock-data references and were not modified.

---

## 5. Security Boundary

PostgreSQL/RLS remains the authoritative authorization boundary.

The centralized permission matrix determines the resource/action authorization decision, while ownership and write-status constraints remain independently enforced by the Comments INSERT policy.

---

## 6. Validation Evidence

- `npx supabase db reset` — PASS
- `npx supabase db lint` — PASS
- `npx supabase db diff` — no schema changes pending
- Comments authorization matrix — PASS; 8 expected rows
- `comments_insert_authorized` — present
- Legacy `comments_insert_user` — absent
- Ownership enforcement — preserved
- Existing write-status enforcement — preserved

---

## 7. Completion Decision

Day 10.3 is technically complete and ready for Git closure.

Next planned work:

**Day 10.4 — Reactions authorization**
