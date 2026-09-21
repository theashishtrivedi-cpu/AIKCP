import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Clock3 } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { news } from '@/data/mockData';
import EmptyState from '@/components/EmptyState';
import { Search } from 'lucide-react';

export default function CurrentAffairsDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const article = news.find((n) => n.id === articleId);

  if (!article) {
    return (
      <main>
        <PageHero eyebrow="Current Affairs" title="Article not found" crumbs={[{ label: 'Home', to: '/' }, { label: 'Current Affairs', to: '/current-affairs' }, { label: 'Not found' }]} />
        <section className="section-shell" style={{ paddingTop: '48px' }}>
          <EmptyState icon={Search} title="Article not found" message="This news article may have been removed or is not yet available." />
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHero
        eyebrow="Current Affairs"
        title={article.headline}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Current Affairs', to: '/current-affairs' }, { label: article.category }]}
        image={article.image}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="article-layout">
          <article className="article-main">
            <div className="article-meta-bar">
              <div className="news-meta"><span>{article.source}</span><span>·</span><span>{article.category}</span><span>·</span><span>{article.time}</span></div>
            </div>
            <div className="article-content">
              <p>{article.summary}</p>
              <p>This development represents a significant step in the ongoing efforts to preserve and promote India's rich cultural heritage. The initiative brings together government agencies, local communities, and experts in the field to ensure a comprehensive approach.</p>
              <p>According to officials familiar with the matter, the project will unfold in multiple phases, beginning with a detailed assessment and followed by implementation. Community participation has been identified as a key factor for long-term success.</p>
              <p>The broader implications of this initiative extend beyond the immediate scope. It sets a precedent for how heritage preservation can be integrated with modern development goals, creating a model that other regions may follow.</p>
            </div>
            <div className="article-actions">
              <button className="article-action-btn"><Clock3 size={16} /> {article.time}</button>
              <Link to="/current-affairs" className="article-action-btn">Back to news <ArrowRight size={16} /></Link>
            </div>
            <div className="news-related-discussion">
              <div className="eyebrow"><span />Related Discussion</div>
              <Link to="/questions" className="related-discussion-link">Join the community discussion on this topic <ArrowRight size={14} /></Link>
            </div>
          </article>
          <aside className="article-rail">
            <div className="rail-section">
              <div className="eyebrow"><span />More News</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 500, margin: '7px 0 0' }}>Latest Stories</h2>
              <div className="news-list" style={{ marginTop: '16px' }}>
                {news.filter((n) => n.id !== article.id).slice(0, 3).map((n) => (
                  <Link to={`/current-affairs/${n.id}`} className="news-item" key={n.id}>
                    <img src={n.image} alt="" />
                    <div><h3>{n.headline}</h3><div className="news-meta"><span>{n.source}</span><span>·</span><span>{n.time}</span></div></div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
