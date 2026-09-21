import { useState } from 'react';
import { Quote, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroImage, discussionImages, topics, discussions, questions, news, trending } from '@/data/mockData';
import SectionHeading from '@/components/SectionHeading';
import DiscussionCard from '@/components/DiscussionCard';
import AssistantPanel from '@/components/AssistantPanel';
import { TopicCardGrid } from '@/components/TopicCard';
import QuestionCard from '@/components/QuestionCard';
import NewsCard from '@/components/NewsCard';
import TrendingTopics from '@/components/TrendingTopics';
import SanatanBoardPanel from '@/components/SanatanBoardPanel';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setSubmittedQuery(query.trim());
  };

  return (
    <main id="top">
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(18, 24, 27, .76) 0%, rgba(32, 34, 27, .47) 46%, rgba(17, 26, 28, .28) 100%), url(${heroImage})` }}>
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow light"><span /> A living knowledge commons</div>
            <h1>Our heritage.<br /><em>Our knowledge.</em><br />A stronger tomorrow.</h1>
            <p>Ask questions. Share insights. Learn from the community.<br className="hidden sm:block" /> Stay informed with current affairs. Be part of a meaningful dialogue.</p>
            <div className="search-wrap"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleSearch()} placeholder="Search questions, articles, news or topics..." aria-label="Search questions, articles, news or topics" /><button onClick={handleSearch}>Search</button></div>
            {submittedQuery && <div className="search-result-note">Showing a preview for “{submittedQuery}”</div>}
            <div className="suggestions"><span>Try:</span>{['Temple Heritage', 'Bhagavad Gita', 'Yoga', 'Education Policy', 'Ayodhya', 'AI & Dharma'].map((chip) => <button key={chip} onClick={() => setQuery(chip)}>{chip}</button>)}</div>
          </div>
          <div className="hero-quote"><Quote size={25} fill="currentColor" /><p>“A society that remembers<br /> its roots can shape<br /> a brighter future.”</p><span>— Our Collective Belief</span></div>
        </div>
        <div className="hero-scroll"><span /> Scroll to explore</div>
      </section>

      <section className="section-shell topics-section" id="explore">
        <SectionHeading eyebrow="Explore the commons" title="Explore Topics" action="View all topics" actionTo="/search" />
        <p className="section-intro">Browse discussions by topic. Select a category to explore relevant questions, articles and current affairs.</p>
        <TopicCardGrid topics={topics} />
      </section>

      <section className="section-shell featured-section" id="questions">
        <SectionHeading eyebrow="Ideas in motion" title="Featured Discussions" action="View all" actionTo="/questions" />
        <div className="feature-layout">
          <div className="discussion-grid">{discussions.map((discussion) => <DiscussionCard discussion={discussion} key={discussion.id} />)}</div>
          <AssistantPanel />
        </div>
      </section>

      <section className="section-shell content-section">
        <div className="main-column">
          <SectionHeading eyebrow="Join the conversation" title="Latest Questions" action="View all" actionTo="/questions" />
          <div className="question-list">{questions.slice(0, 5).map((q) => <QuestionCard question={q} key={q.id} />)}</div>
        </div>
        <div className="news-column" id="current-affairs">
          <SectionHeading eyebrow="The world, contextualized" title="Latest News & Current Affairs" action="View all" actionTo="/current-affairs" />
          <div className="news-list">{news.slice(0, 3).map((n) => <NewsCard news={n} key={n.id} />)}</div>
        </div>
        <aside className="rail">
          <div className="quote-card"><Quote size={24} fill="currentColor" /><p>“Knowledge shared<br /><em>is knowledge multiplied.”</em></p><span>— Indian Wisdom</span></div>
          <TrendingTopics topics={trending} />
          <SanatanBoardPanel />
        </aside>
      </section>

      <section className="section-shell community-cta">
        <div className="cta-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(26, 22, 16, .92), rgba(52, 34, 18, .66)), url(${discussionImages[2]})` }}>
          <Quote size={29} fill="currentColor" />
          <div><h2>Let us build a knowledge-driven, value-based society together.</h2><p>Your voice matters. Ask. Share. Learn. Contribute.</p></div>
          <Link to="/profile" className="cta-button">Join the community <ChevronRight size={17} /></Link>
        </div>
      </section>
    </main>
  );
}
