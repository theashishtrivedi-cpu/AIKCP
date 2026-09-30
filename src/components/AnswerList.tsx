import { useCallback, useEffect, useState } from 'react';
import { listAnswers, type Answer } from '@/lib/answerService';

type AnswerListProps = {
  questionId: string;
  refreshKey?: number;
};

export default function AnswerList({
  questionId,
  refreshKey = 0,
}: AnswerListProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnswers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await listAnswers(questionId);

    setAnswers(result.data);
    setError(result.error);
    setLoading(false);
  }, [questionId]);

  useEffect(() => {
    void loadAnswers();
  }, [loadAnswers, refreshKey]);

  if (loading) {
    return <div className="answer-preview">Loading answers...</div>;
  }

  if (error) {
    return (
      <div className="answer-preview">
        <p>Unable to load answers.</p>
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className="answer-preview">
        <p>No answers yet. Be the first to answer this question.</p>
      </div>
    );
  }

  return (
    <div className="answer-list">
      {answers.map((answer) => (
        <article className="answer-preview" key={answer.id}>
          <div className="answer-preview-head">
            <span className="avatar">
              {answer.author_id?.slice(0, 1).toUpperCase() ?? '?'}
            </span>

            <div>
              <strong>
                {answer.is_accepted ? 'Accepted answer' : 'Community answer'}
              </strong>
              <span className="answer-author">
                {new Date(answer.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          <p>{answer.body}</p>
        </article>
      ))}
    </div>
  );
}
