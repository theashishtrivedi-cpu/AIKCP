import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Bookmark, Clock3, Sparkles, ChevronRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import { profileData, profileActivity, profileDrafts, profileSaved, articles } from '@/data/mockData';

type Tab = 'answers' | 'drafts' | 'saved' | 'activity';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('answers');

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: 'answers', label: 'My Answers', icon: BookOpen },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'activity', label: 'Activity', icon: Clock3 },
  ];

  return (
    <main>
      <PageHero
        eyebrow="Your space"
        title="Profile & Dashboard"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Profile' }]}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="profile-layout">
          <div className="profile-main">
            <div className="profile-header-card">
              <span className="avatar profile-avatar" style={{ backgroundColor: profileData.color, height: '64px', width: '64px', fontSize: '24px' }}>{profileData.initial}</span>
              <div className="profile-info">
                <h2>{profileData.name}</h2>
                <p>{profileData.bio}</p>
                <span className="profile-joined">Joined {profileData.joined}</span>
              </div>
              <div className="profile-stats">
                <div><strong>{profileData.stats.answers}</strong><span>Answers</span></div>
                <div><strong>{profileData.stats.articles}</strong><span>Articles</span></div>
                <div><strong>{profileData.stats.drafts}</strong><span>Drafts</span></div>
                <div><strong>{profileData.stats.saved}</strong><span>Saved</span></div>
              </div>
            </div>

            <div className="profile-tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)} key={tab.id}>
                    <Icon size={14} /> {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === 'answers' && (
              <div className="profile-tab-content">
                <SectionHeading eyebrow="Your contributions" title="My Answers & Articles" />
                <div className="search-articles-list">
                  {articles.map((a) => (
                    <Link to={`/articles/${a.id}`} className="answer-preview" key={a.id}>
                      <div className="answer-preview-head"><span className="avatar" style={{ backgroundColor: a.authorColor }}>{a.authorInitial}</span><div><strong>{a.title}</strong><span className="answer-author">{a.likes} likes · {a.comments.length} comments · {a.publishedAt}</span></div></div>
                      <p>{a.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'drafts' && (
              <div className="profile-tab-content">
                <SectionHeading eyebrow="Work in progress" title="Drafts" />
                <div className="draft-list">
                  {profileDrafts.map((draft) => (
                    <div className="draft-item" key={draft.id}>
                      <FileText size={18} />
                      <div><strong>{draft.title}</strong><span>{draft.words} words · Updated {draft.updated}</span></div>
                      <button className="outline-button" style={{ width: 'auto', padding: '8px 16px' }}>Continue</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="profile-tab-content">
                <SectionHeading eyebrow="Bookmarked" title="Saved Content" />
                <div className="saved-list">
                  {profileSaved.map((item) => (
                    <Link to={item.type === 'Article' ? '/articles/a1' : item.type === 'Question' ? '/questions' : '/current-affairs'} className="saved-item" key={item.id}>
                      <Bookmark size={16} />
                      <div><strong>{item.title}</strong><span>{item.type} · {item.time}</span></div>
                      <ChevronRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="profile-tab-content">
                <SectionHeading eyebrow="Timeline" title="Recent Activity" />
                <div className="activity-list">
                  {profileActivity.map((item, i) => (
                    <div className="activity-item" key={i}>
                      <span className="activity-dot" />
                      <div><strong>{item.title}</strong><span>{item.time}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <aside className="profile-rail">
            <div className="assistant-panel">
              <div className="assistant-title">
                <span className="bot-icon"><Sparkles size={23} /></span>
                <div><h2>AI Recommendations <small>BETA</small></h2><p>Personalized reading suggestions based on your activity.</p></div>
              </div>
              <div className="assistant-actions">
                <button>Read: Preserving Our Temples<ChevronRight size={15} /></button>
                <button>Explore: Bhagavad Gita discussions<ChevronRight size={15} /></button>
                <button>Join: Education Policy debate<ChevronRight size={15} /></button>
              </div>
            </div>
            <Link to="/notifications" className="rail-section-link">
              <div className="eyebrow"><span />Notifications</div>
              <strong>3 unread notifications</strong>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
