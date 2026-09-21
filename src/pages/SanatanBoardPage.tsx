import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, Landmark, Search } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import AssistantPanel from '@/components/AssistantPanel';
import { boardSections, discussions } from '@/data/mockData';
import { heroImage } from '@/data/mockData';

export default function SanatanBoardPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [selectedSection, setSelectedSection] = useState(sectionId || boardSections[0].id);

  const current = boardSections.find((s) => s.id === selectedSection) || boardSections[0];

  return (
    <main>
      <PageHero
        eyebrow="A distinct experience"
        title="Sanatan Board"
        description="Explore the complete Sanatan Board of India Act, documents, sections and community discussions."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Sanatan Board' }]}
        image={heroImage}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="board-layout">
          <div className="board-main">
            <div className="board-search-bar">
              <Search size={18} />
              <input placeholder="Search the Sanatan Board..." />
              <button>Search</button>
            </div>
            <div className="board-language-selector">
              <span className="eyebrow"><span />Language</span>
              <div className="language-row" style={{ marginTop: '8px' }}>
                <button className="language-chip active">English</button>
                <button className="language-chip">हिंदी</button>
                <button className="language-chip">संस्कृत</button>
                <button className="language-chip">தமிழ்</button>
                <button className="language-chip">తెలుగు</button>
              </div>
            </div>

            <div className="board-section-nav">
              {boardSections.map((section) => (
                <button
                  className={`board-section-item ${selectedSection === section.id ? 'active' : ''}`}
                  onClick={() => setSelectedSection(section.id)}
                  key={section.id}
                >
                  <Landmark size={18} />
                  <div>
                    <strong>{section.title}</strong>
                    <span>{section.articles} articles</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>

            <div className="board-section-content">
              <SectionHeading eyebrow="Currently viewing" title={current.title} />
              <p className="section-intro">{current.description}</p>
              <div className="board-article-list">
                {Array.from({ length: Math.min(current.articles, 4) }).map((_, i) => (
                  <div className="board-article-item" key={i}>
                    <div className="board-article-number">{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <strong>{current.title} — Part {i + 1}</strong>
                      <p>An overview of the provisions and objectives within this section of the Sanatan Board.</p>
                    </div>
                    <Link to={`/sanatan-board/${current.id}`} className="board-article-read">Read <ArrowRight size={13} /></Link>
                  </div>
                ))}
              </div>
            </div>

            <SectionHeading eyebrow="Community engagement" title="Related Discussions" action="View all" actionTo="/questions" />
            <div className="discussion-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {discussions.slice(0, 2).map((d) => (
                <Link to={`/questions/${d.id}`} className="discussion-card-link" key={d.id}>
                  <article className="discussion-card">
                    <div className="discussion-image"><img src={d.image} alt="" /></div>
                    <div className="discussion-content">
                      <h3>{d.title}</h3>
                      <div className="discussion-stats"><span>{d.answers} answers</span><span>{d.comments} comments</span></div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
          <aside className="board-rail">
            <AssistantPanel />
            <div className="rail-section">
              <SectionHeading eyebrow="Navigation" title="Board Sections" />
              <div className="board-section-list">
                {boardSections.map((s) => (
                  <Link to={`/sanatan-board/${s.id}`} className="board-section-link" key={s.id}>
                    <strong>{s.title}</strong>
                    <span>{s.articles} articles</span>
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
