import { supabase } from '@/lib/supabase';

export type NewsSourceType = 'rss' | 'api' | 'web';

export type NewsSource = {
  id: string;
  name: string;
  url: string;
  feed_url: string | null;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  source_type: NewsSourceType;
};

export type CreateNewsSourceInput = {
  name: string;
  url: string;
  feed_url?: string | null;
  is_approved?: boolean;
  is_active?: boolean;
  source_type?: NewsSourceType;
};

export type UpdateNewsSourceInput = Partial<CreateNewsSourceInput>;

const NEWS_SOURCE_COLUMNS =
  'id, name, url, feed_url, is_approved, is_active, created_at, updated_at, source_type';

export async function listNewsSources(): Promise<{
  data: NewsSource[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('news_sources')
    .select(NEWS_SOURCE_COLUMNS)
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to load news sources:', error);
    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []) as NewsSource[],
    error: null,
  };
}

export async function getNewsSourceById(
  newsSourceId: string
): Promise<{
  data: NewsSource | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('news_sources')
    .select(NEWS_SOURCE_COLUMNS)
    .eq('id', newsSourceId)
    .single();

  if (error) {
    console.error('Failed to load news source:', error);
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as NewsSource,
    error: null,
  };
}

export async function createNewsSource(
  input: CreateNewsSourceInput
): Promise<{
  data: NewsSource | null;
  error: string | null;
}> {
  const name = input.name.trim();
  const url = input.url.trim();

  if (!name) {
    return {
      data: null,
      error: 'Source name is required.',
    };
  }

  if (!url) {
    return {
      data: null,
      error: 'Source URL is required.',
    };
  }

  const { data, error } = await supabase
    .from('news_sources')
    .insert({
      name,
      url,
      feed_url: input.feed_url?.trim() || null,
      is_approved: input.is_approved ?? false,
      is_active: input.is_active ?? true,
      source_type: input.source_type ?? 'rss',
    })
    .select(NEWS_SOURCE_COLUMNS)
    .single();

  if (error) {
    console.error('Failed to create news source:', error);
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as NewsSource,
    error: null,
  };
}

export async function updateNewsSource(
  newsSourceId: string,
  input: UpdateNewsSourceInput
): Promise<{
  data: NewsSource | null;
  error: string | null;
}> {
  const payload: UpdateNewsSourceInput = {};

  if (input.name !== undefined) {
    const name = input.name.trim();

    if (!name) {
      return {
        data: null,
        error: 'Source name cannot be empty.',
      };
    }

    payload.name = name;
  }

  if (input.url !== undefined) {
    const url = input.url.trim();

    if (!url) {
      return {
        data: null,
        error: 'Source URL cannot be empty.',
      };
    }

    payload.url = url;
  }

  if (input.feed_url !== undefined) {
    payload.feed_url = input.feed_url?.trim() || null;
  }

  if (input.is_approved !== undefined) {
    payload.is_approved = input.is_approved;
  }

  if (input.is_active !== undefined) {
    payload.is_active = input.is_active;
  }

  if (input.source_type !== undefined) {
    payload.source_type = input.source_type;
  }

  const { data, error } = await supabase
    .from('news_sources')
    .update(payload)
    .eq('id', newsSourceId)
    .select(NEWS_SOURCE_COLUMNS)
    .single();

  if (error) {
    console.error('Failed to update news source:', error);
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as NewsSource,
    error: null,
  };
}

export async function deleteNewsSource(
  newsSourceId: string
): Promise<{
  error: string | null;
}> {
  const { error } = await supabase
    .from('news_sources')
    .delete()
    .eq('id', newsSourceId);

  if (error) {
    console.error('Failed to delete news source:', error);
    return {
      error: error.message,
    };
  }

  return {
    error: null,
  };
}
