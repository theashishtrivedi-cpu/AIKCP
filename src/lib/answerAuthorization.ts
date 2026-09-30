import { supabase } from '@/lib/supabase';

export type AnswerAction = 'create' | 'edit';

export async function canPerformAnswerAction(
  action: AnswerAction
): Promise<boolean> {
  const { data, error } = await supabase.rpc('has_permission', {
    p_resource: 'answers',
    p_action: action,
  });

  if (error) {
    console.error('Answer authorization check failed:', error);
    return false;
  }

  return data === true;
}
