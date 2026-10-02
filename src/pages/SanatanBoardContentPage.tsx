import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Search } from 'lucide-react';
import PageHero from '@/components/PageHero';
import EmptyState from '@/components/EmptyState';
import {
  getBoardContentById,
  type BoardContent,
} from '@/lib/boardService';
import { heroImage } from '@/data/mockData';

export default function SanatanBoardContentPage() {
  const { contentId } = useParams<{ contentId: string }>();

  const [content, setContent] = useState<BoardContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      if (!contentId) {
        setError('Board content ID is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await getBoardContentById(contentId);

      if (cancelled) return;

      if (result.error) {
        setError(result.error);
        setContent(null);
      } else {
        setContent(result.data);
      }

      setLoading(false);
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, [contentId]);

  if (loading) {
    return (
      <main>
        <PageHero
          eyebrow="Sanatan Board"
          title="Loading content..."
          description="Loading published Board content."
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Sanatan Board', to: '/sanatan-board' },
          ]}
          image={heroImage}
        />

        <section className="section-shell">
          <p className="section-intro">Loading Board content...</p>
        </section>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main>
        <PageHero
          eyebrow="Sanatan Board"
          title="Content unavailable"
          description="The requested published Board content could not be loaded."
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Sanatan Board', to: '/sanatan-board' },
          ]}
          image={heroImage}
        />

        <section className="section-shell">
          <EmptyState
            icon={Search}
            title="Board content unavailable"
            message={
              error ||
              'The requested Board content does not exist or is not currently published.'
            }
          />

          <div style={{ marginTop: '24px' }}>
            <Link to="/sanatan-board" className="outline-button">
              <ArrowLeft size={15} />
              Back to Sanatan Board
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHero
        eyebrow="Sanatan Board"
        title={content.title}
        description={`Published Board content in ${content.language_code}.`}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Sanatan Board', to: '/sanatan-board' },
        ]}
        image={heroImage}
      />

      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="article-layout">
          <article className="article-main">
            <div className="eyebrow">
              {content.language_code}
            </div>

            <h1>{content.title}</h1>

            <div
              className="article-body"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {content.body}
            </div>

            {content.source_url && (
              <div style={{ marginTop: '32px' }}>
                <a
                  href={content.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="outline-button"
                >
                  View source
                  <ExternalLink size={15} />
                </a>
              </div>
            )}

            <div style={{ marginTop: '32px' }}>
              <Link
                to="/sanatan-board"
                className="outline-button"
              >
                <ArrowLeft size={15} />
                Back to Sanatan Board
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
