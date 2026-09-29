# AI-KCP — Day 10.4 Engineering Record
## Reactions Authorization

**Date:** 2026-09-29  
**Branch:** main  
**Status:** COMPLETE

---

## 1. Objective

Move Reactions creation onto the centralized authorization framework established in Day 10.1 while preserving the existing ownership and write-status controls.

---

## 2. Database Implementation

Created:

`supabase/migrations/20260929170000_day10_reactions_authorization.sql`

Implemented centralized permissions for the `reactions` resource:

| Role | Create | Edit |
|---|---:|---:|
| user | true | false |
| editor | true | true |
| moderator | true | true |
| admin | true | true |

Replaced the previous `reactions_insert_user` policy with:

`reactions_insert_authorized`

The new policy requires all of:

1. Centralized `reactions/create` permission
2. Existing `is_write_allowed()` condition
3. `user_id = auth.uid()`

---

## 3. Existing Policy Preservation

The following Reactions policies were intentionally preserved:

- `reactions_select_authenticated`
- `reactions_update_owner`
- `reactions_delete_owner_moderator_admin`

Only the INSERT authorization path was migrated.

---

## 4. Frontend Scope

No active Reactions authorization helper or submission implementation was identified in the current frontend code during discovery.

No frontend files were modified.

---

## 5. Security Boundary

PostgreSQL/RLS remains the authoritative authorization boundary.

The centralized permission matrix determines the resource/action authorization decision, while ownership and write-status constraints remain independently enforced by the Reactions INSERT policy.

---

## 6. Validation Evidence

- `npx supabase db reset` — PASS
- `npx supabase db lint` — PASS
- `npx supabase db diff` — no schema changes pending
- Reactions authorization matrix — PASS; 8 expected rows
- `reactions_insert_authorized` — present
- Legacy `reactions_insert_user` — absent
- Ownership enforcement — preserved
- Existing write-status enforcement — preserved

---

## 7. Completion Decision

Day 10.4 is technically complete and ready for Git closure.

Next planned work:

**Day 10.5 — Reports authorization**
