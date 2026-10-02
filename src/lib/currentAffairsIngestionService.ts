import { supabase } from '@/lib/supabase';
import {
  normalizeCurrentAffairIngestion,
  type CurrentAffairIngestionInput,
  type NormalizedCurrentAffair,
} from '@/lib/currentAffairsIngestion';

export type CurrentAffairDuplicateResult =
  | {
      duplicate: true;
      existingId: string;
    }
  | {
      duplicate: false;
      existingId: null;
    };

export type CurrentAffairIngestionResult =
  | {
      inserted: true;
      duplicate: false;
      record: NormalizedCurrentAffair & {
        id: string;
      };
    }
  | {
      inserted: false;
      duplicate: true;
      existingId: string;
    };

const CURRENT_AFFAIR_INSERT_COLUMNS =
  'id, source_id, category_id, subcategory_id, title, source_title, source_url, original_content, summary, image_url, language_code, published_at, source_published_at, ingested_at, author_byline, source_language_code, attribution, content_fingerprint, created_at, updated_at, status';

export async function findCurrentAffairDuplicate(
  contentFingerprint: string
): Promise<CurrentAffairDuplicateResult> {
  const { data, error } = await supabase
    .from('current_affairs')
    .select('id')
    .eq('content_fingerprint', contentFingerprint)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Current Affairs duplicate lookup failed: ${error.message}`);
  }

  return data
    ? {
        duplicate: true,
        existingId: data.id,
      }
    : {
        duplicate: false,
        existingId: null,
      };
}

export async function ingestCurrentAffair(
  input: CurrentAffairIngestionInput
): Promise<CurrentAffairIngestionResult> {
  const normalized = await normalizeCurrentAffairIngestion(input);

  const duplicate = await findCurrentAffairDuplicate(
    normalized.content_fingerprint
  );

  if (duplicate.duplicate) {
    return {
      inserted: false,
      duplicate: true,
      existingId: duplicate.existingId,
    };
  }

  const { data, error } = await supabase
    .from('current_affairs')
    .insert({
      source_id: normalized.source_id,
      source_title: normalized.source_title,
      source_url: normalized.source_url,
      title: normalized.title,
      original_content: normalized.original_content,
      summary: normalized.summary,
      image_url: normalized.image_url,
      language_code: normalized.language_code,
      source_published_at: normalized.source_published_at,
      author_byline: normalized.author_byline,
      source_language_code: normalized.source_language_code,
      attribution: normalized.attribution,
      category_id: normalized.category_id,
      subcategory_id: normalized.subcategory_id,
      ingested_at: normalized.ingested_at,
      content_fingerprint: normalized.content_fingerprint,
      status: 'draft',
    })
    .select(CURRENT_AFFAIR_INSERT_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Current Affairs ingestion failed: ${error.message}`);
  }

  return {
    inserted: true,
    duplicate: false,
    record: data as NormalizedCurrentAffair & {
      id: string;
    },
  };
}
