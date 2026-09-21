import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/data/mockData';

export default function NewsCard({ news, variant = 'compact' }: { news: NewsItem; variant?: 'compact' | 'featured' }) {
  if (variant === 'featured') {
    return (
      <Link to={`/current-affairs/${news.id}`} className="news-featured-card">
        <div className="news-featured-image">
          <img src={news.image} alt="" />
          <span className="news-featured-badge">{news.category}</span>
        </div>
        <div className="news-featured-body">
          <h3>{news.headline}</h3>
          <div className="news-meta"><span>{news.source}</span><span>·</span><span>{news.time}</span></div>
          <p>{news.summary}</p>
          <span className="news-read-more">Read more <ArrowRight size={13} /></span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/current-affairs/${news.id}`} className="news-item">
      <img src={news.image} alt="" />
      <div>
        <h3>{news.headline}</h3>
        <div className="news-meta"><span>{news.source}</span><span>·</span><span>{news.time}</span></div>
        <p>{news.summary}</p>
        <span className="news-read-more">Read more <ArrowRight size={13} /></span>
      </div>
    </Link>
  );
}

export function NewsList({ news }: { news: NewsItem[] }) {
  return (
    <div className="news-list">
      {news.map((n) => <NewsCard news={n} key={n.id} />)}
    </div>
  );
}
