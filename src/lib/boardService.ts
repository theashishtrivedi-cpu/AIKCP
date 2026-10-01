import { supabase } from '@/lib/supabase';

export type BoardSection = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  level: 'national' | 'state' | 'district' | 'provisional';
};

export type BoardContent = {
  id: string;
  section_id: string;
  author_id: string | null;
  title: string;
  body: string;
  language_code: string;
  source_url: string | null;
  original_content_id: string | null;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'pending' | 'published' | 'rejected' | 'archived';
};

const BOARD_SECTION_COLUMNS =
  'id, name, slug, parent_id, description, sort_order, is_active, created_at, level';

const BOARD_CONTENT_COLUMNS =
  'id, section_id, author_id, title, body, language_code, source_url, original_content_id, created_at, updated_at, status';

export async function listBoardSections(): Promise<{
  data: BoardSection[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('board_sections')
    .select(BOARD_SECTION_COLUMNS)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Failed to load board sections:', error);
    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []) as BoardSection[],
    error: null,
  };
}

export async function listBoardContent(
  sectionId?: string
): Promise<{
  data: BoardContent[];
  error: string | null;
}> {
  let query = supabase
    .from('board_content')
    .select(BOARD_CONTENT_COLUMNS)
    .eq('status', 'published')
    .order('created_at', { ascending: true });

  if (sectionId) {
    query = query.eq('section_id', sectionId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to load board content:', error);
    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []) as BoardContent[],
    error: null,
  };
}

export async function getBoardContentById(
  boardContentId: string
): Promise<{
  data: BoardContent | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('board_content')
    .select(BOARD_CONTENT_COLUMNS)
    .eq('id', boardContentId)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Failed to load board content:', error);
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as BoardContent,
    error: null,
  };
}
