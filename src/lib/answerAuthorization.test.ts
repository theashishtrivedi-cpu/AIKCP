import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

import { supabase } from '@/lib/supabase';
import { canPerformAnswerAction } from '@/lib/answerAuthorization';

describe('answerAuthorization', () => {
  it('allows an authorized answer action when permission is true', async () => {
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: true,
      error: null,
    } as never);

    await expect(canPerformAnswerAction('create')).resolves.toBe(true);
  });

  it('denies an answer action when permission check fails', async () => {
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: null,
      error: new Error('permission check failed'),
    } as never);

    await expect(canPerformAnswerAction('create')).resolves.toBe(false);
  });

  it('denies an answer action when permission is false', async () => {
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: false,
      error: null,
    } as never);

    await expect(canPerformAnswerAction('edit')).resolves.toBe(false);
  });
});
