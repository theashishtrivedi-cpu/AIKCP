import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  ThumbsUp,
  AtSign,
  Newspaper,
  ChevronRight,
} from 'lucide-react';
import PageHero from '@/components/PageHero';
import {
  listNotifications,
  markAllNotificationsAsRead,
  type AppNotification,
} from '@/lib/notificationService';

const iconMap: Record<string, typeof MessageCircle> = {
  answer: MessageCircle,
  like: ThumbsUp,
  mention: AtSign,
  comment: MessageCircle,
  news: Newspaper,
};

function formatNotificationDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await listNotifications();
      setItems(result.data);

      if (result.error) {
        setError(result.error);
      }
    } catch (cause) {
      console.error('Unexpected notification loading error:', cause);
      setError('Unable to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const unreadCount = items.filter((item) => !item.is_read).length;

  const handleMarkAllAsRead = async () => {
    if (markingRead || unreadCount === 0) {
      return;
    }

    setMarkingRead(true);
    setError(null);

    try {
      const result = await markAllNotificationsAsRead();

      if (result.error) {
        setError(result.error);
        return;
      }

      await loadNotifications();
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (cause) {
      console.error('Unexpected mark-as-read error:', cause);
      setError('Unable to mark notifications as read. Please try again.');
    } finally {
      setMarkingRead(false);
    }
  };

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
              <button
                type="button"
                className="outline-button"
                style={{ width: 'auto', padding: '8px 16px' }}
                onClick={handleMarkAllAsRead}
                disabled={loading || markingRead || unreadCount === 0}
              >
                {markingRead ? 'Marking as read...' : 'Mark all as read'}
              </button>
            </div>

            {error && (
              <div role="alert" aria-live="polite">
                <p>{error}</p>
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => void loadNotifications()}
                  disabled={loading}
                >
                  Try again
                </button>
              </div>
            )}

            {loading ? (
              <p role="status">Loading notifications...</p>
            ) : !error && items.length === 0 ? (
              <p>You don't have any notifications yet.</p>
            ) : (
              <div className="notification-list">
                {items.map((notification) => {
                  const Icon = iconMap[notification.type] || MessageCircle;

                  return (
                    <Link
                      to="/profile"
                      className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                      key={notification.id}
                    >
                      <span className="notification-icon">
                        <Icon size={16} />
                      </span>

                      <div className="notification-content">
                        <p>
                          <strong>{notification.title}</strong>
                          {notification.message && (
                            <>
                              {' '}
                              {notification.message}
                            </>
                          )}
                        </p>
                        <span>
                          {formatNotificationDate(notification.created_at)}
                        </span>
                      </div>

                      {!notification.is_read && (
                        <span className="unread-dot" />
                      )}

                      <ChevronRight size={16} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
