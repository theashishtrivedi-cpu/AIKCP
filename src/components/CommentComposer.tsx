import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { canPerformCommentAction } from '@/lib/commentAuthorization';
import { createComment } from '@/lib/commentService';

type CommentComposerProps = {
  contentId: string;
  contentType?: string;
  parentId?: string | null;
  languageCode?: string;
  onCreated?: () => void;
};

export default function CommentComposer({
  contentId,
  contentType = 'question',
  parentId = null,
  languageCode = 'en',
  onCreated,
}: CommentComposerProps) {
  const { user, loading: authLoading } = useAuth();

  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setMessage(null);

    if (!user) {
      setMessage('Please sign in before posting a comment.');
      return;
    }

    if (!body.trim()) {
      setMessage('Please enter a comment.');
      return;
    }

    setSubmitting(true);

    try {
      const allowed = await canPerformCommentAction('create');

      if (!allowed) {
        setMessage('You are not currently allowed to post a comment.');
        return;
      }

      await createComment({
        contentId,
        parentId,
        body,
        languageCode,
        contentType,
      });

      setBody('');
      setMessage('Comment posted successfully.');
      onCreated?.();
    } catch (error) {
      console.error('Failed to create comment:', error);

      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to post comment.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="comment-preview">
        Checking sign-in status...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="comment-preview">
        <p>Please sign in to write a comment.</p>
      </div>
    );
  }

  return (
    <div className="comment-section">
      <div className="comment-input">
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write a comment..."
          disabled={submitting}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSubmit();
            }
          }}
        />

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={submitting || !body.trim()}
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {message && <div className="comment-meta">{message}</div>}
    </div>
  );
}
