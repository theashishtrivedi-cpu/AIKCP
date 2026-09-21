import { useParams } from 'react-router-dom';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import { TopicCardGrid } from '@/components/TopicCard';
import QuestionCard from '@/components/QuestionCard';
import DiscussionCard from '@/components/DiscussionCard';
import NewsCard from '@/components/NewsCard';
import AssistantPanel from '@/components/AssistantPanel';
import EmptyState from '@/components/EmptyState';
import { Search } from 'lucide-react';
import { getTopicById, getQuestionsByCategory, getDiscussionsByCategory, news, topics } from '@/data/mockData';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const topic = getTopicById(categoryId || '');

  if (!topic) {
    return (
      <main>
        <PageHero eyebrow="Categories" title="Category not found" crumbs={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
        <section className="section-shell" style={{ paddingTop: '48px' }}>
          <EmptyState icon={Search} title="Category not found" message="This category may not exist or has been moved." />
          <div style={{ marginTop: '40px' }}>
            <SectionHeading eyebrow="Browse all" title="All Categories" />
            <TopicCardGrid topics={topics} />
          </div>
        </section>
      </main>
    );
  }

  const Icon = topic.icon;
  const categoryQuestions = getQuestionsByCategory(topic.id);
  const categoryDiscussions = getDiscussionsByCategory(topic.id);
  const relatedNews = news.slice(0, 2);

  return (
    <main>
      <PageHero
        eyebrow="Category"
        title={topic.name}
        description={topic.description}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/search' }, { label: topic.name }]}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="category-layout">
          <div className="category-main">
            <div className="category-header-card">
              <span className={`topic-icon ${topic.tone}`} style={{ width: 56, height: 56 }}><Icon size={28} strokeWidth={1.7} /></span>
              <div>
                <h2>{topic.name}</h2>
                <p>{topic.description}</p>
                <span className="topic-count">{topic.count}</span>
              </div>
            </div>

            <div className="subcategory-strip">
              {topic.subcategories.map((sub) => (
                <a href={`/categories/${topic.id}/${sub.id}`} key={sub.id} className="subcategory-chip">
                  <strong>{sub.name}</strong>
                  <span>{sub.count}</span>
                </a>
              ))}
            </div>

            <SectionHeading eyebrow="Most active" title="Popular Questions" action="View all" actionTo="/questions" />
            <div className="question-list">
              {categoryDiscussions.length > 0 ? categoryDiscussions.map((d) => (
                <DiscussionCard discussion={d} key={d.id} />
              )) : categoryQuestions.slice(0, 3).map((q) => <QuestionCard question={q} key={q.id} />)}
            </div>

            <SectionHeading eyebrow="New voices" title="Latest Questions" action="View all" actionTo="/questions" />
            <div className="question-list">
              {categoryQuestions.length > 0 ? categoryQuestions.map((q) => <QuestionCard question={q} key={q.id} />) : (
                <EmptyState icon={Search} title="No questions yet" message="Be the first to ask a question in this category." />
              )}
            </div>

            <SectionHeading eyebrow="In the news" title="Related Current Affairs" action="View all" actionTo="/current-affairs" />
            <div className="news-list">
              {relatedNews.map((n) => <NewsCard news={n} key={n.id} />)}
            </div>
          </div>
          <aside className="category-rail">
            <AssistantPanel />
          </aside>
        </div>
      </section>
    </main>
  );
}
