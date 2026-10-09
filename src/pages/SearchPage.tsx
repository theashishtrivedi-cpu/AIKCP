import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MessageCircle, Newspaper, BookOpen, Landmark, CircleHelp } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

import NewsCard from '@/components/NewsCard';
import { TopicCardGrid } from '@/components/TopicCard';
import { questions, news, topics, articles } from '@/data/mockData';
import { searchPublishedQuestions, type PublicQuestionSearchResult } from '@/lib/questionService';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [searchInput, setSearchInput] = useState(query);
  const [matchedQuestions, setMatchedQuestions] = useState<PublicQuestionSearchResult[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      if (!query.trim()) {
        setMatchedQuestions([]);
        setQuestionsError(null);
        setQuestionsLoading(false);
        return;
      }

      setQuestionsLoading(true);
      setQuestionsError(null);

      try {
        const result = await searchPublishedQuestions(query);

        if (cancelled) return;

        setMatchedQuestions(result.data);
        setQuestionsError(result.error);
      } catch {
        if (cancelled) return;

        setMatchedQuestions([]);
        setQuestionsError('Could not load question results. Please try again.');
      } finally {
        if (!cancelled) setQuestionsLoading(false);
      }
    }

    void loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [query]);

  const q = query.toLowerCase();
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
            <form
              className="search-wrap search-wrap-large"
              style={{ margin: '0 0 24px' }}
              onSubmit={(event) => {
                event.preventDefault();
                const nextQuery = searchInput.trim();
                if (nextQuery) {
                  setSearchParams({ q: nextQuery });
                } else {
                  setSearchParams({});
                }
              }}
            >
              <Search size={20} />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search questions, articles, news or topics..."
                aria-label="Search content"
              />
              <button type="submit">Search</button>
            </form>
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
                  {!query.trim() ? (
                    <p className="no-results">Enter a search term to find published questions.</p>
                  ) : questionsLoading ? (
                    <p className="no-results">Searching published questions...</p>
                  ) : questionsError ? (
                    <p className="no-results">Could not load question results. Please try again.</p>
                  ) : matchedQuestions.length > 0 ? (
                    matchedQuestions.map((item) => (
                      <Link to={`/questions/${item.id}`} className="answer-preview" key={item.id}>
                        <div className="answer-preview-head">
                          <div>
                            <strong>{item.title}</strong>
                            <span className="answer-author">
                              {new Date(item.created_at).toLocaleDateString()} · {item.language_code}
                            </span>
                          </div>
                        </div>
                        <p>{item.body ?? 'No additional details provided.'}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="no-results">No published questions found.</p>
                  )}
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
