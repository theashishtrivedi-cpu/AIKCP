import { supabase } from '@/lib/supabase';

export type RealQuestion = {
  id: string;
  author_id: string | null;
  category_id: string;
  subcategory_id: string;
  title: string;
  body: string | null;
  language_code: string;
  is_featured: boolean;
  is_trending: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export async function getQuestionByUuid(
  questionId: string
): Promise<{
  data: RealQuestion | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('questions')
    .select(
      'id, author_id, category_id, subcategory_id, title, body, language_code, is_featured, is_trending, view_count, created_at, updated_at'
    )
    .eq('id', questionId)
    .single();

  if (error) {
    console.error('Failed to load question:', error);
    return { data: null, error: error.message };
  }

  return {
    data: data as RealQuestion,
    error: null,
  };
}
