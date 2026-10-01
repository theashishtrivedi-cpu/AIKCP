import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, Landmark, Search } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import AssistantPanel from '@/components/AssistantPanel';
import {
  listBoardContent,
  listBoardSections,
  type BoardContent,
  type BoardSection,
} from '@/lib/boardService';
import { heroImage } from '@/data/mockData';

export default function SanatanBoardPage() {
  const { sectionId } = useParams<{ sectionId: string }>();

  const [sections, setSections] = useState<BoardSection[]>([]);
  const [content, setContent] = useState<BoardContent[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(
    sectionId || null
  );
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSections() {
      setLoadingSections(true);
      setError(null);

      const result = await listBoardSections();

      if (cancelled) return;

      if (result.error) {
        setError(result.error);
        setSections([]);
        setLoadingSections(false);
        return;
      }

      setSections(result.data);

      if (result.data.length > 0) {
        const routeSection = sectionId
          ? result.data.find((section) => section.id === sectionId)
          : null;

        setSelectedSection(
          routeSection?.id || result.data[0].id
        );
      } else {
        setSelectedSection(null);
      }

      setLoadingSections(false);
    }

    loadSections();

    return () => {
      cancelled = true;
    };
  }, [sectionId]);

  useEffect(() => {
    if (!selectedSection) {
      setContent([]);
      return;
    }

    let cancelled = false;

    async function loadContent() {
      setLoadingContent(true);
      setError(null);

      const result = await listBoardContent(selectedSection);

      if (cancelled) return;

      if (result.error) {
        setError(result.error);
        setContent([]);
        setLoadingContent(false);
        return;
      }

      setContent(result.data);
      setLoadingContent(false);
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, [selectedSection]);

  const current = useMemo(
    () =>
      sections.find((section) => section.id === selectedSection) || null,
    [sections, selectedSection]
  );

  const handleSectionChange = (id: string) => {
    setSelectedSection(id);
  };

  return (
    <main>
      <PageHero
        eyebrow="A distinct experience"
        title="Sanatan Board"
        description="Explore the complete Sanatan Board of India Act, documents, sections and community discussions."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Sanatan Board' },
        ]}
        image={heroImage}
      />

      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="board-layout">
          <div className="board-main">
            <div className="board-search-bar">
              <Search size={18} />
              <input placeholder="Search the Sanatan Board..." />
              <button type="button">Search</button>
            </div>

            <div className="board-language-selector">
              <span className="eyebrow">
                <span />
                Language
              </span>

              <div
                className="language-row"
                style={{ marginTop: '8px' }}
              >
                <button type="button" className="language-chip active">
                  English
                </button>
                <button type="button" className="language-chip">
                  हिन्दी
                </button>
                <button type="button" className="language-chip">
                  संस्कृत
                </button>
                <button type="button" className="language-chip">
                  தமிழ்
                </button>
                <button type="button" className="language-chip">
                  తెలుగు
                </button>
              </div>
            </div>

            <div className="board-section-nav">
              {loadingSections ? (
                <div className="section-intro">
                  Loading Board sections...
                </div>
              ) : sections.length === 0 ? (
                <div className="section-intro">
                  No active Board sections are currently available.
                </div>
              ) : (
                sections.map((section) => (
                  <button
                    type="button"
                    className={`board-section-item ${
                      selectedSection === section.id ? 'active' : ''
                    }`}
                    onClick={() => handleSectionChange(section.id)}
                    key={section.id}
                  >
                    <Landmark size={18} />

                    <div>
                      <strong>{section.name}</strong>
                      <span>
                        {section.id === selectedSection
                          ? content.length
                          : 'Published'}{' '}
                        articles
                      </span>
                    </div>

                    <ChevronRight size={16} />
                  </button>
                ))
              )}
            </div>

            {error && (
              <div className="section-intro" role="alert">
                Unable to load Board content: {error}
              </div>
            )}

            <div className="board-section-content">
              <SectionHeading
                eyebrow="Currently viewing"
                title={current?.name || 'Sanatan Board'}
              />

              <p className="section-intro">
                {current?.description ||
                  'Published Board content will appear here when available.'}
              </p>

              <div className="board-article-list">
                {loadingContent ? (
                  <div className="section-intro">
                    Loading Board content...
                  </div>
                ) : content.length === 0 ? (
                  <div className="section-intro">
                    No published content is currently available for this
                    section.
                  </div>
                ) : (
                  content.map((item, index) => (
                    <div
                      className="board-article-item"
                      key={item.id}
                    >
                      <div className="board-article-number">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <div>
                        <strong>{item.title}</strong>
                        <p>
                          {item.body.length > 180
                            ? `${item.body.slice(0, 180)}...`
                            : item.body}
                        </p>
                      </div>

                      <Link
                        to={`/sanatan-board/content/${item.id}`}
                        className="board-article-read"
                      >
                        Read <ArrowRight size={13} />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            <SectionHeading
              eyebrow="Community engagement"
              title="Related Discussions"
              action="View all"
              actionTo="/questions"
            />
          </div>

          <aside className="board-rail">
            <AssistantPanel />

            <div className="rail-section">
              <SectionHeading
                eyebrow="Navigation"
                title="Board Sections"
              />

              <div className="board-section-list">
                {sections.map((section) => (
                  <Link
                    to={`/sanatan-board/${section.id}`}
                    className="board-section-link"
                    key={section.id}
                  >
                    <strong>{section.name}</strong>
                    <span>
                      {section.id === selectedSection
                        ? content.length
                        : 'Published'}{' '}
                      articles
                    </span>
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