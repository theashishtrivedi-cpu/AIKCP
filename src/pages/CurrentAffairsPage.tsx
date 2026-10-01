import { useEffect, useMemo, useState } from 'react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import NewsCard from '@/components/NewsCard';
import TrendingTopics from '@/components/TrendingTopics';
import SanatanBoardPanel from '@/components/SanatanBoardPanel';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import { Newspaper } from 'lucide-react';
import { listCurrentAffairs, type CurrentAffair } from '@/lib/currentAffairsService';
import { trending } from '@/data/mockData';

type NewsCardItem = {
  id: string;
  headline: string;
  source: string;
  time: string;
  summary: string;
  image: string;
  category: string;
};

function formatPublishedTime(publishedAt: string | null): string {
  if (!publishedAt) {
    return 'Date unavailable';
  }

  return new Date(publishedAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function toNewsCardItem(item: CurrentAffair): NewsCardItem {
  return {
    id: item.id,
    headline: item.title,
    source: item.source_title || 'Unknown source',
    time: formatPublishedTime(item.published_at),
    summary: item.summary || item.original_content || '',
    image: item.image_url || '',
    category: item.category_id || 'Uncategorized',
  };
}

export default function CurrentAffairsPage() {
  const categories = ['All', 'Heritage', 'Policy', 'Culture', 'Science', 'World'];

  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentAffairs() {
      setLoading(true);
      setError(null);

      const result = await listCurrentAffairs();

      if (cancelled) {
        return;
      }

      if (result.error) {
        setError(result.error);
        setCurrentAffairs([]);
      } else {
        setCurrentAffairs(result.data);
      }

      setLoading(false);
    }

    void loadCurrentAffairs();

    return () => {
      cancelled = true;
    };
  }, []);

  const newsItems = useMemo(
    () => currentAffairs.map(toNewsCardItem),
    [currentAffairs]
  );

  const featuredNews = newsItems.filter(
    (_, index) => index < 2
  );

  return (
    <main>
      <PageHero
        eyebrow="Current Affairs"
        title="Current Affairs & News"
        description="Stay informed with curated news and current affairs relevant to our knowledge community."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Current Affairs' }]}
      />

      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="current-affairs-layout">
          <div className="ca-main">
            <SearchBar placeholder="Search news and current affairs..." />

            <div className="news-category-tabs">
              {categories.map((cat, i) => (
                <button
                  className={`news-tab ${i === 0 ? 'active' : ''}`}
                  key={cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading && (
              <div className="empty-state">
                <h3>Loading current affairs...</h3>
              </div>
            )}

            {!loading && error && (
              <EmptyState
                icon={Newspaper}
                title="Current affairs unavailable"
                message={error}
              />
            )}

            {!loading && !error && newsItems.length === 0 && (
              <EmptyState
                icon={Newspaper}
                title="No current affairs available"
                message="Published current-affairs content will appear here once it is available."
              />
            )}

            {!loading && !error && newsItems.length > 0 && (
              <>
                {featuredNews.length > 0 && (
                  <>
                    <SectionHeading
                      eyebrow="Top stories"
                      title="Featured News"
                    />
                    <div className="news-featured-grid">
                      {featuredNews.map((item) => (
                        <NewsCard
                          news={item}
                          variant="featured"
                          key={item.id}
                        />
                      ))}
                    </div>
                  </>
                )}

                <SectionHeading
                  eyebrow="Latest updates"
                  title="Latest News"
                  action="View all"
                  actionTo="/current-affairs"
                />

                <div className="news-list">
                  {newsItems.map((item) => (
                    <NewsCard news={item} key={item.id} />
                  ))}
                </div>
              </>
            )}

            <SectionHeading
              eyebrow="Community connection"
              title="Related Discussions"
              action="View all"
              actionTo="/questions"
            />

            <div className="related-discussion-strip">
              <div className="related-discussion-item">
                <Newspaper size={16} />
                <div>
                  <strong>
                    Temple restoration and community participation
                  </strong>
                  <span>3 discussions · 142 answers</span>
                </div>
              </div>

              <div className="related-discussion-item">
                <Newspaper size={16} />
                <div>
                  <strong>
                    Traditional knowledge in modern education
                  </strong>
                  <span>2 discussions · 87 answers</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="ca-rail">
            <TrendingTopics topics={trending} />
            <SanatanBoardPanel />
          </aside>
        </div>
      </section>
    </main>
  );
}
