import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpcMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: rpcMock,
  },
}));

import { canPerformCommentAction } from './commentAuthorization';

describe('commentAuthorization', () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it('allows an authorized comment action', async () => {
    rpcMock.mockResolvedValue({
      data: true,
      error: null,
    });

    await expect(
      canPerformCommentAction('create'),
    ).resolves.toBe(true);

    expect(rpcMock).toHaveBeenCalledWith('has_permission', {
      p_resource: 'comments',
      p_action: 'create',
    });
  });

  it('denies a rejected authorization response', async () => {
    rpcMock.mockResolvedValue({
      data: false,
      error: null,
    });

    await expect(
      canPerformCommentAction('create'),
    ).resolves.toBe(false);
  });

  it('fails closed when authorization RPC errors', async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: new Error('authorization failure'),
    });

    await expect(
      canPerformCommentAction('create'),
    ).resolves.toBe(false);
  });
});
