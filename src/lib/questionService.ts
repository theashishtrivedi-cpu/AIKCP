import { supabase } from '@/lib/supabase';

export type RealQuestion = {
  id: string;
  author_id: string | null;
  category_id: string;
  subcategory_id: string | null;
  title: string;
  body: string | null;
  language_code: string;
  status: 'draft' | 'pending' | 'published' | 'rejected' | 'archived';
  is_featured: boolean;
  is_trending: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type CreateQuestionInput = {
  category_id: string;
  subcategory_id?: string | null;
  title: string;
  body?: string | null;
  language_code?: string;
};

export type UpdateQuestionInput = {
  category_id?: string;
  subcategory_id?: string | null;
  title?: string;
  body?: string | null;
  language_code?: string;
};

export async function listQuestions(): Promise<{
  data: RealQuestion[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('questions')
    .select(
      'id, author_id, category_id, subcategory_id, title, body, language_code, status, is_featured, is_trending, view_count, created_at, updated_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load questions:', error);
    return { data: [], error: error.message };
  }

  return {
    data: (data ?? []) as RealQuestion[],
    error: null,
  };
}

export type PublicQuestionSearchResult = {
  id: string;
  title: string;
  body: string | null;
  language_code: string;
  created_at: string;
};

export async function searchPublishedQuestions(
  searchTerm: string,
  limit = 20
): Promise<{
  data: PublicQuestionSearchResult[];
  error: string | null;
}> {
  const term = searchTerm.trim();

  if (!term) {
    return { data: [], error: null };
  }

  if (term.length > 100) {
    return { data: [], error: 'Search term must not exceed 100 characters.' };
  }

  const safeLimit = Math.max(1, Math.min(Math.trunc(limit) || 20, 50));

  const { data, error } = await supabase.functions.invoke(
    'search-published-questions',
    { body: { searchTerm: term, limit: safeLimit } }
  );

  if (error) {
    console.error('Failed to search published questions:', error.message);
    return { data: [], error: 'Could not load published questions.' };
  }

  if (!data || !Array.isArray(data.data)) {
    console.error('Public question search returned an invalid response.');
    return { data: [], error: 'Could not load published questions.' };
  }

  return {
    data: data.data as PublicQuestionSearchResult[],
    error: null,
  };
}
export async function getQuestionByUuid(
  questionId: string
): Promise<{
  data: RealQuestion | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('questions')
    .select(
      'id, author_id, category_id, subcategory_id, title, body, language_code, status, is_featured, is_trending, view_count, created_at, updated_at'
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

export async function createQuestion(
  input: CreateQuestionInput
): Promise<{
  data: RealQuestion | null;
  error: string | null;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      data: null,
      error: 'You must be signed in to create a question.',
    };
  }

  const title = input.title.trim();

  if (!title) {
    return {
      data: null,
      error: 'Question title is required.',
    };
  }

  const { data, error } = await supabase
    .from('questions')
    .insert({
      author_id: user.id,
      category_id: input.category_id,
      subcategory_id: input.subcategory_id || null,
      title,
      body: input.body?.trim() || null,
      language_code: input.language_code || 'en',
    })
    .select(
      'id, author_id, category_id, subcategory_id, title, body, language_code, status, is_featured, is_trending, view_count, created_at, updated_at'
    )
    .single();

  if (error) {
    console.error('Failed to create question:', error);
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as RealQuestion,
    error: null,
  };
}

export async function updateQuestion(
  questionId: string,
  input: UpdateQuestionInput
): Promise<{
  data: RealQuestion | null;
  error: string | null;
}> {
  const updatePayload: UpdateQuestionInput = {};

  if (input.category_id !== undefined) {
    updatePayload.category_id = input.category_id;
  }

  if (input.subcategory_id !== undefined) {
    updatePayload.subcategory_id = input.subcategory_id;
  }

  if (input.title !== undefined) {
    const title = input.title.trim();

    if (!title) {
      return {
        data: null,
        error: 'Question title is required.',
      };
    }

    updatePayload.title = title;
  }

  if (input.body !== undefined) {
    updatePayload.body = input.body?.trim() || null;
  }

  if (input.language_code !== undefined) {
    updatePayload.language_code = input.language_code;
  }

  const { data, error } = await supabase
    .from('questions')
    .update(updatePayload)
    .eq('id', questionId)
    .select(
      'id, author_id, category_id, subcategory_id, title, body, language_code, status, is_featured, is_trending, view_count, created_at, updated_at'
    )
    .single();

  if (error) {
    console.error('Failed to update question:', error);
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as RealQuestion,
    error: null,
  };
}

export type QuestionModerationStatus = 'published' | 'rejected';

export async function moderateQuestion(
  questionId: string,
  status: QuestionModerationStatus
): Promise<{
  data: RealQuestion | null;
  error: string | null;
}> {
  const { data: authorized, error: authorizationError } = await supabase.rpc(
    'has_permission',
    {
      p_resource: 'questions',
      p_action: 'moderate',
    }
  );

  if (authorizationError) {
    console.error(
      'Question moderation authorization check failed:',
      authorizationError
    );
    return {
      data: null,
      error: authorizationError.message,
    };
  }

  if (authorized !== true) {
    return {
      data: null,
      error: 'You are not authorized to moderate questions.',
    };
  }

  const { data, error } = await supabase
    .from('questions')
    .update({ status })
    .eq('id', questionId)
    .eq('status', 'pending')
    .select(
      'id, author_id, category_id, subcategory_id, title, body, language_code, status, is_featured, is_trending, view_count, created_at, updated_at'
    )
    .single();

  if (error) {
    console.error('Failed to moderate question:', error);
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as RealQuestion,
    error: null,
  };
}

export async function listPendingQuestions(): Promise<{
  data: RealQuestion[];
  error: string | null;
}> {
  const { data: authorized, error: authorizationError } = await supabase.rpc(
    'has_permission',
    {
      p_resource: 'questions',
      p_action: 'moderate',
    }
  );

  if (authorizationError) {
    console.error(
      'Question moderation authorization check failed:',
      authorizationError
    );
    return {
      data: [],
      error: authorizationError.message,
    };
  }

  if (authorized !== true) {
    return {
      data: [],
      error: 'You are not authorized to moderate questions.',
    };
  }

  const { data, error } = await supabase
    .from('questions')
    .select(
      'id, author_id, category_id, subcategory_id, title, body, language_code, status, is_featured, is_trending, view_count, created_at, updated_at'
    )
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to load pending questions:', error);
    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []) as RealQuestion[],
    error: null,
  };
}
