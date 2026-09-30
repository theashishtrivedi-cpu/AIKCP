import { supabase } from '@/lib/supabase';

export type CommentAction = 'create' | 'edit' | 'delete';

export async function canPerformCommentAction(
  action: CommentAction,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('has_permission', {
    p_resource: 'comments',
    p_action: action,
  });

  if (error) {
    console.error('Comment authorization check failed:', error);
    return false;
  }

  return data === true;
}
