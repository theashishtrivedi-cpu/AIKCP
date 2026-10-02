export type CurrentAffairIngestionInput = {
  source_id: string;
  source_title: string;
  source_url: string;
  title: string;
  original_content?: string | null;
  summary?: string | null;
  image_url?: string | null;
  language_code: string;
  source_published_at?: string | null;
  author_byline?: string | null;
  source_language_code?: string | null;
  attribution?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
};

export type NormalizedCurrentAffair = {
  source_id: string;
  source_title: string;
  source_url: string;
  title: string;
  original_content: string | null;
  summary: string | null;
  image_url: string | null;
  language_code: string;
  source_published_at: string | null;
  author_byline: string | null;
  source_language_code: string | null;
  attribution: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  ingested_at: string;
  content_fingerprint: string;
};

export type IngestionValidationResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      errors: string[];
    };

function normalizeText(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function normalizeUrl(value: string): string {
  return value.trim();
}

function normalizeTimestamp(value: string | null | undefined): string {
  return value ? new Date(value).toISOString() : '';
}

export function validateCurrentAffairIngestion(
  input: CurrentAffairIngestionInput
): IngestionValidationResult {
  const errors: string[] = [];

  if (!input.source_id.trim()) {
    errors.push('Source ID is required.');
  }

  if (!input.source_title.trim()) {
    errors.push('Source title is required.');
  }

  if (!input.source_url.trim()) {
    errors.push('Source URL is required.');
  }

  if (!input.title.trim()) {
    errors.push('Article title is required.');
  }

  if (!input.language_code.trim()) {
    errors.push('Language code is required.');
  }

  if (input.source_published_at) {
    const timestamp = new Date(input.source_published_at);

    if (Number.isNaN(timestamp.getTime())) {
      errors.push('Source publication timestamp is invalid.');
    }
  }

  try {
    new URL(input.source_url);
  } catch {
    errors.push('Source URL must be a valid absolute URL.');
  }

  return errors.length === 0
    ? { valid: true }
    : { valid: false, errors };
}

async function sha256Hex(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function normalizeCurrentAffairIngestion(
  input: CurrentAffairIngestionInput,
  ingestedAt = new Date().toISOString()
): Promise<NormalizedCurrentAffair> {
  const validation = validateCurrentAffairIngestion(input);

  if (!validation.valid) {
    throw new Error(validation.errors.join(' '));
  }

  const normalizedIdentity = [
    normalizeText(input.source_id),
    normalizeText(input.source_title),
    normalizeUrl(input.source_url),
    normalizeText(input.title),
    normalizeText(input.original_content),
    normalizeTimestamp(input.source_published_at),
    normalizeText(input.source_language_code || input.language_code),
  ].join('|');

  const content_fingerprint = await sha256Hex(normalizedIdentity);

  return {
    source_id: input.source_id.trim(),
    source_title: input.source_title.trim(),
    source_url: normalizeUrl(input.source_url),
    title: input.title.trim(),
    original_content: input.original_content?.trim() || null,
    summary: input.summary?.trim() || null,
    image_url: input.image_url?.trim() || null,
    language_code: input.language_code.trim(),
    source_published_at: input.source_published_at
      ? new Date(input.source_published_at).toISOString()
      : null,
    author_byline: input.author_byline?.trim() || null,
    source_language_code: input.source_language_code?.trim() || null,
    attribution: input.attribution?.trim() || null,
    category_id: input.category_id || null,
    subcategory_id: input.subcategory_id || null,
    ingested_at: new Date(ingestedAt).toISOString(),
    content_fingerprint,
  };
}
