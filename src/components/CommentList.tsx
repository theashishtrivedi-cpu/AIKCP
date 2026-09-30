import { useCallback, useEffect, useState } from 'react';
import { listComments, type CommentRecord } from '@/lib/commentService';

type CommentListProps = {
  contentId: string;
  refreshKey?: number;
};

export default function CommentList({
  contentId,
  refreshKey = 0,
}: CommentListProps) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await listComments(contentId);
      setComments(result);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setComments([]);
      setError('Unable to load comments.');
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments, refreshKey]);

  if (loading) {
    return (
      <div className="comment-preview">
        Loading comments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="comment-preview">
        <p>{error}</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="comment-preview">
        <p>No comments yet. Be the first to comment.</p>
      </div>
    );
  }

  const roots = comments.filter((comment) => !comment.parent_id);

  return (
    <div className="comment-list">
      {roots.map((comment) => (
        <div key={comment.id}>
          <CommentItem comment={comment} />

          {comments
            .filter((reply) => reply.parent_id === comment.id)
            .map((reply) => (
              <div className="comment-item reply" key={reply.id}>
                <CommentItem comment={reply} />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

function CommentItem({ comment }: { comment: CommentRecord }) {
  return (
    <div className="comment-item">
      <span className="avatar">
        {comment.author_id?.slice(0, 1).toUpperCase() ?? '?'}
      </span>

      <div className="comment-body">
        <div className="comment-meta">
          <strong>
            {comment.author_id
              ? `User ${comment.author_id.slice(0, 8)}`
              : 'Community member'}
          </strong>
          {' · '}
          {new Date(comment.created_at).toLocaleString()}
        </div>

        <p>{comment.body}</p>
      </div>
    </div>
  );
}
