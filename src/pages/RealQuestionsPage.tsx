import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import QuestionComposer from '@/components/QuestionComposer';
import { canPerformQuestionAction } from '@/lib/questionAuthorization';
import {
  listQuestions,
  type RealQuestion,
} from '@/lib/questionService';
import { useAuth } from '@/context/AuthContext';

export default function RealQuestionsPage() {
  const { user, loading: authLoading } = useAuth();

  const [questions, setQuestions] = useState<RealQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) {
        setQuestions([]);
        setCanCreate(false);
        setLoading(false);
        return;
      }

      const [questionResult, permission] = await Promise.all([
        listQuestions(),
        canPerformQuestionAction('create'),
      ]);

      if (cancelled) return;

      setQuestions(questionResult.data);
      setError(questionResult.error);
      setCanCreate(permission);
      setLoading(false);
    }

    if (!authLoading) {
      void load();
    }

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <main>
        <PageHero
          eyebrow="Questions"
          title="Questions"
          description="Checking your session..."
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Questions' },
          ]}
        />
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <PageHero
          eyebrow="Questions"
          title="Sign in to view community questions"
          description="Question visibility is protected by the current authenticated-access policy."
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Questions' },
          ]}
        />
      </main>
    );
  }

  return (
    <main>
      <PageHero
        eyebrow="Questions"
        title="Community Questions"
        description="Questions stored in the AI-KCP knowledge and community platform."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Questions' },
        ]}
      />

      <section
        className="section-shell"
        style={{ paddingTop: '48px' }}
      >
        {canCreate && (
          <>
            <SectionHeading
              eyebrow="Authoring"
              title="Ask a Question"
            />
            <QuestionComposer />
          </>
        )}

        <SectionHeading
          eyebrow="Community"
          title="Questions"
        />

        {loading && (
          <div className="detail-description">
            <p>Loading questions...</p>
          </div>
        )}

        {error && (
          <div className="detail-description">
            <p role="alert">{error}</p>
          </div>
        )}

        {!loading && !error && questions.length === 0 && (
          <div className="detail-description">
            <p>No questions are currently available to this account.</p>
          </div>
        )}

        <div className="question-list">
          {questions.map((question) => (
            <Link
              key={question.id}
              to={`/real-questions/${question.id}`}
              className="question-row"
            >
              <div>
                <strong>{question.title}</strong>
                <p>
                  {question.body ||
                    'No additional question details provided.'}
                </p>
              </div>

              <span>
                {new Date(question.created_at).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
