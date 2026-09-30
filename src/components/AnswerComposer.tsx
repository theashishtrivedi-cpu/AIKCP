import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { canPerformAnswerAction } from '@/lib/answerAuthorization';
import { createAnswer } from '@/lib/answerService';

type AnswerComposerProps = {
  questionId: string;
  languageCode?: string;
  onCreated?: () => void;
};

export default function AnswerComposer({
  questionId,
  languageCode = 'en',
  onCreated,
}: AnswerComposerProps) {
  const { user, loading: authLoading } = useAuth();
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setMessage(null);

    if (!user) {
      setMessage('Please sign in before posting an answer.');
      return;
    }

    if (!body.trim()) {
      setMessage('Please enter an answer.');
      return;
    }

    setSubmitting(true);

    try {
      const allowed = await canPerformAnswerAction('create');

      if (!allowed) {
        setMessage('You are not currently allowed to post an answer.');
        return;
      }

      const result = await createAnswer(questionId, body, languageCode);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setBody('');
      setMessage('Answer posted successfully.');
      onCreated?.();
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="answer-preview">Checking sign-in status...</div>;
  }

  if (!user) {
    return (
      <div className="answer-preview">
        <p>Please sign in to write an answer.</p>
      </div>
    );
  }

  return (
    <div className="comment-section">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Write your answer..."
        rows={5}
        disabled={submitting}
        style={{
          width: '100%',
          resize: 'vertical',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #d8d2c8',
          font: 'inherit',
          boxSizing: 'border-box',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          gap: '12px',
        }}
      >
        <span>{message ?? ''}</span>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !body.trim()}
        >
          {submitting ? 'Posting...' : 'Post answer'}
        </button>
      </div>
    </div>
  );
}
