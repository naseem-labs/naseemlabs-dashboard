import { useEffect, useMemo, useState } from 'react';
import type { AppNotification } from '../types/notification';
import { notificationService } from '../services/notification.service';
import { getErrorMessage } from '../lib/supabaseErrors';

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await notificationService.getNotifications();
        if (isMounted) {
          setNotifications(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getErrorMessage(loadError, 'Unable to load notifications.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

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
