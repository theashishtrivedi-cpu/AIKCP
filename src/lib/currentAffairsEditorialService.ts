import { supabase } from '@/lib/supabase';
import type { CurrentAffair } from '@/lib/currentAffairsService';

const CURRENT_AFFAIR_COLUMNS =
  'id, source_id, category_id, subcategory_id, title, source_title, source_url, original_content, summary, image_url, language_code, published_at, source_published_at, ingested_at, author_byline, source_language_code, attribution, content_fingerprint, created_at, updated_at, status';

export async function listPendingCurrentAffairs(): Promise<{
  data: CurrentAffair[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('current_affairs')
    .select(CURRENT_AFFAIR_COLUMNS)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load pending current affairs:', error);
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

export async function publishCurrentAffair(
  currentAffairId: string
): Promise<{
  data: CurrentAffair | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('current_affairs')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', currentAffairId)
    .eq('status', 'pending')
    .select(CURRENT_AFFAIR_COLUMNS)
    .single();

  if (error) {
    console.error('Failed to publish current affair:', error);
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

export async function rejectCurrentAffair(
  currentAffairId: string
): Promise<{
  data: CurrentAffair | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('current_affairs')
    .update({
      status: 'rejected',
    })
    .eq('id', currentAffairId)
    .eq('status', 'pending')
    .select(CURRENT_AFFAIR_COLUMNS)
    .single();

  if (error) {
    console.error('Failed to reject current affair:', error);
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
