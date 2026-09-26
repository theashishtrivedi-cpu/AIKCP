import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MessageCircle, Newspaper, BookOpen, Landmark, CircleHelp } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import QuestionCard from '@/components/QuestionCard';
import NewsCard from '@/components/NewsCard';
import { TopicCardGrid } from '@/components/TopicCard';
import { questions, news, topics, articles } from '@/data/mockData';

type Tab = 'all' | 'questions' | 'articles' | 'current-affairs' | 'sanatan-board' | 'categories';

const tabs: { id: Tab; label: string; icon: typeof Search }[] = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'questions', label: 'Questions', icon: MessageCircle },
  { id: 'articles', label: 'Articles', icon: BookOpen },
  { id: 'current-affairs', label: 'Current Affairs', icon: Newspaper },
  { id: 'sanatan-board', label: 'Sanatan Board', icon: Landmark },
  { id: 'categories', label: 'Categories', icon: CircleHelp },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const q = query.toLowerCase();
  const matchedQuestions = q ? questions.filter((item) => item.question.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)) : questions;
  const matchedNews = q ? news.filter((n) => n.headline.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)) : news;
  const matchedArticles = q ? articles.filter((a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) : articles;
  const matchedTopics = q ? topics.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : topics;

  const showSection = (tab: Tab) => activeTab === 'all' || activeTab === tab;

  return (
    <main>
      <PageHero
        eyebrow="Explore"
        title={query ? `Search: "${query}"` : 'Search'}
        description="Search across questions, answers, articles, current affairs, Sanatan Board and categories."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Search' }]}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="search-page-layout">
          <div className="search-page-main">
            <div className="search-wrap search-wrap-large" style={{ margin: '0 0 24px' }}>
              <Search size={20} />
              <input defaultValue={query} placeholder="Search questions, articles, news or topics..." />
              <button>Search</button>
            </div>
            <div className="search-tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button className={`search-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)} key={tab.id}>
                    <Icon size={14} /> {tab.label}
                  </button>
                );
              })}
            </div>

            {showSection('questions') && (
              <div className="search-result-section">
                <SectionHeading eyebrow="Community" title="Questions" />
                <div className="question-list">
                  {matchedQuestions.length > 0 ? matchedQuestions.map((item) => <QuestionCard question={item} key={item.id} />) : <p className="no-results">No questions found.</p>}
                </div>
              </div>
            )}

            {showSection('articles') && (
              <div className="search-result-section">
                <SectionHeading eyebrow="Long-form" title="Articles" />
                <div className="search-articles-list">
                  {matchedArticles.length > 0 ? matchedArticles.map((a) => (
                    <Link to={`/articles/${a.id}`} className="answer-preview" key={a.id}>
                      <div className="answer-preview-head"><span className="avatar" style={{ backgroundColor: a.authorColor }}>{a.authorInitial}</span><div><strong>{a.title}</strong><span className="answer-author">by {a.author} · {a.readTime}</span></div></div>
                      <p>{a.excerpt}</p>
                    </Link>
                  )) : <p className="no-results">No articles found.</p>}
                </div>
              </div>
            )}

            {showSection('current-affairs') && (
              <div className="search-result-section">
                <SectionHeading eyebrow="News" title="Current Affairs" />
                <div className="news-list">
                  {matchedNews.length > 0 ? matchedNews.map((n) => <NewsCard news={n} key={n.id} />) : <p className="no-results">No news found.</p>}
                </div>
              </div>
            )}

            {showSection('sanatan-board') && (
              <div className="search-result-section">
                <SectionHeading eyebrow="Board" title="Sanatan Board" />
                <div className="search-articles-list">
                  <Link to="/sanatan-board" className="answer-preview">
                    <div className="answer-preview-head"><span className="avatar" style={{ backgroundColor: '#c56d2c' }}>S</span><div><strong>Sanatan Board — Overview</strong><span className="answer-author">Board introduction and navigation</span></div></div>
                    <p>Explore the complete Sanatan Board of India Act, documents, sections and community discussions.</p>
                  </Link>
                </div>
              </div>
            )}

            {showSection('categories') && (
              <div className="search-result-section">
                <SectionHeading eyebrow="Browse" title="Categories" />
                {matchedTopics.length > 0 ? <TopicCardGrid topics={matchedTopics} /> : <p className="no-results">No categories found.</p>}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
