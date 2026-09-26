import { useParams, Link } from 'react-router-dom';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import QuestionCard from '@/components/QuestionCard';
import DiscussionCard from '@/components/DiscussionCard';
import AssistantPanel from '@/components/AssistantPanel';
import EmptyState from '@/components/EmptyState';
import { Search } from 'lucide-react';
import { getTopicById, getQuestionsByCategory, getDiscussionsByCategory } from '@/data/mockData';

export default function SubcategoryPage() {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const topic = getTopicById(categoryId || '');
  const subcategory = topic?.subcategories.find((s) => s.id === subcategoryId);

  if (!topic || !subcategory) {
    return (
      <main>
        <PageHero eyebrow="Subcategory" title="Subcategory not found" crumbs={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/search' }]} />
        <section className="section-shell" style={{ paddingTop: '48px' }}>
          <EmptyState icon={Search} title="Subcategory not found" message="This subcategory may not exist or has been moved." />
        </section>
      </main>
    );
  }

  const categoryQuestions = getQuestionsByCategory(topic.id);
  const categoryDiscussions = getDiscussionsByCategory(topic.id);

  return (
    <main>
      <PageHero
        eyebrow={`${topic.name} · Subcategory`}
        title={subcategory.name}
        description={`${subcategory.count} within ${topic.name}`}
        crumbs={[{ label: 'Home', to: '/' }, { label: topic.name, to: `/categories/${topic.id}` }, { label: subcategory.name }]}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="category-layout">
          <div className="category-main">
            <div className="subcategory-sibling-strip">
              <Link to={`/categories/${topic.id}`} className="subcategory-chip active">
                <strong>All in {topic.name}</strong>
              </Link>
              {topic.subcategories.map((sub) => (
                <Link to={`/categories/${topic.id}/${sub.id}`} className={`subcategory-chip ${sub.id === subcategoryId ? 'active' : ''}`} key={sub.id}>
                  <strong>{sub.name}</strong>
                  <span>{sub.count}</span>
                </Link>
              ))}
            </div>

            <SectionHeading eyebrow="Featured" title="Featured Discussions" />
            <div className="discussion-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {categoryDiscussions.length > 0 ? categoryDiscussions.map((d) => <DiscussionCard discussion={d} key={d.id} />) : (
                <EmptyState icon={Search} title="No featured discussions" message="No featured discussions in this subcategory yet." />
              )}
            </div>

            <SectionHeading eyebrow="Browse" title="Questions" action="View all" actionTo="/questions" />
            <div className="question-list">
              {categoryQuestions.length > 0 ? categoryQuestions.map((q) => <QuestionCard question={q} key={q.id} />) : (
                <EmptyState icon={Search} title="No questions yet" message="Be the first to ask a question in this subcategory." />
              )}
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
