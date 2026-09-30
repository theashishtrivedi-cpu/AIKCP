import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Clock3 } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import AnswerList from '@/components/AnswerList';
import AnswerComposer from '@/components/AnswerComposer';
import { getQuestionByUuid, type RealQuestion } from '@/lib/questionService';

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function RealQuestionDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();

  const [question, setQuestion] = useState<RealQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!questionId) {
        setError('Question ID is missing.');
        return;
      }

      const result = await getQuestionByUuid(questionId);

      if (cancelled) return;

      setQuestion(result.data);
      setError(result.error);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [questionId]);

  if (error || !question) {
    return (
      <main>
        <PageHero
          eyebrow="Questions"
          title="Question not found"
          description={error ?? 'The requested question is not available.'}
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Questions', to: '/questions' },
            { label: 'Not found' },
          ]}
        />
      </main>
    );
  }

  return (
    <main>
      <PageHero
        eyebrow="Question"
        title={question.title}
        description="Community question with authenticated answers."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Questions', to: '/questions' },
          { label: question.title },
        ]}
      />

      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="detail-layout">
          <div className="detail-main">
            <Link
              to="/questions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 20,
              }}
            >
              <ArrowLeft size={15} />
              Back to Questions
            </Link>

            <div className="detail-stats-row">
              <span>
                <MessageCircle size={14} /> Community answers
              </span>
              <span>
                <Clock3 size={14} /> {formatDate(question.created_at)}
              </span>
            </div>

            <div className="detail-description">
              <p>{question.body ?? 'No additional question details provided.'}</p>
            </div>

            <SectionHeading
              eyebrow="Community responses"
              title="Answers"
            />

            <AnswerList
              questionId={question.id}
              refreshKey={refreshKey}
            />

            <div style={{ marginTop: 32 }}>
              <SectionHeading
                eyebrow="Join the discussion"
                title="Write an answer"
              />

              <AnswerComposer
                questionId={question.id}
                onCreated={() => setRefreshKey((value) => value + 1)}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
