import { supabase } from '@/lib/supabase';

export type CurrentAffair = {
  id: string;
  source_id: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  title: string;
  source_title: string | null;
  source_url: string | null;
  original_content: string | null;
  summary: string | null;
  image_url: string | null;
  language_code: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'pending' | 'published' | 'rejected' | 'archived';
};

const CURRENT_AFFAIR_COLUMNS =
  'id, source_id, category_id, subcategory_id, title, source_title, source_url, original_content, summary, image_url, language_code, published_at, created_at, updated_at, status';

export async function listCurrentAffairs(): Promise<{
  data: CurrentAffair[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('current_affairs')
    .select(CURRENT_AFFAIR_COLUMNS)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Failed to load current affairs:', error);
    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []) as CurrentAffair[],
    error: null,
  };
}

export async function getCurrentAffairById(
  currentAffairId: string
): Promise<{
  data: CurrentAffair | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('current_affairs')
    .select(CURRENT_AFFAIR_COLUMNS)
    .eq('id', currentAffairId)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Failed to load current affair:', error);
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as CurrentAffair,
    error: null,
  };
}
