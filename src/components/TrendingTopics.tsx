import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { TrendingTopic } from '@/data/mockData';

export default function TrendingTopics({ topics }: { topics: TrendingTopic[] }) {
  return (
    <div className="trending-panel">
      <div className="section-heading">
        <div>
          <div className="eyebrow"><span />What the community follows</div>
          <h2>Trending Topics</h2>
        </div>
        <Link to="/search" className="section-heading-action">View all <ChevronRight size={14} /></Link>
      </div>
      {topics.map(([topic, count], index) => (
        <Link to="/search" className="trending-row" key={topic}>
          <span className="rank">{index + 1}</span>
          <div><strong>{topic}</strong><span>{count}</span></div>
          <ChevronRight size={16} />
        </Link>
      ))}
    </div>
  );
}
