import { describe, expect, it } from 'vitest';
import {
  normalizeCurrentAffairIngestion,
  validateCurrentAffairIngestion,
  type CurrentAffairIngestionInput,
} from './currentAffairsIngestion';

const baseInput: CurrentAffairIngestionInput = {
  source_id: 'source-001',
  source_title: 'Example News Source',
  source_url: 'https://example.com/article-1',
  title: 'Important Current Affairs Story',
  original_content: 'This is the original article content.',
  language_code: 'en',
  source_published_at: '2026-10-02T10:00:00Z',
  author_byline: 'Example Author',
  source_language_code: 'en',
  attribution: 'Example News Source',
};

describe('Current Affairs ingestion normalization', () => {
  it('produces the same fingerprint for equivalent normalized content', async () => {
    const first = await normalizeCurrentAffairIngestion(
      baseInput,
      '2026-10-02T12:00:00Z'
    );

    const equivalent = await normalizeCurrentAffairIngestion(
      {
        ...baseInput,
        title: '  IMPORTANT   CURRENT AFFAIRS STORY  ',
        original_content: ' This is   the original article content. ',
        source_title: ' Example News Source ',
      },
      '2026-10-02T13:00:00Z'
    );

    expect(first.content_fingerprint).toBe(equivalent.content_fingerprint);
  });

  it('changes the fingerprint when substantive article content changes', async () => {
    const first = await normalizeCurrentAffairIngestion(
      baseInput,
      '2026-10-02T12:00:00Z'
    );

    const changed = await normalizeCurrentAffairIngestion(
      {
        ...baseInput,
        original_content: 'This is materially different article content.',
      },
      '2026-10-02T12:00:00Z'
    );

    expect(first.content_fingerprint).not.toBe(changed.content_fingerprint);
  });

  it('rejects invalid ingestion input', () => {
    const result = validateCurrentAffairIngestion({
      ...baseInput,
      source_id: '',
      source_url: 'not-a-url',
      title: '',
      language_code: '',
      source_published_at: 'invalid-date',
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain('Source ID is required.');
      expect(result.errors).toContain('Article title is required.');
      expect(result.errors).toContain('Language code is required.');
      expect(result.errors).toContain(
        'Source publication timestamp is invalid.'
      );
      expect(result.errors).toContain(
        'Source URL must be a valid absolute URL.'
      );
    }
  });

  it('normalizes the source publication timestamp to ISO format', async () => {
    const result = await normalizeCurrentAffairIngestion(
      {
        ...baseInput,
        source_published_at: '2026-10-02T15:30:00+05:30',
      },
      '2026-10-02T16:00:00+05:30'
    );

    expect(result.source_published_at).toBe('2026-10-02T10:00:00.000Z');
    expect(result.ingested_at).toBe('2026-10-02T10:30:00.000Z');
  });
});
