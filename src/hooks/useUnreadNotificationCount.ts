import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUnreadNotificationCount } from '@/lib/notificationService';

export function useUnreadNotificationCount() {
  const { user, loading: authLoading } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setCount(0);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await getUnreadNotificationCount();
      setCount(result.data);
      setError(result.error);
    } catch (cause) {
      console.error('Unexpected unread notification count error:', cause);
      setCount(0);
      setError('Unable to load unread notification count.');
    } finally {
      setLoading(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    void refresh();

    const handleNotificationsUpdated = () => {
      void refresh();
    };

    window.addEventListener('notifications-updated', handleNotificationsUpdated);

    return () => {
      window.removeEventListener('notifications-updated', handleNotificationsUpdated);
    };
  }, [refresh]);

  return { count, loading: authLoading || loading, error, refresh };
}
