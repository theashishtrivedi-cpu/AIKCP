import { Link } from 'react-router-dom';
import { MessageCircle, ThumbsUp, AtSign, Newspaper, ChevronRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { notifications } from '@/data/mockData';

const iconMap: Record<string, typeof MessageCircle> = {
  answer: MessageCircle,
  like: ThumbsUp,
  mention: AtSign,
  comment: MessageCircle,
  news: Newspaper,
};

export default function NotificationsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Stay updated"
        title="Notifications"
        description="Your latest activity, mentions, and platform updates."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Notifications' }]}
      />
      <section className="section-shell" style={{ paddingTop: '48px' }}>
        <div className="notifications-layout">
          <div className="notifications-main">
            <div className="notifications-toolbar">
              <button className="outline-button" style={{ width: 'auto', padding: '8px 16px' }}>Mark all as read</button>
            </div>
            <div className="notification-list">
              {notifications.map((n) => {
                const Icon = iconMap[n.type] || MessageCircle;
                return (
                  <Link to="/profile" className={`notification-item ${n.unread ? 'unread' : ''}`} key={n.id}>
                    <span className="notification-icon"><Icon size={16} /></span>
                    <div className="notification-content">
                      <p>{n.text}</p>
                      <span>{n.time}</span>
                    </div>
                    {n.unread && <span className="unread-dot" />}
                    <ChevronRight size={16} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
