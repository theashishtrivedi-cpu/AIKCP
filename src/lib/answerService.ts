import { supabase } from '@/lib/supabase';

export type Answer = {
  id: string;
  question_id: string;
  author_id: string | null;
  body: string;
  language_code: string;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
};

export async function listAnswers(questionId: string): Promise<{
  data: Answer[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('answers')
    .select(
      'id, question_id, author_id, body, language_code, is_accepted, created_at, updated_at'
    )
    .eq('question_id', questionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to load answers:', error);

    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []) as Answer[],
    error: null,
  };
}

export async function createAnswer(
  questionId: string,
  body: string,
  languageCode = 'en'
): Promise<{
  data: Answer | null;
  error: string | null;
}> {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    return {
      data: null,
      error: 'Answer cannot be empty.',
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: 'You must be signed in to post an answer.',
    };
  }

  const { data, error } = await supabase
    .from('answers')
    .insert({
      question_id: questionId,
      author_id: user.id,
      body: trimmedBody,
      language_code: languageCode,
    })
    .select(
      'id, question_id, author_id, body, language_code, is_accepted, created_at, updated_at'
    )
    .single();

  if (error) {
    console.error('Failed to create answer:', error);

    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as Answer,
    error: null,
  };
}
