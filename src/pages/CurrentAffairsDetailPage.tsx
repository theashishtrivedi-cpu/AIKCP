import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Clock3, Search } from 'lucide-react';
import PageHero from '@/components/PageHero';
import EmptyState from '@/components/EmptyState';
import { getCurrentAffairById, type CurrentAffair } from '@/lib/currentAffairsService';

function formatPublishedTime(publishedAt: string | null): string {
  if (!publishedAt) {
    return 'Date unavailable';
  }

  return new Date(publishedAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function CurrentAffairsDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();

  const [article, setArticle] = useState<CurrentAffair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadArticle() {
      if (!articleId) {
        setArticle(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await getCurrentAffairById(articleId);

      if (cancelled) {
        return;
      }

      if (result.error) {
        setError(result.error);
        setArticle(null);
      } else {
        setArticle(result.data);
      }

      setLoading(false);
    }

    void loadArticle();

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  if (loading) {
    return (
      <main>
        <PageHero
          eyebrow="Current Affairs"
          title="Loading article..."
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Current Affairs', to: '/current-affairs' },
          ]}
        />
        <section className="section-shell" style={{ paddingTop: '48px' }}>
          <EmptyState
            icon={Search}
            title="Loading article"
            message="Please wait while the current-affairs article is loaded."
          />
        </section>
      </main>
    );
  }

  if (!article) {
    return (
      <main>
        <PageHero
          eyebrow="Current Affairs"
          title="Article not found"
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Current Affairs', to: '/current-affairs' },
            { label: 'Not found' },
          ]}
        />
        <section className="section-shell" style={{ paddingTop: '48px' }}>
          <EmptyState
            icon={Search}
            title="Article not found"
            message={
              error ||
              'This news article may have been removed or is not yet available.'
            }
          />
        </section>
      </main>
    );
  }

  const content =
    article.original_content?.trim() ||
    article.summary?.trim() ||
    'No article content is currently available.';

  const sourceLabel = article.source_title || 'Unknown source';
  const categoryLabel = article.category_id || 'Uncategorized';
  const publishedLabel = formatPublishedTime(article.published_at);

  return (
    <main>
      <PageHero
        eyebrow="Current Affairs"
        title={article.title}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Current Affairs', to: '/current-affairs' },
          { label: categoryLabel },
        ]}
        image={article.image_url || undefined}
      />

      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="article-layout">
          <article className="article-main">
            <div className="article-meta-bar">
              <div className="news-meta">
                <span>{sourceLabel}</span>
                <span>·</span>
                <span>{categoryLabel}</span>
                <span>·</span>
                <span>{publishedLabel}</span>
              </div>
            </div>

            <div className="article-content">
              {content.split(/\n+/).map((paragraph, index) => (
                <p key={`${article.id}-${index}`}>{paragraph}</p>
              ))}
            </div>

            {article.source_url && (
              <div className="article-actions">
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="article-action-btn"
                >
                  View source <ArrowRight size={16} />
                </a>
              </div>
            )}

            <div className="article-actions">
              <button className="article-action-btn">
                <Clock3 size={16} /> {publishedLabel}
              </button>

              <Link
                to="/current-affairs"
                className="article-action-btn"
              >
                Back to news <ArrowRight size={16} />
              </Link>
            </div>

            <div className="news-related-discussion">
              <div className="eyebrow">
                <span />
                Related Discussion
              </div>

              <Link
                to="/questions"
                className="related-discussion-link"
              >
                Join the community discussion on this topic{' '}
                <ArrowRight size={14} />
              </Link>
            </div>
          </article>

          <aside className="article-rail">
            <div className="rail-section">
              <div className="eyebrow">
                <span />
                Source
              </div>

              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '20px',
                  fontWeight: 500,
                  margin: '7px 0 0',
                }}
              >
                {sourceLabel}
              </h2>

              {article.source_url && (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="related-discussion-link"
                  style={{ marginTop: '16px' }}
                >
                  Open original source <ArrowRight size={14} />
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
