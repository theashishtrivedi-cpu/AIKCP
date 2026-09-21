import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import NewsCard from '@/components/NewsCard';
import TrendingTopics from '@/components/TrendingTopics';
import SanatanBoardPanel from '@/components/SanatanBoardPanel';
import SearchBar from '@/components/SearchBar';
import { featuredNews, news, trending } from '@/data/mockData';
import { Newspaper } from 'lucide-react';

export default function CurrentAffairsPage() {
  const categories = ['All', 'Heritage', 'Policy', 'Culture', 'Science', 'World'];

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
                <button className={`news-tab ${i === 0 ? 'active' : ''}`} key={cat}>{cat}</button>
              ))}
            </div>

            <SectionHeading eyebrow="Top stories" title="Featured News" />
            <div className="news-featured-grid">
              {featuredNews.map((n) => <NewsCard news={n} variant="featured" key={n.id} />)}
            </div>

            <SectionHeading eyebrow="Latest updates" title="Latest News" action="View all" actionTo="/current-affairs" />
            <div className="news-list">
              {news.map((n) => <NewsCard news={n} key={n.id} />)}
            </div>

            <SectionHeading eyebrow="Community connection" title="Related Discussions" action="View all" actionTo="/questions" />
            <div className="related-discussion-strip">
              <div className="related-discussion-item">
                <Newspaper size={16} />
                <div><strong>Temple restoration and community participation</strong><span>3 discussions · 142 answers</span></div>
              </div>
              <div className="related-discussion-item">
                <Newspaper size={16} />
                <div><strong>Traditional knowledge in modern education</strong><span>2 discussions · 87 answers</span></div>
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
