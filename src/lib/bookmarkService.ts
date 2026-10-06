
import { supabase } from '@/lib/supabase';

export type CurrentAffairBookmark = {
  id: string;
  content_id: string;
  created_at: string;
  content_type: 'current_affair';
  title: string;
  published_at: string | null;
  source_title: string | null;
};

type BookmarkResult<T> = {
  data: T;
  error: string | null;
};

async function getAuthenticatedUser(): Promise<{
  user: { id: string } | null;
  error: string | null;
}> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      error: 'Please sign in to manage your saved content.',
    };
  }

  return { user: { id: user.id }, error: null };
}

export async function isCurrentAffairBookmarked(
  currentAffairId: string
): Promise<BookmarkResult<boolean>> {
  const auth = await getAuthenticatedUser();

  if (!auth.user) {
    return { data: false, error: auth.error };
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', auth.user.id)
    .eq('content_type', 'current_affair')
    .eq('content_id', currentAffairId)
    .maybeSingle();

  if (error) {
    console.error('Failed to check bookmark:', error);
    return { data: false, error: error.message };
  }

  return { data: Boolean(data), error: null };
}

export async function saveCurrentAffairBookmark(
  currentAffairId: string
): Promise<BookmarkResult<boolean>> {
  const auth = await getAuthenticatedUser();

  if (!auth.user) {
    return { data: false, error: auth.error };
  }

  const { error } = await supabase.from('bookmarks').insert({
    user_id: auth.user.id,
    content_id: currentAffairId,
    content_type: 'current_affair',
  });

  // The unique constraint means a duplicate bookmark already exists.
  if (error?.code === '23505') {
    return { data: true, error: null };
  }

  if (error) {
    console.error('Failed to save bookmark:', error);
    return { data: false, error: error.message };
  }

  return { data: true, error: null };
}

export async function removeCurrentAffairBookmark(
  currentAffairId: string
): Promise<BookmarkResult<boolean>> {
  const auth = await getAuthenticatedUser();

  if (!auth.user) {
    return { data: false, error: auth.error };
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', auth.user.id)
    .eq('content_type', 'current_affair')
    .eq('content_id', currentAffairId);

  if (error) {
    console.error('Failed to remove bookmark:', error);
    return { data: false, error: error.message };
  }

  return { data: true, error: null };
}

export async function listCurrentAffairBookmarks(): Promise<
  BookmarkResult<CurrentAffairBookmark[]>
> {
  const auth = await getAuthenticatedUser();

  if (!auth.user) {
    return { data: [], error: auth.error };
  }

  const { data: bookmarks, error: bookmarkError } = await supabase
    .from('bookmarks')
    .select('id, content_id, created_at, content_type')
    .eq('user_id', auth.user.id)
    .eq('content_type', 'current_affair')
    .order('created_at', { ascending: false });

  if (bookmarkError) {
    console.error('Failed to load bookmarks:', bookmarkError);
    return { data: [], error: bookmarkError.message };
  }

  if (!bookmarks?.length) {
    return { data: [], error: null };
  }

  const contentIds = bookmarks.map((bookmark) => bookmark.content_id);

  const { data: affairs, error: affairError } = await supabase
    .from('current_affairs')
    .select('id, title, published_at, source_title')
    .in('id', contentIds)
    .eq('status', 'published');

  if (affairError) {
    console.error('Failed to load bookmarked current affairs:', affairError);
    return { data: [], error: affairError.message };
  }

  const affairsById = new Map(
    (affairs ?? []).map((affair) => [affair.id, affair])
  );

  const savedItems: CurrentAffairBookmark[] = bookmarks.flatMap(
    (bookmark) => {
      const affair = affairsById.get(bookmark.content_id);

      // Only show content that remains publicly available.
      if (!affair) {
        return [];
      }

      return [
        {
          id: bookmark.id,
          content_id: bookmark.content_id,
          created_at: bookmark.created_at,
          content_type: 'current_affair' as const,
          title: affair.title,
          published_at: affair.published_at,
          source_title: affair.source_title,
        },
      ];
    }
  );

  return { data: savedItems, error: null };
}
