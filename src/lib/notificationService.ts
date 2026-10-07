import { supabase } from '@/lib/supabase';

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  message: string | null;
  content_id: string | null;
  is_read: boolean;
  created_at: string;
};

export type NotificationResult<T> = {
  data: T;
  error: string | null;
};

async function getAuthenticatedUser(): Promise<{
  id: string | null;
  error: string | null;
}> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      id: null,
      error: 'Please sign in to view your notifications.',
    };
  }

  return { id: user.id, error: null };
}

export async function listNotifications(): Promise<
  NotificationResult<AppNotification[]>
> {
  const auth = await getAuthenticatedUser();

  if (!auth.id) {
    return { data: [], error: auth.error };
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, message, content_id, is_read, created_at')
    .eq('user_id', auth.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load notifications:', error);
    return { data: [], error: 'Unable to load notifications. Please try again.' };
  }

  return { data: (data ?? []) as AppNotification[], error: null };
}

export async function getUnreadNotificationCount(): Promise<
  NotificationResult<number>
> {
  const auth = await getAuthenticatedUser();

  if (!auth.id) {
    return { data: 0, error: auth.error };
  }

  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', auth.id)
    .eq('is_read', false);

  if (error) {
    console.error('Failed to load unread notification count:', error);
    return { data: 0, error: 'Unable to load unread notification count.' };
  }

  return { data: count ?? 0, error: null };
}

export async function markAllNotificationsAsRead(): Promise<
  NotificationResult<boolean>
> {
  const auth = await getAuthenticatedUser();

  if (!auth.id) {
    return { data: false, error: auth.error };
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', auth.id)
    .eq('is_read', false);

  if (error) {
    console.error('Failed to mark notifications as read:', error);
    return { data: false, error: 'Unable to mark notifications as read.' };
  }

  return { data: true, error: null };
}
