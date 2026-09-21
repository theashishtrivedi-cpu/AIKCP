import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import type { Topic } from '@/data/mockData';

export default function TopicCard({ topic }: { topic: Topic }) {
  const Icon = topic.icon;
  return (
    <Link to={`/categories/${topic.id}`} className="topic-tile" key={topic.name}>
      <span className={`topic-icon ${topic.tone}`}><Icon size={25} strokeWidth={1.7} /></span>
      <strong>{topic.name}</strong>
      <span className="topic-description">{topic.description}</span>
      <span className="topic-count">{topic.count}</span>
      <span className="topic-browse">Browse <ChevronRight size={12} /></span>
    </Link>
  );
}

export function TopicCardGrid({ topics }: { topics: Topic[] }) {
  return (
    <div className="topic-grid">
      {topics.map((topic) => <TopicCard topic={topic} key={topic.id} />)}
    </div>
  );
}
