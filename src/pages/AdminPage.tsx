import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, MessageCircle, FolderTree, Shield, Newspaper, Rss, Settings, ChevronRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { useAuth } from '@/context/AuthContext';
import SectionHeading from '@/components/SectionHeading';
import { adminStats, adminUsers, newsSources, topics, questions } from '@/data/mockData';
import { canPerformQuestionAction } from '@/lib/questionAuthorization';
import { listPendingQuestions, moderateQuestion, type RealQuestion } from '@/lib/questionService';

type AdminTab = 'overview' | 'users' | 'questions' | 'categories' | 'moderation' | 'current-affairs' | 'news-sources' | 'settings';

const adminTabs: { id: AdminTab; label: string; icon: typeof Users }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'questions', label: 'Questions', icon: MessageCircle },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'moderation', label: 'Moderation', icon: Shield },
  { id: 'current-affairs', label: 'Current Affairs', icon: Newspaper },
  { id: 'news-sources', label: 'News Sources', icon: Rss },
  { id: 'settings', label: 'Site Settings', icon: Settings },
];

export default function AdminPage() {
  const { profile } = useAuth();


  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [pendingQuestions, setPendingQuestions] = useState<RealQuestion[]>([]);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [moderationActionId, setModerationActionId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== 'moderation') {
      return;
    }

    let cancelled = false;

    async function loadModerationQueue() {
      setModerationLoading(true);
      setModerationError(null);

      const authorized = await canPerformQuestionAction('moderate');

      if (!authorized) {
        if (!cancelled) {
          setPendingQuestions([]);
          setModerationError(
            'You are not authorized to access question moderation.'
          );
          setModerationLoading(false);
        }
        return;
      }

      const result = await listPendingQuestions();

      if (cancelled) {
        return;
      }

      if (result.error) {
        setPendingQuestions([]);
        setModerationError(result.error);
      } else {
        setPendingQuestions(result.data);
      }

      setModerationLoading(false);
    }

    void loadModerationQueue();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  if (
    !profile ||
    profile.status !== 'active' ||
    (profile.role !== 'moderator' && profile.role !== 'admin')
  ) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#182331]">
            Access denied
          </h1>
          <p className="mt-2 text-sm text-[#68717c]">
            You do not have permission to access the administration area.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <PageHero
        eyebrow="Administration"
        title="Admin Dashboard"
        description="Manage users, questions, categories, moderation, current affairs and site settings."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Admin' }]}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="admin-layout">
          <aside className="admin-sidebar">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)} key={tab.id}>
                  <Icon size={16} /> {tab.label}
                  <ChevronRight size={14} />
                </button>
              );
            })}
          </aside>
          <div className="admin-content">
            {activeTab === 'overview' && (
              <div>
                <SectionHeading eyebrow="Platform health" title="Overview" />
                <div className="admin-stats-grid">
                  {adminStats.map((stat) => (
                    <div className="admin-stat-card" key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span className="admin-stat-label">{stat.label}</span>
                      <span className="admin-stat-change">{stat.change}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <SectionHeading eyebrow="Community" title="Users" />
                <div className="admin-table">
                  <div className="admin-table-head">
                    <span>Name</span><span>Role</span><span>Joined</span><span>Answers</span><span>Status</span>
                  </div>
                  {adminUsers.map((user) => (
                    <div className="admin-table-row" key={user.name}>
                      <span className="avatar" style={{ height: '24px', width: '24px', fontSize: '9px', backgroundColor: '#cf7847' }}>{user.name[0]}</span>
                      <span>{user.name}</span>
                      <span>{user.role}</span>
                      <span>{user.joined}</span>
                      <span>{user.answers}</span>
                      <span className={`status-badge status-${user.status.toLowerCase()}`}>{user.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div>
                <SectionHeading eyebrow="Admin-managed" title="Questions" />
                <div className="admin-table">
                  {questions.slice(0, 6).map((q) => (
                    <div className="admin-table-row" key={q.id}>
                      <span className="avatar" style={{ height: '24px', width: '24px', fontSize: '9px', backgroundColor: q.avatarColor }}>{q.avatarInitial}</span>
                      <div><strong>{q.question}</strong><span>{q.category} · {q.answers} answers · {q.time}</span></div>
                      <button className="outline-button" style={{ width: 'auto', padding: '6px 12px', fontSize: '10px' }}>Edit</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <SectionHeading eyebrow="Taxonomy" title="Categories" />
                <div className="admin-table">
                  {topics.map((t) => (
                    <div className="admin-table-row" key={t.id}>
                      <span className={`topic-icon ${t.tone}`} style={{ height: '32px', width: '32px' }}><t.icon size={16} strokeWidth={1.7} /></span>
                      <div><strong>{t.name}</strong><span>{t.count} · {t.subcategories.length} subcategories</span></div>
                      <button className="outline-button" style={{ width: 'auto', padding: '6px 12px', fontSize: '10px' }}>Manage</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'moderation' && (
              <div>
                <SectionHeading eyebrow="Queue" title="Moderation" />

                {moderationLoading && (
                  <div className="admin-table">
                    <div className="admin-table-row">
                      <span>Loading pending questions...</span>
                    </div>
                  </div>
                )}

                {!moderationLoading && moderationError && (
                  <div className="admin-table">
                    <div className="admin-table-row">
                      <span>{moderationError}</span>
                    </div>
                  </div>
                )}

                {!moderationLoading && !moderationError && pendingQuestions.length === 0 && (
                  <div className="admin-table">
                    <div className="admin-table-row">
                      <span>No pending questions require moderation.</span>
                    </div>
                  </div>
                )}

                {!moderationLoading && !moderationError && pendingQuestions.length > 0 && (
                  <div className="admin-table">
                    {pendingQuestions.map((question) => (
                      <div className="admin-table-row" key={question.id}>
                        <div>
                          <strong>{question.title}</strong>
                          <span>
                            {question.body} · Submitted {new Date(question.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="admin-row-actions">
                          <button
                            className="admin-action approve"
                            disabled={moderationActionId === question.id}
                            onClick={async () => {
                              setModerationActionId(question.id);
                              setModerationError(null);

                              const result = await moderateQuestion(
                                question.id,
                                'published'
                              );

                              if (result.error) {
                                setModerationError(result.error);
                              } else {
                                setPendingQuestions((current) =>
                                  current.filter((item) => item.id !== question.id)
                                );
                              }

                              setModerationActionId(null);
                            }}
                          >
                            {moderationActionId === question.id ? 'Processing...' : 'Approve'}
                          </button>

                          <button
                            className="admin-action reject"
                            disabled={moderationActionId === question.id}
                            onClick={async () => {
                              setModerationActionId(question.id);
                              setModerationError(null);

                              const result = await moderateQuestion(
                                question.id,
                                'rejected'
                              );

                              if (result.error) {
                                setModerationError(result.error);
                              } else {
                                setPendingQuestions((current) =>
                                  current.filter((item) => item.id !== question.id)
                                );
                              }

                              setModerationActionId(null);
                            }}
                          >
                            {moderationActionId === question.id ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'current-affairs' && (
              <div>
                <SectionHeading eyebrow="News management" title="Current Affairs" />
                <div className="admin-table">
                  <div className="admin-table-head"><span>Headline</span><span>Source</span><span>Category</span><span>Time</span></div>
                  {[
                    ['Restoration work begins at 12th century temple', 'India', 'Heritage', '2 hours ago'],
                    ['Traditional knowledge systems gain recognition', 'World', 'Policy', '5 hours ago'],
                    ['Digital archive for Sanskrit manuscripts', 'Culture', 'Heritage', '2 days ago'],
                  ].map(([h, s, c, t], i) => (
                    <div className="admin-table-row" key={i}>
                      <div><strong>{h}</strong></div>
                      <span>{s}</span>
                      <span>{c}</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'news-sources' && (
              <div>
                <SectionHeading eyebrow="Feeds" title="News Sources" />
                <div className="admin-table">
                  <div className="admin-table-head"><span>Source</span><span>Status</span><span>Articles</span><span>Last Sync</span></div>
                  {newsSources.map((src) => (
                    <div className="admin-table-row" key={src.name}>
                      <div><strong>{src.name}</strong></div>
                      <span className={`status-badge status-${src.status.toLowerCase()}`}>{src.status}</span>
                      <span>{src.articles}</span>
                      <span>{src.lastSync}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <SectionHeading eyebrow="Configuration" title="Site Settings" />
                <div className="admin-settings">
                  <div className="admin-setting-row">
                    <div><strong>Platform Name</strong><span>The displayed name of the platform</span></div>
                    <input defaultValue="Sanatan Board India" />
                  </div>
                  <div className="admin-setting-row">
                    <div><strong>AI Moderation</strong><span>Enable AI-assisted content moderation</span></div>
                    <button className="toggle-switch active">On</button>
                  </div>
                  <div className="admin-setting-row">
                    <div><strong>Auto-approve Questions</strong><span>Automatically publish admin-created questions</span></div>
                    <button className="toggle-switch">Off</button>
                  </div>
                  <div className="admin-setting-row">
                    <div><strong>News Auto-sync</strong><span>Automatically sync news from configured sources</span></div>
                    <button className="toggle-switch active">On</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
