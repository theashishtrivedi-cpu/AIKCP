
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Clock3, Search } from 'lucide-react';
import PageHero from '@/components/PageHero';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/context/AuthContext';
import {
  getCurrentAffairById,
  type CurrentAffair,
} from '@/lib/currentAffairsService';
import {
  isCurrentAffairBookmarked,
  saveCurrentAffairBookmark,
  removeCurrentAffairBookmark,
} from '@/lib/bookmarkService';

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
  const { user, loading: authLoading } = useAuth();

  const [article, setArticle] = useState<CurrentAffair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [bookmarkMessage, setBookmarkMessage] = useState<string | null>(null);

  // Load the published article.
  useEffect(() => {
    let cancelled = false;

    async function loadArticle() {
      if (!articleId) {
        setArticle(null);
        setError('No article ID was provided.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
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
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error('Unexpected error loading current affair:', loadError);
        setError('Unable to load this article. Please try again.');
        setArticle(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadArticle();

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  // Load the bookmark state for the current user.
  useEffect(() => {
    let cancelled = false;

    async function loadBookmark() {
      setBookmarkError(null);
      setBookmarkMessage(null);

      if (authLoading) {
        return;
      }

      if (!user || !articleId) {
        setIsBookmarked(false);
        setBookmarkLoading(false);
        return;
      }

      setBookmarkLoading(true);

      try {
        const result = await isCurrentAffairBookmarked(articleId);

        if (cancelled) {
          return;
        }

        setIsBookmarked(result.data);
        setBookmarkError(result.error);
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error('Unexpected error checking bookmark:', loadError);
        setBookmarkError('Unable to check saved status. Please try again.');
      } finally {
        if (!cancelled) {
          setBookmarkLoading(false);
        }
      }
    }

    void loadBookmark();

    return () => {
      cancelled = true;
    };
  }, [articleId, user, authLoading]);

  async function handleBookmarkToggle() {
    if (!user) {
      setBookmarkError('Please sign in to save this article.');
      setBookmarkMessage(null);
      return;
    }

    if (!articleId || bookmarkBusy || bookmarkLoading) {
      return;
    }

    const nextBookmarked = !isBookmarked;

    setBookmarkBusy(true);
    setBookmarkError(null);
    setBookmarkMessage(null);

    try {
      const result = nextBookmarked
        ? await saveCurrentAffairBookmark(articleId)
        : await removeCurrentAffairBookmark(articleId);

      if (result.error) {
        setBookmarkError(result.error);
        return;
      }

      setIsBookmarked(nextBookmarked);
      setBookmarkMessage(
        nextBookmarked ? 'Article saved.' : 'Bookmark removed.'
      );
    } catch (toggleError) {
      console.error('Unexpected error updating bookmark:', toggleError);
      setBookmarkError('Unable to update the bookmark. Please try again.');
    } finally {
      setBookmarkBusy(false);
    }
  }

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
              <button
                type="button"
                className="article-action-btn"
                onClick={() => void handleBookmarkToggle()}
                disabled={
                  authLoading || bookmarkLoading || bookmarkBusy
                }
                aria-label={
                  isBookmarked ? 'Remove bookmark' : 'Save article'
                }
              >
                <Bookmark size={16} />
                {authLoading || bookmarkLoading
                  ? 'Checking saved status...'
                  : bookmarkBusy
                    ? 'Saving...'
                    : isBookmarked
                      ? 'Remove bookmark'
                      : 'Save article'}
              </button>

              <button type="button" className="article-action-btn">
                <Clock3 size={16} /> {publishedLabel}
              </button>

              <Link
                to="/current-affairs"
                className="article-action-btn"
              >
                Back to news <ArrowRight size={16} />
              </Link>
            </div>

            {bookmarkError && (
              <p role="alert">
                {bookmarkError}
                {!user && (
                  <>
                    {' '}
                    <Link to="/login">Sign in</Link>
                  </>
                )}
              </p>
            )}

            {bookmarkMessage && (
              <p role="status">{bookmarkMessage}</p>
            )}

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
