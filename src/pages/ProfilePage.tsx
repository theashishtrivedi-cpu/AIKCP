import { useEffect, useState } from 'react';
import { useUnreadNotificationCount } from '@/hooks/useUnreadNotificationCount';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Bookmark,
  Clock3,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import {
  profileActivity,
  profileDrafts,
  articles,
} from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import {
  listCurrentAffairBookmarks,
  type CurrentAffairBookmark,
} from '@/lib/bookmarkService';

type Tab = 'answers' | 'drafts' | 'saved' | 'activity';

export default function ProfilePage() {
  const { count: unreadNotificationCount } = useUnreadNotificationCount();
  const [activeTab, setActiveTab] = useState<Tab>('answers');

  const { user, profile, loading } = useAuth();

  const [savedItems, setSavedItems] = useState<CurrentAffairBookmark[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: 'answers', label: 'My Answers', icon: BookOpen },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'activity', label: 'Activity', icon: Clock3 },
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadSavedItems() {
      if (loading) return;

      if (!user) {
        setSavedItems([]);
        setSavedError('Sign in to view your saved Current Affairs.');
        setSavedLoading(false);
        return;
      }

      setSavedLoading(true);
      setSavedError(null);

      const result = await listCurrentAffairBookmarks();

      if (cancelled) return;

      setSavedItems(result.data);
      setSavedError(result.error);
      setSavedLoading(false);
    }

    void loadSavedItems();

    return () => {
      cancelled = true;
    };
  }, [user, loading]);

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
            <span
              className="avatar profile-avatar"
              style={{
                backgroundColor: '#cf7847',
                height: '64px',
                width: '64px',
                fontSize: '24px',
              }}
            >
              {loading
                ? 'â€¦'
                : (profile?.display_name || user?.email?.charAt(0) || 'U')
                    .charAt(0)
                    .toUpperCase()}
            </span>

            <div className="profile-info">
              <h2>
                {loading
                  ? 'Loading...'
                  : profile?.display_name || user?.email || 'User'}
              </h2>

              <p>
                {profile?.bio ||
                  'Welcome to Sanatan Board India. Share knowledge, participate in discussions, and contribute to the community.'}
              </p>

              <span className="profile-joined">
                Joined{' '}
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Recently'}
              </span>
            </div>

            <div className="profile-stats">
              <div><strong>0</strong><span>Answers</span></div>
              <div><strong>0</strong><span>Articles</span></div>
              <div><strong>0</strong><span>Drafts</span></div>
              <div><strong>{savedItems.length}</strong><span>Saved</span></div>
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
                      <div className="answer-preview-head"><span className="avatar" style={{ backgroundColor: a.authorColor }}>{a.authorInitial}</span><div><strong>{a.title}</strong><span className="answer-author">{a.likes} likes Â· {a.comments.length} comments Â· {a.publishedAt}</span></div></div>
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
                      <div><strong>{draft.title}</strong><span>{draft.words} words Â· Updated {draft.updated}</span></div>
                      <button className="outline-button" style={{ width: 'auto', padding: '8px 16px' }}>Continue</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="profile-tab-content">
                <SectionHeading eyebrow="Bookmarked" title="Saved Content" />

                {savedLoading && (
                  <p role="status">Loading your saved Current Affairs...</p>
                )}

                {savedError && (
                  <p role="alert">
                    {savedError}
                    {!user && (
                      <>
                        {' '}
                        <Link to="/login">Sign in</Link>
                      </>
                    )}
                  </p>
                )}

                {!savedLoading && !savedError && savedItems.length === 0 && (
                  <p>You have not saved any Current Affairs articles yet.</p>
                )}

                {!savedLoading && savedItems.length > 0 && (
                  <div className="saved-list">
                    {savedItems.map((item) => (
                      <Link
                        to={`/current-affairs/${item.content_id}`}
                        className="saved-item"
                        key={item.id}
                      >
                        <Bookmark size={16} />
                        <div>
                          <strong>{item.title}</strong>
                          <span>
                            Current Affairs
                            {item.source_title ? ` · ${item.source_title}` : ''}
                            {' · Saved '}
                            {new Date(item.created_at).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <ChevronRight size={16} />
                      </Link>
                    ))}
                  </div>
                )}
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
              <strong>{unreadNotificationCount} unread {unreadNotificationCount === 1 ? "notification" : "notifications"}</strong>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

