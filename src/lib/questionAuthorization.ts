import type { Profile } from '@/context/AuthContext';

export const QUESTION_AUTHORING_ROLES = [
  'editor',
  'moderator',
  'admin',
] as const;

export function canCreateOrEditQuestion(
  profile: Profile | null
): boolean {
  if (!profile) return false;

  if (profile.status !== 'active') return false;

  return QUESTION_AUTHORING_ROLES.includes(
    profile.role as (typeof QUESTION_AUTHORING_ROLES)[number]
  );
}
