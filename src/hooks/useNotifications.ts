import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppNotification } from '../types/notification';
import { notificationService } from '../services/notification.service';
import { getErrorMessage } from '../lib/supabaseErrors';
import { useSupabaseRealtime } from './useSupabaseRealtime';

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (loadError) {
      if (!silent) {
        setError(getErrorMessage(loadError, 'Unable to load notifications.'));
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useSupabaseRealtime(
    'dashboard-notifications',
    [{ table: 'notifications' }],
    () => {
      void load(true);
    },
  );

  const unread = useMemo(
    () => notifications.filter((item) => !item.read),
    [notifications],
  );

  const read = useMemo(
    () => notifications.filter((item) => item.read),
    [notifications],
  );

  const unreadCount = unread.length;

  return {
    notifications,
    unread,
    read,
    unreadCount,
    isLoading,
    error,
  };
}
