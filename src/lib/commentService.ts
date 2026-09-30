import { supabase } from '@/lib/supabase';

export type CommentRecord = {
  id: string;
  content_id: string;
  parent_id: string | null;
  author_id: string | null;
  body: string;
  language_code: string;
  created_at: string;
  updated_at: string;
  status: string;
  content_type: string;
};

export type CreateCommentInput = {
  contentId: string;
  parentId?: string | null;
  body: string;
  languageCode?: string;
  contentType: string;
};

export async function listComments(contentId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(
      'id, content_id, parent_id, author_id, body, language_code, created_at, updated_at, status, content_type',
    )
    .eq('content_id', contentId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as CommentRecord[];
}

export async function createComment(input: CreateCommentInput) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  const body = input.body.trim();

  if (!body) {
    throw new Error('Comment cannot be empty');
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      content_id: input.contentId,
      parent_id: input.parentId ?? null,
      author_id: user.id,
      body,
      language_code: input.languageCode ?? 'en',
      content_type: input.contentType,
    })
    .select(
      'id, content_id, parent_id, author_id, body, language_code, created_at, updated_at, status, content_type',
    )
    .single();

  if (error) {
    throw error;
  }

  return data as CommentRecord;
}
