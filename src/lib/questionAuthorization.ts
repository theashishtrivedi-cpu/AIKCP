import type { Profile } from '@/context/AuthContext';

/*
 * Day 9 authorization boundary.
 *
 * Question authoring is intentionally disabled until the centralized,
 * administrator-configurable authorization framework is implemented.
 *
 * This module must not encode role-specific authorization rules.
 */

export type QuestionAction = 'create' | 'edit';

export function canPerformQuestionAction(
  _profile: Profile | null,
  _action: QuestionAction
): boolean {
  return false;
}
