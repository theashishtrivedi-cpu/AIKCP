import { useState } from 'react';
import { Flame, Clock3, MessageCircle, TrendingUp } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import QuestionCard from '@/components/QuestionCard';
import { TopicCardGrid } from '@/components/TopicCard';
import TrendingTopics from '@/components/TrendingTopics';
import AssistantPanel from '@/components/AssistantPanel';
import { questions, discussions, topics, trending } from '@/data/mockData';

type Filter = 'latest' | 'trending' | 'discussed';

const filters: { id: Filter; label: string; icon: typeof Flame }[] = [
  { id: 'latest', label: 'Latest', icon: Clock3 },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'discussed', label: 'Most Discussed', icon: MessageCircle },
];

export default function QuestionsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('latest');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const allQuestions = [...discussions.map(d => ({ id: d.id, question: d.title, answers: d.answers, comments: d.comments, category: d.category, categoryId: d.categoryId, subcategory: d.subcategory, subcategoryId: d.subcategoryId, time: '3 days ago', avatarColor: d.participants[0], avatarInitial: 'A', author: 'Admin' })), ...questions];

  const filtered = allQuestions
    .filter((q) => activeCategory === 'all' || q.categoryId === activeCategory)
    .sort((a, b) => {
      if (activeFilter === 'trending') return b.answers - a.answers;
      if (activeFilter === 'discussed') return b.comments - a.comments;
      return 0;
    });

  return (
    <main>
      <PageHero
        eyebrow="Questions & Topics"
        title="Questions"
        description="Explore questions posed by the community. Browse by category, filter by activity, and join the conversation."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Questions' }]}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="questions-layout">
          <div className="questions-main">
            <div className="filter-bar">
              <div className="filter-group">
                {filters.map((f) => {
                  const Icon = f.icon;
                  return (
                    <button key={f.id} className={`filter-chip ${activeFilter === f.id ? 'active' : ''}`} onClick={() => setActiveFilter(f.id)}>
                      <Icon size={13} /> {f.label}
                    </button>
                  );
                })}
              </div>
              <select className="filter-select" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
                <option value="all">All Categories</option>
                {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="question-list">
              {filtered.map((q) => <QuestionCard question={q} key={q.id} />)}
            </div>
          </div>
          <aside className="questions-rail">
            <AssistantPanel />
            <TrendingTopics topics={trending} />
          </aside>
        </div>
      </section>
      <section className="section-shell" style={{ paddingTop: '60px' }}>
        <SectionHeading eyebrow="Browse by topic" title="All Categories" />
        <p className="section-intro">Select a category to explore its questions, subcategories and discussions.</p>
        <TopicCardGrid topics={topics} />
      </section>
    </main>
  );
}
