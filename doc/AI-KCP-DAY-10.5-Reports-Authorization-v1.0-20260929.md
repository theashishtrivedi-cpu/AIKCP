# AI-KCP — Day 10.5 Engineering Record
## Reports Authorization

**Date:** 2026-09-29  
**Branch:** main  
**Status:** COMPLETE

---

## 1. Objective

Move Reports creation onto the centralized authorization framework established in Day 10.1 while preserving the existing reporter ownership/null behavior and write-status enforcement.

---

## 2. Database Implementation

Created:

`supabase/migrations/20260929180000_day10_reports_authorization.sql`

Implemented centralized permissions for the `reports` resource:

| Role | Create | Edit |
|---|---:|---:|
| user | true | false |
| editor | true | false |
| moderator | true | true |
| admin | true | true |

Replaced the previous `reports_insert_user` policy with:

`reports_insert_authorized`

The new policy requires all of:

1. Centralized `reports/create` permission
2. Existing `is_write_allowed()` condition
3. `reporter_id = auth.uid()` OR `reporter_id IS NULL`

---

## 3. Existing Policy Preservation

The following Reports policies were intentionally preserved:

- `reports_delete_admin`
- `reports_select_reporter_moderator_admin`
- `reports_update_moderator_admin`

Only the INSERT authorization path was migrated.

---

## 4. Frontend Scope

No active Reports authorization helper or Reports submission implementation was identified in the current frontend code during discovery.

No frontend files were modified.

---

## 5. Security Boundary

PostgreSQL/RLS remains the authoritative authorization boundary.

The centralized permission matrix determines the resource/action authorization decision, while reporter ownership/null semantics and write-status constraints remain independently enforced by the Reports INSERT policy.

---

## 6. Validation Evidence

- `npx supabase db reset` — PASS
- `npx supabase db lint` — PASS
- `npx supabase db diff` — no schema changes pending
- Reports authorization matrix — PASS; 8 expected rows
- `reports_insert_authorized` — present
- Legacy `reports_insert_user` — absent
- Reporter ownership/null behavior — preserved
- Existing write-status enforcement — preserved
- Existing DELETE/SELECT/UPDATE policies — preserved

---

## 7. Completion Decision

Day 10.5 is technically complete and ready for Git closure.

Next planned work:

**Day 10.6 — Notifications authorization**
