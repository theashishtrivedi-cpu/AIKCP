import { supabase } from '@/lib/supabase';

export type QuestionAction = 'create' | 'edit';

/**
 * Resolves question authorization through the centralized
 * database permission matrix.
 *
 * PostgreSQL remains the authoritative enforcement layer.
 * This function is a frontend authorization check used to
 * control UI behavior before an operation is attempted.
 */
export async function canPerformQuestionAction(
  action: QuestionAction
): Promise<boolean> {
  const { data, error } = await supabase.rpc('has_permission', {
    p_resource: 'questions',
    p_action: action,
  });

  if (error) {
    console.error('Question authorization check failed:', error);
    return false;
  }

  return data === true;
}
